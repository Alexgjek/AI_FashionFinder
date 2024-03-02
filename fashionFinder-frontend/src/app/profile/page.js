'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    try {
    
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
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
    const numberWithCommas = formattedValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    handleChange("budget", numberWithCommas);
  };
  const addBrand = () => {
    setUserInfo({
      ...userInfo,
      brands: [...(userInfo.brands || []), ""],
    });
  };

  const handleBrandChange = (index, value) => {
    const capitalizedBrand = value.replace(/\b\w/g, (char) => char.toUpperCase());

    const updatedBrand = capitalizedBrand.replace(/[^A-Za-z\s]/g, '');
  
    const updatedBrands = [...userInfo.brands];
    updatedBrands[index] = updatedBrand;
    
    setUserInfo({
      ...userInfo,
      brands: updatedBrands,
    });
  };

  const deleteBrand = (index) => {
    const updatedBrands = [...userInfo.brands];
    updatedBrands.splice(index, 1);
    setUserInfo({
      ...userInfo,
      brands: updatedBrands,
    });
  };

  const changePassword = () => {
    router.push("/forgot");
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold p-3">Personal Information</h1>
        <div className="flex flex-col items-start">
          <h2 className="text-gray-600">
            Manage your personal details, brand preferences, and budget
            preferences
          </h2>
          <div className="w-full font-semibold mt-4">
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h3 className="mb-6">
              NAME: {userInfo.firstName} {userInfo.lastName}
            </h3>
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h4 className="mb-6">EMAIL: {userInfo.email}</h4>
            <hr className="border border-gray-300 mt-2 mb-2" />

            <div>
              <h5 className="mb-6">
                PASSWORD: {"**********"}{" "}
                {isEditing && (
                  <button
                    onClick={changePassword}
                    className="ml-2 bg-black text-white px-3 py-1 rounded-md"
                  >
                    Change Password
                  </button>
                )}
              </h5>
              <hr className="border border-gray-300 mt-2 mb-2" />
            </div>

            <h6 className="mb-6">
              BRANDS:{" "}
              {isEditing ? (
                <div>
                  {userInfo.brands &&
                    userInfo.brands.map((brand, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) =>
                            handleBrandChange(index, e.target.value)
                          }
                          placeholder="Enter brand"
                          className="border border-gray-300 p-2 rounded-md mr-2"
                        />
                        <button
                          onClick={() => deleteBrand(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={addBrand}
                    className="bg-black text-white px-2 py-1 rounded-md ml-2"
                  >
                    Add Brand
                  </button>
                </div>
              ) : (
                userInfo.brands && userInfo.brands.join(", ")
              )}
            </h6>
            <hr className="border border-gray-300 mt-2 mb-2" />
            <h7 className="mb-6">
              BUDGET:{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo.budget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. $1,000"
                  className="border border-gray-300 p-2 rounded-md"
                />
              ) : userInfo.budget !== undefined ? (
                `$${userInfo.budget}`
              ) : (
                ""
              )}
            </h7>
          </div>
        </div>
         <button
          className="bg-black text-white p-4 w-40 mt-4"
          onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        
      </div>
    </main>
  );
}