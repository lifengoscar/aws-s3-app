import React, { useEffect, useState } from 'react';
import './FetchData.css';

function FetchData() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // Function to fetch files from the Lambda API
  const fetchFiles = async () => {
    try {
      const response = await fetch('https://gx9yuy30yd.execute-api.us-east-1.amazonaws.com/prod/fetchfiledata' , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFiles(data);
      setMessage('Files fetched successfully!');
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage('Failed to fetch files.');
    }
  };

  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="App">
      <h1>Uploaded Files</h1>
      {message && <p>{message}</p>}
      {files.length > 0 ? (
        <ul>
          {files.map(file => (
           
            <ul key={file.fileID}>
              <li>
                {file.fileID}:{file.fileName},
              </li>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {file.fileUrl}
              </a>
            </ul>            
           
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
    </div>
  );
}

export default FetchData;
