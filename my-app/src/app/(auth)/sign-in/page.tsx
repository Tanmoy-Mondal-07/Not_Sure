"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schema/signInSchema"
import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import {
    Form, FormControl,
    FormField, FormItem,
    FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react';

function SignupPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        setIsSubmitting(true)
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast.error("Login Failed", {
                        description: 'Incorrect username or password',
                    })

                } else {
                    toast.error("Error", {
                        description: result.error,
                    })
                }
            }

            if (result?.url) {
                // router.replace('/dashboard');
            }
            // console.log(result);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-15">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Welcome Back
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full font-medium shadow-md" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-3 text-muted-foreground font-medium">Or</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full shadow-md">
                                <Github /> Continue with GitHub
                            </Button>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Don't have an account?{" "}
                                <a
                                    href="/signUp"
                                    className="font-medium text-indigo-600 hover:text-indigo-700 transition"
                                >
                                    SignUp
                                </a>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignupPage