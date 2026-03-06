import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { bookService } from '../services/api';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookService.getBookById(id);
      setBook(response.data);
    } catch (err) {
      alert('Book not found');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this book?')) {
      try {
        await bookService.deleteBook(id);
        navigate('/books');
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <Button variant="link" onClick={() => navigate(-1)} className="mb-3">
        <FaArrowLeft /> Back
      </Button>

      <Card>
        <Card.Header as="h4" className="bg-primary text-white">
          📘 Book Details
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <h5>Title</h5>
              <p className="mb-4">{book.title}</p>
              <h5>Author</h5>
              <p className="mb-4">{book.author}</p>
              <h5>Publication</h5>
              <p className="mb-4">{book.publication}</p>
            </div>
            <div className="col-md-6">
              <h5>Year</h5>
              <p className="mb-4">{book.publicationYear}</p>
              <h5>Available Copies</h5>
              <p className="mb-4">
                <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
                  {book.availableCopies}
                </Badge>
              </p>
              <h5>Genre</h5>
              <p className="mb-4">
                <Badge bg="info">{book.genre.replace('_', ' ')}</Badge>
              </p>
            </div>
          </div>
          <hr />
          <div className="d-flex gap-2">
            <Link to={`/books/edit/${book.id}`} className="btn btn-warning">
              <FaEdit /> Edit
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              <FaTrash /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookDetails;