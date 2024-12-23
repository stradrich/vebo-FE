import React, { useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import SelectInput from '../components/SelectInput';
import { Center } from '@chakra-ui/react';

function PopupForm({ onClose }) {
  const [partName, setPartName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', partName);
    onClose(); // Close the form after submission
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
       
     {/* Header Section */}
     <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Space between the title and button
          }}
        >
          <h2 className="text-xl font-semibold ml-6">Add Inventory</h2>
          <button onClick={onClose} style={{ marginRight: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
            <CancelIcon />
          </button>
        </div>
    
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
          </div>
          {/* <div className="mb-4">
            <SelectInput/>
          </div> */}
           {/* Scrollable container for SelectInput */}
           <div
            className="mb-4"
            style={{
              maxHeight: '550px', // Adjust height as needed
              overflowY: 'auto', // Enable vertical scrolling
            }}
          >
            <SelectInput />
          </div>
          {/* <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button> */}

        <Stack direction="row" sx={{marginLeft: 36, marginRight: 30}}>
            <Button variant="outlined">Submit</Button>
        </Stack>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
