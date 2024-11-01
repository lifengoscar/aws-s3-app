import React, { useState } from 'react';
import './FileUpload.css';

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
      const base64Content = reader.result.split(',')[1]; 
      const response = await fetch(process.env.REACT_APP_FILE_UPLOAD_API, {
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

    reader.readAsDataURL(file); 
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
