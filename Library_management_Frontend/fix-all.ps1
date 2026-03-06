# fix-all.ps1
Write-Host "🔧 Fixing Book Library Frontend Issues" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Install missing packages
Write-Host "`n📦 Installing missing packages..." -ForegroundColor Yellow
npm install react-bootstrap bootstrap react-icons axios react-router-dom

# Step 2: Create missing SearchByPublication component
Write-Host "`n📝 Creating missing SearchByPublication component..." -ForegroundColor Yellow

$searchByPublicationContent = @'
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
              placeholder="Enter publication name"
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
              <Alert variant="info">No books found</Alert>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Copies</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publicationYear}</td>
                      <td>{book.availableCopies}</td>
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
'@

$searchByPublicationContent | Out-File -FilePath "src/components/SearchByPublication.js" -Encoding utf8
Write-Host "✅ Created SearchByPublication component" -ForegroundColor Green

# Step 3: Verify backend connection
Write-Host "`n🔍 Testing backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/books" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running at localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Cannot connect to backend at localhost:8080" -ForegroundColor Yellow
    Write-Host "   Make sure your Spring Boot app is running first!" -ForegroundColor Yellow
}

Write-Host "`n🎉 Fix complete!" -ForegroundColor Green
Write-Host "`n🚀 To start the app:" -ForegroundColor Cyan
Write-Host "1. First start your Spring Boot backend (if not running)" -ForegroundColor White
Write-Host "2. Then run: npm start" -ForegroundColor White
Write-Host "3. Open: http://localhost:3000" -ForegroundColor White