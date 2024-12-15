package com.aml.library.dto;

import com.aml.library.Entity.Media;


public class InventoryDTO {
	
	private Long id;
	private Media media;
	private BranchDTO branch;
    private String status;
    private int renewalCount;
    
    public InventoryDTO(Long id, Media media,BranchDTO branch,String status,int renewalCount) {
    	this.setId(id);
    	this.setBranch(branch);
    	this.setMedia(media);
    	this.setStatus(status);
    	this.setRenewalCount(renewalCount);
    }
	
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

	public BranchDTO getBranch() {
		return branch;
	}

	public void setBranch(BranchDTO branch) {
		this.branch = branch;
	}
}

