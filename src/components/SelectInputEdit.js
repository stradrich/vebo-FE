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

export default function SelectTextFieldsEdit({part}) {
   
    console.log(part);


    // If the photo URL is a Blob URL, fetch the blob and convert it to base64
    if (part.photoUrl instanceof Blob) {
        const reader = new FileReader();

        reader.onload = () => {
            console.log("Base64 string:", reader.result); // The base64-encoded string
        };

        reader.onerror = (error) => {
            console.error("Error converting blob to base64:", error);
        };

        reader.readAsDataURL(part.photoUrl); // Start reading the blob as a base64 string
    } else {
        console.log("Not a Blob URL, using directly:", part.photoUrl);
    }

    

    // HANDLING AUTO CALCULATION
    const availableStock = part.stockLevel - part.reservedStock;

    // Local state to manage input fields
    const [formData, setFormData] = useState({ ...part });
    
    // Handle Edit Input Change
   
    // const handleEditInputChange = (event) => {
    //     const { name, value } = event.target;
    //     console.log(`Field: ${name}, Value: ${value}`);
        
    //     if (validateField(name, value)) {
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             [name]: value
    //         }));
    //     } else {
    //         console.error(`${name} is invalid: ${value}`);
    //     }
    // };

    const handleEditInputChange = (event) => {
        const { name, value, files } = event.target;
    
        console.log(`Field: ${name}, Value: ${value}`);
    
        if (name === "photoUrl" && files?.length > 0) {
            const file = files[0];
            // const fileUrl = URL.createObjectURL(file);
            const fileName = file.name; // Extract the original file name
    
            console.log(file);
            
            // console.log(`Generated File URL: ${fileUrl}`);
            console.log(`Original File Name: ${fileName}`);
    
            
            setFormData((prevState) => ({
                ...prevState,
                [name]: fileName, // Store the blob URL
                [`${name}Name`]: fileName, // Store the file name separately,
                photoUrl: file,
            }));
        } else if (validateField(name, value)) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            console.error(`${name} is invalid: ${value}`);
        }
    };
    
    

      // Clear field on focus
      const handleFocus = (event) => {
        const { defaultValue } = event.target;
        console.log(defaultValue);
        
        setFormData((prevState) => ({
            ...prevState,
            [defaultValue]: '', // Clear the value when focused
        }));
    };

       // Handle validation
       const numericFields = ['stockLevel', 'reservedStock', 'minStockLevel', 'costPrice'];

       const [invalidFields, setInvalidFields] = useState({
        stockLevel: false,
        reservedStock: false,
        minStockLevel: false,
        sellingPrice: false,
    });

    const validateField = (name, value) => {
        if (numericFields.includes(name)) {
            const normalizedValue = value.trim();
            const isValidNumber = /^\d+$/.test(normalizedValue);  // Ensure it's a valid integer
            const parsedValue = parseInt(normalizedValue, 10);
    
            // Check for leading zeros only if the number is not '0'
            const isLeadingZero = (name === 'costPrice' || name === 'stockLevel' || name === 'reservedStock' || name === 'minStockLevel') 
                && normalizedValue.startsWith('0') && normalizedValue !== '0';
    
            // Update invalidFields state based on different conditions
            setInvalidFields((prev) => ({
                ...prev,
                [name]: !isValidNumber || parsedValue < 0 || isLeadingZero,
            }));
    
            return isValidNumber && parsedValue >= 0 && !isLeadingZero;
        }
        return true;
    };
    
    // Toggle 
    const [isControlled, setIsControlled] = useState(false);

    const handleControlToggle = (event) => {
        setIsControlled(event.target.value === 'YES');
    }

     // HANDLING COMBINED FUNCTIONS
     const handleCombinedChange = (event) => {
        handleControlToggle(event);
        handleEditInputChange(event);
    };
    
    const handleSubmit = async () => {
        const url = part.photoUrl;
        const fileName = url.match(/\/([^\/]+)$/)[1] + ".jpg"; // Extract the filename
    
        console.log(part);
        console.log(fileName);
    
        // Consolidate form data
        const consolidatedData = {
            sku: formData.sku,
            status: formData.status,
            description: formData.description,
            supplier: formData.supplier,
            costPrice: formData.costPrice,
            sellingPrice: formData.sellingPrice,
            photoUrl: formData.file, // Default to the existing URL or filename
            partType: formData.partType,
            controlled: formData.controlled,
            controlStock: formData.controlStock,
            stockLevel: formData.stockLevel,
            reservedStock: formData.reservedStock,
            availableStock: formData.availableStock,
            minStockLevel: formData.minStockLevel,
        };
    
        console.log("SKU before fetch:", formData.sku);
        console.log("Consolidated Data:", consolidatedData);
    
        try {
            // Step 1: Update the part details
            const updatePartResponse = await fetch(`http://localhost:8080/parts/${formData.sku}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(consolidatedData),
            });
    
            if (!updatePartResponse.ok) {
                throw new Error("Failed to update part");
            }
    
            console.log("Part updated successfully:", await updatePartResponse.json());
    
            console.log(formData.photoUrl instanceof File);
            
            // Step 2: Handle photo upload if a new photo is provided
            if (formData.photoUrl instanceof File) {
                const uploadUrl = `http://localhost:8080/parts/${formData.sku}/uploadPhoto`;
                console.log(uploadUrl);
                
                const fileUploadForm = new FormData();
                // console.log(fileUploadForm);
                
                console.log(formData.photoUrl); // check if it's a file
                
                fileUploadForm.append('file', formData.photoUrl);
                // console.log(fileUploadForm);
                
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    body: fileUploadForm,
                });

                console.log(uploadResponse);
                
    
                if (!uploadResponse.ok) {
                    throw new Error('File upload failed');
                }
    
                const uploadResult = await uploadResponse.json();
                console.log('File uploaded successfully. URL:', uploadResult.url);
            } else {
                console.warn('No file provided for photoUrl.');
            }
    

        } catch (error) {
            console.error("Error during submission:", error);
        }
    
        // Optionally reload the page or update UI after the submission
        // window.location.reload();
    };
    
    
    
    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
            noValidate
            autoComplete="off"
        >
            <div>
                <div className='mb-5'>
                    {/* SKU */}
                    <TextField
                        name="sku"
                        label="mandatory sku"
                        defaultValue={part.sku} 
                        helperText="Please contact dev team change SKU!"
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                        disabled
                    />

                    {/* STATUS */}
                    <TextField
                        name="status"
                        select
                        label={`Previous Status: ${part.status}`} 
                        // defaultValue={part.status} 
                        helperText=""
                        onChange={handleEditInputChange}
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
                        defaultValue={part.description} 
                        // helperText="Describe inventory, i.e Mini W11 Main pulley (China)"
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                    />

                    {/* SUPPLIER */}  
                    <TextField
                        name="supplier"
                        select
                        label={`Previous Supploer: ${part.supplier}`} 
                        // defaultValue={part.supplier} 
                        helperText=""
                        onChange={handleEditInputChange}
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
                        defaultValue={part.costPrice} 
                        helperText={invalidFields['costPrice'] ? "Please enter a valid number. It can't be 0 or lower or have leading zeros" : " "}
                        error={invalidFields['costPrice']}
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                    />

                     {/* CONTROLLED PART */}
                    <TextField
                        name="controlled"
                        select
                        label={`Special Handling? ${part.controlled}`} 
                        // defaultValue={part.controlled} 
                        // helperText="Is this a ontrolled part? High value or important parts require special handling procedure"
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                        >
                        {options.map((options) => (
                            <MenuItem key={options.value} value={options.value}>
                            {options.label}
                            </MenuItem>
                        ))}
                    </TextField> 

                    {/* UPLOAD PHOTO URL */}  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div >
                            <UploadButton 
                            type="file"
                            id="photoUrl"
                            name="photoUrl"
                            onChange={handleEditInputChange}
                            />
                        </div>
                     <span className="mt-5 mb-10 flex flex-col text-xs">
                        <p>Previous file: {part.photoUrl ? new URL(part.photoUrl).pathname.split('/').pop() : ''}</p>
                        {/* <p>Previous file: {formData.photoUrl} </p> */}
                        <p>New file: {formData.photoUrlName || 'No file selected'}</p>
                     </span>
                    </div>
                </div>
                <div>
                    {/* PART TYPE */}  
                    <TextField
                        name="partType"
                        select
                        label={`Previous Part Type: ${part.partType}`} 
                        // defaultValue={part.partType} 
                        helperText=""
                        onChange={handleEditInputChange}
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
                        defaultValue="NO"
                        // helperText="YES to ENABLE (Stock level, Reserve Stock, Available Stock, Minimum Stock)"
                        onChange={handleCombinedChange}
                        onFocus={handleFocus}
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
                        defaultValue={part.stockLevel}
                        helperText={invalidFields['stockLevel'] ? "Please enter a valid number. It can't be lower than 0 or have leading zeros" : " "}
                        disabled={!isControlled}
                        error={invalidFields["stockLevel"]}
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                    />

                    {/* RESERVED STOCK */}
                    <TextField
                        name="reservedStock"
                        label="Reserved Stock"
                        defaultValue={part.reservedStock}
                        helperText={invalidFields['reservedStock'] ? "Please enter a valid number. It can't be lower than 0 or have leading zeros"  : " "}
                        disabled={!isControlled}
                        error={invalidFields['reservedStock']}
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
                    />

                     {/* AVAILABLE STOCK */}
                    <TextField
                        name="availableStock"
                        label="Available Stock"
                        value={availableStock} // compute dynamically
                        helperText="This is calculated automatically!"
                        disabled
                    />


                    {/* MINUMUM STOCK */}
                    <TextField
                        name="minStockLevel"
                        label="Minimum Stock"
                        defaultValue={part.minStockLevel}
                        helperText={invalidFields['minStockLevel'] ? "Please enter a valid number. It can't be lower than 0 or have leading zeros"  : " "}
                        disabled={!isControlled}
                        error={invalidFields['minStockLevel']}
                        onChange={handleEditInputChange}
                        onFocus={handleFocus}
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
    )
}