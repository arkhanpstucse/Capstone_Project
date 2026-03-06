import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge, Card } from 'react-bootstrap';
import { bookService } from '../services/api';
import { FaEdit, FaTrash, FaEye, FaSync } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching books from backend...');
      const response = await bookService.getAllBooks();
      console.log('✅ Books received:', response.data);
      setBooks(response.data);
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      
      let errorMessage = 'Failed to fetch books. ';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. ';
      } else if (err.message.includes('Network Error')) {
        errorMessage += 'Cannot reach backend. ';
      } else if (err.response) {
        errorMessage += `Server error: ${err.response.status}. `;
      }
      
      errorMessage += '\n\n🔧 Troubleshooting:';
      errorMessage += '\n1. Make sure Spring Boot backend is running';
      errorMessage += '\n2. Check if backend is on port 8080';
      errorMessage += '\n3. Verify CORS is configured';
      errorMessage += '\n4. Check backend console for errors';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await bookService.deleteBook(id);
        setBooks(books.filter(book => book.id !== id));
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  const getGenreColor = (genre) => {
    const colors = {
      'FICTION': 'primary',
      'SCIENCE_FICTION': 'info',
      'NON_FICTION': 'success',
      'FANTASY': 'warning'
    };
    return colors[genre] || 'secondary';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading books...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📖 Book Collection</h2>
        <Button variant="outline-primary" onClick={handleRetry}>
          <FaSync /> Retry
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>❌ Connection Error</Alert.Heading>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {error}
          </pre>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-success" size="sm" onClick={handleRetry}>
              Try Again
            </Button>
            <Button variant="outline-info" size="sm" href="http://localhost:8080/api/books" target="_blank">
              Test Backend Directly
            </Button>
          </div>
        </Alert>
      )}

      {!error && books.length === 0 && (
        <Card className="text-center p-5">
          <Card.Body>
            <h3>📚 No Books Found</h3>
            <p>Your library is empty. Add your first book!</p>
            <Link to="/books/new">
              <Button variant="primary">Add First Book</Button>
            </Link>
          </Card.Body>
        </Card>
      )}

      {!error && books.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="bg-primary text-white">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publication</th>
              <th>Year</th>
              <th>Copies</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publication}</td>
                <td>{book.publicationYear}</td>
                <td>
                  <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
                    {book.availableCopies}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getGenreColor(book.genre)}>
                    {book.genre.replace('_', ' ')}
                  </Badge>
                </td>
                <td>
                  <Link to={`/books/${book.id}`} className="btn btn-info btn-sm me-2">
                    <FaEye />
                  </Link>
                  <Link to={`/books/edit/${book.id}`} className="btn btn-warning btn-sm me-2">
                    <FaEdit />
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(book.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BookList;