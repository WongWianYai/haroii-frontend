import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { User, Store, Clock, Mail, Phone, MapPin, Tag, Edit3, Save, X } from "lucide-react";
import { Restaurant, Owner } from "@/types";

interface RestaurantFormProps {
    restaurant: Restaurant;
    owner: Owner;
    isEdit: boolean;
    onRestaurantChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOwnerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onDiscard: () => void;
    onToggleEdit: () => void;
}

export default function RestaurantForm({
    restaurant,
    owner,
    isEdit,
    onRestaurantChange,
    onOwnerChange,
    onSave,
    onDiscard,
    onToggleEdit,
}: RestaurantFormProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">การจัดการข้อมูลร้านอาหาร</h1>
                    <p className="text-sm text-gray-600 mt-1">จัดการข้อมูลร้านอาหารและเจ้าของร้าน</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleEdit}
                    className="flex items-center gap-2"
                >
                    <Edit3 className="w-4 h-4" />
                    {isEdit ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Owner Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-[#F38DA9]" />
                            ข้อมูลเจ้าของร้าน
                        </CardTitle>
                        <CardDescription>
                            ข้อมูลส่วนตัวของเจ้าของร้านอาหาร
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="owner-email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="w-4 h-4 text-gray-500" />
                                อีเมล
                            </Label>
                            <Input
                                id="owner-email"
                                type="email"
                                name="email"
                                value={owner?.email || ""}
                                onChange={onOwnerChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="owner-name" className="flex items-center gap-2 text-sm font-medium">
                                <User className="w-4 h-4 text-gray-500" />
                                ชื่อเจ้าของร้าน
                            </Label>
                            <Input
                                id="owner-name"
                                type="text"
                                name="name"
                                value={owner?.name || ""}
                                onChange={onOwnerChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="ชื่อ-นามสกุล"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="owner-phone" className="flex items-center gap-2 text-sm font-medium">
                                <Phone className="w-4 h-4 text-gray-500" />
                                เบอร์โทรศัพท์
                            </Label>
                            <Input
                                id="owner-phone"
                                type="tel"
                                name="phone"
                                value={owner?.phone || ""}
                                onChange={onOwnerChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="0xx-xxx-xxxx"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Restaurant Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Store className="w-5 h-5 text-[#F38DA9]" />
                            ข้อมูลร้านอาหาร
                        </CardTitle>
                        <CardDescription>
                            ข้อมูลทั่วไปของร้านอาหาร
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant-name" className="flex items-center gap-2 text-sm font-medium">
                                <Store className="w-4 h-4 text-gray-500" />
                                ชื่อร้านอาหาร
                            </Label>
                            <Input
                                id="restaurant-name"
                                type="text"
                                name="name"
                                value={restaurant.name}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="ชื่อร้านอาหาร"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="restaurant-address" className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                ที่อยู่ร้านอาหาร
                            </Label>
                            <Input
                                id="restaurant-address"
                                type="text"
                                name="address"
                                value={restaurant.address || ""}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="ที่อยู่ร้านอาหาร"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="restaurant-phone" className="flex items-center gap-2 text-sm font-medium">
                                <Phone className="w-4 h-4 text-gray-500" />
                                เบอร์โทรร้านอาหาร
                            </Label>
                            <Input
                                id="restaurant-phone"
                                type="text"
                                name="phone"
                                value={restaurant.phone || ""}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="0xx-xxx-xxxx"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="restaurant-type" className="flex items-center gap-2 text-sm font-medium">
                                <Tag className="w-4 h-4 text-gray-500" />
                                ประเภทร้านอาหาร
                            </Label>
                            <Input
                                id="restaurant-type"
                                type="text"
                                name="type"
                                value={restaurant.type}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                                placeholder="เช่น อาหารไทย, อาหารญี่ปุ่น"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Operating Hours Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-[#F38DA9]" />
                        เวลาทำการ
                    </CardTitle>
                    <CardDescription>
                        กำหนดเวลาเปิด-ปิดร้านอาหาร
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant-open-time" className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4 text-gray-500" />
                                เวลาเปิด
                            </Label>
                            <Input
                                id="restaurant-open-time"
                                type="time"
                                name="openTime"
                                value={restaurant.openTime}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="restaurant-close-time" className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4 text-gray-500" />
                                เวลาปิด
                            </Label>
                            <Input
                                id="restaurant-close-time"
                                type="time"
                                name="closeTime"
                                value={restaurant.closeTime}
                                onChange={onRestaurantChange}
                                disabled={!isEdit}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEdit && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={onDiscard}
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={onSave}
                        className="bg-[#F38DA9] hover:bg-[#e37795] flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </div>
            )}
        </div>
    );
}