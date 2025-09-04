"use client"
import React, {ChangeEvent, FormEvent, useState} from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
interface FormData{
    email : string,
    password: string,


}
function SignIn() {
    
    const [formData,setFormData] = useState<FormData>({
        email:"",
        password:""
    });

    const handleSubmit = async (e: React.FormEvent) => {
       
    };

        const handleChange = (e : ChangeEvent<HTMLInputElement> ) => {
            setFormData({...formData, [e.target.name]: e.target.value});
        }

    return (
       
        <>
            <div className="flex flex-col items-center justify-center min-h-screen  bg-white/10 ">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4  w-[341px] h-[568px]  max-sw-sm bg-white/6 p-6  shadow-lg text-center backdrop-blur-md border border-white/10 rounded-2xl blur-in-lg ">
                <h1 className="text-5xl f font-bold mb-7 mt-[60px]">Sign In</h1>
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
                        <div className='flex justify-between items-center'>
                            <div className="flex items-center gap-3">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">Remember me</Label>
                            </div>
                            <span className="text-gray-900 hover:underline cursor-pointer text-l ">Forgot Password</span>

                        </div>
                        
                  
                    {/* <button
                        type="submit"
                        className="bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition-colors font-semibold cursor-pointer text-xl"
                    >
                        Create Account
                    </button>
                    <Button asChild>
                        <Link href="/login">Create Account</Link>
                    </Button> */}
                    <Button className= "px-6 py-5 text-lg cursor-pointer " variant="outline">Log In</Button>
                    
     


        
                        <div className="text-gray-700">
                    <span>Don't have any account? </span>
                    <span className="text-gray-900 hover:underline cursor-pointer ">sign up</span>
                </div>
                </form>
                
            
                </div>
                </>
            
        
    );
};
export default SignIn;