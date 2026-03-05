package com.example.swd392_gr03_eco.service.payment;

import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.service.impl.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component("VNPAY")
public class VnpayStrategy implements PaymentStrategy {

    private final ExchangeRateService exchangeRateService;
    private final String tmnCode;
    private final String secretKey;
    private final String payUrl;
    private final String returnUrl;

    public VnpayStrategy(
            ExchangeRateService exchangeRateService,
            @Value("${vnpay.tmn_code}") String tmnCode,
            @Value("${vnpay.secret_key}") String secretKey,
            @Value("${vnpay.pay_url}") String payUrl,
            @Value("${vnpay.return_url}") String returnUrl
    ) {
        this.exchangeRateService = exchangeRateService;
        this.tmnCode = tmnCode;
        this.secretKey = secretKey;
        this.payUrl = payUrl;
        this.returnUrl = returnUrl;
    }

    @Override
    public String createPaymentUrl(Order order, HttpServletRequest request) {
        
        BigDecimal finalAmountVnd = exchangeRateService.convertUsdToVnd(order.getFinalAmount());
        long amountInCents = finalAmountVnd.longValue() * 100;

        // --- CRITICAL FIX: Create a unique transaction reference for every payment attempt ---
        String vnp_TxnRef = order.getId().toString() + "_" + System.currentTimeMillis();
        // ------------------------------------------------------------------------------------

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = "Payment for order " + order.getId();
        String vnp_OrderType = "other";
        String vnp_Amount = String.valueOf(amountInCents);
        String vnp_IpAddr = "127.0.0.1";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", this.tmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", this.returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

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
        String vnp_SecureHash = hmacSHA512(this.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return this.payUrl + "?" + queryUrl;
    }

    @Override
    public int handleCallback(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        
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

    private String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate HMAC-SHA512", ex);
        }
    }
}
