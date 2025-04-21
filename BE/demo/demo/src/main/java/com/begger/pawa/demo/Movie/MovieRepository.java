package com.begger.pawa.demo.Movie;

import com.begger.pawa.demo.Movie.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, String> {
}
