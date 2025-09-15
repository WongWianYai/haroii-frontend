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
    <table className="w-full border-collapse text-sm md:text-base">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left">ชื่ออาหาร</th>
          <th className="border px-4 py-2 text-left">ราคา (บาท)</th>
          <th className="border px-4 py-2 text-left">คำอธิบาย</th>
          <th className="border px-4 py-2 text-left">หมวดหมู่</th>
          <th className="border px-4 py-2 text-left">สต๊อก</th>
          <th className="border px-4 py-2 text-left">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">
                {item.isAvailable ? "มีอยู่" : "หมดสต๊อก"}
              </td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(item)}
                    title="แก้ไข"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDelete(item._id)}
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="border px-4 py-8 text-center text-gray-500">
              {searchCategory 
                ? `ไม่พบเมนูในหมวดหมู่ "${searchCategory}"` 
                : "ไม่มีรายการเมนู"
              }
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}