import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const SearchBooks = () => {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({ category: '', publisher: '' });
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!keyword && !filters.category && !filters.publisher) {
      setResults([]); // Clear results if no fields are filled
      return; // Do not send a request
    }

    try {
      const queryParams = new URLSearchParams({
        keyword,
        category: filters.category,
        publisher: filters.publisher,
      });

      // Send GET request to fetch results
      const response = await fetch(`http://localhost:8080/search?${queryParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data); // Set the fetched results
      } else {
        console.error('Failed to fetch search results');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Book Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search by keyword (Title, Author, etc.)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ margin: '5px', padding: '5px', width: '300px' }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Category (e.g., History)"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          style={{ margin: '5px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Publisher (e.g., Doubleday)"
          value={filters.publisher}
          onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
          style={{ margin: '5px', padding: '5px' }}
        />
      </div>
      <button onClick={handleSearch} style={{ margin: '5px', padding: '5px' }}>
        Search
      </button>

      <div>
        <h2>Results:</h2>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
              <h3>{result.title}</h3>
              <p><strong>Authors:</strong> {result.authors}</p>
              <p><strong>Description:</strong> {result.description}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Publisher:</strong> {result.publisher}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    category: '',
    publisher: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      !formData.title ||
      !formData.authors ||
      !formData.description ||
      !formData.category ||
      !formData.publisher
    ) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Book added successfully!');
        setFormData({
          title: '',
          authors: '',
          description: '',
          category: '',
          publisher: '',
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to add book.');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Add a New Book</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Authors:</label>
          <input
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Publisher:</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Add Book
        </button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '10px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Search Books</Link>
        <Link to="/add-book">Add Book</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SearchBooks />} />
        <Route path="/add-book" element={<AddBook />} />
      </Routes>
    </Router>
  );
};

export default App;
