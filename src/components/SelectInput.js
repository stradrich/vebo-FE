import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import UploadButton from '../components/UploadButton';
import Button from '@mui/material/Button';

const options = [
    { value: 'YES', label: 'YES'},
    { value: 'NO', label: 'NO'}
]

const status = [
    { value: 'ACTIVE', label: 'ACTIVE'},
    { value: 'OBSOLETE', label: 'OBSOLETE'},
    { value: 'ON HOLD', label: 'ON HOLD'}
]

const supplier = [
    { value: 'BA', label: 'BA'},
    { value: 'KH', label: 'KH'},
    { value: 'BY', label: 'BY'},
    { value: 'CA', label: 'CA'},
    { value: 'etc', label: 'etc'},
]

const partType = [
    { value: 'ORI', label: 'ORI'},
    { value: 'OEM', label: 'OEM'},
    { value: 'CHINA', label: 'CHINA'},
    { value: 'USED', label: 'USED'},
    { value: 'AFTERMKT', label: 'AFTERMKT'},
    { value: 'PACKAGE', label: 'PACKAGE'},
    { value: 'OTHERS', label: 'OTHERS'},
]

const currencies = [
    {
      value: 'USD',
      label: '$',
    },
    {
      value: 'EUR',
      label: '€',
    },
    {
      value: 'BTC',
      label: '฿',
    },
    {
      value: 'JPY',
      label: '¥',
    },
    {
       value: 'MYR',
       label: 'RM',
    },
  ];

