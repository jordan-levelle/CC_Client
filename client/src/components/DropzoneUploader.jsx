import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import '../styles/components/dropzoneuploader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const DropzoneUploader = ({ onFileUpload, canCancel = false }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const maxSize = 1048576;

  const onDrop = useCallback((files) => {
    if (files.length > 0) {
      const newFiles = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
      setAcceptedFiles(prevFiles => [...prevFiles, ...newFiles]);
      onFileUpload(files[0]); // Call the upload callback if needed
      console.log("Uploaded file:", files[0]);
    }
  }, [onFileUpload]);

  const { isDragActive, getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    minSize: 0,
    maxSize,
  });

  const handleCancel = (file) => {
    setAcceptedFiles(prevFiles => prevFiles.filter((f) => f !== file));
  };

  return (
    <div className="container text-center mt-3">
      <div 
        {...getRootProps()} 
        className={isDragActive ? 'dropzone-active' : ''} 
      >
        <input {...getInputProps()} />
        {!isDragActive && 'Click here or drop a file to upload'}
        {isDragActive && !isDragReject && "Drop it like it's hot!"}
        {isDragReject && "File type not accepted, sorry!"}
      </div>

      <ul className="list-group mt-2">
        {acceptedFiles.length > 0 && acceptedFiles.map(file => (
          <li className="list-group-item list-group-item-success" key={file}>
            {file.name}
            <span 
                className="cancel-icon" 
                onClick={() => handleCancel(file)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faXmark} className="text-danger" />
              </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropzoneUploader;

