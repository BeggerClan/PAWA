package com.opwa.opwa_be.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.opwa.opwa_be.Repository.StaffRepo;
import com.opwa.opwa_be.model.Staff;

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
    if (data != null) {
        if (staff.getStaff_usename() != null) data.setStaff_usename(staff.getStaff_usename());
        if (staff.getStaff_nationID() != 0) data.setStaff_nationID(staff.getStaff_nationID());
        if (staff.getStaff_firstname() != null) data.setStaff_firstname(staff.getStaff_firstname());
        if (staff.getStaff_lastname() != null) data.setStaff_lastname(staff.getStaff_lastname());
        if (staff.getStaff_email() != null) data.setStaff_email(staff.getStaff_email());
        if (staff.getStaff_password() != null) data.setStaff_password(staff.getStaff_password());
        if (staff.getStaff_phone() != null) data.setStaff_phone(staff.getStaff_phone());
        if (staff.getStaff_address() != null) data.setStaff_address(staff.getStaff_address());
        if (staff.getStaff_role() != null) data.setStaff_role(staff.getStaff_role());
        if (staff.getStaff_birthday() != null) data.setStaff_birthday(staff.getStaff_birthday());

        staffRepo.save(data);
    }
    else {
        System.out.println("Staff not found with id: " + staff.getStaff_id());
    }
    System.out.println("Staff updated successfully!");
}

    @DeleteMapping("/deleteStaff/{id}")
    public void deleteStaff(@PathVariable int id){
    staffRepo.deleteById(id);

}
    @PostMapping("/addStaffList")
    public void addStaffList(@RequestBody List<Staff> staff) {
    staffRepo.saveAll(staff); 
 
}

  
    
    
    
}
