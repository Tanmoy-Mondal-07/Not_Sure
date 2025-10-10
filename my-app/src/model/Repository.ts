import mongoose from "mongoose";

const RepositorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    fullName: String,
    description: String,
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    lastUpdated: Date,
}, { timestamps: true });

export default mongoose.models.Repository || mongoose.model("Repository", RepositorySchema);