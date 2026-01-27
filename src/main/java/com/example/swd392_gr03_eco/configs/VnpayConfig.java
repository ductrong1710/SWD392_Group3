package com.example.swd392_gr03_eco.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class VnpayConfig {

    // These static fields will be populated by the setter methods below
    public static String vnp_PayUrl;
    public static String vnp_ReturnUrl;
    public static String vnp_TmnCode;
    public static String secretKey;

    @Value("${vnpay.pay_url}")
    public void setVnp_PayUrl(String vnp_PayUrl) {
        VnpayConfig.vnp_PayUrl = vnp_PayUrl;
    }

    @Value("${vnpay.return_url}")
    public void setVnp_ReturnUrl(String vnp_ReturnUrl) {
        VnpayConfig.vnp_ReturnUrl = vnp_ReturnUrl;
    }

    @Value("${vnpay.tmn_code}")
    public void setVnp_TmnCode(String vnp_TmnCode) {
        VnpayConfig.vnp_TmnCode = vnp_TmnCode;
    }

    @Value("${vnpay.secret_key}")
    public void setSecretKey(String secretKey) {
        VnpayConfig.secretKey = secretKey;
    }

    public static String hmacSHA512(final String key, final String data) {
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
