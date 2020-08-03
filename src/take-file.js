import React from 'react';
import {useDropzone} from 'react-dropzone';

function TakeFile(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const {fileHandler} = props
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileHandle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    fileHandler(acceptedFiles[0])
  }
  

  return (
    <section className="container" onChange={fileHandle}>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default TakeFile;