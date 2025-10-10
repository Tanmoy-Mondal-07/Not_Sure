import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import GitHubProvider from "next-auth/providers/github";


export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error('no user found with this email')
                    }

                    if (!user.isVerified) {
                        throw new Error('please verify your account')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("incorrect password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt(args) {
            const { token, user, account, profile } = args

            //github provider
            if (account?.provider === "github") {
                await dbConnect();

                const email = profile?.email
                const username = profile?.login || profile?.name?.replace(/\s+/g, "_").toLowerCase()

                let dbUser = await UserModel.findOne({ email: profile?.email });

                if (!dbUser) {
                    dbUser = await UserModel.create({
                        email,
                        username,
                        isVerified: true,
                        password: "",
                        accounts: [
                            {
                                provider: "github",
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                token_type: account.token_type,
                                scope: account.scope,
                            },
                        ],
                    });
                } else {
                    dbUser.accounts.push({
                        provider: "github",
                        providerAccountId: account.providerAccountId,
                        access_token: account.access_token,
                        token_type: account.token_type,
                        scope: account.scope,
                    });
                    await dbUser.save();
                }
            }

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString()
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}