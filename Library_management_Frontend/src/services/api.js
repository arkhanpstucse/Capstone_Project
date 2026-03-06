import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('🚀 Request:', {
    method: request.method,
    url: request.url,
    baseURL: request.baseURL,
    fullURL: `${request.baseURL}${request.url}`
  });
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ Error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response'
    });
    return Promise.reject(error);
  }
);

export const bookService = {
  getAllBooks: () => api.get('/books'),
  
  getBookById: (id) => api.get(`/books/${id}`),
  
  createBook: (book) => api.post('/books', book),
  
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  
  deleteBook: (id) => api.delete(`/books/${id}`),
  
  getBooksByAuthor: (author) => {
    console.log('Calling getBooksByAuthor with:', author);
    return api.get(`/books/author/${encodeURIComponent(author)}`);
  },
  
  getBooksByGenre: (genre) => {
    console.log('Calling getBooksByGenre with:', genre);
    return api.get(`/books/genre/${genre}`);
  },
  
  getBooksByPublication: (publication) => {
    console.log('Calling getBooksByPublication with:', publication);
    return api.get(`/books/publication/${encodeURIComponent(publication)}`);
  },
  
  getPublicationSummary: (publication) => {
    console.log('Calling getPublicationSummary with:', publication);
    return api.get(`/books/publication/${encodeURIComponent(publication)}/summary`);
  },
  
  getTotalBooksByGenre: (genre) => {
    console.log('Calling getTotalBooksByGenre with:', genre);
    return api.get(`/books/genre/${genre}/total`);
  },
};

export default api;