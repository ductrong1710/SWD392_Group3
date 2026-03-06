package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.Payment;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.service.interfaces.IOrderTrackingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderTrackingServiceImpl implements IOrderTrackingService {

    private final OrderRepository orderRepository;

    private static final String PREPARING = "PREPARING";
    private static final String SHIPPING = "SHIPPING";
    private static final String DELIVERED = "DELIVERED";
    private static final String COMPLETED = "COMPLETED";
    private static final String NOT_RECEIVED = "NOT_RECEIVED";

    @Override
    @Transactional
    public Order updateTracking(Integer orderId, String newTracking, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        String currentTracking = order.getTracking();
        String paymentMethod = order.getPayments().stream().findFirst().map(Payment::getMethod).orElse("");
        String paymentStatus = order.getStatus();
        String userRole = currentUser.getRole().getRoleName();

        // Rule for Staff
        if ("STAFF".equalsIgnoreCase(userRole)) {
            switch (newTracking) {
                case PREPARING:
                    boolean isCodAwaiting = "AWAITING_PAYMENT".equalsIgnoreCase(paymentStatus) && "COD".equalsIgnoreCase(paymentMethod);
                    boolean isVnpayCompleted = "COMPLETED".equalsIgnoreCase(paymentStatus) && "VNPAY".equalsIgnoreCase(paymentMethod);
                    if (isCodAwaiting || isVnpayCompleted) {
                        order.setTracking(PREPARING);
                    } else {
                        throw new IllegalStateException("Order is not ready to be prepared.");
                    }
                    break;
                case SHIPPING:
                    if (Objects.equals(currentTracking, PREPARING)) {
                        order.setTracking(SHIPPING);
                    } else {
                        throw new IllegalStateException("Order must be prepared before shipping.");
                    }
                    break;
                case DELIVERED:
                    if (Objects.equals(currentTracking, SHIPPING)) {
                        order.setTracking(DELIVERED);
                    } else {
                        throw new IllegalStateException("Order must be shipped before being delivered.");
                    }
                    break;
                default:
                    throw new IllegalArgumentException("Invalid tracking status for staff: " + newTracking);
            }
        }
        // Rule for Customer
        else if ("CUSTOMER".equalsIgnoreCase(userRole)) {
            // Ensure the order belongs to the customer
            if (!order.getUser().getId().equals(currentUser.getId())) {
                throw new SecurityException("Customer can only update their own orders.");
            }
            if (Objects.equals(currentTracking, DELIVERED)) {
                if (COMPLETED.equalsIgnoreCase(newTracking) || NOT_RECEIVED.equalsIgnoreCase(newTracking)) {
                    order.setTracking(newTracking);
                    order.setStatus("COMPLETED");
                } else {
                    throw new IllegalArgumentException("Invalid confirmation status: " + newTracking);
                }
            } else {
                throw new IllegalStateException("Order is not yet delivered for confirmation.");
            }
        } else {
            throw new SecurityException("User does not have permission to update tracking status.");
        }

        order.setUpdateAt(Instant.now());
        return orderRepository.save(order);
    }

    @Override
    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void autoCompleteDeliveredOrders() {
        Instant twentyFourHoursAgo = Instant.now().minus(24, ChronoUnit.HOURS);
        List<Order> ordersToComplete = orderRepository.findByTrackingAndUpdateAtBefore(DELIVERED, twentyFourHoursAgo);

        for (Order order : ordersToComplete) {
            order.setTracking(COMPLETED);
            order.setUpdateAt(Instant.now());
            orderRepository.save(order);
        }
    }
}
