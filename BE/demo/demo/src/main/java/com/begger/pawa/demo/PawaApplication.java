package com.begger.pawa.demo;

import com.begger.pawa.demo.Configuration.StripeProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableConfigurationProperties(StripeProperties.class)
public class PawaApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("STRIPE_API_KEY", dotenv.get("STRIPE_API_KEY"));
        SpringApplication.run(PawaApplication.class, args);
    }

}