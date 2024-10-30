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
                setFiles(response.data); // Assuming the response structure matches the mapped JSON
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
            <div className="image-grid">
                {files.map((file) => (
                    <div key={file.fileID} className="image-item">
                        <img src={file.fileUrl} alt={file.fileName} />
                        <p>{file.fileName}:{file.fileUrl}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
