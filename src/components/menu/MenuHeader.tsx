import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuHeaderProps {
  onAddNew: () => void;
}

export default function MenuHeader({ onAddNew }: MenuHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-gray-900">จัดการเมนูอาหาร</h1>
        <p className="text-xs text-gray-600 mt-0.5">
          จัดการเมนูอาหาร เพิ่ม แก้ไข และลบรายการอาหาร
        </p>
      </div>
      <Button 
        onClick={onAddNew}
        className="bg-[#F38DA9] hover:bg-[#e37795] flex items-center gap-2 h-8 text-sm"
        size="sm"
      >
        <Plus className="w-4 h-4" />
        เพิ่มเมนูใหม่
      </Button>
    </div>
  );
}