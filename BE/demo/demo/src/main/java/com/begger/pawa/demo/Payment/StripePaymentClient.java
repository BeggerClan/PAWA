package com.begger.pawa.demo.Payment;

import com.begger.pawa.demo.Configuration.StripeProperties;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.util.Map;

@Component
public class StripePaymentClient {

    private final StripeProperties props;

    public StripePaymentClient(StripeProperties props) {
        this.props = props;
    }

    @PostConstruct
    public void init (){
        Stripe.apiKey = props.getApiKey();
    }

    // charge card via stripe
    public Charge charge (Long amount, String token) throws StripeException{
        return Charge.create(
                Map.of(
                        "amount", amount,
                        "currency", "vnd",
                        "source", token
                )
        );
    }
}
