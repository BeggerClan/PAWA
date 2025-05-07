package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Model.Station;
import com.opwa.opwa_be.Repository.StationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class StationGenerator implements CommandLineRunner {

    @Autowired
    private StationRepo stationRepo;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        stationRepo.deleteAll();

        if (stationRepo.count() == 0) {
            createStation("Ben Thanh", 10.7796, 106.6993, "red");
            createStation("Opera House", 10.7844, 106.7045, "red");
            createStation("Ba Son", 10.7889, 106.7097, "red");
            createStation("Vinhomes Central Park", 10.7934, 106.7149, "red");
            createStation("Tan Cang", 10.7979, 106.7201, "red");
            createStation("Thu Thiem", 10.8024, 106.7253, "red");
            createStation("An Phu", 10.8069, 106.7305, "red");
            createStation("Rach Chiec", 10.8114, 106.7357, "red");
            createStation("Phuoc Long", 10.8159, 106.7409, "red");
            createStation("Binh Thai", 10.8204, 106.7461, "red");
            createStation("Long Binh", 10.8249, 106.7513, "red");
            createStation("Bien Hoa", 10.8294, 106.7565, "red");
            createStation("Binh Duong", 10.8339, 106.7617, "red");
            createStation("Suoi Tien", 10.8384, 106.7669, "red");
            
            // Blue line stations
            createStation("Ben Thanh", 10.7796, 106.6993, "blue");
            createStation("Tao Dan", 10.7741, 106.6941, "blue");
            createStation("Dakao", 10.7686, 106.6889, "blue");
            createStation("Ba Huyen Thanh Quan", 10.7631, 106.6837, "blue");
            createStation("Cach Mang Thang Tam", 10.7576, 106.6785, "blue");
            createStation("Tan Binh", 10.7521, 106.6733, "blue");
            createStation("Phu Lam", 10.7466, 106.6681, "blue");
            createStation("Binh Chanh", 10.7411, 106.6629, "blue");
            createStation("Tham Luong", 10.7356, 106.6577, "blue");
            
            // Green line stations (for future expansion)
            createStation("District 1 Center", 10.7732, 106.6964, "green");
            createStation("District 3 Hub", 10.7823, 106.6841, "green");
            createStation("District 5 Crossing", 10.7543, 106.6692, "green");
            createStation("District 7 Terminal", 10.7321, 106.7265, "green");
        }
    }

    private void createStation(String name, double lat, double lng, String marker) {
        Station station = new Station();
        station.setStationId("ST" + (stationRepo.count() + 1));
        station.setStationName(name);
        station.setLatitude(lat);
        station.setLongitude(lng);
        station.setMapMarker(marker);
        stationRepo.save(station);
    }
}