"use client";
import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wrench } from "lucide-react";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface restaurant{
    name: string;
    phone: string;
    address: string;
}
const restaurant = {
  name: "Haroii",
  phone: "0812345678",
  address: "123 Main Street, Bangkok",
};

const menuItems = [
        {name: "Pork", price: 50, description: "หมู"},
        {name: "Chicken", price: 40, description: "ไก่"}
];
function MenuManagement(){
    const [activeTab, setActiveTab] = useState<"menu" | "restaurant">("menu");
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div>
            <h1 className="text-3xl font-bold mb-8">Haroii</h1>
            <div className="flex gap-4 mb-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded bg-gray-200 hover:bg-gray-300">
                        {/* Hamburger Icon SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24">
                        <rect y="4" width="24" height="2" rx="1" fill="black"/>
                        <rect y="11" width="24" height="2" rx="1" fill="black"/>
                        <rect y="18" width="24" height="2" rx="1" fill="black"/>
                        </svg>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setActiveTab("menu")}>
                            Menu Items
                        </DropdownMenuItem>  
                        <DropdownMenuItem onSelect={() => setActiveTab("restaurant")}>
                            Restaurant Information
                        </DropdownMenuItem>                       
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="w-full max-w-3xl bg-white rounded shadow p-6">
                {activeTab === "menu" ? (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Menus</th>
                        <th className="border px-4 py-2 text-left">Price (baht)</th>
                        <th className="border px-4 py-2 text-left">Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {menuItems.map((item, idx) => (
                        <tr key={idx}>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.price}</td>
                        <td className="border px-4 py-2">{item.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
                        <Button variant="secondary"
                            onClick={() => {
                            // later: open form or modal
                            console.log("Edit restaurant info clicked");
                            }}
                        >
                            <Wrench className="w-4 h-4" />
                        </Button>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">ชื่อร้านอาหาร: </span>
                            {restaurant.name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">เบอร์โทรร้านอาหาร: </span>
                            {restaurant.phone}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">ที่อยู่ร้านอาหาร: </span>
                            {restaurant.address}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MenuManagement;