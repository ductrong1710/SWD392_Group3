package com.example.swd392_gr03_eco;

import com.example.swd392_gr03_eco.config.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class Swd392Gr03EcoApplicationTests {

    @Test
    void contextLoads() {
    }

}
