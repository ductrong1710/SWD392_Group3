package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.response.OrderResponse;
import com.example.swd392_gr03_eco.model.entities.User;

import java.util.List;

public interface IOrderService {
    List<OrderResponse> getMyOrders(User user);
    OrderResponse getMyOrderDetails(User user, Integer orderId);
    void cancelMyOrder(User user, Integer orderId);
}
