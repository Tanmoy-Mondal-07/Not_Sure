import mongoose from "mongoose";

const CommitSchema = new mongoose.Schema({
    repoId: { type: mongoose.Schema.Types.ObjectId, ref: "Repository" },
    message: String,
    author: String,
    date: Date,
    additions: { type: Number, default: 0 },
    deletions: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Commit || mongoose.model("Commit", CommitSchema);