import { useState } from "react";
import { MenuItem } from "@/types";
import { apiClient } from "@/lib/api";

export const useMenuOperations = (onMenuItemsChange: () => void) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบเมนูนี้หรือไม่?")) return;
    
    try {
      await apiClient.deleteMenuItem(id);
      onMenuItemsChange();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบเมนู");
    }
  };

  const handleFormSuccess = () => {
    onMenuItemsChange();
    setShowForm(false);
    setEditingMenu(null);
  };

  const handleAddNew = () => {
    setEditingMenu(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMenu(null);
  };

  return {
    showForm,
    editingMenu,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleAddNew,
    handleCloseForm,
  };
};