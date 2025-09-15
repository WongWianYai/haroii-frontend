import { Card, CardContent } from "../ui/card";
import { UtensilsCrossed, Package } from "lucide-react";
import { MenuItem } from "@/types";

interface MenuStatsProps {
  menuItems: MenuItem[];
}

export default function MenuStats({ menuItems }: MenuStatsProps) {
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const unavailableItems = menuItems.filter(item => !item.isAvailable).length;

  return (
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
  );
}