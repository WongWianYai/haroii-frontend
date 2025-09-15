import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@/types";

interface MenuTableProps {
  menuItems: MenuItem[];
  searchCategory: string;
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
}

export default function MenuTable({ 
  menuItems, 
  searchCategory, 
  onEdit, 
  onDelete 
}: MenuTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left font-semibold text-xs w-1/5">ชื่ออาหาร</th>
            <th className="border px-3 py-2 text-left font-semibold text-xs w-1/8">ราคา (บาท)</th>
            <th className="border px-3 py-2 text-left font-semibold text-xs w-2/5">คำอธิบาย</th>
            <th className="border px-3 py-2 text-left font-semibold text-xs w-1/6">หมวดหมู่</th>
            <th className="border px-3 py-2 text-left font-semibold text-xs w-1/8">สต๊อก</th>
            <th className="border px-3 py-2 text-left font-semibold text-xs w-1/6">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="border px-3 py-1.5 font-medium text-sm">{item.name}</td>
                <td className="border px-3 py-1.5 text-right font-semibold text-green-600 text-sm">
                  ฿{item.price.toLocaleString()}
                </td>
                <td className="border px-3 py-1.5 text-gray-700 text-sm leading-tight">
                  {item.description}
                </td>
                <td className="border px-3 py-1.5">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </td>
                <td className="border px-3 py-1.5">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                    item.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {item.isAvailable ? "มีอยู่" : "หมดสต๊อก"}
                  </span>
                </td>
                <td className="border px-3 py-1.5">
                  <div className="flex gap-1 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(item)}
                      title="แก้ไข"
                      className="hover:bg-blue-50 hover:border-blue-300 h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => onDelete(item._id)}
                      title="ลบ"
                      className="hover:bg-red-600 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border px-3 py-6 text-center text-gray-500 text-sm">
                {searchCategory 
                  ? `ไม่พบเมนูในหมวดหมู่ "${searchCategory}"` 
                  : "ไม่มีรายการเมนู"
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}