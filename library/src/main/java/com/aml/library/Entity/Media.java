package com.aml.library.Entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String genre;
    private String author;
    private String format;
    private String description;
    private int publicationYear;

//    @ManyToOne
//    @JoinColumn(name = "branch_id")
//    private Branch branch;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;

    // Getters and Setters
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

    public String getGenre() {
        return genre;
    }

    public void setGenre(String type) {
        this.genre = type;
    }

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}
	
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getPublicationYear() {
		return publicationYear;
	}

	public void setPublicationYear(int publicationYear) {
		this.publicationYear = publicationYear;
	}
    
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public LocalDate getDueDate() {
//        return dueDate;
//    }
//
//    public void setDueDate(LocalDate dueDate) {
//        this.dueDate = dueDate;
//    }
//
//    public int getRenewalCount() {
//        return renewalCount;
//    }
//
//    public void setRenewalCount(int renewalCount) {
//        this.renewalCount = renewalCount;
//    }

//    public Branch getBranch() {
//        return branch;
//    }
//
//    public void setBranch(Branch branch) {
//        this.branch = branch;
//    }
//
//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }
//
//    public boolean isEligibleForRenewal() {
//        return renewalCount < MAX_RENEWALS && status.equals("borrowed");
//    }

//    public void renew() {
//        if (isEligibleForRenewal()) {
//            renewalCount++;
//            dueDate = dueDate.plusWeeks(2); // Extend by 2 weeks
//        } else {
//            throw new IllegalStateException("Media is not eligible for renewal");
//        }
//    }
}
