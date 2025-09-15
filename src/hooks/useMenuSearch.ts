import { useState, useEffect } from "react";
import { MenuItem } from "@/types";

export const useMenuSearch = (menuItems: MenuItem[]) => {
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    setFilteredMenuItems(menuItems);
  }, [menuItems]);

  const handleSearchCategory = (searchTerm: string) => {
    setSearchCategory(searchTerm);
    if (searchTerm.trim() === "") {
      setFilteredMenuItems(menuItems);
    } else {
      const filtered = menuItems.filter(item =>
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  };

  const getUniqueCategories = () => {
    const categories = menuItems.map(item => item.category);
    return [...new Set(categories)].filter(category => category.trim() !== "");
  };

  return {
    filteredMenuItems,
    searchCategory,
    handleSearchCategory,
    getUniqueCategories,
  };
};