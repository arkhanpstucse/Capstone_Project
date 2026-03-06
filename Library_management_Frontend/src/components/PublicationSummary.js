import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col, Table, Badge } from 'react-bootstrap';
import { bookService } from '../services/api';

const PublicationSummary = () => {
  const [publication, setPublication] = useState('');
  const [summary, setSummary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!publication.trim()) {
      setError('Please enter a publication name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get summary
      const summaryResponse = await bookService.getPublicationSummary(publication);
      console.log('Summary response:', summaryResponse.data);
      
      // Get books for display
      const booksResponse = await bookService.getBooksByPublication(publication);
      console.log('Books response:', booksResponse.data);
      
      setSummary(summaryResponse.data);
      setBooks(booksResponse.data);
      setSearched(true);
      
    } catch (err) {
      console.error('Summary error:', err);
      setError('Failed to get publication summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get genre badge color
  const getGenreColor = (genre) => {
    const colors = {
      'FICTION': 'primary',
      'SCIENCE_FICTION': 'info',
      'NON_FICTION': 'success',
      'FANTASY': 'warning'
    };
    return colors[genre] || 'secondary';
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h4" className="bg-primary text-white">
        <i className="bi bi-bar-chart"></i> Publication Summary
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Publication Name</Form.Label>
            <Form.Control
              type="text"
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              placeholder="e.g., Harper, Scribner, Penguin"
              disabled={loading}
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Loading...
              </>
            ) : (
              'Get Summary'
            )}
          </Button>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {searched && !loading && summary && (
          <div className="mt-4">
            {/* Summary Cards */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="bg-primary text-white text-center h-100">
                  <Card.Body>
                    <h5>Total Books</h5>
                    <h1 className="display-4">{summary.totalBooks || 0}</h1>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="bg-success text-white text-center h-100">
                  <Card.Body>
                    <h5>Total Available Copies</h5>
                    <h1 className="display-4">{summary.totalAvailableCopies || 0}</h1>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Books List */}
            <h5 className="mb-3">Books from {publication}:</h5>
            {books.length === 0 ? (
              <Alert variant="info">
                No books found from this publication.
              </Alert>
            ) : (
              <>
                <p>Found {books.length} book(s)</p>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Year</th>
                      <th>Copies</th>
                      <th>Genre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
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

export default PublicationSummary;