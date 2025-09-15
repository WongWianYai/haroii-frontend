import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";
import { Search } from "lucide-react";
import { MenuItem } from "@/types";

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
          <div className="flex gap-1 flex-wrap">
            <Button
              variant={searchCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange("")}
              className={`text-xs h-8 px-2 ${searchCategory === "" ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}`}
            >
              ทั้งหมด ({menuItems.length})
            </Button>
            {uniqueCategories.map((category) => (
              <Button
                key={category}
                variant={searchCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
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
            แสดง {filteredCount} จาก {menuItems.length} รายการ
            {searchTerm && ` สำหรับ "${searchTerm}"`}
            {searchCategory && ` ในหมวดหมู่ "${searchCategory}"`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}