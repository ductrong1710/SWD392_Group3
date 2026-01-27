package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.response.OrderResponse;
import java.util.List;

public interface IAdminOrderService {
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Integer orderId);
    void updateOrderStatus(Integer orderId, String status);
}
