import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import UploadButton from '../components/UploadButton';

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

export default function SelectTextFields({updateFormData, onFileChange}) {
    const [formData, setFormData] = useState({
        sku: '',
        status: '',
        description: '',
        supplier: '',
        costPrice: '',
        sellingPrice: '',
        photoUrl: '',
        partType: '',
        controlled: '',
        controlStock: '',
        stockLevel: 10,
        reservedStock: 5,
        availableStock: '',
        minStockLevel: ','
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
        const { name, value } = event.target;

        if (!name) {
            console.error("Name attribute is missing for input field.");
            return;
        }

         // Validate numeric fields
        if (name === 'input-stock-level' || name === 'input-reserved-stock' || name === 'input-minimum-stock' || name === 'input-amount') {
            const isValidNumber = !isNaN(value) && value !== '';
            setInvalidFields(prev => ({
                ...prev,
                [name]: !isValidNumber
            }));
        }

        // updateFormData((prev) => ({...prev, [id]: value }));
        updateFormData(name, value);
        console.log('Input value from SelectInput.js: ',value); 
    }

    // Handling POST http://localhost:8080/parts
    // const handleSubmit = async (event) => {
    //     console.log("Form data:", formData);
        

    // }

    // HANDLING AUTO CALCULATION
    const availableStock = formData.stockLevel - formData.reservedStock;
    

    // HANDLING COMBINED FUNCTIONS
    const handleCombinedChange = (event) => {
        handleControlToggle(event);
        handleInputChange(event);
    };

    // HANDLING UPLOAD PHOTO
    const [uploadedFileName, setUploadedFileName] = useState('No file selected');

    const handleFileChange = (fileName) => {
        setUploadedFileName(fileName); // Update the state with the file name
        updateFormData('photoUrl', fileName);  // Update photoUrl in the form data
    };
    
    


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
                id="input-sku"
                name="input-sku"
                label="mandatory"
                defaultValue="sku i.e 33322406288"
                helperText="The last 2 characters of a SKU will always be the supplier code!"
                onFocus={(e) => e.target.value === "sku i.e 33322406288" && (e.target.value = "")}
                onChange={handleInputChange}
            />

            {/* STATUS */}
            <TextField
            id="select-status"
            name="select-status"
            select
            label="Select Current Status"
            defaultValue="ACTIVE"
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
                id="input-description"
                name="input-description"
                label="mandatory"
                defaultValue="i.e Mini W11 Main pulley (China)"
                helperText="Describe inventory"
                onFocus={(e) => e.target.value === "i.e Mini W11 Main pulley (China)" && (e.target.value = "")}
                onChange={handleInputChange}
            />

            {/* SUPPLIER */}  
            <TextField
            id="select-supplier"
            name="select-supplier"
            select
            label="Select Supplier"
            // defaultValue="etc"
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
                id="input-amount"
                name="input-amount"
                label="Amount"
                defaultValue="MYR"
                helperText={invalidFields['input-amount'] ? "Please enter a valid number!" : " "}
                // helperText="Input initial price only; Cost price will be generated automatically"
                onFocus={(e) => e.target.value === "MYR" && (e.target.value = "")}
                onChange={handleInputChange}
                // error={invalidFields.sellingPrice}
                error={invalidFields['input-amount']}
            />

            <TextField
            id="select-option"
            name="select-option"
            select
            label="Select Handling"
            defaultValue="NO"
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
            <UploadButton  
            id="photoUrl"
            name="photoUrl"
            onFileChange={handleFileChange}
            onChange={onFileChange}
            />
            <span>{uploadedFileName}</span>
        </div>

        <div>
            {/* PART TYPE */}  
            <TextField
            id="select-partType"
            name="select-partType"
            select
            label="Select Part Type"
            // defaultValue="OTHERS"
            helperText=""
            onChange={handleInputChange}
            >
            {partType.map((partType) => (
                <MenuItem key={partType.value} value={partType.value}>
                {partType.label}
                </MenuItem>
            ))}
            </TextField> 

            {/* CONTROLLED PART */}
            <TextField
            id="select-options"
            name="select-options"
            select
            label="Toggle Control Stock Calculation"
            defaultValue="NO"
            helperText="YES to ENABLE (Stock level, Reserve Stock, Available Stock, Minimum Stock)"
            onChange={handleCombinedChange}
            >
            {options.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                {options.label}
                </MenuItem>
            ))}
            </TextField> 
            
            {/* TOGGLING EFFECT */}
            {/* STOCK LEVEL */}
            <TextField
                id="input-stock-level"
                name="input-stock-level"
                label="Stock Level"
                defaultValue={formData.stockLevel}
                // helperText="Please enter a number!"
                helperText={invalidFields['input-stock-level'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.stockLevel}
                error={invalidFields["input-stock-level"]}
            />

            {/* RESERVED STOCK */}
            <TextField
                id="input-reserved-stock"
                name="input-reserved-stock"
                label="Reserved Stock"
                defaultValue={formData.reservedStock}
                // helperText="Please enter a number!"
                helperText={invalidFields['input-reserved-stock'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.reservedStock}
                error={invalidFields['input-reserved-stock']}
            />

            {/* AVAILABLE STOCK */}
            <TextField
                id="input-available-stock"
                name="input-available-stock"
                label="Available Stock"
                defaultValue={availableStock} // compute dynamically
                helperText="This is calculated automatically!"
                disabled
                onChange={handleInputChange}
            />

            {/* MINUMUM STOCK */}
            <TextField
                id="input-minimum-stock"
                name="input-minimum-stock"
                label="Minimum Stock"
                defaultValue=""
                // helperText="Please enter a number!"
                helperText={invalidFields['input-minimum-stock'] ? "Please enter a valid number!" : " "}
                disabled={!isControlled}
                onChange={handleInputChange}
                // error={invalidFields.minStockLevel}
                error={invalidFields['input-minimum-stock']}
            />
        </div>
      </div>
    </Box>
  );
}
