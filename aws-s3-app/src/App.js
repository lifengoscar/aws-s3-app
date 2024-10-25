import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://dx0fa0fcrc.execute-api.us-east-1.amazonaws.com/prod/submit-form',  // Replace with your actual API Gateway URL
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('Error submitting form.');
    }
  };

  return (
    <div className="App">
      <h1>React AWS S3 Application</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default App;
