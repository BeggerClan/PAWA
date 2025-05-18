package com.begger.pawa.demo.TicketType;

import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Document(collection = "ticket_type")
public class TicketType {

    @Id
    private ObjectId id;
    private String code;
    private String displayName;
    private long price;
    private long validityDurationHours;  // e.g. 24, 72, 720
    private ValidFrom validFrom;
    private Integer maxStations;         // null if not applicable
    private Eligibility eligibility;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public long getValidityDurationHours() {
        return validityDurationHours;
    }

    public void setValidityDurationHours(long validityDurationHours) {
        this.validityDurationHours = validityDurationHours;
    }

    public ValidFrom getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(ValidFrom validFrom) {
        this.validFrom = validFrom;
    }

    public Integer getMaxStations() {
        return maxStations;
    }

    public void setMaxStations(Integer maxStations) {
        this.maxStations = maxStations;
    }

    public Eligibility getEligibility() {
        return eligibility;
    }

    public void setEligibility(Eligibility eligibility) {
        this.eligibility = eligibility;
    }
}
