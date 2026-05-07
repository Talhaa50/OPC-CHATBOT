import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "data", "bot-config.json");

function readConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function writeConfig(config) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// GET — read config
export async function GET(req) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(readConfig());
}

// POST — save config
export async function POST(req) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  writeConfig(body);
  return Response.json({ success: true });
}