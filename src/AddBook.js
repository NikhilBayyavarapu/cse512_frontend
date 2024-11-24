import React, { useState } from 'react';

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

export default AddBook;
