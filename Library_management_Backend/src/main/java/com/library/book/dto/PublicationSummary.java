package com.library.book.dto;

public class PublicationSummary {
    private String publication;
    private long totalBooks;
    private int totalAvailableCopies;

    public PublicationSummary(String publication, long totalBooks, int totalAvailableCopies) {
        this.publication = publication;
        this.totalBooks = totalBooks;
        this.totalAvailableCopies = totalAvailableCopies;
    }

    // Getters and Setters
    public String getPublication() {
        return publication;
    }

    public void setPublication(String publication) {
        this.publication = publication;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public int getTotalAvailableCopies() {
        return totalAvailableCopies;
    }

    public void setTotalAvailableCopies(int totalAvailableCopies) {
        this.totalAvailableCopies = totalAvailableCopies;
    }
}