import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { FiMoreVertical as MoreVertical } from 'react-icons/fi';


const InventoryList = () => {
  // Sample data - replace with actual data fetching
  const parts = [
    {
      id: "675bfa39cb276d1151a0b6a8",
      uuid: "60636ce7dc987b063e374265",
      sku: "11237525135FEBA",
      status: "ACTIVE",
      description: "Mini W11 Main pulley (China)",
      supplier: "CA",
      costPrice: 100.0,
      sellingPrice: 150.0,
      photoUrl: "https://cdn1.npcdn.net/images/1628147456banner2.gif",
      partType: "ORI",
      controlled: "NO",
      controlStock: "NO",
      stockLevel: 5,
      reservedStock: 2,
      availableStock: 3,
      minStockLevel: 2
    },
    // Add more sample parts as needed
  ];

  return (
    <div className="flex flex-col gap-4">
      {parts.map((part) => (
        <div key={part.id} className="rounded-lg border bg-white shadow-sm p-6">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start space-x-4">
              {/* Image Container */}
              <div className="relative h-40 w-40 rounded-lg overflow-hidden group">
              <img
                src={part.photoUrl}
                alt={part.description}
                fill
                className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:inset-0 group-hover:top-0 group-hover:left-0 group-hover:w-full group-hover:h-full"
              />
            </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{part.description}</h3>
                <div className="text-sm text-gray-500">
                  <span>{part.sku}</span>
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
              <p className="text-lg font-semibold">RM {part.sellingPrice.toFixed(2)}</p>
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
                  <DropdownMenuItem className='m-5'>Edit</DropdownMenuItem>
                  <DropdownMenuItem className='m-5'>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
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
                <p className="font-medium">{part.availableStock}</p>
              </div>
              <div>
                <p className="text-gray-500">Min. Stock</p>
                <p className="font-medium">{part.minStockLevel}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
