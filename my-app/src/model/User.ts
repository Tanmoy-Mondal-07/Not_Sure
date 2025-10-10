import mongoose, { Schema, Document } from "mongoose";

export interface GitHubStats {
    totalCommits: number;
    totalPRs: number;
    totalStars: number;
    lastUpdated: Date;
}

export interface Account {
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    image?: string;
    accounts: Account[];
    githubStats?: GitHubStats;
    createdAt: Date;
    updatedAt: Date;
}

const AccountSchema: Schema<Account> = new Schema({
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: { type: String },
    refresh_token: { type: String },
    token_type: { type: String },
    scope: { type: String },
}, { _id: false });

const GitHubStatsSchema: Schema<GitHubStats> = new Schema({
    totalCommits: { type: Number, default: 0 },
    totalPRs: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use valid email address"]  //rajax
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    accounts: [AccountSchema],
    githubStats: GitHubStatsSchema,

}, { timestamps: true })

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;