
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";
import { Search } from "lucide-react";
import { MenuItem } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchCategory: string;
  onCategoryChange: (category: string) => void;
  menuItems: MenuItem[];
  uniqueCategories: string[];
  filteredCount: number;
}

export default function MenuSearchFilter({
  searchTerm,
  onSearchChange,
  searchCategory,
  onCategoryChange,
  menuItems,
  uniqueCategories,
  filteredCount,
}: MenuSearchFilterProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ค้นหาเมนู..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-8"
            />
          </div>

          {/* Category Filter */}
          <div className="w-[200px]">
            <Select 
              value={searchCategory || "all"} 
              onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  ทั้งหมด ({menuItems.length})
                </SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category} ({menuItems.filter(item => item.category === category).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600">
            แสดง {filteredCount} จาก {menuItems.length} รายการ
            {searchTerm && ` สำหรับ "${searchTerm}"`}
            {searchCategory && ` ในหมวดหมู่ "${searchCategory}"`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}