export default function SelectTextFields() {
    const [formData, setFormData] = useState({
        sku: '',
        status: '',
        description: '',
        supplier: '',
        costPrice: '',
        sellingPrice: '',
        photoUrl: 'https://cdn1.npcdn.net/images/1628147456banner2.gif',
        partType: '',
        controlled: '',
        controlStock: '',
        stockLevel: 10,
        reservedStock: 5,
        availableStock: '',
        minStockLevel: ''
    })

    const [isControlled, setIsControlled] = useState(false);

    const handleControlToggle = (event) => {
        setIsControlled(event.target.value === 'YES');
    }

    const [invalidFields, setInvalidFields] = useState({
        stockLevel: false,
        reservedStock: false,
        minStockLevel: false,
        sellingPrice: false,
    });

    // Input change from child
    const handleInputChange = (event) => {
        const { id, name, value, files } = event.target;

        if (!name) {
            console.error("Name attribute is missing for input field.");
            return;
        }

           // If it's a file input, handle it differently
        if (name === "photoUrl" && files && files.length > 0) {
            const file = files[0];  // The first file selected
            console.log('File selected:', file);
            setFormData((prev) => ({
                ...prev,
                photoUrl: file,  // Update photoUrl in state if needed
            }));
            return;  // Early return to prevent the rest of the code from executing
        }

        // Validate numeric fields only if the field expects numeric values
        const numericFields = ['stockLevel', 'reservedStock', 'minStockLevel', 'costPrice'];
        if (numericFields.includes(name)) {
            // Check if the value contains only numbers (possibly with a decimal point)
            const isValidNumber = /^\d*\.?\d+$/.test(value);

            // Update the invalidFields state based on validation
            setInvalidFields(prev => ({
                ...prev,
                [name]: !isValidNumber
            }));

            console.log('Validation for ' + name + ' isValidNumber:', isValidNumber);

            if (!isValidNumber) {
                console.error(`${name} is invalid: ${value}`);
                return; // Don't update state if invalid
            }
        }

          // Update formData with the new value
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Log for debugging
        console.log(`Updated formData:`, { ...formData, [name]: value });

        // updateFormData(name, value);
        console.log('Input value from SelectInput.js: ',value); 
    }

    // Consolidate all input fields (! photo is a file input)
    // Handling POST http://localhost:8080/parts
    const handleSubmit = async () => {
        
        console.log(formData.photoUrl.name);
        
        // Consolidate the "form data"
        const consolidatedData = {
            sku: formData.sku,
            status: formData.status,
            description: formData.description,
            supplier: formData.supplier,
            costPrice: formData.costPrice,
            sellingPrice: formData.sellingPrice,
            photoUrl: formData.photoUrl.name,
            partType: formData.partType,
            controlled: formData.controlled,
            controlStock: formData.controlStock,
            stockLevel: formData.stockLevel,
            reservedStock: formData.reservedStock,
            availableStock: availableStock,
            minStockLevel: formData.minStockLevel,
        };

        console.log("SKU before fetch:", formData.sku);
        
        // Log out consolidated data
        console.log('Consolidated Data:', consolidatedData);
    
        try {
            // Step 1: Create the part by POSTing to /parts
            const createPartResponse = await fetch('http://localhost:8080/parts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consolidatedData),
            });

            if (createPartResponse.status === 409) {
                // Handle conflict (409) error
                const responseBody = await createPartResponse.text();  // Get the response body
                console.warn('Error: Conflict - Part with SKU already exists:', responseBody);  // Log it out
                alert(`Error: ${responseBody}`);  // Display it to the user (you can use a more refined UI for this)
                return;  // Exit the function early if there is a conflict
            }
    
            if (!createPartResponse.ok) {
                throw new Error('Failed to create part');
            }
    
            console.log('Part created successfully:', await createPartResponse.json());
    
            console.log(`http://localhost:8080/parts/${formData.sku}/uploadPhoto`);
            
            // HANDLING UPLOAD PHOTO
            // Step 2: Upload the photo if it exists
            if (formData.photoUrl instanceof File) {
                const uploadUrl = `http://localhost:8080/parts/${formData.sku}/uploadPhoto`;
                const fileUploadForm = new FormData();
                fileUploadForm.append('file', formData.photoUrl);
    
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    body: fileUploadForm,
                });
    
                if (!uploadResponse.ok) {
                    throw new Error('File upload failed');
                }
    
                const uploadResult = await uploadResponse.json();
                console.log('File uploaded successfully. URL:', uploadResult.url);
            } else {
                console.warn('No file provided for photoUrl.');
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
        // Now pass the consolidatedData to PopupForm
        // Pass the data to PopupForm.js to handle submission
        // Assuming onSubmit is a prop passed from PopupForm
        // window.location.reload();
        
    };
    

    // HANDLING AUTO CALCULATION
    const availableStock = formData.stockLevel - formData.reservedStock;
    

    // HANDLING COMBINED FUNCTIONS
    const handleCombinedChange = (event) => {
        handleControlToggle(event);
        handleInputChange(event);
    };

    // HANDLING UPLOAD PHOTO
    // const uploadFile = async (sku, file) => {
    //     console.log("SKU before fetch:", formData.sku);
        
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     const response = await fetch(`http://localhost:8080/parts/${formData.sku}/uploadPhoto`, {
    //         method: 'POST',
    //         body: formData,
    //     });
    
    //     if (!response.ok) {
    //         throw new Error('File upload failed');
    //     }
    
    //     const data = await response.json();
    //     return data.fileUrl;  // Assuming the server returns a URL for the uploaded file
    // };
    
    
    
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
      noValidate
      autoComplete="off"
    //   onSubmit={handleSubmit}
    >
        {/* 
            "sku": "",
            "status": ACTIVE,OBSOLETE,ON_HOLD; 
            "description": "",
            "supplier": BA,KH,BY,CA;
            "costPrice": 
            "sellingPrice": 
            "photoUrl":
            "partType":  ORI,OEM,CHINA,USED,AFTERMKT,PACKAGE,OTHERS
            "controlled":  YES OR NO (FOR PARTS SPECIAL HANDLING)
            "controlStock": YES OR NO (ENABLE OR DISABLE stockLevel; reservedStock; availableStock; minStockLevel)
            "stockLevel": ,
            "reservedStock": ,
            "availableStock":,
            "minStockLevel": 
        */}
      
      <div>
        <div>
            {/* SKU */}
            <TextField
                name="sku"
                label="mandatory sku"
                value={formData.sku} 
                helperText="The last 2 characters of a SKU will always be the supplier code! i.e 33322406288"
                // onFocus={(e) => e.target.value === "sku i.e 33322406288" && (e.target.value = "")}
                onChange={handleInputChange}
            />

            {/* STATUS */}
            <TextField
            name="status"
            select
            label="Select Current Status"
            value={formData.status} 
            helperText=""
            onChange={handleInputChange}
            >
            {status.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                {status.label}
                </MenuItem>
            ))}
            </TextField> 

            {/* DESCRIPTION 40 char max mandatory */}  
            <TextField
                name="description"
                label="mandatory desciption"
                value={formData.description} 
                helperText="Describe inventory, i.e Mini W11 Main pulley (China)"
                // onFocus={(e) => e.target.value === "i.e Mini W11 Main pulley (China)" && (e.target.value = "")}
                onChange={handleInputChange}
            />

            {/* SUPPLIER */}  
            <TextField
            name="supplier"
            select
            label="Select Supplier"
            // defaultValue="etc"
            value={formData.supplier} 
            helperText=""
            onChange={handleInputChange}
            >
            {supplier.map((supplier) => (
                <MenuItem key={supplier.value} value={supplier.value}>
                {supplier.label}
                </MenuItem>
            ))}
            </TextField> 

            {/* COST PRICE */} {/* SELLING PRICE*/}  
            <TextField
                name="costPrice"
                label="Amount (MYR)"
                value={formData.costPrice} 
                helperText={invalidFields['costPrice'] ? "Please enter a valid number!" : " "}
                onFocus={(e) => e.target.value === "MYR" && (e.target.value = "")}
                onChange={handleInputChange}
                error={invalidFields['costPrice']}
            />

            {/* CONTROLLED PART */}
            <TextField
            name="controlled"
            select
            label="Select Handling"
            value={formData.controlled} 
            helperText="Is this a controlled part? High value or important parts require special handling procedure"
            onChange={handleInputChange}
            >
            {options.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                {options.label}
                </MenuItem>
            ))}
            </TextField>  

            {/* UPLOAD PHOTO URL */}  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <UploadButton  
                    type="file"
                    id="photoUrl"
                    name="photoUrl"
                    onChange={handleInputChange}
                    />
                </div>            
                <span className="mt-5 mb-10">
                    {formData.photoUrl.name}
                </span>
            </div>
        </div>

        <div>
            {/* PART TYPE */}  
            <TextField
            name="partType"
            select
            label="Select Part Type"
            value={formData.partType} 
            helperText=""
            onChange={handleInputChange}
            >
            {partType.map((partType) => (
                <MenuItem key={partType.value} value={partType.value}>
                {partType.label}
                </MenuItem>
            ))}
            </TextField> 

           
             {/* TOGGLING EFFECT */}
            <TextField
            name="controlStock"
            select
            label="Toggle Control Stock Calculation"
            value={formData.controlStock} 
            helperText="YES to ENABLE (Stock level, Reserve Stock, Available Stock, Minimum Stock)"
            onChange={handleCombinedChange}
            >
            {options.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                {options.label}
                </MenuItem>
            ))}
            </TextField> 
            
           
            {/* STOCK LEVEL */}
            <TextField
                name="stockLevel"
                label="Stock Level"
                value={formData.stockLevel}
                // helperText="Please enter a number!"
                helperText={invalidFields['stockLevel'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.stockLevel}
                error={invalidFields["stockLevel"]}
            />

            {/* RESERVED STOCK */}
            <TextField
                name="reservedStock"
                label="Reserved Stock"
                value={formData.reservedStock}
                // helperText="Please enter a number!"
                helperText={invalidFields['reservedStock'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.reservedStock}
                error={invalidFields['reservedStock']}
            />

            {/* AVAILABLE STOCK */}
            <TextField
                name="availableStock"
                label="Available Stock"
                defaultValue={availableStock} // compute dynamically
                helperText="This is calculated automatically!"
                disabled
                onChange={handleInputChange}
            />

            {/* MINUMUM STOCK */}
            <TextField
                name="minStockLevel"
                label="Minimum Stock"
                value={formData.minStockLevel}
                // helperText="Please enter a number!"
                helperText={invalidFields['minStockLevel'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.minStockLevel}
                error={invalidFields['minStockLevel']}
            />
        </div>
      </div>

      <Button
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
            sx={{
                padding: '10px 20px',
                borderRadius: '8px',
                borderWidth: '1px',
                borderColor: '#1976d2',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    borderColor: '#1976d2',
                    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)', // Gloss effect
                },
                '&:focus': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)', // Focus effect for accessibility
                }
            }}
        >
            Submit
        </Button>
    </Box>
  );
}
