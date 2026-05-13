package com.shopsphere.dto;

import jakarta.validation.constraints.*;

public class OrderRequest {
    @NotBlank private String shippingName;
    @NotBlank private String shippingAddress;
    @NotBlank private String shippingCity;
    @NotBlank private String shippingState;
    @NotBlank private String shippingZipCode;
    @NotBlank private String shippingPhone;
    private String notes;
    private String paymentMethod;

    public String getShippingName() { return shippingName; }
    public void setShippingName(String s) { this.shippingName = s; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String s) { this.shippingAddress = s; }
    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String s) { this.shippingCity = s; }
    public String getShippingState() { return shippingState; }
    public void setShippingState(String s) { this.shippingState = s; }
    public String getShippingZipCode() { return shippingZipCode; }
    public void setShippingZipCode(String s) { this.shippingZipCode = s; }
    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String s) { this.shippingPhone = s; }
    public String getNotes() { return notes; }
    public void setNotes(String n) { this.notes = n; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String p) { this.paymentMethod = p; }
}
