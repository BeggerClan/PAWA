package com.begger.pawa.demo.Movie;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document(collection = "embedded_movies")
public class Movie {

    @MongoId
    private String id;
    private String title;
    private String plot;
    private String fullplot;
    private List<String> genres;
    private Integer runtime;
    private List<String> cast;
    private Integer num_mflix_comments;
    private String poster;
    private List<String> languages;
    private Date released;
    private List<String> directors;
    private List<String> writers;
    private Awards awards;
    private Integer year;
    private Imdb imdb;
    private List<String> countries;
    private String type;
    private Tomatoes tomatoes;

    // Inner classes
    public static class Awards {
        private int wins;
        private int nominations;
        private String text;

        // getters and setters
    }

    public static class Imdb {
        private double rating;
        private int votes;
        private int id;

        // getters and setters
    }

    public static class Tomatoes {
        private Viewer viewer;
        private String production;
        private Date lastUpdated;

        public static class Viewer {
            private double rating;
            private int numReviews;

            // getters and setters
        }

        // getters and setters
    }

    // getters and setters
}