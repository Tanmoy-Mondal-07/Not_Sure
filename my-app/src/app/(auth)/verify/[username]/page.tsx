"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { OtpSchema } from "@/schema/otpSchema"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import z from "zod"
import { useParams } from "next/navigation"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/router"
import { ApiResponse } from "@/types/ApiResponse"

export default function InputOTPForm() {
    const prams = useParams<{ username: string }>()
    const router = useRouter()

    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data: z.infer<typeof OtpSchema>) {
        try {
            const response = await axios.post('/api/verify_user', {
                username: prams.username,
                code: data.pin
            })

            toast("Success", {
                description: response.data.message,
            })
            router.replace('sign-in')
        } catch (error) {
            console.log("error in verifing otp user");
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMassage = axiosError.response?.data.message

            toast.error("sign up faild", {
                description: errorMassage,
            })
        }

        // toast("You submitted the following values", {
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Verify Your Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your phone.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
