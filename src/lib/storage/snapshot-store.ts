import { promises as fs } from "fs";
import path from "path";
import type {
  DashboardKind,
  DashboardMeta,
  DashboardSnapshot,
} from "@/lib/types/stock";

const DATA_DIR = path.join(process.cwd(), "data", "snapshots");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function snapshotPath(kind: DashboardKind): string {
  return path.join(DATA_DIR, `${kind}.json`);
}

function metaPath(): string {
  return path.join(DATA_DIR, "meta.json");
}

const defaultMeta: DashboardMeta = {
  globalUpdatedAt: null,
  israelUpdatedAt: null,
  lastRefreshAttemptAt: null,
  lastRefreshStatus: "idle",
};

export async function readSnapshot(
  kind: DashboardKind,
): Promise<DashboardSnapshot | null> {
  try {
    const raw = await fs.readFile(snapshotPath(kind), "utf8");
    return JSON.parse(raw) as DashboardSnapshot;
  } catch {
    return null;
  }
}

export async function writeSnapshot(
  snapshot: DashboardSnapshot,
): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(snapshotPath(snapshot.kind), JSON.stringify(snapshot, null, 2));
}

export async function readMeta(): Promise<DashboardMeta> {
  try {
    const raw = await fs.readFile(metaPath(), "utf8");
    return { ...defaultMeta, ...(JSON.parse(raw) as DashboardMeta) };
  } catch {
    return defaultMeta;
  }
}

export async function writeMeta(meta: DashboardMeta): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(metaPath(), JSON.stringify(meta, null, 2));
}

export async function persistRefreshResults(
  snapshots: DashboardSnapshot[],
  status: DashboardMeta["lastRefreshStatus"],
): Promise<DashboardMeta> {
  const now = new Date().toISOString();

  for (const snapshot of snapshots) {
    await writeSnapshot(snapshot);
  }

  const meta: DashboardMeta = {
    globalUpdatedAt:
      snapshots.find((snapshot) => snapshot.kind === "global")?.updatedAt ??
      (await readMeta()).globalUpdatedAt,
    israelUpdatedAt:
      snapshots.find((snapshot) => snapshot.kind === "israel")?.updatedAt ??
      (await readMeta()).israelUpdatedAt,
    lastRefreshAttemptAt: now,
    lastRefreshStatus: status,
  };

  await writeMeta(meta);
  return meta;
}
