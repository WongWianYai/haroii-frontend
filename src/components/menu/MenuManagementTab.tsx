import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types";
import { useMenuSearch } from "@/hooks/useMenuSearch";
import { apiClient } from "@/lib/api";
import MenuSearch from "./MenuSearch";
import MenuTable from "./MenuTable";
import AddEditMenuForm from "./MenuForm";

interface MenuManagementTabProps {
  menuItems: MenuItem[];
  onMenuItemsChange: () => void;
}

export default function MenuManagementTab({ 
  menuItems, 
  onMenuItemsChange 
}: MenuManagementTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  
  const {
    filteredMenuItems,
    searchCategory,
    handleSearchCategory,
    getUniqueCategories,
  } = useMenuSearch(menuItems);

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

  return (
    <>
      <MenuSearch
        searchCategory={searchCategory}
        onSearchChange={handleSearchCategory}
        filteredCount={filteredMenuItems.length}
        menuItems={menuItems}
        uniqueCategories={getUniqueCategories()}
      />

      <MenuTable
        menuItems={filteredMenuItems}
        searchCategory={searchCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="flex justify-end mt-4">
        <Button onClick={handleAddNew}>เพิ่มเมนูใหม่</Button>
      </div>

      {showForm && (
        <AddEditMenuForm
          menu={editingMenu || undefined}
          onSuccess={handleFormSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}