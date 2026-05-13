package com.shopsphere.service;

import com.shopsphere.dto.OrderRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.*;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;

    @Transactional
    public Order placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setShippingName(request.getShippingName());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingZipCode(request.getShippingZipCode());
        order.setShippingPhone(request.getShippingPhone());
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.CONFIRMED);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(product, cartItem.getQuantity());
            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }

        order.setSubtotal(subtotal);
        order.setTax(subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP));
        order.setShippingCost(subtotal.compareTo(new BigDecimal("100")) >= 0 ? BigDecimal.ZERO : new BigDecimal("9.99"));
        order.setTotalAmount(order.getSubtotal().add(order.getTax()).add(order.getShippingCost()));

        Order savedOrder = orderRepository.save(order);

        // Create payment record
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(savedOrder.getTotalAmount());
        payment.setMethod(PaymentMethod.valueOf(request.getPaymentMethod() != null ?
            request.getPaymentMethod().toUpperCase() : "COD"));
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        // Clear cart
        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    public Page<Order> getAllOrders(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
            if (payment != null) {
                payment.setStatus(PaymentStatus.COMPLETED);
                paymentRepository.save(payment);
            }
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own orders");
        }
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }
        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
