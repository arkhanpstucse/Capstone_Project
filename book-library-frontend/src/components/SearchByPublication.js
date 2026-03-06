import React, { useState } from 'react';
import { Form, Button, Card, Table, Alert } from 'react-bootstrap';
import { bookService } from '../services/api';

const SearchByPublication = () => {
  const [publication, setPublication] = useState('');
  const [books, setBooks] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await bookService.getBooksByPublication(publication);
      setBooks(response.data);
      setSearched(true);
    } catch (err) {
      alert('Search failed. Make sure backend is running at localhost:8080');
    }
  };

  return (
    <Card>
      <Card.Header as="h4">🏢 Search by Publication</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Publication Name</Form.Label>
            <Form.Control
              type="text"
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              placeholder="Enter publication name (e.g., Harper)"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form>

        {searched && (
          <div className="mt-4">
            <h5>Results for "{publication}"</h5>
            {books.length === 0 ? (
              <Alert variant="info">No books found from this publication.</Alert>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
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
                      <td>{book.availableCopies}</td>
                      <td>{book.genre.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SearchByPublication;