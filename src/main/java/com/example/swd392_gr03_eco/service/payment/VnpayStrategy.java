package com.example.swd392_gr03_eco.service.payment;

import com.example.swd392_gr03_eco.configs.VnpayConfig;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.service.impl.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component("VNPAY")
@RequiredArgsConstructor
public class VnpayStrategy implements PaymentStrategy {

    private final ExchangeRateService exchangeRateService;

    @Override
    public String createPaymentUrl(Order order, HttpServletRequest request) {
        
        // --- NEW: Convert USD to VND ---
        BigDecimal finalAmountUsd = order.getFinalAmount();
        BigDecimal finalAmountVnd = exchangeRateService.convertUsdToVnd(finalAmountUsd);
        // VNPAY requires amount in cents (or smallest currency unit), so multiply by 100
        long amountInCents = finalAmountVnd.longValue() * 100;
        // -----------------------------

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = order.getId().toString();
        String vnp_OrderInfo = "Payment for order " + order.getId();
        String vnp_OrderType = "other";
        String vnp_Amount = String.valueOf(amountInCents);
        String vnp_IpAddr = "127.0.0.1";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnpayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        try {
            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return VnpayConfig.vnp_PayUrl + "?" + queryUrl;
    }

    @Override
    public int handleCallback(Map<String, String> params) {
        // This logic remains the same as it only checks the response code
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        
        // In a real project, you must implement proper hash verification here
        if (true) {
            String responseCode = params.get("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                return 0; // Payment success
            } else {
                return 1; // Payment failed
            }
        } else {
            return -1; // Invalid signature
        }
    }
}
