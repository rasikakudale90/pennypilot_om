package com.pennypilot.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PennyPilot API")
                        .version("1.0.0")
                        .description("REST API documentation for the PennyPilot Core Expense Tracker (V1)"));
    }
}
