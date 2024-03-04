'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [brandError, setBrandError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disabledInputs, setDisabledInputs] = useState([]);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    brands: [],
    budget: '',
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/api/users/userInfo");
        setUserInfo(response.data);
        setDisabledInputs(response.data.brands.map(() => true));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    const filteredBrands = userInfo.brands.filter(brand => brand.trim() !== '');
  
    if (filteredBrands.length === 0 && !isEditing) {
      setIsEditing(true); 
      setBrandError(true); 
      return;
    } else {
      setBrandError(false); 
    }
  
    const uniqueBrands = [...new Set(filteredBrands.map(brand => brand.trim()))];
    if (uniqueBrands.length !== filteredBrands.length) {
      setErrorMessage("Duplicate brand");
      return;
    }
  
    try {
      const response = await axios.post("/api/users/setBrandOrBudget", { ...userInfo, brands: uniqueBrands });
      console.log(response.data);
      setIsEditing(false);
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        brands: uniqueBrands 
      }));
  
      setDisabledInputs(uniqueBrands.map(() => true));
    } catch (error) {
      console.error("Error setting brands and budget:", error);
    }
  };
  
  
  const handleChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      [field]: value,
    });
  };

  const handleBudgetChange = (value) => {
    const formattedValue = value.replace(/^0(?!\.)/, '');
    //const numberWithCommas = formattedValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    handleChange("budget", formattedValue);
  };

  const handleBudgetReset = async () => {
    try {
      await axios.delete("/api/users/resetBudget");
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        budget: ''
      }));
      console.log("Budget reset successfully");
      setErrorMessage('');
    } catch (error) {
      console.error("Error resetting budget:", error);
    }
  };
  
  const addBrand = () => {
    const isEmptyField = userInfo.brands.some(brand => brand.trim() === "");
    if (isEmptyField) {
      setBrandError(true);
      return;
    } else {
      setBrandError(false);
    }
  
    setUserInfo({
      ...userInfo,
      brands: [...userInfo.brands, ""],
    });
    setDisabledInputs(prevDisabledInputs => [...prevDisabledInputs, false]);

  };
  
  
  const handleBrandChange = (index, value) => {
    const capitalizedBrand = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    const updatedBrands = [...userInfo.brands];
    updatedBrands[index] = capitalizedBrand;
    setUserInfo({
      ...userInfo,
      brands: updatedBrands,
    });
  
    if (!isEditing) {
      setDisabledInputs(prevDisabledInputs => {
        const updatedDisabledInputs = [...prevDisabledInputs];
        updatedDisabledInputs[index] = false;
        return updatedDisabledInputs;
      });
    }
  };
  
  
  
  

  const handleDeleteBrand = async (index) => {
    try {
      const deletedBrand = userInfo.brands[index];
      const response = await axios.delete(`/api/users/deleteBrands?brand=${deletedBrand}`);
      if (response.data.success) {
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          brands: [...prevUserInfo.brands.slice(0, index), ...prevUserInfo.brands.slice(index + 1)]
        }));
  
        setDisabledInputs(prevDisabledInputs => {
          const updatedDisabledInputs = [...prevDisabledInputs];
          updatedDisabledInputs.splice(index, 1); 
          return updatedDisabledInputs;
        });
  
        console.log("Brand removed successfully");
      } else {
        console.log("Error removing brand:", response.data.error);
      }
      setErrorMessage('');
    } catch (error) {
      console.error("Error removing brand:", error);
    }
  }
  

  const changePassword = () => {
    router.push("/forgot");
  };

  return (
    <main className='p-6'>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold p-3">Personal Information</h1>
        <div className="flex flex-col items-start">
          <h2 className="text-gray-600">
            Manage your personal details, brand preferences, and budget preferences
          </h2>
          <div className="w-full font-semibold mt-4">
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h3 className="mb-4">
              NAME
              <br />
              <span className="font-normal">
                {userInfo.firstName} {userInfo.lastName}
              </span>
            </h3>
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h4 className="mb-4">
              E-MAIL
              <br/>
              <span className='font-normal'>
                {userInfo.email}
              </span>
            </h4>
            <hr className="border border-gray-300 mt-2 mb-2" />
            <div>
              <h5 className="mb-4">
                <div className="flex justify-between">
                  <div>
                    PASSWORD
                    <br/>
                    <span className='font-normal'>
                      {"**********"}{" "}
                    </span>
                  </div>
                  {isEditing && (
                    <button
                      onClick={changePassword}
                      className="bg-transparent text-black px-1 py-1 rounded-md font-normal hover:opacity-50">
                      Change Password
                    </button>
                  )}
                </div>
              </h5>
              <hr className="border border-gray-300 mt-2 mb-2" />
            </div>
            <h6 className="mb-4">
              BRANDS{" "}
              {brandError && (
                <p className='text-red-500 font-normal'>Field must be filled</p>
              )}
              {errorMessage && (
                <p className='text-red-500 font-normal'>{errorMessage}</p>
              )}
              <div>
                {isEditing ? (
                  <>
                    {userInfo.brands &&
                      userInfo.brands.map((brand, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="text"
                            value={brand}
                            onChange={(e) =>
                              handleBrandChange(index, e.target.value)
                            }
                            placeholder="Enter brand"
                            className="border border-gray-300 p-2 rounded-md mr-2 outline-none"
                            disabled={disabledInputs[index]}
                            />
                          {brand && (
                            <button
                              onClick={() => handleDeleteBrand(index)}
                              className="bg-gray-500 text-white px-2 py-1 rounded-md"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    <button
                      onClick={addBrand}
                      className="bg-black text-white px-2 py-1 rounded-md mt-2"
                    >
                      Add Brand
                    </button>
                  </>
                ) : (
                  <span className="font-normal">
                    {userInfo.brands && userInfo.brands.filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </h6>
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h6 className="mb-4">
              BUDGET{" "}
              <div>
                {isEditing ? (
                  <div className='flex justify-between items-center'>
                    <input
                      type="text"
                      value={userInfo.budget}
                      onChange={(e) => handleBudgetChange(e.target.value)}
                      placeholder="e.g. $1,000"
                      className="border border-gray-300 p-2 rounded-md outline-none"
                    />
                    <button
                      onClick={handleBudgetReset}
                      className='font-normal hover:opacity-50'>
                      Reset Budget 
                    </button>
                  </div>
                ) : userInfo.budget !== undefined && userInfo.budget !== '' ? (
                  <span className="font-normal">
                    {`$${userInfo.budget}`}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </h6>
          </div>
        </div>
        <button
          className="bg-black text-white p-4 w-40 mt-4"
          onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
        >
          {isEditing ? 
          <p className='font-semibold'>Save</p> : 
          <p className='font-semibold'>Edit</p>}
        </button>
      </div>
    </main>
  );
}

