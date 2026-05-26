import { promises as fs } from "fs";
import path from "path";
import type { RefreshLogEntry } from "@/lib/types/stock";

const LOG_PATH = path.join(process.cwd(), "data", "snapshots", "refresh-log.json");
const MAX_LOG_ENTRIES = 30;

async function ensureLogFile(): Promise<void> {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });

  try {
    await fs.access(LOG_PATH);
  } catch {
    await fs.writeFile(LOG_PATH, "[]");
  }
}

export async function readRefreshLogs(limit = 20): Promise<RefreshLogEntry[]> {
  try {
    await ensureLogFile();
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const logs = JSON.parse(raw) as RefreshLogEntry[];
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}

export async function readLatestRefreshLog(): Promise<RefreshLogEntry | null> {
  const logs = await readRefreshLogs(1);
  return logs[0] ?? null;
}

export async function appendRefreshLog(entry: RefreshLogEntry): Promise<void> {
  await ensureLogFile();
  const existing = await readRefreshLogs(MAX_LOG_ENTRIES);
  const next = [entry, ...existing].slice(0, MAX_LOG_ENTRIES);
  await fs.writeFile(LOG_PATH, JSON.stringify(next, null, 2));
}
