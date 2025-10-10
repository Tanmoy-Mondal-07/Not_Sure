import mongoose from "mongoose";

const PullRequestSchema = new mongoose.Schema({
    repoId: { type: mongoose.Schema.Types.ObjectId, ref: "Repository" },
    title: String,
    author: String,
    status: String,
    createdAt: Date,
    mergedAt: Date,
}, { timestamps: true });

export default mongoose.models.PullRequest || mongoose.model("PullRequest", PullRequestSchema);
