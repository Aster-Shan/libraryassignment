package com.aml.library.dto;

import java.time.LocalDate;

public class BorrowResponse {
	private String pickup;
	private String author;
	private String title;
	private LocalDate borrowDate;
	private LocalDate dueDate;
	private int renewal_count;
	private String branchAddress;
	public String getPickup() {
		return pickup;
	}
	public void setPickup(String pickup) {
		this.pickup = pickup;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public LocalDate getBorrowDate() {
		return borrowDate;
	}
	public void setBorrowDate(LocalDate borrowDate) {
		this.borrowDate = borrowDate;
	}
	public LocalDate getDueDate() {
		return dueDate;
	}
	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}
	public int getRenewal_count() {
		return renewal_count;
	}
	public void setRenewal_count(int renewal_count) {
		this.renewal_count = renewal_count;
	}
	public void setBranchAddress(String branchAddress) {
        this.branchAddress = branchAddress;
    }
	public String getBranchAddress() {
        return branchAddress;
    }
	
}
