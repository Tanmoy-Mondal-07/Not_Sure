"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/schema/signUpSchema"
import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

function SignupPage() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            if (response.data.success) {

                toast.success("Account created", {
                    description: "Please verify your email to continue.",
                });

            } else {
                toast.error("Faild to create account", {
                    description: response.data.message,
                })
            }
            router.replace(`/verify/${data.username}`);
        } catch (error) {
            toast.error("Signup failed", {
                description: "Something went wrong. Please try again later.",
            });
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:pt-15">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Create an Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            This will be your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
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
                                    'Sign Up'
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

                            <Button onClick={() => signIn("github")} variant="outline" className="w-full shadow-md">
                                <Github /> Continue with GitHub
                            </Button>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Already have an account?{" "}
                                <a
                                    href="/sign-in"
                                    className="font-medium text-indigo-600 hover:text-indigo-700 transition"
                                >
                                    Login
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