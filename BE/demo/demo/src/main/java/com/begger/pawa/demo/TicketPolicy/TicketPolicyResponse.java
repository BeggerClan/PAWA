package com.begger.pawa.demo.TicketPolicy;

import com.begger.pawa.demo.TicketType.Eligibility;
import com.begger.pawa.demo.TicketType.ValidFrom;
import com.begger.pawa.demo.TicketType.TicketType;

public class TicketPolicyResponse {

    private String code;
    private String displayName;
    private long price;
    private long validityDurationHours;
    private ValidFrom validFrom;
    private Integer maxStations;
    private Eligibility eligibility;

    public TicketPolicyResponse() {}

    public TicketPolicyResponse(String code,
                                String displayName,
                                long price,
                                long validityDurationHours,
                                ValidFrom validFrom,
                                Integer maxStations,
                                Eligibility eligibility) {
        this.code                  = code;
        this.displayName           = displayName;
        this.price                 = price;
        this.validityDurationHours = validityDurationHours;
        this.validFrom             = validFrom;
        this.maxStations           = maxStations;
        this.eligibility           = eligibility;
    }

    public static TicketPolicyResponse fromEntity(TicketType t) {
        return new TicketPolicyResponse(
                t.getCode(),
                t.getDisplayName(),
                t.getPrice(),
                t.getValidityDurationHours(),
                t.getValidFrom(),
                t.getMaxStations(),
                t.getEligibility()
        );
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Eligibility getEligibility() {
        return eligibility;
    }

    public void setEligibility(Eligibility eligibility) {
        this.eligibility = eligibility;
    }

    public Integer getMaxStations() {
        return maxStations;
    }

    public void setMaxStations(Integer maxStations) {
        this.maxStations = maxStations;
    }

    public ValidFrom getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(ValidFrom validFrom) {
        this.validFrom = validFrom;
    }

    public long getValidityDurationHours() {
        return validityDurationHours;
    }

    public void setValidityDurationHours(long validityDurationHours) {
        this.validityDurationHours = validityDurationHours;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
