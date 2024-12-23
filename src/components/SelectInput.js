import * as React from 'react';
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

export default function SelectTextFields() {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
      noValidate
      autoComplete="off"
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
                label="mandatory"
                defaultValue="sku i.e 33322406288"
                helperText="The last 2 characters of a SKU will always be the supplier code!"
                onFocus={(e) => e.target.value === "sku i.e 33322406288" && (e.target.value = "")}
            />
            {/* STATUS */}
            <TextField
            id="outlined-select-status"
            select
            label="Select Current Status"
            defaultValue="NO"
            helperText=""
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
                label="mandatory"
                defaultValue="i.e Mini W11 Main pulley (China)"
                helperText="Describe inventory"
                onFocus={(e) => e.target.value === "i.e Mini W11 Main pulley (China)" && (e.target.value = "")}
            />

            {/* SUPPLIER */}  
            <TextField
            id="outlined-select-supplier"
            select
            label="Select Supplier"
            defaultValue="OTHERS"
            helperText=""
            >
            {supplier.map((supplier) => (
                <MenuItem key={supplier.value} value={supplier.value}>
                {supplier.label}
                </MenuItem>
            ))}
            </TextField> 

            {/* COST PRICE */} {/* SELLING PRICE*/}  
            <TextField
                sx={{ }}
                id="input-sku"
                label="Amount"
                defaultValue="MYR"
                helperText="Input initial price only | Cost price will be generated automatically"
                onFocus={(e) => e.target.value === "MYR" && (e.target.value = "")}
            />

            <TextField
            id="outlined-select-option"
            select
            label="Select Handling"
            defaultValue="NO"
            helperText="Is this a controlled part? High value or important parts require special handling procedure"
            >
            {options.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                {options.label}
                </MenuItem>
            ))}
            </TextField>  

            {/* UPLOAD PHOTO URL */}  
            <UploadButton/>
        </div>

        <div>
            {/* PART TYPE */}  
            <TextField
            id="outlined-select-partType"
            select
            label="Select Part Type"
            defaultValue="others"
            helperText=""
            >
            {partType.map((partType) => (
                <MenuItem key={partType.value} value={partType.value}>
                {partType.label}
                </MenuItem>
            ))}
            </TextField> 

            {/* CONTROLLED PART */}
            <TextField
            id="outlined-select-options"
            select
            label="Toggle Control Stock Calculation"
            defaultValue="NO"
            helperText="YES to ENABLE (Stock level, Reserve Stock, Available Stock, Minimum Stock)"
            >
            {options.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                {options.label}
                </MenuItem>
            ))}
            </TextField> 
            
            {/* STOCK LEVEL */}
            <TextField
                id="input-stock-level"
                label="Stock Level"
                defaultValue="10"
                helperText="Please enter a number!"
                disabled
            />
            {/* RESERVED STOCK */}
            <TextField
                id="input-reserved-stock"
                label="Reserved Stock"
                defaultValue="10"
                helperText="Please enter a number!"
                disabled
            />
            {/* AVAILABLE STOCK */}
            <TextField
                id="input-available-stock"
                label="Available Stock"
                defaultValue="0"
                helperText=""
                disabled
            />
            {/* MINUMUM STOCK */}
            <TextField
                id="input-minimum-stock"
                label="Minimum Stock"
                defaultValue="10"
                helperText="Please enter a number!"
                disabled
            />
        </div>
      </div>
    </Box>
  );
}
