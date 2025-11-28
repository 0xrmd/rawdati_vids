import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import './App.css';

const UPLOAD_VIDEO = gql`
  mutation UploadVideoToBunny($file: Upload!, $title: String!) {
    uploadVideoToBunny(file: $file, title: $title) {
      id
      title
      status
      bunnyVideoId
    }
  }
`;

interface UploadData {
  uploadVideoToBunny: {
    id: string;
    title: string;
    status: string;
    bunnyVideoId: string;
  };
}

function App() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadVideo, { loading, error, data }] = useMutation<UploadData>(UPLOAD_VIDEO);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      await uploadVideo({
        variables: {
          file,
          title,
        },
      });
      alert('Video uploaded successfully!');
      setTitle('');
      setFile(null);
    } catch (err) {
      console.error('Error uploading video:', err);
    }
  };
  
  return (
    <div className="App">
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="file">Video File:</label>
          <input
            type="file"
            id="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Upload Result:</h3>
          <p>ID: {data.uploadVideoToBunny.id}</p>
          <p>Title: {data.uploadVideoToBunny.title}</p>
          <p>Status: {data.uploadVideoToBunny.status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
