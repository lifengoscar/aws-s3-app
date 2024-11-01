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
      const submit_form_api = process.env.REACT_APP_SUBMIT_FORM_API;
      
      
      if (!submit_form_api) {
        console.error('API URL is not set');
        return;
    }
      const response = await axios.post(
        `${submit_form_api}/submit-form`, 
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
      if (error.response) {
        
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
    }
      setResponseMessage('Error submitting form.');
    }
  };

  return (
    <div className="form-container">
      <h1 className='form-title'>Subscribe to our Newsletter for the Latest AI-generated Videos</h1>
      <div className="newsletter-info">
        <p>Be the first to know about new videos and exciting developments from AI-videos. Sign up for our newsletter and stay up-to-date with the latest news and updates. Don't miss out, subscribe now!</p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        {/* <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="form-group">
          {/* <label>Email: </label> */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
         <button type="submit">Submit</button>
    </div>
    
  </form>
  {responseMessage && <p className="response-message">{responseMessage}</p>}
</div>
  );
}

export default App;
