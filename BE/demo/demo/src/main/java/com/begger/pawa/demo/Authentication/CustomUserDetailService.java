package com.begger.pawa.demo.Authentication;

import com.begger.pawa.demo.Passenger.Passenger;
import com.begger.pawa.demo.Passenger.PassengerRepository;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final PassengerRepository passengerRepository;

    public CustomUserDetailService(PassengerRepository passengerRepository){
        this.passengerRepository = passengerRepository;
    }

    @Override
    public UserDetails loadUserByUsername (String email) throws UsernameNotFoundException {
        Passenger p = passengerRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user associate with this email " + email));

        // create spring security user, with role passenger
        return User.withUsername(p.getEmail())
                .password(p.getPassword())
                .roles("PASSENGER") // grant passenger role
                .build();
    }
}
