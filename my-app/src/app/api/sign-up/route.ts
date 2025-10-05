import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const findExistingUserWithUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })

        if (findExistingUserWithUsername) {
            return Response.json({
                success: false,
                message: "username is alredy taken"
            }, { status: 400 })
        }

        const findUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (findUserByEmail) {
            if (findUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user with email id alredy exist"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                findUserByEmail.username = username
                findUserByEmail.password = hashedPassword
                findUserByEmail.verifyCode = verifyCode
                findUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                findUserByEmail.save()
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "Please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.log('error regestring user :: ', error);
        return Response.json(
            {
                success: false,
                message: 'Error while registring user'
            }, {
            status: 500
        })
    }
}