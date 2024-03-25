'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import ShortHeader from '@/components/ShortHeader'; 
import OutfitSort from '@/components/sorting/outfitSorting/OutfitSort';
import { set } from 'mongoose';

export default function AlbumId({ params }) {
  const router = useRouter();
  const { albumId } = params;
  const decodedAlbumId = decodeURIComponent(albumId);
  const [userEmail, setUserEmail] = useState('');
  const [outfits, setOutfits] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState(null);
  const [shareToken, setShareToken] = useState('');
  const [sortType, setSortType] = useState('');

  // const [sortedOutfits, setSortedOutfits] = useState([]);



  const fetchOutfits = async () => {
    try {
      console.log('Fetching outfits...');
      console.log('Album ID:', decodedAlbumId);
      
      // Check if a share token is present in the URL
      const searchParams = new URLSearchParams(window.location.search);
      const shareToken = searchParams.get("token");
      setShareToken(shareToken);
      
      // Determine the API endpoint based on whether a share token is present
      let endpoint;
      if (shareToken) {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}&token=${shareToken}`;
      } else {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}`;
      }
      
      const response = await axios.get(endpoint);
      console.log('Outfits response:', response.data);
      setOutfits(response.data.outfits);
      // setSortedOutfits(response.data.outfits);
    } catch (error) {
      console.error('Failed to grab outfits:', error);
      if (error.response && error.response.status === 404) {
        console.log('Redirecting to 404 page due to error.');
        router.push('/about');
      }
    }
  };
  

  const handleSortChange = async (option) => {
    try {
      let endpoint;
      if (shareToken) {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}&token=${shareToken}`;
      } else {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}`;
      }
      
      const response = await axios.get(endpoint);
      const fetchedOutfits = response.data.outfits;
  
      let sortedOutfits = [...fetchedOutfits];
      switch (option) {
        case 'ascendingPrice':
          sortedOutfits.sort((a, b) => {
            // Parse prices and remove non-numeric characters
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g,""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g,""));
            return priceA - priceB;
          });
          break;
        case 'descendingPrice':
          sortedOutfits.sort((a, b) => {
            // Parse prices and remove non-numeric characters
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g,""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g,""));
            return priceB - priceA;
          });
          break;
        case 'ascendingRating':
          sortedOutfits.sort((a, b) => a.rating - b.rating);
          break;
        case 'descendingRating':
          sortedOutfits.sort((a, b) => b.rating - a.rating);
          break;
        case 'descending':
          sortedOutfits.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case 'ascending':
          sortedOutfits.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
          break;
        default:
          break;
      }
      console.log('Sorted outfits:', sortedOutfits);
      setSortType(option);
      setOutfits(sortedOutfits); // Update state with sorted outfits
    } catch (error) {
      console.error('Failed to handle sorting:', error);
    }
  };
  
  
  
  const fetchUserEmail = async () => {
    try {
      console.log('Fetching user email...');
      const response = await axios.get('/api/users/grabUserEmail');
      console.log('User email response:', response.data);
      setUserEmail(response.data.email);
    } catch (error) {
      console.error('Failed to grab user email:', error);
    }
  };

  useEffect(() => {
    fetchUserEmail();
    fetchOutfits();
  }, []);

  const handleDeleteOutfit = async (outfitUrl) => {
    if (shareToken) {
      return;
    }
    setOutfitToDelete(outfitUrl);
    setShowDeleteConfirmation(true);
    fetchOutfits();
  };

  const confirmDeleteOutfit = async () => {
    try {
      console.log('Deleting outfit...');
      const encodedOutfitUrl = encodeURIComponent(outfitToDelete); 
      const response = await axios.delete(`/api/users/deleteOutfitsFromAlbum?albumName=${decodedAlbumId}&outfitUrl=${encodedOutfitUrl}`);
      console.log('Delete outfit response:', response.data);
      console.log('Outfit deleted successfully');
      handleSortChange(sortType);
      fetchOutfits();
      setShowDeleteConfirmation(false);
      setOutfitToDelete(null);
    } catch (error) {
      console.error('Failed to delete outfit:', error);
    }
  };

  const cancelDeleteOutfit = () => {
    setOutfitToDelete(null);
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    async function setShareExpiry() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const shareToken = searchParams.get("token") || ''; 
        console.log('Share token:', shareToken);
        setShareToken(shareToken);
        if (shareToken) {
          const response = await axios.post('/api/users/setShareExpiry', { shareToken }); 
        
          if (response.data.shareExpiry && response.data.timesOpened) {
            const shareExpiryDate = new Date(response.data.shareExpiry);
            const currentDate = new Date();
            const timesOpened = response.data.timesOpened;
            console.log('Share expiry date:', shareExpiryDate);
            console.log('Current date:', currentDate);
            console.log('Times opened:', timesOpened);
            if (shareExpiryDate < currentDate || timesOpened > 1) {
              console.log('Share expiry is in the past. Redirecting to 404 page.');
              router.push('/404');
            } else {
              console.log('Share token is still valid.');
            }
          }
        } else {
          console.log('No share token found. Rendering album page.');
        }
      } catch (error) {
        console.error('Error setting share expiry:', error);
        console.log('Redirecting to 404 page due to error.');
        router.push('/');
      }
    }

    setShareExpiry();
  }, []);

  return (
    <main>
      {userEmail !== '' ? <Header /> : <ShortHeader />}
      <div className="bg-gray-300 p-4">
        <h1 className="flex items-center justify-center font-semibold text-4xl">{decodedAlbumId}</h1>
      </div>
      <div>
        <OutfitSort outfits={outfits} onSortChange={handleSortChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        
        {outfits.map((outfit, index) => (
          <div key={index} className="relative group">
            <img
              src={outfit.imageUrl}
              alt={`Outfit ${index + 1}`}
              className="cursor-pointer"
              onClick={() => window.open(outfit.outfitUrl, '_blank')}
            />
            <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-50 flex flex-col justify-center items-center z-30">
              <button
                className="text-violet-800 text-xl font-bold mb-4"
                onClick={() => window.open(outfit.outfitUrl, '_blank')}
              >
                Go
              </button>
              {!shareToken && (
                <button
                  className="text-red-500 text-xl font-bold"
                  onClick={() => handleDeleteOutfit(outfit.outfitUrl)}
                >
                  Delete
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        
        {outfits.map((outfit, index) => (
          <div key={index} className="relative group">
            <img
              src={outfit.imageUrl}
              alt={`Outfit ${index + 1}`}
              className="cursor-pointer"
              onClick={() => window.open(outfit.outfitUrl, '_blank')}
            />
            <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-50 flex flex-col justify-center items-center z-30">
              <button
                className="text-violet-800 text-xl font-bold mb-4"
                onClick={() => window.open(outfit.outfitUrl, '_blank')}
              >
                Go
              </button>
              {!shareToken && (
                <button
                  className="text-red-500 text-xl font-bold"
                  onClick={() => handleDeleteOutfit(outfit.outfitUrl)}
                >
                  Delete
                </button>
              )}

            </div>
          </div>
        ))}
      </div> */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-xl font-semibold mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDeleteOutfit} className="px-4 py-2 bg-black text-white font-semibold rounded-md w-1/3">Confirm</button>
              <button onClick={cancelDeleteOutfit} className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md w-1/3">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
  
}


