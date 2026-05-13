package com.shopsphere.service;

import com.shopsphere.entity.*;
import com.shopsphere.exception.*;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartService {

    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public CartItem addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        return cartItemRepository.findByUserIdAndProductId(userId, productId)
            .map(existing -> {
                existing.setQuantity(existing.getQuantity() + quantity);
                return cartItemRepository.save(existing);
            })
            .orElseGet(() -> cartItemRepository.save(new CartItem(user, product, quantity)));
    }

    @Transactional
    public CartItem updateQuantity(Long userId, Long productId, int quantity) {
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
