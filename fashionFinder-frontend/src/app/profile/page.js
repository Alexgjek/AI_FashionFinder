'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "", // Initialize as empty string
    email: "", // Initialize as empty string
    password: "",
    brands: [],
    budget: 0
  });

  useEffect(() => {
    // Fetch user information from the server
    async function fetchUserInfo() {
      try {
        const response = await axios.get('/api/users/profile');
        const { firstName, lastName, email } = response.data; // Assuming the API returns first name, last name, and email
        setUserInfo({
          ...userInfo,
          name: `${firstName} ${lastName}`, // Combine first name and last name
          email: email
        });
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    }
    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  useEffect(() => {
    // Load user information from localStorage
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }
  }, []);

  

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      [field]: value,
    });
  };

  const handleBudgetChange = (value) => {
    // Add commas to the budget value
    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    handleChange('budget', formattedValue);
  };

  const handleSubmit = async () => {
    try {
      // Format the budget value before saving it
      const formattedBudget = userInfo.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setUserInfo({
        ...userInfo,
        budget: formattedBudget
      });
      console.log('Saving preferences:', userInfo.brands, userInfo.budget);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsEditing(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addBrand = () => {
    setUserInfo({
      ...userInfo,
      brands: [...userInfo.brands, ''] // Add an empty string for a new brand
    });
  };

  const handleBrandChange = (index, value) => {
    const updatedBrand = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const updatedBrands = [...userInfo.brands];
    updatedBrands[index] = updatedBrand;
    setUserInfo({
      ...userInfo,
      brands: updatedBrands
    });
  };

  const deleteBrand = (index) => {
    const updatedBrands = [...userInfo.brands];
    updatedBrands.splice(index, 1);
    setUserInfo({
      ...userInfo,
      brands: updatedBrands
    });
  };

  const changePassword = () => {
    router.push('/forgot');
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <h1 className='text-3xl font-bold p-3'>
          Personal Information
        </h1>
        <div className='flex flex-col items-start'>
          <h2 className='text-gray-600'>Manage your personal details, brand preferences, and budget preferences</h2>
          <div className='w-full font-semibold mt-4'>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h3 className='mb-6'>NAME: {userInfo.name}</h3>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h4 className='mb-6'>EMAIL: {userInfo.email}</h4>
            <hr className='border border-gray-300 mt-2 mb-2'/>

              <div>
                <h5 className='mb-6'>PASSWORD: {userInfo.password} {isEditing ? (<button 
                  onClick={changePassword}
                  style={{ padding: '5px', marginLeft: '5px' }}
                >
                  Change Password
                </button>) : null}</h5>
                <hr className='border border-gray-300 mt-2 mb-2'/>
              </div>
          
            <h6 className='mb-6'>
              BRANDS: {isEditing ? 
              <div>
                {userInfo.brands.map((brand, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                    <input 
                      type="text" 
                      value={brand} 
                      onChange={(e) => handleBrandChange(index, e.target.value)} 
                      placeholder="Enter brand"
                      style={{border: "1px solid black", padding: "5px", marginRight: "5px"}}
                    />
                    <button 
                      onClick={() => deleteBrand(index)}
                      style={{ padding: '5px', marginLeft: '5px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addBrand}
                  style={{ padding: '5px', marginLeft: '5px' }}
                >
                  Add Brand
                </button>
              </div>
              : userInfo.brands.join(', ')} 
            </h6>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h7 className='mb-6'>
              BUDGET: {isEditing ? 
              <input 
                type="text" 
                value={userInfo.budget} 
                onChange={(e) => handleBudgetChange(e.target.value)} 
                placeholder="e.g. $1,000"
                style={{border: "1px solid black", padding: "5px"}}
              /> 
              : `$${userInfo.budget}`} 
            </h7>
          </div>
        </div>
        <button
          className="bg-black text-white p-4 w-40 mt-4"
          onClick={isEditing ? handleSubmit : handleEditToggle}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          className="bg-black text-white p-4 w-40 mt-4"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}