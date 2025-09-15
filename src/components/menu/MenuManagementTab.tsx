import { useState } from "react";
import { MenuItem } from "@/types";
import { useMenuSearch } from "@/hooks/useMenuSearch";
import { useMenuOperations } from "@/hooks/useMenuOperations";
import MenuHeader from "./MenuHeader";
import MenuStats from "./MenuStats";
import MenuSearchFilter from "./MenuSearchFilter";
import MenuTableView from "./MenuTableView";
import AddEditMenuForm from "./MenuForm";

interface MenuManagementTabProps {
  menuItems: MenuItem[];
  onMenuItemsChange: () => void;
}

export default function MenuManagementTab({ 
  menuItems, 
  onMenuItemsChange 
}: MenuManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    filteredMenuItems,
    searchCategory,
    handleSearchCategory,
    getUniqueCategories,
  } = useMenuSearch(menuItems);

  const {
    showForm,
    editingMenu,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleAddNew,
    handleCloseForm,
  } = useMenuOperations(onMenuItemsChange);

  // Additional filtering by search term
  const finalFilteredItems = filteredMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <MenuHeader onAddNew={handleAddNew} />
      
      <MenuStats menuItems={menuItems} />
      
      <MenuSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchCategory={searchCategory}
        onCategoryChange={handleSearchCategory}
        menuItems={menuItems}
        uniqueCategories={getUniqueCategories()}
        filteredCount={finalFilteredItems.length}
      />
      
      <MenuTableView
        menuItems={finalFilteredItems}
        searchTerm={searchTerm}
        searchCategory={searchCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      {showForm && (
        <AddEditMenuForm
          menu={editingMenu || undefined}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}