"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { API_URL } from '@/config';

import Link from "next/link";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const handleSubmit =  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isRegister &&formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError("");
    try {
    const res = await fetch(`${API_URL}/auth/${isRegister ? 'login' : 'register-restaurant'}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers if needed
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })
    });
    if(!res.ok){
      const err = await res.json();
      throw new Error(err.message || (!isRegister ? "Sign up failed" : "Login failed"));
    }
    const data = await res.json();
    console.log("success" , data);


    alert("Signup successful!");
  } catch(err: any){
    setError(err.message)

  }
  finally{
    setLoading((false));
  }
}

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  bg-white/10 ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4  w-[341px] h-[568px]  max-sw-sm bg-white/6 p-6  shadow-lg text-center backdrop-blur-md border border-white/10 rounded-2xl blur-in-lg "
        >
          <h1 className="text-5xl f font-bold mb-7 mt-[60px]">
            {!isRegister ? "Sign Up" : "Sign In"}
          </h1>
          {error && <h2 className="text-red-400 text-l">{error}</h2>}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-1.5"
          />
          
          {!isRegister && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          )}

          {/* <button
                        type="submit"
                        className="bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition-colors font-semibold cursor-pointer text-xl"
                    >
                        Create Account
                    </button>
                    <Button asChild>
                        <Link href="/login">Create Account</Link>
                    </Button> */}
          <Button className="px-6 py-6 text-lg " variant="outline">
            {!isRegister ? "Create Account" : "Log-In"}
          </Button>
          {isRegister && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Remember me</Label>
              </div>
              {/* <span className="text-gray-900 hover:underline cursor-pointer text-l ">
                Forgot Password
              </span> */}
              <Button variant="link">Forgot Password</Button>
            </div>
          )}

          <div className="text-gray-700">
            <span>
              {!isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
            </span>
            <span
              className="text-gray-900 hover:underline cursor-pointer  "
              onClick={() => setIsRegister(!isRegister)}
            >
               {!isRegister ?  <Button variant="link">Sign in</Button> :  <Button variant="link">Sign up</Button>}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}


export default SignUp;
