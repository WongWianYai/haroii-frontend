import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  UtensilsCrossed,
  DollarSign,
  Package
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem } from "@/types";
import { useMenuSearch } from "@/hooks/useMenuSearch";
import { apiClient } from "@/lib/api";
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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    filteredMenuItems,
    searchCategory,
    handleSearchCategory,
    getUniqueCategories,
  } = useMenuSearch(menuItems);

  // Additional filtering by search term
  const finalFilteredItems = filteredMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Statistics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const unavailableItems = menuItems.filter(item => !item.isAvailable).length;

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">จัดการเมนูอาหาร</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            จัดการเมนูอาหาร เพิ่ม แก้ไข และลบรายการอาหาร
          </p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-[#F38DA9] hover:bg-[#e37795] flex items-center gap-2 h-8 text-sm"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          เพิ่มเมนูใหม่
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <UtensilsCrossed className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">รายการทั้งหมด</p>
                <p className="text-xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">พร้อมจำหน่าย</p>
                <p className="text-xl font-bold text-gray-900">{availableItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <Package className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">ไม่พร้อมจำหน่าย</p>
                <p className="text-xl font-bold text-gray-900">{unavailableItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ค้นหาเมนู..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8"
                size="sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={searchCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSearchCategory("")}
                className={`text-xs h-8 px-2 ${searchCategory === "" ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}`}
              >
                ทั้งหมด ({menuItems.length})
              </Button>
              {getUniqueCategories().map((category) => (
                <Button
                  key={category}
                  variant={searchCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSearchCategory(category)}
                  className={`text-xs h-8 px-2 ${searchCategory === category ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}`}
                >
                  {category} ({menuItems.filter(item => item.category === category).length})
                </Button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600">
              แสดง {finalFilteredItems.length} จาก {menuItems.length} รายการ
              {searchTerm && ` สำหรับ "${searchTerm}"`}
              {searchCategory && ` ในหมวดหมู่ "${searchCategory}"`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-gray-900 text-xs">เมนู</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-900 text-xs">หมวดหมู่</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-900 text-xs">ราคา</th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-900 text-xs">สถานะ</th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-900 text-xs w-16">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {finalFilteredItems.length > 0 ? (
                    finalFilteredItems.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span className="font-semibold text-green-600 text-sm">
                            ฿{item.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Badge 
                            variant={item.isAvailable ? "default" : "destructive"}
                            className={`text-xs px-1.5 py-0.5 ${item.isAvailable 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isAvailable ? "พร้อม" : "หมด"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit className="w-3 h-3 mr-2" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(item._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <UtensilsCrossed className="w-6 h-6 text-gray-300" />
                          <p className="text-sm">
                            {searchTerm || searchCategory 
                              ? "ไม่พบเมนูที่ตรงกับการค้นหา" 
                              : "ยังไม่มีเมนูในระบบ"
                            }
                          </p>
                          {!searchTerm && !searchCategory && (
                            <Button 
                              onClick={handleAddNew}
                              className="bg-[#F38DA9] hover:bg-[#e37795] mt-2"
                              size="sm"
                            >
                              <Plus className="w-3 h-3 mr-2" />
                              เพิ่มเมนูแรก
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Grid view would go here
        <div>Grid view coming soon...</div>
      )}

      {showForm && (
        <AddEditMenuForm
          menu={editingMenu || undefined}
          onSuccess={handleFormSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}