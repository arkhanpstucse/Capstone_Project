import React, { useState } from 'react';
import { Form, Button, Card, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { bookService } from '../services/api';

const SearchByAuthor = () => {
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!author.trim()) {
      setError('Please enter an author name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Searching for author:', author);
      const response = await bookService.getBooksByAuthor(author);
      console.log('📚 Response:', response);
      
      // Check if response has data
      if (response && response.data) {
        setBooks(response.data);
        setSearched(true);
        
        if (response.data.length === 0) {
          setError(`No books found by author: "${author}"`);
        }
      } else {
        setError('Invalid response from server');
      }
      
    } catch (err) {
      console.error('❌ Search error:', err);
      
      // Detailed error message
      let errorMessage = 'Failed to search books. ';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. ';
      } else if (err.message.includes('Network Error')) {
        errorMessage += 'Network error - cannot reach backend. ';
      } else if (err.response) {
        // The request was made and the server responded with a status code
        errorMessage += `Server error: ${err.response.status}. `;
        if (err.response.data) {
          errorMessage += `Details: ${JSON.stringify(err.response.data)}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage += 'No response from server. ';
      } else {
        // Something happened in setting up the request
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h4" className="bg-primary text-white">
        <i className="bi bi-person"></i> Search Books by Author
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., F. Scott Fitzgerald, Frank Herbert"
              disabled={loading}
              isInvalid={error && !loading}
            />
            {error && !loading && (
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
          
          {/* Test buttons for common authors */}
          <div className="mt-3">
            <small className="text-muted">Quick test:</small>
            <div className="d-flex gap-2 mt-1">
              <Button 
                size="sm" 
                variant="outline-secondary"
                onClick={() => setAuthor('F. Scott Fitzgerald')}
              >
                F. Scott Fitzgerald
              </Button>
              <Button 
                size="sm" 
                variant="outline-secondary"
                onClick={() => setAuthor('Frank Herbert')}
              >
                Frank Herbert
              </Button>
              <Button 
                size="sm" 
                variant="outline-secondary"
                onClick={() => setAuthor('Yuval Noah Harari')}
              >
                Yuval Noah Harari
              </Button>
            </div>
          </div>
        </Form>

        {searched && !loading && books.length > 0 && (
          <div className="mt-4">
            <h5>Results for "{author}"</h5>
            <p>Found {books.length} book(s)</p>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Publication</th>
                  <th>Year</th>
                  <th>Copies</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.publication}</td>
                    <td>{book.publicationYear}</td>
                    <td>
                      <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
                        {book.availableCopies}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={
                        book.genre === 'FICTION' ? 'primary' :
                        book.genre === 'SCIENCE_FICTION' ? 'info' :
                        book.genre === 'NON_FICTION' ? 'success' : 'warning'
                      }>
                        {book.genre.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SearchByAuthor;