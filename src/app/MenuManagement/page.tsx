"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
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
} from "@/components/ui/dropdown-menu";
import { Wrench } from "lucide-react";
import { Label } from "@radix-ui/react-label";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  name: string;
  phone: string;
  address: string;
}
interface User {
  name: string;
  phone: string;
  email: string;
}

interface MeResponse {
  user: User;
  restaurant: Restaurant;
}

const menuItems = [
  { name: "Pork", price: 50, description: "หมู" },
  { name: "Chicken", price: 40, description: "ไก่" },
];
function MenuManagement() {
  const [activeTab, setActiveTab] = useState<"menu" | "restaurant">("menu");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: "",
    phone: "",
    address: "",
  });
  const [originalRestaurant, setOgRestaurant] = useState<Restaurant>({
    name: "",
    phone: "",
    address: "",
  });
  const [originalOwner, setOgOwner] = useState<User>({
    name: "",
    phone: "",
    email: "",
  });
  const [owner, setOwner] = useState<User>({
    name: "",
    phone: "",
    email: "",
  });

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
        setOgRestaurant(data.restaurant);
        setOgOwner(data.user);
        setOwner(data.user);
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

  const handleChangeOwner = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner({
      ...owner,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeRest = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const handleDiscardBtn = () => {
    setOwner(originalOwner);
    setRestaurant(originalRestaurant);
  };

  const handleSaveBtn = async () => {
    try {
  
      const res = await fetch(`${API_URL}/api/v1/auth/restaurant/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      console.log("Updated successfully:", data);
      setOgRestaurant(data);
      
    } catch (err) {
      console.error("Error updating:", err);
      alert("Error updating data");
    }

      try {
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(owner),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      console.log("Updated successfully:", data);
      setOgOwner(data);
    

    } catch (err) {
      console.error("Error updating:", err);
      alert("Error updating data");
    }
      setEdit(!isEdit);
  };

  return (
    <div>
      <header className="w-full w-full bg-[#F38DA9] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            CS
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-1 font-medium bg-[#F38DA9] text-white hover:bg-[#e37795]">
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
                <NavigationMenuLink onSelect={() => setActiveTab("menu")}>
                  จัดการรายการอาหาร
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink onSelect={() => setActiveTab("restaurant")}>
                  ร้านอาหาร
                </NavigationMenuLink>
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

          <div
            className="text-xl font-bold text-white"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            Haroii.
          </div>
        </div>
      </header>
      <div className="flex gap-4 mb-6"></div>
      <div className="relative w-full max-w-3xl bg-white rounded shadow p-6">
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
            <div className="flex relative items-center justify-center mb-4">
              <h2 className="text-xl  text-center font-bold ">
                การจัดการข้อมูลร้านอาหาร
              </h2>

              <svg
                width="20"
                height="25"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-2  cursor-pointer text-gray-600 hover:text-pink-500"
                onClick={() => {
                  setEdit(!isEdit);
                }}
              >
                <path
                  d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="pl-8">
              <div className="">
                <h3 className="font-semibold mt-2 mb-2">ข้อมูลบัญชี : </h3>
               <div className="ml-[120px]">


                   <dl>
                <dt className="mb-1.5">
                  อีเมล
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="email"
                    name="email"
                    value={owner?.email}
                    // value={}
                    onChange={handleChangeOwner}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
                  />
                </dd>
              </dl>
              <dl>
                <dt className="mb-1.5">
                 ชื่อเจ้าของร้าน
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="text"
                    name="name"
                    value={owner.name}
                    // value={}
                    onChange={handleChangeOwner}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5 w-ful"
                  />
                </dd>
              </dl>
              <dl>
                <dt className="mb-1.5">
                  เบอร์โทรเจ้าของร้าน
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="tel"
                    name="phone"
                    value={owner.phone}
                    // value={}
                    onChange={handleChangeOwner}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
                  />
                </dd>
              </dl>
               </div>


              </div>
            

            <div>
              <h3 className="font-semibold mt-2 mb-2">ข้อมูลร้านอาหาร : </h3>

            <div className="ml-[120px]">
                <dl>
                <dt className="mb-1.5 ">
                  ชื่อร้านอาหาร
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="text"
                    name="name"
                    value={restaurant.name}
                    // value={}
                    onChange={handleChangeRest}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
                  />
                </dd>
              </dl>

              <dl >
                <dt className="mb-1.5">
                  ที่อยู่ร้านอาหาร
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="text"
                    name="address"
                    value={restaurant.address}
                    // value={}
                    onChange={handleChangeRest}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
                  />
                </dd>
              </dl>
              <dl>
                <dt className="mb-1.5">
                  เบอร์โทรร้านอาหาร
                </dt>
                <dd className="mb-1.5">
                  <input
                    type="text"
                    name="phone"
                    value={restaurant.phone}
                    // value={}
                    onChange={handleChangeRest}
                    disabled={!isEdit}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
                  />
                </dd>
              </dl>




            </div>
            

            </div>

              {isEdit && (
                <div className="flex items-center justify-end gap-4 mt-1">
                  <Button
                    className="bg-gray-700  hover:bg-gray-300"
                    onClick={handleDiscardBtn}
                  >
                    Discard
                  </Button>
                  <Button
                    className="bg-[#F38DA9] hover:bg-pink-400"
                    onClick={handleSaveBtn}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
            {/* <div className="mb-2">
              <span className="font-semibold">เจ้าของร้าน </span>
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
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuManagement;
