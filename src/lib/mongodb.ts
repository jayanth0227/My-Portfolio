import mongoose from "mongoose";
import { Resolver } from "dns/promises";

// Fallback known hosts for portfolio cluster in case local DNS fails SRV lookup
const FALLBACK_SHARDS = [
  "ac-rphhcdq-shard-00-00.3qvinfd.mongodb.net:27017",
  "ac-rphhcdq-shard-00-01.3qvinfd.mongodb.net:27017",
  "ac-rphhcdq-shard-00-02.3qvinfd.mongodb.net:27017",
];
const FALLBACK_REPLICA_SET = "atlas-fwco1i-shard-0";

/**
 * Resolves mongodb+srv:// URIs using custom DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1)
 * or known replica set hosts to permanently eliminate Windows/ISP "querySrv ECONNREFUSED" errors.
 */
async function resolveMongoUri(rawUri: string): Promise<string> {
  if (!rawUri || !rawUri.startsWith("mongodb+srv://")) {
    return rawUri;
  }

  try {
    const parsed = new URL(rawUri.replace("mongodb+srv://", "http://"));
    const host = parsed.hostname;

    let hostsStr = "";
    let replicaSet = "";
    let authSource = "admin";

    try {
      const resolver = new Resolver();
      resolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
      const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
      if (srvRecords && srvRecords.length > 0) {
        hostsStr = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
      }
      try {
        const txtRecords = await resolver.resolveTxt(host);
        if (txtRecords && txtRecords.length > 0) {
          const txt = txtRecords.flat().join("&");
          const params = new URLSearchParams(txt);
          if (params.get("replicaSet")) replicaSet = params.get("replicaSet")!;
          if (params.get("authSource")) authSource = params.get("authSource")!;
        }
      } catch {
        // ignore TXT resolution error
      }
    } catch {
      // ignore SRV error, fallback will be used
    }

    if (!hostsStr) {
      if (host.includes("portfolio.3qvinfd.mongodb.net")) {
        hostsStr = FALLBACK_SHARDS.join(",");
        replicaSet = FALLBACK_REPLICA_SET;
      } else {
        return rawUri;
      }
    }

    const auth = parsed.username
      ? `${encodeURIComponent(decodeURIComponent(parsed.username))}${
          parsed.password ? `:${encodeURIComponent(decodeURIComponent(parsed.password))}` : ""
        }@`
      : "";

    const pathname = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "/portfolio";

    const searchParams = new URLSearchParams(parsed.search);
    searchParams.set("ssl", "true");
    if (replicaSet) searchParams.set("replicaSet", replicaSet);
    if (authSource) searchParams.set("authSource", authSource);

    return `mongodb://${auth}${hostsStr}${pathname}?${searchParams.toString()}`;
  } catch (err) {
    console.warn("Could not transform mongodb+srv URI, falling back to original:", err);
    return rawUri;
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.warn("MONGODB_URI is not defined in environment variables. Database operations will be bypassed or fallback to mock data.");
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = (async () => {
      const finalUri = await resolveMongoUri(rawUri);
      return mongoose.connect(finalUri, opts);
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
