'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import axios from 'axios';

export default function AlbumsPage() {
  const [albumName, setAlbumName] = useState('');
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteAlbumName, setDeleteAlbum] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/api/users/getUserAlbums');
      setAlbums(response.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreateAlbum = () => {
    setShowModal(true);
    setErrorMessage('');
  };

  const handleModalInputChange = (e) => {
    setAlbumName(e.target.value);
    setErrorMessage('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAlbumName('');
  };

  const handleModalSubmit = async () => {
    try {
      const response = await axios.post('/api/users/createAlbums', { albumName });
      console.log(albumName);

      setAlbums(prevAlbums => [...prevAlbums, { albumName }]);
      setShowModal(false);
      setAlbumName('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage('Album already exists');
        } else {
          setErrorMessage('Failed to create album');
        }
      } else {
        setErrorMessage('Network error. Please try again.');
      }
    }
  };

  const handleDeleteAlbum = async (albumName) => {
    setDeleteAlbum(albumName); 
    setShowModal(true); 
  };

  const confirmDeleteAlbum = async () => {
    if (deleteAlbumName) {
      console.log("Deleting album:", deleteAlbumName);
      try {
        const response = await axios.delete(`/api/users/deleteAlbums?albumName=${deleteAlbumName}`);
        setShowModal(false);
        setDeleteAlbum("");
        await fetchAlbums();
      } catch (error) {
        console.log(error);
        console.log("Failed to delete album");
      }
    }
  };
  
  

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleModalSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [albumName]);

  return (
    <main>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"></div>
      )}
  
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            {deleteAlbumName ? ( 
              <>
                <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete this album?</h2>
                <div className="flex items-center justify-center">
                  <button className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold" onClick={confirmDeleteAlbum}>Yes</button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>No</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">Enter Album Name</h2>
                {errorMessage && <p className='text-sm text-red-500 mb-2'>{errorMessage}</p>}
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
                  value={albumName}
                  onChange={handleModalInputChange}
                  placeholder='Album Name'
                />
                <div className="flex items-center justify-center">
                  <button className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold" onClick={handleModalSubmit}>Create</button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
  
      <div className="flex flex-col items-center justify-center bg-gray-300 shadow-lg p-4">
        <h1 className="font-bold text-3xl mb-4">Albums</h1>
        <button className="bg-black text-white px-4 py-2 rounded-xl mb-4 font-semibold" onClick={handleCreateAlbum}>
          Create Album
        </button>
      </div>
  
      <div className="grid grid-cols-3 gap-4 m-5">
        {albums.map((album, index) => (
          album && album.albumName && ( 
            <div key={index} className="bg-white rounded-lg shadow-md p-4 relative text-center">
              <Link href={`/albums/${album.albumName}`} className="text-lg font-semibold mb-2 hover:opacity-70">{album.albumName}</Link>
              <button
                className="absolute bottom-0 right-0 bg-transparent text-white px-4 py-2 rounded-md font-semibold"
                onClick={() => handleDeleteAlbum(album.albumName)}
                title='Delete Album'
              >
                <FontAwesomeIcon icon={faTrashCan} className='text-red-500' />
              </button>
            </div>
          )
        ))}
      </div>
    </main>
  );
  
  
}
