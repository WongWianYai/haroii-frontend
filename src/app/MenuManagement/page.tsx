"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
// import { useForm } from "../Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Wrench } from "lucide-react";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  name: string;
  phone: string;
  address: string;
  owner?: string;
}

interface MeResponse {
  user: { id: string; name: string; email: string; role: string };
  restaurant: Restaurant | null;
}

const menuItems = [
  { name: "Pork", price: 50, description: "หมู" },
  { name: "Chicken", price: 40, description: "ไก่" },
];
function MenuManagement() {
  const [activeTab, setActiveTab] = useState<"menu" | "restaurant">("menu");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  //   const { token, setToken } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: MeResponse = await res.json();
        setRestaurant(data.restaurant);
        setOwnerName(data.user?.name || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!restaurant) return <p>No restaurant data</p>;

  return (
    <div>
        <header className="w-full w-full bg-[#F38DA9] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">  
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                    CS
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className= "flex items-center gap-1 font-medium bg-[#F38DA9] text-white hover:bg-[#e37795]">
                            ร้านอาหารเช้าเชฟไทน์
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>ครัวคุณไทน์</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                การตั้งค่าบัญชี
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                การจ่ายเงิน
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                การตั้งค่า
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem>
                            ออกจากระบบ
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink onSelect= {() => setActiveTab("menu")}>จัดการรายการอาหาร</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink onSelect= {() => setActiveTab("restaurant")}>ร้านอาหาร</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>รายงาน</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>จัดการร้านอาหาร</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>บัญชี</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="text-xl font-bold text-white" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>Haroii.</div>
            </div>

        </header>
      <div className="flex gap-4 mb-6">
        
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
            <div className="flex flex-wrap items-center gap-2 md:flex-row justify-end">
                <Button>Add</Button>
            </div>
          </table>
          
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
              <Button
                variant="secondary"
                onClick={() => {
                  // later: open form or modal
                  console.log("Edit restaurant info clicked");
                }}
              >
                <Wrench className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-2">
              <span className="font-semibold">เจ้าของร้าน: </span>
              {ownerName}
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
