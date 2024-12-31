package com.aml.library.Entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    @ManyToOne
    @JoinColumn(name = "message_id")
    private NotificationMessage message;
    
	private LocalDateTime sentAt;

	@OneToOne
    @JoinColumn(name = "media_circulation_id", unique = true)
    private MediaCirculation transaction;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationMessage getMessage() {
        return message;
    }

    public void setMessage(NotificationMessage message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    public MediaCirculation getTransaction() {
		return transaction;
	}

	public void setTransaction(MediaCirculation transaction) {
		this.transaction = transaction;
	}

}
