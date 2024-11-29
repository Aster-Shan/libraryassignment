package com.aml.library.dto;
import lombok.Data;

@Data
public class MediaStats {
    private long totalMedia;
    private long availableMedia;
    private long borrowedMedia;
}