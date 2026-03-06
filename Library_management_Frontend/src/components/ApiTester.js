import React, { useState } from 'react';
import { Card, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';
import { bookService } from '../services/api';

const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const testEndpoint = async (name, apiCall) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: null }));
    
    try {
      console.log(`Testing ${name}...`);
      const response = await apiCall();
      console.log(`${name} response:`, response.data);
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: true, 
          data: response.data,
          status: response.status 
        } 
      }));
    } catch (error) {
      console.error(`${name} error:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [name]: error.message 
      }));
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: false } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const endpoints = [
    { name: 'Get All Books', action: () => bookService.getAllBooks() },
    { name: 'Get Books by Author (Orwell)', action: () => bookService.getBooksByAuthor('George Orwell') },
    { name: 'Get Books by Genre (FICTION)', action: () => bookService.getBooksByGenre('FICTION') },
    { name: 'Get Total by Genre (FICTION)', action: () => bookService.getTotalBooksByGenre('FICTION') },
    { name: 'Get Books by Publication (Harper)', action: () => bookService.getBooksByPublication('Harper') },
    { name: 'Get Publication Summary (Harper)', action: () => bookService.getPublicationSummary('Harper') },
  ];

  return (
    <Card>
      <Card.Header as="h4">🔧 API Tester</Card.Header>
      <Card.Body>
        <ListGroup>
          {endpoints.map((endpoint) => (
            <ListGroup.Item key={endpoint.name}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{endpoint.name}</span>
                <Button 
                  size="sm" 
                  onClick={() => testEndpoint(endpoint.name, endpoint.action)}
                  disabled={loading[endpoint.name]}
                >
                  {loading[endpoint.name] ? <Spinner size="sm" /> : 'Test'}
                </Button>
              </div>
              
              {errors[endpoint.name] && (
                <Alert variant="danger" className="mt-2 mb-0">
                  ❌ Error: {errors[endpoint.name]}
                </Alert>
              )}
              
              {results[endpoint.name]?.success && (
                <Alert variant="success" className="mt-2 mb-0">
                  ✅ Success! Status: {results[endpoint.name].status}
                  <pre className="mt-2 mb-0 small">
                    {JSON.stringify(results[endpoint.name].data, null, 2).slice(0, 200)}
                    {JSON.stringify(results[endpoint.name].data).length > 200 ? '...' : ''}
                  </pre>
                </Alert>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ApiTester;