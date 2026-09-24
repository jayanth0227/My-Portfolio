import mongoose, { Schema, Model } from "mongoose";

export interface IMessage {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, default: "General Inquiry" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
