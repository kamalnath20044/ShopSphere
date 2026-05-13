package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.entity.Order;
import com.shopsphere.security.UserDetailsImpl;
import com.shopsphere.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order from cart items")
    public ResponseEntity<Order> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl user,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(user.getId(), request));
    }

    @GetMapping
    @Operation(summary = "Get current user's order history")
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<Order> cancelOrder(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id, user.getId()));
    }
}
