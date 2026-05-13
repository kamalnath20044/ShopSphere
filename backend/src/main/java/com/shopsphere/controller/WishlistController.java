package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.entity.Wishlist;
import com.shopsphere.security.UserDetailsImpl;
import com.shopsphere.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "User wishlist management")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get user's wishlist")
    public ResponseEntity<List<Wishlist>> getWishlist(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(user.getId()));
    }

    @PostMapping("/add")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<Wishlist> addToWishlist(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody Map<String, Long> request) {
        return ResponseEntity.ok(wishlistService.addToWishlist(user.getId(), request.get("productId")));
    }

    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse> removeFromWishlist(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(user.getId(), productId);
        return ResponseEntity.ok(new ApiResponse(true, "Removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    @Operation(summary = "Check if product is in wishlist")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(user.getId(), productId)));
    }
}
