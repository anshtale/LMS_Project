"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const NavbarRoutes = ()=>{
    const pathname = usePathname();
    // const router = useRouter(); 

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname.includes("/chapter");

    return(
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href={"/"}>
                    <Button size="sm" variant="outline">
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                </Link>
            ):(
                <Button size="sm" variant="outline"  asChild>
                    <Link href="/teacher/courses">Teacher Mode</Link>
                </Button>
            )}
            <UserButton
                afterSignOutUrl="/"
            />

        </div>
    )
}