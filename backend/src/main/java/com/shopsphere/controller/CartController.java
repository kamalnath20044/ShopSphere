package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.entity.CartItem;
import com.shopsphere.security.UserDetailsImpl;
import com.shopsphere.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Cart operations")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart items")
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(cartService.getCartItems(user.getId()));
    }

    @PostMapping("/add")
    @Operation(summary = "Add product to cart")
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        int quantity = request.containsKey("quantity") ? Integer.parseInt(request.get("quantity").toString()) : 1;
        return ResponseEntity.ok(cartService.addToCart(user.getId(), productId, quantity));
    }

    @PutMapping("/update")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<?> updateQuantity(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        int quantity = Integer.parseInt(request.get("quantity").toString());
        CartItem updated = cartService.updateQuantity(user.getId(), productId, quantity);
        if (updated == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart"));
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove product from cart")
    public ResponseEntity<ApiResponse> removeFromCart(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long productId) {
        cartService.removeFromCart(user.getId(), productId);
        return ResponseEntity.ok(new ApiResponse(true, "Product removed from cart"));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse> clearCart(@AuthenticationPrincipal UserDetailsImpl user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared"));
    }
}
