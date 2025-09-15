import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItem } from "@/types";
import { MESSAGES } from "@/constants/messages";

interface MenuSearchProps {
    searchCategory: string;
    onSearchChange: (searchTerm: string) => void;
    filteredCount: number;
    menuItems: MenuItem[];
    uniqueCategories: string[];
}

export default function MenuSearch({
    searchCategory,
    onSearchChange,
    filteredCount,
    menuItems,
    uniqueCategories,
}: MenuSearchProps) {
    return (
        <>
            {/* Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <Label htmlFor="categorySearch" className="text-sm font-medium">
                    {MESSAGES.SEARCH_BY_CATEGORY}
                </Label>
                <div className="relative flex-1 max-w-md">
                    <Input
                        id="categorySearch"
                        type="text"
                        placeholder={MESSAGES.SEARCH_PLACEHOLDER}
                        value={searchCategory}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full"
                    />
                    {searchCategory && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => onSearchChange("")}
                        >
                            ×
                        </Button>
                    )}
                </div>
                {searchCategory && (
                    <span className="text-sm text-gray-600">
                        {MESSAGES.FOUND_ITEMS} {filteredCount} {MESSAGES.ITEMS_UNIT}
                    </span>
                )}
            </div>

            {/* Category suggestions */}
            {uniqueCategories.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{MESSAGES.AVAILABLE_CATEGORIES}</p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={searchCategory === "" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSearchChange("")}
                            className={`text-xs ${searchCategory === ""
                                ? "bg-[#F38DA9] hover:bg-[#e37795] text-white"
                                : "hover:bg-[#F38DA9]/10"
                                }`}
                        >
                            {MESSAGES.ALL_CATEGORIES} ({menuItems.length})
                        </Button>
                        {uniqueCategories.map((category) => (
                            <Button
                                key={category}
                                variant={searchCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => onSearchChange(category)}
                                className={`text-xs ${searchCategory === category
                                    ? "bg-[#F38DA9] hover:bg-[#e37795] text-white"
                                    : "hover:bg-[#F38DA9]/10"
                                    }`}
                            >
                                {category} ({menuItems.filter(item => item.category === category).length})
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}