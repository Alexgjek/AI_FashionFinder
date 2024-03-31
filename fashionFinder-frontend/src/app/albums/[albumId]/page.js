"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import ShortHeader from "@/components/ShortHeader";
import OutfitSort from "@/components/sorting/outfitSorting/OutfitSort";

export default function AlbumId({ params }) {
  const router = useRouter();
  const { albumId } = params;
  const decodedAlbumId = decodeURIComponent(albumId);
  const [userEmail, setUserEmail] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState(null);
  const [shareToken, setShareToken] = useState("");
  const [sortType, setSortType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemColors, setItemColors] = useState([]);
  const [itemBrands, setItemBrands] = useState([]);
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [slideIn, setSlideIn] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [initialBrands, setInitialBrands] = useState([]);
  const [initialColors, setInitialColors] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [error, setError] = useState("");

  const handleFilterSelection = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // useEffect(() => {
  //   if (showModal) {
  //     setAppliedFilters([...appliedFilters]);
  //   }
  // }, [showModal]);

  const handleModalSubmit = () => {
    if (lowerBound && upperBound && Number(lowerBound) > Number(upperBound)) {
      setError("Lower bound cannot be greater than upper bound");
      return;
    }
    const copyFilters = [...selectedFilters];
    if (lowerBound) {
      copyFilters.push({ lowerBound });
    }
    if (upperBound) {
      copyFilters.push({ upperBound });
    }

    setAppliedFilters(copyFilters);
    fetchOutfits(copyFilters);
    setSlideIn(false);
    setTimeout(() => setShowModal(false), 500);
  };

  const handleLowerBoundChange = (e) => {
    const lowerBoundValue = e.target.value;
    if (
      lowerBoundValue &&
      upperBound &&
      Number(lowerBoundValue) > Number(upperBound)
    ) {
      setError("Lower bound cannot be greater than upper bound");
    } else {
      setError("");
    }
    if (!lowerBoundValue || /^\d+$/.test(lowerBoundValue)) {
      setLowerBound(lowerBoundValue);
    }
  };

  const handleUpperBoundChange = (e) => {
    const upperBoundValue = e.target.value;
    if (
      upperBoundValue &&
      lowerBound &&
      Number(upperBoundValue) < Number(lowerBound)
    ) {
      setError("Upper bound cannot be less than lower bound");
    } else {
      setError("");
    }
    if (!upperBoundValue || /^\d+$/.test(upperBoundValue)) {
      setUpperBound(upperBoundValue);
    }
  };

  const fetchOutfits = async (appliedFilters) => {
    try {
      let endpoint = `/api/users/getOutfitsFromAlbum?albumName=${decodedAlbumId}`;

      if (shareToken) {
        endpoint += `&token=${shareToken}`;
      }

      if (appliedFilters) {
        Object.keys(appliedFilters).forEach((key) => {
          const encodedValue = encodeURIComponent(appliedFilters[key]);
          endpoint += `&${key}=${encodedValue}`;
        });
      }

      console.log("Endpoint:", endpoint);

      const response = await axios.get(endpoint);
      setOutfits(response.data.outfits);
      setFilteredOutfits(response.data.outfits);
      const primaryColors = [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "brown",
        "gray",
        "black",
        "white",
      ];
      let colors = [];
      let brands = [];

      if (initialBrands.length === 0 && initialColors.length === 0) {
        response.data.outfits.forEach((outfit) => {
          if (outfit.color) {
            let colorArray = Array.isArray(outfit.color)
              ? outfit.color
              : outfit.color.split(",");
            colorArray.forEach((color) => {
              let normalizedColor = color.trim().toLowerCase();
              const matchPrimaryColor = primaryColors.find((primaryColor) =>
                normalizedColor.includes(primaryColor)
              );
              if (matchPrimaryColor) {
                if (!colors.includes(matchPrimaryColor)) {
                  colors.push(matchPrimaryColor);
                }
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

        setInitialBrands(brands);
        setInitialColors(colors);
      } else {
        brands = initialBrands;
        colors = initialColors;
      }

      setItemColors(colors);
      setItemBrands(brands);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortChange = async (option) => {
    try {
      let sortedOutfits = [...filteredOutfits];
      switch (option) {
        case "ascendingPrice":
          sortedOutfits.sort((a, b) => {
            // Parse prices and remove non-numeric characters
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
            return priceA - priceB;
          });
          break;
        case "descendingPrice":
          sortedOutfits.sort((a, b) => {
            // Parse prices and remove non-numeric characters
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
            return priceB - priceA;
          });
          break;
        case "ascendingRating":
          sortedOutfits.sort((a, b) => a.rating - b.rating);
          break;
        case "descendingRating":
          sortedOutfits.sort((a, b) => b.rating - a.rating);
          break;
        case "descending":
          sortedOutfits.sort(
            (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
          );
          break;
        case "ascending":
          sortedOutfits.sort(
            (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
          );
          break;
        default:
          break;
      }
      console.log("Sorted outfits:", sortedOutfits);
      setSortType(option);
      setOutfits(sortedOutfits);
    } catch (error) {
      console.error("Failed to handle sorting:", error);
    }
  };

  const fetchUserEmail = async () => {
    try {
      console.log("Fetching user email...");
      const response = await axios.get("/api/users/grabUserEmail");
      console.log("User email response:", response.data);
      setUserEmail(response.data.email);
    } catch (error) {
      console.error("Failed to grab user email:", error);
    }
  };

  useEffect(() => {
    fetchUserEmail();
    fetchOutfits(appliedFilters);
  }, []);

  const handleDeleteOutfit = async (outfitUrl) => {
    if (shareToken) {
      return;
    }
    setOutfitToDelete(outfitUrl);
    setShowDeleteConfirmation(true);
    fetchOutfits(appliedFilters);
  };

  const confirmDeleteOutfit = async () => {
    try {
      console.log("Deleting outfit...");
      const encodedOutfitUrl = encodeURIComponent(outfitToDelete);
      const response = await axios.delete(
        `/api/users/deleteOutfitsFromAlbum?albumName=${decodedAlbumId}&outfitUrl=${encodedOutfitUrl}`
      );
      console.log("Delete outfit response:", response.data);
      console.log("Outfit deleted successfully");
      handleSortChange(sortType);
      fetchOutfits(appliedFilters);
      setShowDeleteConfirmation(false);
      setOutfitToDelete(null);
    } catch (error) {
      console.error("Failed to delete outfit:", error);
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
        const shareToken = searchParams.get("token") || "";
        console.log("Share token:", shareToken);
        setShareToken(shareToken);
        if (shareToken) {
          const response = await axios.post("/api/users/setShareExpiry", {
            shareToken,
          });

          if (response.data.shareExpiry && response.data.timesOpened) {
            const shareExpiryDate = new Date(response.data.shareExpiry);
            const currentDate = new Date();
            const timesOpened = response.data.timesOpened;
            console.log("Share expiry date:", shareExpiryDate);
            console.log("Current date:", currentDate);
            console.log("Times opened:", timesOpened);
            if (shareExpiryDate < currentDate || timesOpened > 1) {
              console.log(
                "Share expiry is in the past. Redirecting to 404 page."
              );
              router.push("/404");
            } else {
              console.log("Share token is still valid.");
            }
          }
        } else {
          console.log("No share token found. Rendering album page.");
        }
      } catch (error) {
        console.error("Error setting share expiry:", error);
        console.log("Redirecting to 404 page due to error.");
        router.push("/");
      }
    }

    setShareExpiry();
  }, []);

  const filtersModal = () => {
    setShowModal(true);
    setTimeout(() => setSlideIn(true), 0);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setLowerBound("");
    setUpperBound("");
    setLowerBound("");
  };

  const handleModalCancel = () => {
    setSlideIn(false);
    setSelectedFilters([...appliedFilters]);
    setTimeout(() => setShowModal(false), 500);
  };

  return (
    <main>
      {userEmail !== "" ? <Header /> : <ShortHeader />}
      <div className="bg-gray-300 p-4">
        <h1 className="flex items-center justify-center font-semibold text-4xl">
          {decodedAlbumId}
        </h1>
      </div>
      <div>
        <div className="inline-flex gap-3">
          <OutfitSort outfits={outfits} onSortChange={handleSortChange} />
          <button
            className="bg-white shadow-md mt-3 px-6 border border-gray-300"
            onClick={filtersModal}
          >
            Filter
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {outfits.map((outfit, index) => (
            <div key={index} className="relative group h-64">
              <img
                src={outfit.imageUrl}
                alt={`Outfit ${index + 1}`}
                className="cursor-pointer object-contain w-full h-full"
                onClick={() => window.open(outfit.outfitUrl, "_blank")}
              />
              <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-50 flex flex-col justify-center items-center z-30">
                <button
                  className="text-violet-800 text-xl font-bold mb-4"
                  onClick={() => window.open(outfit.outfitUrl, "_blank")}
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
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-xl font-semibold mb-4">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteOutfit}
                className="px-4 py-2 bg-black text-white font-semibold rounded-md w-1/3"
              >
                Confirm
              </button>
              <button
                onClick={cancelDeleteOutfit}
                className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md w-1/3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex justify-start items-center bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-500 ease-in-out">
          <div
            className={`bg-white p-8 sm:w-full md:w-1/2 lg:w-2/5 h-full transform transition-transform duration-500 ease-in-out ${
              slideIn ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="w-full inline-flex justify-between mb-8">
              <button
                className={`text-xl font-semibold underline ${
                  selectedFilters.length === 0 &&
                  lowerBound === "" &&
                  upperBound === ""
                    ? "opacity-25 cursor-not-allowed"
                    : ""
                }`}
                onClick={clearFilters}
                disabled={
                  selectedFilters.length === 0 &&
                  lowerBound === "" &&
                  upperBound === ""
                }
              >
                Clear Filters
              </button>
              <button
                className="border border-black px-3 text-black hover:bg-gray-800 hover:text-white"
                onClick={handleModalCancel}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="mb-2">
              <p className="text-xl text-left font-semibold">Brand</p>
              <div className="flex flex-wrap justify-start gap-2 mt-2">
                {itemBrands.map((brand, index) => (
                  <button
                    key={index}
                    className={`border border-gray-200 shadow-md text-gray-800 px-3 py-1 rounded-md overflow-ellipsis ${
                      selectedFilters.includes(brand)
                        ? "bg-green-400 opacity-50"
                        : "bg-white"
                    }`}
                    onClick={() => handleFilterSelection(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
              <hr className="bg-black mt-2 shadow-sm" />
            </div>
            <div className="text-xl mb-2">
              <p className="text-left font-semibold">Color</p>
              <div className="flex flex-wrap justify-start gap-2 mt-2">
                {itemColors.map((color, index) => (
                  <button
                    key={index}
                    className={`border border-gray-200 shadow-md text-gray-800 px-3 py-1 rounded-md overflow-ellipsis ${
                      selectedFilters.includes(color)
                        ? "bg-green-400 opacity-50"
                        : "bg-white"
                    }`}
                    onClick={() => handleFilterSelection(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <hr className="bg-black mt-2 shadow-sm" />
            </div>
            <div className="m-2 outline-none">
              <p className="text-xl text-left mb-2 font-semibold">
                Budget Range
              </p>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="flex justify-between gap-2 w-full">
                <input
                  className="border border-gray-300 outline-none flex-grow w-1/2 p-1"
                  placeholder="Lower Limit"
                  value={lowerBound}
                  onChange={handleLowerBoundChange}
                />
                <p className="self-center">to</p>
                <input
                  className="border border-gray-300 outline-none flex-grow w-1/2 p-1"
                  placeholder="Upper Limit"
                  value={upperBound}
                  onChange={handleUpperBoundChange}
                />
              </div>
            </div>
            <div className="flex justify-center absolute bottom-10 left-8 right-8">
              <button
                onClick={handleModalSubmit}
                className={`py-3 bg-white text-black border border-black font-semibold rounded-md w-full hover:opacity-50 ${
                  error ? "opacity-50" : ""
                }`}
                disabled={error !== ""}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
