"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  UtensilsCrossed,
  FileText,
  DollarSign,
  Tag,
  Image,
  CheckCircle,
  Save,
  X,
  Plus
} from "lucide-react";
import { apiClient } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuFormProps {
  menu?: { _id: string; name: string; description: string; price: number; category: string; isAvailable: boolean };
  onSuccess?: () => void;
  onClose: () => void;
}

const MENU_CATEGORIES = [
  "เซ็ทอาหาร",
  "อาหารจานเดียว",
  "เครื่องดื่ม",
  "ของหวาน",
  "ของทานเล่น",
  "ท็อปปิ้ง",
  "อื่นๆ"
] as const;

export default function MenuForm({ menu, onSuccess, onClose }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: menu?.name || "",
    description: menu?.description || "",
    price: menu?.price.toString() || "",
    category: menu?.category || "",
    image: null as File | null,
    isAvailable: menu?.isAvailable ?? true,
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        price: menu.price.toString(),
        category: menu.category,
        image: null,
        isAvailable: menu.isAvailable,
      });
    }
  }, [menu]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("isAvailable", String(formData.isAvailable));
      if (formData.image) form.append("image", formData.image);

      if (menu) {
        await apiClient.updateMenuItem(menu._id, form);
      } else {
        await apiClient.createMenuItem(form);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกเมนู");
    }
  };
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="mx-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {menu ? (
                  <UtensilsCrossed className="w-6 h-6 text-[#F38DA9]" />
                ) : (
                  <Plus className="w-6 h-6 text-[#F38DA9]" />
                )}
                <div>
                  <CardTitle className="text-xl">
                    {menu ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
                  </CardTitle>
                  <CardDescription>
                    {menu ? "แก้ไขข้อมูลเมนูอาหาร" : "เพิ่มเมนูอาหารใหม่ลงในระบบ"}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#F38DA9]" />
                ข้อมูลพื้นฐาน
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <UtensilsCrossed className="w-4 h-4 text-gray-500" />
                    ชื่อเมนู
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="ชื่อเมนูอาหาร"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="w-4 h-4 text-gray-500" />
                    หมวดหมู่
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-gray-500" />
                  รายละเอียด
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="อธิบายรายละเอียดของเมนู เช่น ส่วนผสม วิธีการทำ"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Price and Availability */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#F38DA9]" />
                ราคาและสถานะ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    ราคา (บาท)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isAvailable" className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    สถานะ
                  </Label>
                  <div className="flex items-center space-x-3 pt-2">
                    <Switch
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isAvailable: checked })
                      }
                      className="data-[state=checked]:bg-[#F38DA9]"
                    />
                    <span className="text-sm text-gray-600">
                      {formData.isAvailable ? "พร้อมจำหน่าย" : "ไม่พร้อมจำหน่าย"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-[#F38DA9]" />
                รูปภาพ
              </h3>

              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-2 text-sm font-medium">
                  <Image className="w-4 h-4 text-gray-500" />
                  อัปโหลดรูปภาพเมนู
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#F38DA9] hover:bg-[#e37795] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {menu ? "บันทึกการแก้ไข" : "เพิ่มเมนู"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
