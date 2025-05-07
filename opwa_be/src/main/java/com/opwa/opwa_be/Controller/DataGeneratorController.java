package com.opwa.opwa_be.Controller;

import com.opwa.opwa_be.Generator.MasterDataGenerator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/data-generator")
public class DataGeneratorController {

    private final MasterDataGenerator masterDataGenerator;

    public DataGeneratorController(MasterDataGenerator masterDataGenerator) {
        this.masterDataGenerator = masterDataGenerator;
    }

    @PostMapping("/run")
    public String generateAllData() {
        masterDataGenerator.generateAll();
        return "Data generation completed!";
    }
}