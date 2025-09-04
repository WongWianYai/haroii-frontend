"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

function Auth() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/auth/${isRegister ? "login" : "register-restaurant"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add CORS headers if needed
          },
          credentials: "include", // Important for cookies
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.message || (!isRegister ? "Sign up failed" : "Login failed")
        );
      }
      const data = await res.json();
      console.log("success", data);

      alert("Signup successful!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  bg-white/10 ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center">
          <h1 className="text-5xl f font-bold mb-7 mt-[60px]">
            {!isRegister ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
          </h1>
          {error && <h2 className="text-red-400 text-l">{error}</h2>}
          {!isRegister && (
            <input
              type="text"
              name="name"
              placeholder="ชื่อ-นามสกุล"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
          />
          <div className="relative w-80">
            <input
              type={showPassword ? "text":"password"}
              name="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ?  <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {!isRegister && (
            <input
              type="tel"
              name="phone"
              placeholder="0xx-xxx-xxxx"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
            />
          )}

          <Button className="px-6 py-6 text-lg " variant="outline">
            {!isRegister ? "สร้างบัญชี" : "ล็อคอิน"}
          </Button>
          {isRegister && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">จำการเข้าสู่ระบบ</Label>
              </div>
              {/* <span className="text-gray-900 hover:underline cursor-pointer text-l ">
                Forgot Password
              </span> */}
              <Button variant="link">ลืมรหัสผ่าน</Button>
            </div>
          )}

          <div className="text-gray-700 text-center">
            <span>
              {!isRegister ? "มีบัญชีอยู่แล้ว ? " : "ยังไม่ได้สร้างบัญชี ?"}
            </span>
            <span
              className="text-gray-900 hover:underline cursor-pointer  "
              onClick={() => setIsRegister(!isRegister)}
            >
              {!isRegister ? (
                <Button variant="link">เข้าสู่ระบบ</Button>
              ) : (
                <Button variant="link">ลงทะเบียน</Button>
              )}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Auth;
