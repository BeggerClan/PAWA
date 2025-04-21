package com.begger.pawa.demo.Movie;

import com.begger.pawa.demo.Movie.Movie;
import com.begger.pawa.demo.Movie.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/top10")
    public List<Movie> getTop10Movies() {
        return movieService.getFirst10Movies();
    }
}

