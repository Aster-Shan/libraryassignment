package com.aml.library.Entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "media_id")
    private Media media;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    private String status;
    private int renewalCount;
    private static final int MAX_RENEWALS = 2;

    // Default constructor (required by JPA)
    public Inventory() {}

    // Parameterized constructor for easier initialization
    public Inventory(Long id, Media media, Branch branch, String status, int renewalCount) {
        this.id = id;
        this.media = media;
        this.branch = branch;
        this.status = status;
        this.renewalCount = renewalCount;
    }

    public boolean isEligibleForRenewal() {
        return renewalCount < MAX_RENEWALS;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Media getMedia() {
        return media;
    }

    public void setMedia(Media media) {
        this.media = media;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRenewalCount() {
        return renewalCount;
    }

    public void setRenewalCount(int renewalCount) {
        this.renewalCount = renewalCount;
    }
}
