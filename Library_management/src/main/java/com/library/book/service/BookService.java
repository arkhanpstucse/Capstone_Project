package com.library.book.service;

import com.library.book.dto.PublicationSummary;
import com.library.book.entity.Book;
import com.library.book.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Create
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Read all
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Read by ID
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    // Update
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPublication(bookDetails.getPublication());
        book.setPublicationYear(bookDetails.getPublicationYear());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        book.setGenre(bookDetails.getGenre());

        return bookRepository.save(book);
    }

    // Delete
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    // Find by Author (using Stream API)
    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findAll().stream()
                .filter(book -> book.getAuthor().equalsIgnoreCase(author))
                .collect(Collectors.toList());
    }

    // Find by Genre (using Stream API)
    public List<Book> getBooksByGenre(Book.Genre genre) {
        return bookRepository.findAll().stream()
                .filter(book -> book.getGenre() == genre)
                .collect(Collectors.toList());
    }

    // Find by Publication (using Stream API)
    public List<Book> getBooksByPublication(String publication) {
        return bookRepository.findAll().stream()
                .filter(book -> book.getPublication().equalsIgnoreCase(publication))
                .collect(Collectors.toList());
    }

    // Get Publication Summary (using Stream API)
    public PublicationSummary getPublicationSummary(String publication) {
        List<Book> books = getBooksByPublication(publication);

        long totalBooks = books.size();
        int totalAvailableCopies = books.stream()
                .mapToInt(Book::getAvailableCopies)
                .sum();

        return new PublicationSummary(publication, totalBooks, totalAvailableCopies);
    }

    // NEW METHOD: Get total number of books by genre
    public long getTotalBooksByGenre(Book.Genre genre) {
        return bookRepository.findAll().stream()
                .filter(book -> book.getGenre() == genre)
                .count();
    }
}