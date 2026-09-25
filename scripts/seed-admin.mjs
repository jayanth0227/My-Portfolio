import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors
}

// Read .env or .env.local
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(__dirname, "..", file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "jayanthyeswanth9@gmail.com")
  .toLowerCase()
  .trim();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "jayanthyeswanth9@gmail.com")
  .toLowerCase()
  .trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jayanth@2003";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set!");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("Connected to MongoDB successfully!");

    let existing = await Admin.findOne({
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!existing) {
      const newAdmin = await Admin.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Successfully created admin in MongoDB:", {
        id: newAdmin._id,
        email: newAdmin.email,
        username: newAdmin.username,
        role: newAdmin.role,
      });
    } else {
      existing.username = ADMIN_USERNAME;
      existing.email = ADMIN_EMAIL;
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      console.log("Successfully synced admin in MongoDB:", {
        id: existing._id,
        email: existing.email,
        username: existing.username,
        role: existing.role,
      });
    }

    const count = await Admin.countDocuments();
    console.log(`Total admin users in MongoDB: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin in MongoDB:", error);
    process.exit(1);
  }
}

seed();
