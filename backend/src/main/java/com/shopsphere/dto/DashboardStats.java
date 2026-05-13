package com.shopsphere.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStats {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long deliveredOrders;
    private Map<Integer, BigDecimal> monthlySales;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long t) { this.totalUsers = t; }
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long t) { this.totalProducts = t; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long t) { this.totalOrders = t; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal t) { this.totalRevenue = t; }
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long p) { this.pendingOrders = p; }
    public long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(long d) { this.deliveredOrders = d; }
    public Map<Integer, BigDecimal> getMonthlySales() { return monthlySales; }
    public void setMonthlySales(Map<Integer, BigDecimal> m) { this.monthlySales = m; }
}
