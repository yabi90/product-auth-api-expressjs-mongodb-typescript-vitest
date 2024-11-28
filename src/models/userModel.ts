import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface for the User document.
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: "user" | "admin"; 
}

/**
 * Schema for the User document.
 */
const userSchema = new Schema<IUser>(
  {
    /**
     * Email address of the user.
     */
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],  // Basic email validation
    },

    /**
     * Password of the user.
     */
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters long.'],
    },

    /**
     * Role of the user (defaults to 'user').
     */
    role: {
      type: String,
      enum: ["user", "admin"],  // Limit to 'user' or 'admin'
      default: "user", // Can be 'user', 'admin', etc.
    },
  },
  {
    /**
     * Automatically add createdAt and updatedAt timestamps to the document.
     */
    timestamps: true,
  }
);

/**
 * Mongoose model for the User document.
 */
export const User = mongoose.model<IUser>("User", userSchema);
