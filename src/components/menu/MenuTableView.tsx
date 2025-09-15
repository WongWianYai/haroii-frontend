import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UtensilsCrossed
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem } from "@/types";

interface MenuTableViewProps {
  menuItems: MenuItem[];
  searchTerm: string;
  searchCategory: string;
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export default function MenuTableView({
  menuItems,
  searchTerm,
  searchCategory,
  onEdit,
  onDelete,
  onAddNew,
}: MenuTableViewProps) {
  return (
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
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
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
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="w-3 h-3 mr-2" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(item._id)}
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
                          onClick={onAddNew}
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
  );
}