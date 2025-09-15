import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { TabType, Restaurant } from "@/types";

interface HeaderProps {
  restaurant: Restaurant;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Header({ restaurant, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="w-full bg-[#F38DA9] px-4 py-2 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
          CS
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-1 font-medium bg-[#F38DA9] text-white hover:bg-[#e37795] text-sm md:text-base">
              {restaurant.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>{restaurant.name}</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>การตั้งค่าบัญชี</DropdownMenuItem>
              <DropdownMenuItem>การจ่ายเงิน</DropdownMenuItem>
              <DropdownMenuItem>การตั้งค่า</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem>ออกจากระบบ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NavigationMenu className="order-3 w-full md:order-none md:w-auto">
        <NavigationMenuList className="flex flex-col md:flex-row md:gap-4 w-full md:w-auto text-sm md:text-base">
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={`cursor-pointer ${activeTab === 'menu' ? 'font-bold' : ''}`}
              onSelect={() => onTabChange("menu")}
            >
              จัดการรายการอาหาร
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={`cursor-pointer ${activeTab === 'restaurant' ? 'font-bold' : ''}`}
              onSelect={() => onTabChange("restaurant")}
            >
              ร้านอาหาร
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="cursor-pointer">รายงาน</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="cursor-pointer">จัดการร้านอาหาร</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="cursor-pointer">บัญชี</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div 
        className="text-lg md:text-xl font-bold text-white order-2 md:order-none" 
        style={{ fontFamily: '"IBM Plex Mono", monospace' }}
      >
        {process.env.NEXT_PUBLIC_APP_NAME || "Haroii."}
      </div>
    </header>
  );
}