import React, { useState } from 'react';
import { Form, Button, Card, Table, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { bookService } from '../services/api';

const SearchByGenre = () => {
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const genres = [
    { value: 'FICTION', label: 'Fiction' },
    { value: 'SCIENCE_FICTION', label: 'Science Fiction' },
    { value: 'NON_FICTION', label: 'Non-Fiction' },
    { value: 'FANTASY', label: 'Fantasy' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!genre) {
      setError('Please select a genre');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get books by genre
      const booksResponse = await bookService.getBooksByGenre(genre);
      console.log('Books by genre:', booksResponse.data);
      
      // Get total count by genre
      const totalResponse = await bookService.getTotalBooksByGenre(genre);
      console.log('Total by genre:', totalResponse.data);
      
      setBooks(booksResponse.data);
      setTotal(totalResponse.data.totalBooks);
      setSearched(true);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search books by genre. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h4" className="bg-primary text-white">
        <i className="bi bi-tags"></i> Search Books by Genre
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Select Genre</Form.Label>
            <Form.Select 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)}
              disabled={loading}
            >
              <option value="">Choose a genre...</option>
              {genres.map(g => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !genre}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {searched && !loading && (
          <div className="mt-4">
            {/* Total Books Card */}
            <Row className="mb-4">
              <Col md={6} className="mx-auto">
                <Card className="bg-info text-white text-center">
                  <Card.Body>
                    <h5>Total Books in {genres.find(g => g.value === genre)?.label}</h5>
                    <h1 className="display-4">{total || 0}</h1>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Books List */}
            <h5>Books in this genre:</h5>
            {books.length === 0 ? (
              <Alert variant="info">
                No books found in this genre.
              </Alert>
            ) : (
              <>
                <p>Found {books.length} book(s)</p>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Publication</th>
                      <th>Year</th>
                      <th>Copies</th>
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
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SearchByGenre;