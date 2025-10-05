import { z } from 'zod'

export const OtpSchema = z.object({
    pin: z.string().length(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})