"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";

interface MenuFormProps {
  menu?: { _id: string; name: string; description: string; price: number; category: string; isAvailable: boolean};
  onSuccess?: () => void;
  onClose: () => void;
}

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

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md bg-white rounded shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">{menu ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}</h2>

        <div className="grid gap-2">
          <div>
            <Label htmlFor="name">ชื่อเมนู</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">รายละเอียด</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <Label htmlFor="price">ราคา</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="category">หมวดหมู่</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor= "isAvailable">Availability</Label>
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
            />
          </div>
          <div>
            <Label htmlFor="image">รูปภาพ</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit}>{menu ? "แก้ไข" : "เพิ่ม"}</Button>
        </div>
      </div>
    </>
  );
}
