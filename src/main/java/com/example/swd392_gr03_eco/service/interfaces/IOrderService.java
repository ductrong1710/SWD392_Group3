package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.OrderRequest;
import com.example.swd392_gr03_eco.model.dto.response.OrderResponseDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentResponse;

import java.util.List;

public interface IOrderService {
    // For User
    PaymentResponse createOrder(Long userId, Object sessionCart, OrderRequest request);
    List<OrderResponseDto> getOrdersByUserId(Long userId);
    OrderResponseDto getOrderDetails(Integer orderId, Long userId);
    void cancelOrder(Integer orderId, Long userId);

    // For Admin
    List<OrderResponseDto> getAllOrders();
    void updateOrderStatus(Integer orderId, String status);
}
