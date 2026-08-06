package com.nexusgov.dto;

import java.util.Map;

public class StatsDTO {

    private long total;
    private long reported;
    private long inProgress;
    private long resolved;
    private long rejected;
    private Map<String, Long> categoryBreakdown;

    public StatsDTO() {
    }

    public StatsDTO(long total, long reported, long inProgress, long resolved, long rejected, Map<String, Long> categoryBreakdown) {
        this.total = total;
        this.reported = reported;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.rejected = rejected;
        this.categoryBreakdown = categoryBreakdown;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getReported() {
        return reported;
    }

    public void setReported(long reported) {
        this.reported = reported;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
