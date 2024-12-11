import { useDropzone } from 'react-dropzone';
import { useCallback, useState, useEffect } from 'react';
import '../styles/components/dropzoneuploader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const DropzoneUploader = ({ onFileUpload, initialFile, canCancel = false, onFileRemove }) => {
  const [acceptedFiles, setAcceptedFiles] = useState(initialFile ? [initialFile] : []);
  const maxSize = 1048576;

  useEffect(() => {
    if (initialFile) {
      setAcceptedFiles([{
        ...initialFile,
        name: initialFile.fileName || initialFile.name, // Set the file name for display
        preview: initialFile.fileUrl, // Use `fileUrl` for preview
        isExisting: true, // Mark as an existing file
      }]);
    }
  }, [initialFile]);

  const onDrop = useCallback((files) => {
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        ...file,
        name: file.name || file.fileName, // Ensure the file has a name property
        preview: URL.createObjectURL(file),
      }));
      setAcceptedFiles(newFiles); // Replace previous files
      onFileUpload(files[0]); // Notify the parent about the new file
    }
  }, [onFileUpload]);

  const { isDragActive, getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    minSize: 0,
    maxSize,
  });

  const handleCancel = async (file) => {
    try {
      if (file.isExisting && onFileRemove) {
        await onFileRemove(file); // Notify the parent about the existing file removal
      }
      setAcceptedFiles(prevFiles => prevFiles.filter((f) => f !== file));
      if (!file.isExisting && onFileUpload) {
        onFileUpload(null); // Remove the new file
      }
    } catch (error) {
      console.error("Error removing file:", error);
    }
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
          <li className="list-group-item list-group-item-success" key={file.name || file.fileName}>
            {file.name || file.fileName}
            {canCancel && (
              <span 
                className="cancel-icon" 
                onClick={() => handleCancel(file)}
                style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faXmark} className="text-danger" />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropzoneUploader;
