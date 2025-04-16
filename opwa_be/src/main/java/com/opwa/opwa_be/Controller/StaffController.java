package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.opwa.opwa_be.Model.Staff;
import com.opwa.opwa_be.Repository.StaffRepo;
import org.springframework.web.bind.annotation.PutMapping;


@RestController

public class StaffController {
    @Autowired
    StaffRepo staffRepo;

    @PostMapping("/addStaff")
    public void addStaff(@RequestBody Staff staff) {
        staffRepo.save(staff); 

        
    }
    @GetMapping("/getStaff/{id}")
    public Staff  getStaff(@PathVariable int id) {
        return staffRepo.findById(id).orElse(null);
      
    }
    @GetMapping("/fecthStaffs")
    public List<Staff> fetchStaffs() {
       return staffRepo.findAll();
    }
    @PutMapping("/updateStaff")
    public void updateStaff(@RequestBody Staff staff) {
        Staff data = staffRepo.findById(staff.getStaff_id()).orElse(null);
        System.out.println(data);
    }

  
    
    
    
}
