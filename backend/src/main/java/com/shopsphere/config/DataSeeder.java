package com.shopsphere.config;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_USER));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
        }

        // Seed admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@shopsphere.com", passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(ERole.ROLE_ADMIN).ifPresent(roles::add);
            roleRepository.findByName(ERole.ROLE_USER).ifPresent(roles::add);
            admin.setRoles(roles);
            userRepository.save(admin);
        }

        // Seed categories and products
        if (categoryRepository.count() == 0) {
            Category electronics = new Category("Electronics", "Smartphones, laptops, and gadgets");
            Category fashion = new Category("Fashion", "Clothing, shoes, and accessories");
            Category home = new Category("Home & Living", "Furniture, decor, and kitchen essentials");
            Category books = new Category("Books", "Fiction, non-fiction, and educational books");
            Category sports = new Category("Sports & Fitness", "Equipment and activewear");

            categoryRepository.save(electronics);
            categoryRepository.save(fashion);
            categoryRepository.save(home);
            categoryRepository.save(books);
            categoryRepository.save(sports);

            // Electronics
            createProduct("iPhone 15 Pro Max", "Latest Apple flagship with A17 Pro chip, titanium design, and 48MP camera system.", new BigDecimal("1199.99"), null, 50, "Apple", 4.8, 2340, true, electronics, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500");
            createProduct("Samsung Galaxy S24 Ultra", "AI-powered smartphone with S Pen, 200MP camera, and titanium frame.", new BigDecimal("1299.99"), new BigDecimal("1149.99"), 35, "Samsung", 4.7, 1856, true, electronics, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500");
            createProduct("MacBook Pro 16\"", "M3 Max chip, 36GB RAM, 1TB SSD. The ultimate pro laptop.", new BigDecimal("2499.99"), null, 20, "Apple", 4.9, 987, true, electronics, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500");
            createProduct("Sony WH-1000XM5", "Industry-leading noise cancelling headphones with 30hr battery.", new BigDecimal("349.99"), new BigDecimal("279.99"), 100, "Sony", 4.6, 4521, false, electronics, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500");
            createProduct("iPad Air M2", "10.9-inch Liquid Retina display with M2 chip performance.", new BigDecimal("599.99"), null, 45, "Apple", 4.7, 1234, false, electronics, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500");

            // Fashion
            createProduct("Premium Leather Jacket", "Genuine Italian leather, slim fit design with quilted lining.", new BigDecimal("299.99"), new BigDecimal("249.99"), 30, "Zara", 4.5, 567, true, fashion, "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500");
            createProduct("Classic White Sneakers", "Minimalist design, premium leather upper, comfortable insole.", new BigDecimal("129.99"), null, 80, "Nike", 4.4, 2341, false, fashion, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500");
            createProduct("Silk Evening Dress", "Elegant floor-length silk dress perfect for formal occasions.", new BigDecimal("189.99"), new BigDecimal("159.99"), 25, "H&M", 4.6, 432, true, fashion, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500");

            // Home & Living
            createProduct("Ergonomic Office Chair", "Full mesh back, adjustable lumbar support, 4D armrests.", new BigDecimal("449.99"), new BigDecimal("379.99"), 40, "Herman Miller", 4.8, 876, true, home, "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500");
            createProduct("Smart LED Floor Lamp", "WiFi-enabled, 16M colors, voice control compatible.", new BigDecimal("79.99"), null, 120, "Philips", 4.3, 1543, false, home, "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500");

            // Books
            createProduct("Clean Code", "A Handbook of Agile Software Craftsmanship by Robert C. Martin.", new BigDecimal("39.99"), new BigDecimal("29.99"), 200, "Prentice Hall", 4.7, 8765, true, books, "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500");
            createProduct("Design Patterns", "Elements of Reusable Object-Oriented Software. Gang of Four classic.", new BigDecimal("49.99"), null, 150, "Addison-Wesley", 4.5, 5432, false, books, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500");

            // Sports
            createProduct("Yoga Mat Premium", "6mm thick, non-slip surface, eco-friendly TPE material.", new BigDecimal("49.99"), new BigDecimal("39.99"), 150, "Manduka", 4.6, 3456, false, sports, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500");
            createProduct("Adjustable Dumbbells Set", "5-52.5 lbs per dumbbell, quick-change weight system.", new BigDecimal("349.99"), new BigDecimal("299.99"), 30, "Bowflex", 4.7, 2134, true, sports, "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500");
        }
    }

    private void createProduct(String name, String desc, BigDecimal price, BigDecimal discount,
                               int stock, String brand, double rating, int reviews,
                               boolean featured, Category category, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setDiscountPrice(discount);
        p.setStockQuantity(stock);
        p.setBrand(brand);
        p.setRating(rating);
        p.setReviewCount(reviews);
        p.setFeatured(featured);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        productRepository.save(p);
    }
}
