import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { bookService } from '../services/api';

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publication: '',
    publicationYear: '',
    availableCopies: '',
    genre: 'FICTION'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genres = ['FICTION', 'SCIENCE_FICTION', 'NON_FICTION', 'FANTASY'];

  useEffect(() => {
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookService.getBookById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch book');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bookData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear),
        availableCopies: parseInt(formData.availableCopies)
      };

      if (isEditMode) {
        await bookService.updateBook(id, bookData);
      } else {
        await bookService.createBook(bookData);
      }
      navigate('/books');
    } catch (err) {
      setError(isEditMode ? 'Failed to update book' : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Card>
          <Card.Header as="h4">
            {isEditMode ? '✏️ Edit Book' : '➕ Add New Book'}
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Publication</Form.Label>
                <Form.Control
                  type="text"
                  name="publication"
                  value={formData.publication}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Publication Year</Form.Label>
                <Form.Control
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  required
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Available Copies</Form.Label>
                <Form.Control
                  type="number"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre.replace('_', ' ')}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
              </Button>
              <Button variant="secondary" className="ms-2" onClick={() => navigate('/books')}>
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default BookForm;