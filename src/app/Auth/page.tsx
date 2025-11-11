"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { API_URL } from "@/config";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
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

function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      const result = await res.json();
      console.log("Login success", result);
      router.push("/MenuManagement");
    } catch (err: unknown) {
        if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error");
  }
} 
     finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setError("");

    const bodyData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      restaurantName: data.restaurantName,
      restaurantPhone: data.restaurantPhone,
      restaurantAddress: data.restaurantAddress,
      type: data.type,
      openTime: data.openingHours.openTime,
      closeTime: data.openingHours.closeTime,
    };

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register-restaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "ลงทะเบียนไม่สำเร็จ");
      }

      const result = await res.json();
      console.log("Register success", result);
      setIsLogin(true); // Switch to login form after successful registration
    } catch (err: unknown) {
       if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error");
  }
} finally {
  setLoading(false);
    } 
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(""); // Clear error when switching modes
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {isLogin ? (
          <LoginForm
            onSubmit={handleLogin}
            onToggleMode={toggleMode}
            loading={loading}
            error={error}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onToggleMode={toggleMode}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

export default Auth;
