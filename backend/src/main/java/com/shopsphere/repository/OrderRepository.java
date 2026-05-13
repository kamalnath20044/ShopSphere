package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT MONTH(o.createdAt) as month, SUM(o.totalAmount) as total FROM Order o " +
           "WHERE YEAR(o.createdAt) = YEAR(CURRENT_DATE) AND o.status != 'CANCELLED' " +
           "GROUP BY MONTH(o.createdAt) ORDER BY MONTH(o.createdAt)")
    List<Object[]> getMonthlySales();
}
