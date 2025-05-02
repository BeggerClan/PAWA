package com.begger.pawa.demo.Profile;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.security.Principal;

@RestController
@RequestMapping("/api/passengers/profile")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    // get profile with valid jwt
    @GetMapping
    public ProfileResponse getProfile(Principal principal){
        return service.getProfile(principal.getName());
    }

    // update profile
    @PatchMapping
    public ProfileResponse updateProfile (@Valid @RequestBody UpdateProfileRequest req, Principal principal){
        return service.updateProfile(principal.getName(),req);
    }
}
