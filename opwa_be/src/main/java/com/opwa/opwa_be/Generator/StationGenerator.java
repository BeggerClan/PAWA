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

        // Line 1 Stations
        createStation("ST001", "Ben Thanh", 10.7796, 106.6993, "red");
        createStation("ST002", "Opera House", 10.7844, 106.7045, "red");
        createStation("ST003", "Ba Son", 10.7889, 106.7097, "red");
        createStation("ST004", "Vinhomes Central Park", 10.7934, 106.7149, "red");
        createStation("ST005", "Tan Cang", 10.7979, 106.7201, "red");
        createStation("ST006", "Thu Thiem", 10.8024, 106.7253, "red");
        createStation("ST007", "An Phu", 10.8069, 106.7305, "red");
        createStation("ST008", "Rach Chiec", 10.8114, 106.7357, "red");
        createStation("ST009", "Phuoc Long", 10.8159, 106.7409, "red");
        createStation("ST010", "Binh Thai", 10.8204, 106.7461, "red");
        createStation("ST011", "Long Binh", 10.8249, 106.7513, "red");
        createStation("ST012", "Bien Hoa", 10.8294, 106.7565, "red");
        createStation("ST013", "Binh Duong", 10.8339, 106.7617, "red");
        createStation("ST014", "Suoi Tien", 10.8384, 106.7669, "red");

        // Line 2 Stations
        createStation("ST015", "Ben Thanh", 10.7796, 106.6993, "blue");
        createStation("ST016", "Tao Dan", 10.7741, 106.6941, "blue");
        createStation("ST017", "Dakao", 10.7686, 106.6889, "blue");
        createStation("ST018", "Ba Huyen Thanh Quan", 10.7631, 106.6837, "blue");
        createStation("ST019", "Cach Mang Thang Tam", 10.7576, 106.6785, "blue");
        createStation("ST020", "Tan Binh", 10.7521, 106.6733, "blue");
        createStation("ST021", "Phu Lam", 10.7466, 106.6681, "blue");
        createStation("ST022", "Binh Chanh", 10.7411, 106.6629, "blue");
        createStation("ST023", "Tham Luong", 10.7356, 106.6577, "blue");
    }

    private void createStation(String id, String name, double lat, double lng, String marker) {
        Station station = new Station();
        station.setStationId(id);
        station.setStationName(name);
        station.setLatitude(lat);
        station.setLongitude(lng);
        station.setMapMarker(marker);
        stationRepo.save(station);
    }
}