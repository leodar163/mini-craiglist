'use client';

import LoginForm from "@/app/login/components/login-form";
import {useState} from "react";
import RegisterForm from "./components/register-form";

export default function LoginPage() {
    const [register, setRegister] = useState(false)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {
                !register ?
                    <LoginForm onRegisterButtonHit={() => setRegister(true)}/>
                    : <RegisterForm onRegisterButtonHit={() => setRegister(false)}/>
            }
        </div>
    )
}