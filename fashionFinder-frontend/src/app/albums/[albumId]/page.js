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
  const [showModal, setShowModal] = useState(false);
  const [itemColors, setItemColors] = useState([]);
  const [itemBrands, setItemBrands] = useState([]);
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [error, setError] = useState('');

  const handleLowerBoundChange = (e) => {
    setLowerBound(e.target.value);
  };

  const handleUpperBoundChange = (e) => {
    setUpperBound(e.target.value);
  };

  const fetchOutfits = async () => {
    try {
      console.log('Fetching outfits...');
      console.log('Album ID:', decodedAlbumId);
      
      const searchParams = new URLSearchParams(window.location.search);
      const shareToken = searchParams.get("token");
      setShareToken(shareToken);
      
      let endpoint;
      if (shareToken) {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}&token=${shareToken}`;
      } else {
        endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}`;
      }
      
      const response = await axios.get(endpoint);
      setOutfits(response.data.outfits);
  
      const colors = [];
      const brands = [];
      response.data.outfits.forEach(outfit => {
        if (outfit.color) {
          let colorArray = Array.isArray(outfit.color) ? outfit.color : outfit.color.split(',');
          colorArray.forEach(color => {
            let normalizedColor = color.trim().toLowerCase();
            if (!colors.includes(normalizedColor)) {
              colors.push(normalizedColor);
            }
          });
        }
        if (outfit.brand) {
          let normalizedBrand = outfit.brand.trim().toLowerCase();
          if (!brands.includes(normalizedBrand)) {
            brands.push(normalizedBrand);
          }
        }
      });
      
      setItemColors(colors);
      console.log('brands:', brands)
      setItemBrands(brands);
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
      setOutfits(sortedOutfits); 
      setOutfits(sortedOutfits); 
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

  const filtersModal = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    setError('');
    
    if (parseFloat(lowerBound) > parseFloat(upperBound)) {
      setError('Lower bound cannot be greater than upper bound.');
    }
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <main>
      {userEmail !== '' ? <Header /> : <ShortHeader />}
      <div className="bg-gray-300 p-4">
        <h1 className="flex items-center justify-center font-semibold text-4xl">{decodedAlbumId}</h1>
      </div>
      <div>
        <div className="inline-flex gap-3">
          <OutfitSort outfits={outfits} onSortChange={handleSortChange} />
          <button 
          className='bg-white shadow-md mt-3 px-6 border border-gray-300'
          onClick={filtersModal}>
          Filter
        </button>
        </div>
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
      </div> *
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
      {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-2/5">
              <p className="text-3xl font-semibold mb-4 text-center">Filters</p>
              <div className="mb-2">
                <p className='text-xl text-center font-semibold'>Brand</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {itemBrands.map((brand, index) => (
                      <button key={index} className="border border-gray-200 shadow-md text-gray-800 px-3 py-1 rounded-md w-full truncate flex-1 overflow-ellipsis">{brand}</button>
                    ))}
                </div>
                <hr className='bg-black mt-2'/>
              </div>
              <div className='text-xl mb-2 font-semibold'>
                <p className='text-center'>Color</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {itemColors.map((color, index) => (
                      <button key={index} className="border border-gray-200 shadow-md text-gray-800 px-3 py-1 rounded-md w-full truncate flex-1 overflow-ellipsis">{color}</button>
                    ))}
                </div>
                <hr className='bg-black mt-2'/>
              </div>
              <div className='m-2 font-semibold outline-none'>
                <p className='text-xl text-center'>Budget Range</p>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <div className='flex justify-center'>
                  <div className='flex flex-col'>
                    <input
                      className='border border-gray-300 outline-none mb-2'
                      placeholder='Lower Limit'
                      value={lowerBound}
                      onChange={handleLowerBoundChange}
                    />
                    <input
                      className='border border-gray-300 outline-none'
                      placeholder='Upper Limit'
                      value={upperBound}
                      onChange={handleUpperBoundChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={handleModalCancel} className="px-4 py-2 bg-black text-white font-semibold rounded-md max-w-2/5">Apply</button>
                <button onClick={handleModalCancel} className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md max-w-2/5">Cancel</button>
              </div>
            </div>
          </div>
        )}f
    </main>
  );
  
}
