package com.opwa.opwa_be.model;

public enum Shift {
    DAY("06:00 AM – 02:00 PM"),
    EVENING("02:00 PM – 10:00 PM"),
    NIGHT("10:00 PM – 06:00 AM");

    private final String timeRange;

    Shift(String timeRange) {
        this.timeRange = timeRange;
    }

    public String getTimeRange() {
        return timeRange;
    }
}