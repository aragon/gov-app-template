import { type ICache } from "./ICache";
import { createClient, type VercelKV } from "@vercel/kv";

export default class VercelCache implements ICache {
  client: VercelKV;

  constructor() {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      throw new Error("Cache URL or token not found");
    }
    this.client = createClient({
      url,
      token,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!ttl) {
      this.client.set<T>(key, value);
    } else {
      this.client.set<T>(key, value, { ex: ttl });
    }
  }

  async remove(keys_pattern: string): Promise<number> {
    const keys = await this.client.keys(keys_pattern);
    const res = await Promise.all(
      keys.map((key) => {
        return this.client.del(key);
      })
    );
    return res.reduce((acc, val) => acc + val, 0);
  }

  async clear(): Promise<void> {
    this.client.flushdb();
  }
}
