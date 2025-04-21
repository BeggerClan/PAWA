package com.begger.pawa.demo.Movie;

import com.begger.pawa.demo.Movie.Movie;
import com.begger.pawa.demo.Movie.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getFirst10Movies() {
        return movieRepository.findAll().stream().limit(10).toList();
    }
}