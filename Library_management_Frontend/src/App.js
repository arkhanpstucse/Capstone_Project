import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ApiTester from './components/ApiTester';
// Components - make sure all are imported
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BookDetails from './components/BookDetails';
import SearchByAuthor from './components/SearchByAuthor';
import SearchByGenre from './components/SearchByGenre';
import SearchByPublication from './components/SearchByPublication';  // This was missing!
import PublicationSummary from './components/PublicationSummary';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/debug" element={<ApiTester />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/edit/:id" element={<BookForm />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/search/author" element={<SearchByAuthor />} />
            <Route path="/search/genre" element={<SearchByGenre />} />
            <Route path="/search/publication" element={<SearchByPublication />} />
            <Route path="/publication/summary" element={<PublicationSummary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;