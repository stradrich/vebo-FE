import React, { useState, useEffect } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';

import SelectInput from '../components/SelectInput';
import SelectInputEdit from '../components/SelectInputEdit';


function PopupEditForm({part, onClose }) {
  
  // console.log(part);
  
  // if (!part) {
  //   return (
  //     <div className="popup-overlay">
  //       <div className="popup-container">
  //         <h2 className="text-xl font-semibold ml-6">Error: Part data is missing</h2>
  //         <button onClick={onClose} style={{ marginRight: 20 }}>
  //           <CancelIcon />
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
  
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
          <h2 className="text-xl font-semibold ml-6">
            Edit Inventory
            <span className='ml-6 font-thin italic'>{part.sku}</span>
          </h2>
          <button onClick={onClose} style={{ marginRight: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
            <CancelIcon />
              {/* Display SKUs */}
              {/* {part && part.length > 0 ? (
                part.map((part, index) => (
                  <p key={index}>SKU: {part}</p>
                ))
              ) : (
                <p>No parts available</p>
              )} */}
          </button>
        </div>
    
        <form 
        // onSubmit={handleFormSubmit}
        >
          <div className="mb-4">
              {/* File input */}
              {/* <input
              type="file"
              onChange={(e) => setFormData({ ...formData, photoFile: e.target.files[0] })}
            /> */}
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
            <SelectInputEdit part={part}/>
          </div>
          {/* <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button> */}

        {/* <Stack direction="row" sx={{marginLeft: 36, marginRight: 30}}>
            <Button type="submit" variant="outlined">
              Submit
            </Button>
        </Stack> */}
        </form>
      </div>
    </div>
  );
}

export default PopupEditForm;
