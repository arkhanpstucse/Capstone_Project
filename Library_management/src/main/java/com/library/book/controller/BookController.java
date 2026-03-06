package com.library.book.controller;

import com.library.book.dto.PublicationSummary;
import com.library.book.entity.Book;
import com.library.book.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // 1. POST /api/books - Add a new book
    @PostMapping
    public ResponseEntity<Book> addBook(@Valid @RequestBody Book book) {
        Book savedBook = bookService.addBook(book);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }

    // 2. GET /api/books - Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // 3. GET /api/books/{id} - Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 4. PUT /api/books/{id} - Update a book
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        try {
            Book updatedBook = bookService.updateBook(id, book);
            return new ResponseEntity<>(updatedBook, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE /api/books/{id} - Delete a book
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 6. GET /api/books/author/{authorName} - Find by author
    @GetMapping("/author/{authorName}")
    public ResponseEntity<List<Book>> getBooksByAuthor(@PathVariable String authorName) {
        List<Book> books = bookService.getBooksByAuthor(authorName);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // 7. GET /api/books/genre/{genre} - Find by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Book>> getBooksByGenre(@PathVariable String genre) {
        try {
            Book.Genre genreEnum = Book.Genre.valueOf(genre.toUpperCase());
            List<Book> books = bookService.getBooksByGenre(genreEnum);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 8. GET /api/books/publication/{publication} - Find by publication
    @GetMapping("/publication/{publication}")
    public ResponseEntity<List<Book>> getBooksByPublication(@PathVariable String publication) {
        List<Book> books = bookService.getBooksByPublication(publication);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // 9. GET /api/books/publication/{publication}/summary - Get publication summary
    @GetMapping("/publication/{publication}/summary")
    public ResponseEntity<PublicationSummary> getPublicationSummary(@PathVariable String publication) {
        PublicationSummary summary = bookService.getPublicationSummary(publication);
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }

    // 10. NEW ENDPOINT: GET /api/books/genre/{genre}/total - Get total number of books by genre
    @GetMapping("/genre/{genre}/total")
    public ResponseEntity<Map<String, Object>> getTotalBooksByGenre(@PathVariable String genre) {
        try {
            Book.Genre genreEnum = Book.Genre.valueOf(genre.toUpperCase());
            long totalBooks = bookService.getTotalBooksByGenre(genreEnum);

            Map<String, Object> response = new HashMap<>();
            response.put("genre", genreEnum.toString());
            response.put("totalBooks", totalBooks);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid genre. Valid genres are: FICTION, SCIENCE_FICTION, NON_FICTION, FANTASY");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}