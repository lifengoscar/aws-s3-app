// FileList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FileList.css'; // Import the CSS file

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_FETCH_DATA_API; 

        const fetchFiles = async () => {
            try {
                const response = await axios.get(apiUrl);
                console.log(response.data); // Log the entire response data
                setFiles(response.data); 
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        
        fetchFiles();
    }, []); // Empty dependency array to run once on mount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
      <div>
      <h1>Uploaded Files</h1>
      <div className="file-grid">
      {files.map((file) => (
    <div key={file.fileID} className="file-item">
        {/* Check if the file is a video based on its URL or type */}
        {file.fileUrl.endsWith('.mp4') ? (
            <video controls width="300">
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        ) : (
            <img src={file.fileUrl} alt={file.fileName} />
        )}
        <p>
            {file.twitterAuthor ? file.twitterAuthor : 'Unknown Author'}: 
            {file.prompt ? ` ${file.prompt}` : ' No prompt available'}
        </p>
    </div>
))}

      </div>
  </div>
  
    );
};

export default FileList;
