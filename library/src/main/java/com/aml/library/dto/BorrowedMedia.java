package com.aml.library.dto;

import java.time.LocalDate;

public class BorrowedMedia {
	private Long id;
	private String title;
	private String author;
	private LocalDate borrowDate;
	private LocalDate dueDate;
	private boolean returned;
	private LocalDate returnDate;
	private String branchName;
	private String branchFullAddress;
	private int renewalCount;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
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
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public int getRenewalCount() {
		return renewalCount;
	}
	public void setRenewalCount(int renewalCount) {
		this.renewalCount = renewalCount;
	}
	public String getBranchFullAddress() {
		return branchFullAddress;
	}
	public void setBranchFullAddress(String branchAddress) {
		this.branchFullAddress = branchAddress;
	}
	public boolean isReturned() {
		return returned;
	}
	public void setReturned(boolean returned) {
		this.returned = returned;
	}
	public LocalDate getReturnDate() {
		return returnDate;
	}
	public void setReturnDate(LocalDate returnDate) {
		this.returnDate = returnDate;
	}
}
