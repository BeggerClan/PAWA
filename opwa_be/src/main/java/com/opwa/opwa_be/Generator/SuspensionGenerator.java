// package com.opwa.opwa_be.Generator;

// import com.opwa.opwa_be.Model.MetroLine;
// import com.opwa.opwa_be.Model.Suspension;
// import com.opwa.opwa_be.Repository.MetroLineRepo;
// import com.opwa.opwa_be.Repository.SuspensionRepo;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.time.LocalDateTime;
// import java.util.List;

// @Component
// public class SuspensionGenerator implements CommandLineRunner {

//     @Autowired
//     private SuspensionRepo suspensionRepo;
    
//     @Autowired
//     private MetroLineRepo metroLineRepo;

//     @Override
//     public void run(String... args) throws Exception {
//         // Clear existing data
//         suspensionRepo.deleteAll();

//         // Get Line 1
//         MetroLine line1 = metroLineRepo.findByLineName("Line 1");
        
//         // Create a sample suspension for Line 1 (maintenance)
//         Suspension maintenance = new Suspension();
//         maintenance.setLineId(line1.getLineId());
//         maintenance.setReason("Scheduled maintenance");
//         maintenance.setStartTime(LocalDateTime.now().plusHours(1));
//         maintenance.setEndTime(LocalDateTime.now().plusHours(4));
//         suspensionRepo.save(maintenance);

//         // Create a sample suspension for Line 1 (emergency)
//         Suspension emergency = new Suspension();
//         emergency.setLineId(line1.getLineId());
//         emergency.setReason("Emergency repair");
//         emergency.setStartTime(LocalDateTime.now().minusHours(1));
//         emergency.setEndTime(LocalDateTime.now().plusHours(2));
//         suspensionRepo.save(emergency);
//     }
// }