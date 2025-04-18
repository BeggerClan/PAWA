package com.opwa.opwa_be.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.opwa.opwa_be.Model.MetroLine;
import java.util.List;

public interface MetroLineRepo extends MongoRepository<MetroLine, String> {
    List<MetroLine> findByStatus(boolean status);
    MetroLine findByLineName(String lineName);
}