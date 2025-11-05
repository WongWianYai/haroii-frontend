"use client";
import { useEffect, useState } from "react";
import { MenuItem, Restaurant, Owner, TabType } from "@/types";
import { apiClient } from "@/lib/api";
import Header from "@/components/layout/Header";
import MenuManagementTab from "@/components/menu/MenuManagementTab";
import RestaurantForm from "@/components/restaurant/RestaurantForm";
import OrderManagement from "@/components/orders/OrderManagement";
import OrderHistory from "@/components/orderHistory/OrderHistory"
import { API_URL } from "@/config";

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurant and Owner state
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: "",
    slug: "",
    phone: "",
    address: "",
    type: "",
    owner: "",
    openTime: "",
    closeTime: ""
  });

  const [originalRestaurant, setOriginalRestaurant] = useState<Restaurant>({
    name: "",
    slug: "",
    phone: "",
    address: "",
    type: "",
    owner: "",
    openTime: "",
    closeTime: ""
  });

  const [owner, setOwner] = useState<Owner>({
    name: "",
    phone: "",
    email: "",
  });

  const [originalOwner, setOriginalOwner] = useState<Owner>({
    name: "",
    phone: "",
    email: "",
  });

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meData, menuData] = await Promise.all([
          apiClient.getMe(),
          apiClient.getMenuItems()
        ]);

        setRestaurant(meData.restaurant);
        setOriginalRestaurant(meData.restaurant);
        setOwner(meData.user);
        setOriginalOwner(meData.user);
        setMenuItems(menuData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Event handlers
  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner({
      ...owner,
      [e.target.name]: e.target.value,
    });
  };

  const handleDiscard = () => {
    setOwner(originalOwner);
    setRestaurant(originalRestaurant);
    setIsEdit(false);
  };

  const handleSave = async () => {
    try {
      const [updatedRestaurant, updatedOwner] = await Promise.all([
        apiClient.updateRestaurant(restaurant),
        apiClient.updateOwner(owner)
      ]);

      setOriginalRestaurant(updatedRestaurant);
      setOriginalOwner(updatedOwner);
      setIsEdit(false);
    } catch (err) {
      console.error("Error updating:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const handleToggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const fetchMenuItems = async () => {
    try {
      const data = await apiClient.getMenuItems();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  



  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">กำลังโหลด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  // if (!restaurant.name) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <p className="text-lg">ไม่พบข้อมูลร้านอาหาร</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        restaurant={originalRestaurant}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="w-full max-w-7xl mx-auto bg-white rounded shadow p-6 mt-5">
        {activeTab === "menu" && (
          <MenuManagementTab
            menuItems={menuItems}
            onMenuItemsChange={fetchMenuItems}
          />
        )}
        {activeTab === "restaurant" && (
          <RestaurantForm
            restaurant={restaurant}
            owner={owner}
            isEdit={isEdit}
            onRestaurantChange={handleRestaurantChange}
            onOwnerChange={handleOwnerChange}
            onSave={handleSave}
            onDiscard={handleDiscard}
            onToggleEdit={handleToggleEdit}
          />
        )}
        {activeTab === "orders" && (
          <OrderManagement />
        )}
        {activeTab === "history" && (
          <OrderHistory />
        )}
      </div>
    </div>
  );
}