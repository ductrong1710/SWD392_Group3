package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.model.entities.Order;

public interface IOrderTrackingService {
    /**
     * Updates the tracking status of an order based on business rules.
     * @param orderId The ID of the order to update.
     * @param newTracking The new tracking status string.
     * @param currentUser The user performing the action.
     * @return The updated order.
     */
    Order updateTracking(Integer orderId, String newTracking, User currentUser);

    /**
     * A scheduled task to automatically complete delivered orders after a timeout.
     */
    void autoCompleteDeliveredOrders();
}
