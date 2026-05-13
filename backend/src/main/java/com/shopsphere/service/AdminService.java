package com.shopsphere.service;

import com.shopsphere.dto.DashboardStats;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.countByActiveTrue());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalRevenue(orderRepository.getTotalRevenue());
        stats.setPendingOrders(orderRepository.countByStatus(OrderStatus.PENDING) +
                              orderRepository.countByStatus(OrderStatus.CONFIRMED));
        stats.setDeliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED));

        Map<Integer, BigDecimal> monthlySales = new HashMap<>();
        List<Object[]> monthlyData = orderRepository.getMonthlySales();
        for (Object[] row : monthlyData) {
            monthlySales.put((Integer) row[0], (BigDecimal) row[1]);
        }
        stats.setMonthlySales(monthlySales);
        return stats;
    }
}
