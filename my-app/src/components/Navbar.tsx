"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="w-full max-h-15 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-gray-900">
                        NoName
                    </span>
                </div>

                <section className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 mx-5">
                        {links.map(({ href, label }) => (
                            <Button
                                key={href}
                                variant={pathname === href ? "secondary" : "ghost"}
                                asChild
                            >
                                <Link href={href}>{label}</Link>
                            </Button>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <Button variant="default" >
                            Login
                        </Button>
                    </div>

                    <div className="md:hidden">
                        <SidebarTrigger />
                    </div>
                </section>
            </div>
        </nav >
    );
}
