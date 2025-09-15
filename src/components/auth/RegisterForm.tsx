"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone, Store, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantAddress: string;
  type: string;
  openingHours: {
    openTime: string;
    closeTime: string;
  };
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  onToggleMode: () => void;
  loading: boolean;
  error: string;
}

export function RegisterForm({ onSubmit, onToggleMode, loading, error }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    restaurantName: "",
    restaurantPhone: "",
    restaurantAddress: "",
    type: "",
    openingHours: {
      openTime: "",
      closeTime: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow rounded p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ลงทะเบียน</h1>
        <p className="text-gray-600">สร้างบัญชีใหม่สำหรับร้านอาหารของคุณ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-[#F38DA9]" />
              ข้อมูลส่วนตัว
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">ชื่อ-นามสกุล</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">เบอร์โทรศัพท์</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0xx-xxx-xxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">อีเมล</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm">รหัสผ่าน</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Store className="w-4 h-4 text-[#F38DA9]" />
              ข้อมูลร้านอาหาร
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="restaurantName" className="text-sm">ชื่อร้านอาหาร</Label>
                <div className="relative mt-1">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="restaurantName"
                    name="restaurantName"
                    placeholder="กรอกชื่อร้านอาหาร"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type" className="text-sm">ประเภทร้านอาหาร</Label>
                <div className="relative mt-1">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="type"
                    name="type"
                    placeholder="เช่น อาหารไทย, อาหารจีน"
                    value={formData.type}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="restaurantPhone" className="text-sm">เบอร์โทรร้าน</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="restaurantPhone"
                    name="restaurantPhone"
                    type="tel"
                    placeholder="0xx-xxx-xxxx"
                    value={formData.restaurantPhone}
                    onChange={handleChange}
                    className="pl-10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="restaurantAddress" className="text-sm">ที่อยู่ร้าน</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="restaurantAddress"
                    name="restaurantAddress"
                    placeholder="บ้านเลขที่ / ถนน / แขวง / เขต / จังหวัด"
                    value={formData.restaurantAddress}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="openTime" className="text-sm">เวลาเปิด</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="openTime"
                      name="openTime"
                      type="time"
                      value={formData.openingHours.openTime}
                      onChange={handleTimeChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="closeTime" className="text-sm">เวลาปิด</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="closeTime"
                      name="closeTime"
                      type="time"
                      value={formData.openingHours.closeTime}
                      onChange={handleTimeChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <Button 
            type="submit" 
            className="flex-1 bg-[#F38DA9] hover:bg-[#e37795]" 
            disabled={loading}
          >
            {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </Button>
          
          <div className="flex items-center justify-center text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{" "}
            <Button variant="link" onClick={onToggleMode} className="px-2">
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}