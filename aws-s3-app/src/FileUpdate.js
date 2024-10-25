import React, { useState } from 'react';
import './App.css';

function FileUpdate() {
  const [formData, setFormData] = useState({
    fileName: '',
    fileContent: '',
    contentType: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setFormData({
          ...formData,
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    // Read the file content as a base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Content = reader.result.split(',')[1]; // Get base64 content without the prefix
      const response = await fetch('https://6id9e761z5.execute-api.us-east-1.amazonaws.com/test/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: formData.fileName,
          fileContent: base64Content,
          contentType: formData.contentType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`File uploaded successfully: ${data.fileUrl}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    };

    reader.readAsDataURL(file); // This will trigger onloadend once the file is read
  };

  return (
    <div className="App">
      <h1>React AWS S3 File Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select File: </label>
          <input
            type="file"
            name="file"
            accept="*"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpdate;
