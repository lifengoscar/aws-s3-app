

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MediaList.css'; 

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
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
      <div className="file-container">
    <h1>Recent AI-generated videos</h1>
    <div className="file-grid">
        {files.map((file) => (
            <div key={file.fileID} className="file-item">
                <video className="video-element" controls>
                    <source src={file.fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="caption">
                    <span>{file.prompt}</span>
                    <a href={file.fileUrl} className="download-icon" download>⬇️</a>
                </div>
            </div>
        ))}
    </div>
</div>

    );
};

export default FileList;
