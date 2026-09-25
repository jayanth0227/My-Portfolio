import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import Admin, { IAdmin } from "@/models/Admin";

export interface AdminCredentials {
  username: string;
  email: string;
  password: string;
}

export function getEnvAdminCredentials(): AdminCredentials {
  const username =
    process.env.ADMIN_USERNAME ||
    process.env.ADMIN_EMAIL ||
    "jayanthyeswanth9@gmail.com";
  const email =
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_USERNAME ||
    "jayanthyeswanth9@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "jayanth@2003";

  return { username, email, password };
}

/**
 * Ensures the admin record from .env is synced/stored into MongoDB.
 */
export async function syncAdminToDatabase(): Promise<IAdmin | null> {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.warn("Database connection unavailable for admin sync.");
      return null;
    }

    const { username, email, password } = getEnvAdminCredentials();
    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check if an admin exists with this email or username
    let admin = await Admin.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await Admin.create({
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin user '${cleanEmail}' created in MongoDB.`);
    } else {
      // Check if current password matches (either direct hash comparison or plaintext)
      let matches = false;
      if (admin.password === password) {
        matches = true;
      } else {
        matches = await bcrypt.compare(password, admin.password).catch(() => false);
      }

      if (!matches) {
        admin.password = await bcrypt.hash(password, 10);
        admin.username = cleanUsername;
        admin.email = cleanEmail;
        await admin.save();
        console.log(`Admin user '${cleanEmail}' password synced in MongoDB.`);
      }
    }

    return admin;
  } catch (error) {
    console.error("Error syncing admin to MongoDB:", error);
    return null;
  }
}

/**
 * Verifies credentials against MongoDB (with fallback to .env).
 */
export async function verifyAdminCredentials(
  identifier: string,
  rawPassword: string
): Promise<{
  valid: boolean;
  user?: { email: string; username: string; role: string };
  error?: string;
}> {
  if (!identifier || !rawPassword) {
    return { valid: false, error: "Username/email and password are required." };
  }

  const cleanId = identifier.toLowerCase().trim();
  const envCreds = getEnvAdminCredentials();

  // Ensure DB has the admin stored
  await syncAdminToDatabase();

  // Check in MongoDB
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const admin = await Admin.findOne({
        $or: [{ email: cleanId }, { username: cleanId }],
      });

      if (admin) {
        let passwordMatches = false;
        if (admin.password === rawPassword) {
          passwordMatches = true;
        } else {
          passwordMatches = await bcrypt
            .compare(rawPassword, admin.password)
            .catch(() => false);
        }

        if (passwordMatches) {
          return {
            valid: true,
            user: {
              email: admin.email,
              username: admin.username,
              role: admin.role,
            },
          };
        }
      }
    }
  } catch (err) {
    console.error("DB check failed during login, checking .env fallback:", err);
  }

  // Direct .env fallback check (in case DB query failed or network glitch)
  const isEnvUser =
    cleanId === envCreds.email.toLowerCase().trim() ||
    cleanId === envCreds.username.toLowerCase().trim();

  if (isEnvUser && rawPassword === envCreds.password) {
    return {
      valid: true,
      user: {
        email: envCreds.email,
        username: envCreds.username,
        role: "admin",
      },
    };
  }

  return {
    valid: false,
    error: "Invalid credentials. Please check your email/username and password.",
  };
}
