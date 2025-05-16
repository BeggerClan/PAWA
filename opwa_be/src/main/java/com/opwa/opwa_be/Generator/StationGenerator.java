package com.opwa.opwa_be.Generator;

import com.opwa.opwa_be.Repository.StationRepo;
import com.opwa.opwa_be.model.Station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StationGenerator implements CommandLineRunner {

    @Autowired
    private StationRepo stationRepo;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        stationRepo.deleteAll();

        // Line 1 (Red)
        createStation("Ben Thanh", 10.770814000000017, 106.6974889, "red");
        createStation("Opera House", 10.776087999999994, 106.702577, "red");
        createStation("Ba Son", 10.781545499999984, 106.70790530000002, "red");
        createStation("Van Thanh Park", 10.796082399999985, 106.7154919, "red");
        createStation("Tan Cang", 10.798643700000017, 106.72325839999999, "red");
        createStation("Thao Dien", 10.80050700000001, 106.73366500000002, "red");
        createStation("An Phu", 10.802240799999987, 106.74226020000003, "red");
        createStation("Rach Chiec", 10.80847990000001, 106.75518139999998, "red");
        createStation("Phuoc Long", 10.821368299999998, 106.7581087, "red");
        createStation("Binh Thai", 10.836374900000006, 106.7657043, "red");
        createStation("Thu Duc", 10.846417999999996, 106.77162100000001, "red");
        createStation("Hi-Tech Park", 10.858838199999992, 106.78832880000002, "red");
        createStation("National University", 10.866283300000028, 106.80117920000004, "red");
        createStation("Suoi Tien Terminal", 10.879566499999989, 106.81401330000001, "red");

        // Line 2 (Blue)
        createStation("Ben Thanh", 10.770814000000017, 106.6974889, "blue");
        createStation("Tao Dan", 10.7725321, 106.6910569, "blue");
        createStation("Dan Chu", 10.7775418, 106.6819929, "blue");
        createStation("Hoa Hung", 10.782665809908664, 106.67713445751163, "blue");
        createStation("Le Thi Rieng", 10.7860466141236, 106.66559716955892, "blue");
        createStation("Pham Van Hai", 10.789142340945713, 106.66028628228501, "blue");
        createStation("Bay Hien", 10.793786046271816, 106.65422075875978, "blue");
        createStation("Nguyen Hong Dao", 10.797900563403283, 106.6437942082327, "blue");
        createStation("Ba Queo", 10.809011502284783, 106.6338555455807, "blue");
        createStation("Pham Van Bach", 10.817732380746634, 106.63726819800785, "blue");
        createStation("Tan Binh", 10.828017960588946, 106.64305819030737, "blue");

        // Line 3 (Green)
        // createStation("Ben Thanh", 10.770814, 106.697489, "green");
        // createStation("Nguyen Tri Phuong", 10.7625, 106.6775, "green");
        // createStation("Ba Thang Hai", 10.7622, 106.6698, "green");
        // createStation("Ly Thai To", 10.7620, 106.6630, "green");
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