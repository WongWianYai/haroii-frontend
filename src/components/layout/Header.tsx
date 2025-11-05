import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Settings,
    CreditCard,
    Cog,
    LogOut
} from "lucide-react";
import { TabType, Restaurant } from "@/types";
import { useState } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";

interface HeaderProps {
    restaurant: Restaurant;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function Header({ restaurant, activeTab, onTabChange }: HeaderProps) {
    const router = useRouter();
    
    const handleLogOut = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
      
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "ออกจากระบบไม่สำเร็จ");
            }
      
            const result = await res.json();
            console.log("logout success", result);
            router.push("/Auth");
        } catch (err: any) {
            console.error("Logout error:", err.message);
        }
    };
      
    return (
        <header className="w-full bg-[#F38DA9] px-4 py-2 flex flex-wrap items-center justify-between gap-2 fixed top-0 z-50">
            <div
                className="text-lg md:text-xl font-bold text-white order-1 md:order-none"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
                {"Haroii."}
            </div>
            <Menubar className="order-3 w-full md:order-2 md:w-auto bg-transparent border-none p-0 h-auto space-x-2">
                <MenubarMenu>
                    <MenubarTrigger
                        className={`cursor-pointer text-white hover:text-white/80 hover:bg-white/10 transition-colors px-2 py-1.5 rounded text-xs md:text-sm ${activeTab === 'orders' ? 'font-bold bg-white/20' : ''
                            }`}
                        onClick={() => onTabChange("orders")}
                    >
                        ออเดอร์
                    </MenubarTrigger>
                </MenubarMenu>
                
                <MenubarMenu>
                    <MenubarTrigger
                        className={`cursor-pointer text-white hover:text-white/80 hover:bg-white/10 transition-colors px-2 py-1.5 rounded text-xs md:text-sm ${activeTab === 'menu' ? 'font-bold bg-white/20' : ''
                            }`}
                        onClick={() => onTabChange("menu")}
                    >
                        จัดการรายการอาหาร
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger
                        className={`cursor-pointer text-white hover:text-white/80 hover:bg-white/10 transition-colors px-2 py-1.5 rounded text-xs md:text-sm ${activeTab === 'restaurant' ? 'font-bold bg-white/20' : ''
                            }`}
                        onClick={() => onTabChange("restaurant")}
                    >
                        ร้านอาหาร
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger className={`cursor-pointer text-white hover:text-white/80 hover:bg-white/10 transition-colors px-2 py-1.5 rounded text-xs md:text-sm ${activeTab === 'history' ? 'font-bold bg-white/20' : ''
                            }`}
                        onClick={() => onTabChange("history")}
                    >
                        รายงาน
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer text-white hover:text-white/80 hover:bg-white/10 transition-colors px-2 py-1.5 rounded text-xs md:text-sm">
                        บัญชี
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            <div className="flex items-center flex-shrink-0 order-2 md:order-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 font-medium text-white hover:bg-white/10 text-sm md:text-base px-3 py-2 rounded-lg cursor-pointer transition-colors">
                            <img
                                src="https://avatar.iran.liara.run/public"
                                alt="Profile Avatar"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                            />
                            <span className="truncate max-w-32 md:max-w-none">
                                {restaurant.name}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel className="flex items-center gap-2">
                            <img
                                src="https://avatar.iran.liara.run/public"
                                alt="Profile Avatar"
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            {restaurant.name}
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                การตั้งค่าบัญชี
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                การจ่ายเงิน
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Cog className="w-4 h-4" />
                                การตั้งค่า
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleLogOut} className="flex items-center gap-2 text-red-600">
                            <LogOut onClick={handleLogOut} className="w-4 h-4" />
                            ออกจากระบบ
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}