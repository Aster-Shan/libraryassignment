package com.aml.library.Entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.aml.library.exception.MediaNotEligibleForRenewalException;

@Entity
@Table(name="media_circulation")
public class MediaCirculation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
    @JoinColumn(name = "inventory_id")
	private Inventory inventory;
	
	@ManyToOne
    @JoinColumn(name = "user_id")
	private User user;
	
	private LocalDate borrowDate;
	private LocalDate dueDate;
	private LocalDate returnDate;
	
	private boolean returned;
	
    public void renew() {
        if (this.inventory.isEligibleForRenewal()) {
        	this.inventory.setRenewalCount(this.inventory.getRenewalCount()+1);
            dueDate = dueDate.plusWeeks(2); // Extend by 2 weeks
        } else {
        	throw new MediaNotEligibleForRenewalException("Media is not eligible for renewal. Maximun renewals reached.");
        }
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Inventory getInventory() {
		return inventory;
	}

	public void setInventory(Inventory inventory) {
		this.inventory = inventory;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public boolean isReturned() {
		return returned;
	}

	public void setReturned(boolean reutrned) {
		this.returned = reutrned;
	}

	public LocalDate getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(LocalDate returnedDate) {
		this.returnDate = returnedDate;
	}
}
