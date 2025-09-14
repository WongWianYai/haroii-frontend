"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config";
import AddEditMenuForm from "@/components/menu/MenuForm"; // modal form
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wrench, Trash2, Edit } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
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

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<"menu" | "restaurant">("menu");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/menu`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
    fetchMenuItems();
  }, []);

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบเมนูนี้หรือไม่?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/menu/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete menu");
      fetchMenuItems();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบเมนู");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!restaurant) return <p>No restaurant data</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-[#F38DA9] px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">CS</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-1 font-medium bg-[#F38DA9] text-white hover:bg-[#e37795] text-sm md:text-base">
                ร้านอาหารเช้าเชฟไทน์
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>ครัวคุณไทน์</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>การตั้งค่าบัญชี</DropdownMenuItem>
                <DropdownMenuItem>การจ่ายเงิน</DropdownMenuItem>
                <DropdownMenuItem>การตั้งค่า</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem>ออกจากระบบ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <NavigationMenu className="order-3 w-full md:order-none md:w-auto">
          <NavigationMenuList className="flex flex-col md:flex-row md:gap-4 w-full md:w-auto text-sm md:text-base">
            <NavigationMenuItem>
              <NavigationMenuLink onSelect={() => setActiveTab("menu")}>จัดการรายการอาหาร</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink onSelect={() => setActiveTab("restaurant")}>ร้านอาหาร</NavigationMenuLink>
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

        <div className="text-lg md:text-xl font-bold text-white order-2 md:order-none" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
          Haroii.
        </div>
      </header>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded shadow p-6 mt-4">
        {activeTab === "menu" ? (
          <>
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Menus</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                  <th className="border px-4 py-2 text-left">Description</th>
                  <th className="border px-4 py-2 text-left">Categories</th>
                  <th className="border px-4 py-2 text-left">Availability</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className= "border px-4 py-2">{item.category}</td>
                    <td className= "border px-4 py-2">{item.isAvailable ? "Available" : "Out of Stock"}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <Button onClick={() => { setEditingMenu(null); setShowForm(true); }}>Add Menu</Button>
            </div>

            {showForm && (
              <AddEditMenuForm
                menu={editingMenu || undefined}
                onSuccess={fetchMenuItems}
                onClose={() => setShowForm(false)}
              />
            )}
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-4">Restaurant Information</h2>
              <Button variant="secondary" onClick={() => console.log("Edit restaurant info clicked")}>
                <Wrench className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-2"><span className="font-semibold">เจ้าของร้าน: </span>{ownerName}</div>
            <div className="mb-2"><span className="font-semibold">ชื่อร้านอาหาร: </span>{restaurant.name}</div>
            <div className="mb-2"><span className="font-semibold">เบอร์โทรร้านอาหาร: </span>{restaurant.phone}</div>
            <div className="mb-2"><span className="font-semibold">ที่อยู่ร้านอาหาร: </span>{restaurant.address}</div>
          </div>
        )}
      </div>
    </div>
  );
}
