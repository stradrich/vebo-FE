import React, { useEffect, useState} from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { FiMoreVertical as MoreVertical } from 'react-icons/fi';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Slider from '@mui/material/Slider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SystemSecurityUpdateGoodIcon from '@mui/icons-material/SystemSecurityUpdateGood';

import PopupEditForm from '../components/PopupEditForm';
// import PopupForm from '../components/PopupForm';

const InventoryList = () => {
  function valuetext(value) {
    return `${value}°C`;
  }
  // // Dummy Sample data - replace with actual data fetching
  // const parts = [
  //   {
  //     id: "675bfa39cb276d1151a0b6a8",
  //     uuid: "60636ce7dc987b063e374265",
  //     sku: "11237525135FEBA",
  //     status: "ACTIVE",
  //     description: "Mini W11 Main pulley (China)",
  //     supplier: "CA",
  //     costPrice: 100.0,
  //     sellingPrice: 150.0,
  //     photoUrl: "https://cdn1.npcdn.net/images/1628147456banner2.gif",
  //     partType: "ORI",
  //     controlled: "NO",
  //     controlStock: "NO",
  //     stockLevel: 5,
  //     reservedStock: 2,
  //     availableStock: 3,
  //     minStockLevel: 2
  //   },
  //   // Add more sample parts as needed
  // ];

  const [isFormOpen, setFormOpen] = useState(false); // State to track form visibility

  const toggleForm = () => {
    console.log('Button clicked! Toggling form visibility...');
    setFormOpen(!isFormOpen); // Function to toggle form visibility
  };
  

  const [parts, setParts] = useState([]);
  
    // Fetch all parts on component mount
      useEffect(() => {
        const fetchParts = async () => {
          try {
            const response = await fetch("http://localhost:8080/parts");
            const data = await response.json();

            const updatedParts = await Promise.all(
              data.map(async (part) => {
                console.log(part);
                
                console.log(part.sku);
                
                const latestPhotoUrl = await fetchLatestPhoto(part.sku); // Get latest photo URL
                return {
                  ...part,
                  photoUrl: latestPhotoUrl, // Set the latest photo URL here
                };
              })
            );

            setParts(updatedParts);
          } catch (error) {
            console.error("Error fetching parts:", error);
          }
        };

        fetchParts();
      }, []);
    

    const [selectedSKU, setSelectedSKU] = useState(null); // State to track the SKU of the selected part
    const [selectedPart, setSelectedPart] = useState(null); // State to track the selected part's data
    
    // Function to handle edit and log SKU
    const handleEdit = (sku, action) => {
      const selectedPart = parts.find((part) => part.sku === sku); // Find the part by SKU
      // console.log(selectedPart);
      
      console.log(`${action} clicked for SKU: ${sku}`);
      setSelectedSKU(parts);
      // console.log(parts);
      // console.log(parts[0].sku);
      // setSelectedSKU(sku); // Set the selected SKU
      setSelectedPart(selectedPart);
      // console.log(selectedPart);
      
      setFormOpen(true); // Open the form
    };

     // Function to handle delete and log SKU
     const handleDelete = (sku, action) => {
      console.log(`${action} clicked for SKU: ${sku}`);
      
      // Send DELETE request to the server
      fetch(`http://localhost:8080/parts/${sku}`, {
        method: 'DELETE', // Use DELETE HTTP method
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.ok) {
          console.log(`Part with SKU: ${sku} successfully deleted.`);
          // Optionally, remove the part from the UI (client-side)
          setParts((prevParts) => prevParts.filter((part) => part.sku !== sku));
        } else {
          console.error(`Failed to delete part with SKU: ${sku}.`);
        }
      })
      .catch((error) => {
        console.error('Error deleting part:', error);
      });
    };

    const validateImageUrl = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true); // Resolve to true if the image loads successfully
        img.onerror = () => resolve(false); // Resolve to false if the image fails to load
        img.src = url; // Set the source of the image
      });
    };

  //   async function fetchLatestPhoto() {
  //     console.log(part);
      
  //     const placeholderImage = "https://cdn1.npcdn.net/images/1628147456banner2.gif";
  //     const url = `http://localhost:8080/uploads/photos/${part}/latest`;
  
  //     try {
  //         const response = await fetch(url, { method: "POST" });
          
  //         if (!response.ok) {
  //             // Handle non-200 responses
  //             console.warn("No photo found, using placeholder.");
  //             return placeholderImage;
  //         }
  
  //         const photoUrl = await response.text(); // Assuming the API returns the URL as plain text
  //         return photoUrl || placeholderImage; // Fallback to placeholder if URL is empty
  
  //     } catch (error) {
  //         console.error("Error fetching photo:", error);
  //         return placeholderImage; // Fallback in case of any error
  //     }
  // }

    // Function to fetch the latest photo for a given SKU
    const fetchLatestPhoto = async (sku) => {
      const url = `http://localhost:8080/uploads/photos/${sku}/latest`;
      console.log("Fetching photo from URL:", url);  // Log the URL being fetched
  
      try {
          const response = await fetch(url);
          console.log("Response status:", response.status);  // Log the response status
  
          if (!response.ok) {
              console.warn("No photo found, using placeholder.");
              return "https://cdn1.npcdn.net/images/1628147456banner2.gif";
          }
  
          const photoUrl = URL.createObjectURL(await response.blob());
          return photoUrl;
  
      } catch (error) {
          console.error("Error fetching photo:", error);
          return "https://cdn1.npcdn.net/images/1628147456banner2.gif";
      }
  };
  
  

  return (
  
    <div className="flex flex-col gap-4">
      {parts.map((part) => (
        <div key={part.id}  className="rounded-xl border bg-white shadow-md p-6">
          <div sx={{ width: '100%'}} className="flex items-start justify-between space-x-4">
              <div className="flex items-start space-x-4">
                {/* Image Container */}
                <div className="relative h-40 w-40 rounded-lg overflow-hidden group">
                  {/* <img
                    src={part.photoUrl && part.photoUrl !== 'null' && part.photoUrl !== null 
                      ? (part.photoUrl.startsWith('http') 
                          ? part.photoUrl // Use the URL directly if it's already a full URL
                          : `http://localhost:8080/uploads/photos/${part.sku}/${part.photoUrl}`) // Append the base URL if it's just a filename
                      : "https://cdn1.npcdn.net/images/1628147456banner2.gif"} // Default image if photoUrl is null
                    alt={part.photoUrl ? part.photoUrl : "Default Image"}
                    fill
                    className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:inset-0 group-hover:top-0 group-hover:left-0 group-hover:w-full group-hover:h-full"
                  /> */}
            <img
              src={part.photoUrl}
              alt={part.photoUrl ? `Image of ${part.sku}` : "Default Image"}
              className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:inset-0 group-hover:top-0 group-hover:left-0 group-hover:w-full group-hover:h-full"
            />
              {/* {console.log('Image URL:', part.photoUrl && part.photoUrl !== 'null' && part.photoUrl !== null
                ? (part.photoUrl.startsWith('http') || part.photoUrl.startsWith('https')
                  ? part.photoUrl
                  : `http://localhost:8080/uploads/photos/${part.sku}/${part.photoUrl}`)
                : "https://cdn1.npcdn.net/images/1628147456banner2.gif")} */}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{part.description}</h3>
                  <div className="text-sm text-gray-500">
                    <span>sku: {part.sku}</span>
                    <div></div>
                    <span>Controlled: {part.controlled}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${part.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {part.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Part Type: {part.partType}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Supplier: {part.supplier}</span>
                  </div>
                </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold ml-20">RM {part.sellingPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Cost: RM {part.costPrice.toFixed(2)}</p>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-2 py-1 bg-gray-100 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* EDIT  */}
                  <DropdownMenuItem 
                    onClick={() => handleEdit(part.sku, 'Edit')}
                    className='m-5 text-xs'>
                    Edit
                  </DropdownMenuItem>
                  {/* DELETE */}
                  <DropdownMenuItem 
                    onClick={() => handleDelete(part.sku, 'Delete')}
                    className='m-5 text-xs'>
                      Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="ml-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Stock Level</p>
                <p className="font-medium">{part.stockLevel}</p>
              </div>
              <div>
                <p className="text-gray-500">Reserved</p>
                <p className="font-medium">{part.reservedStock}</p>
              </div>
              <div>
                <p className="text-gray-500">Available</p>
                {/* <p className="font-medium">{part.availableStock}</p> */}
                <p className="font-medium">{part.stockLevel - part.reservedStock}</p>
              </div>
              <div>
                <p className="text-gray-500">Min. Stock</p>
                <p className="font-medium">{part.minStockLevel}</p>
              </div>
            </div>
          </div>

          <div className='mt-4 border-t pt-4'>
          <Box sx={{ width: '100%', ml: 1, mt: 5}}>
            <Typography id="input-slider" gutterBottom>
              Tracking shipment
            </Typography>
          

            <Box sx={{ display: 'flex'}}>
                <DirectionsBoatIcon />
                <Slider
                  aria-label="Small steps"
                  sx={{
                    marginLeft: 1,
                    marginRight: 1,
                    '& .MuiSlider-thumb': {
                      display: 'none', // Hides the thumb (the round button)
                    },
                  }}
                />
                
                <SystemSecurityUpdateGoodIcon/>
                <Slider
                  aria-label="Small steps"
                  sx={{
                    marginLeft: 1,
                    marginRight: 1,
                    '& .MuiSlider-thumb': {
                      display: 'none', // Hides the thumb (the round button)
                    },
                  }}
                />
                
                <LocalShippingIcon />
                <Slider
                  aria-label="Small steps"
                  sx={{
                    marginLeft: 1,
                    marginRight: 1,
                    '& .MuiSlider-thumb': {
                      display: 'none', // Hides the thumb (the round button)
                    },
                  }}
                />
                <HomeWorkIcon />
            </Box>
          </Box>
          </div>
        </div>

        
      ))}
      
    {/* Edit PopupForm.js */}
    {isFormOpen && <PopupEditForm part={selectedPart} sku={selectedSKU} onClose={toggleForm} />}
    {/* {isFormOpen && (
      console.log(selectedPart), // Log the selected part here
      <PopupEditForm part={selectedPart} onClose={toggleForm} />
    )} */}
    
    </div>     
  );
};

export default InventoryList;

