import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: function() { return !this.googleId; } },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } },
    googleId: { type: String },
    name: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
