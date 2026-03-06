package com.library.book.config;

import com.library.book.entity.Book;
import com.library.book.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        // Add some sample data
        bookRepository.save(new Book("The Great Gatsby", "F. Scott Fitzgerald",
                "Scribner", 1925, 5, Book.Genre.FICTION));

        bookRepository.save(new Book("Dune", "Frank Herbert",
                "Chilton Books", 1965, 3, Book.Genre.SCIENCE_FICTION));

        bookRepository.save(new Book("Sapiens", "Yuval Noah Harari",
                "Harper", 2011, 7, Book.Genre.NON_FICTION));

        bookRepository.save(new Book("The Hobbit", "J.R.R. Tolkien",
                "Allen & Unwin", 1937, 4, Book.Genre.FANTASY));
    }
}