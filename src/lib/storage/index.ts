// Static imports — dynamic require() of drivers breaks in the Turbopack
// standalone runtime ("t is not a constructor"). Keep these top-level.
import { R2StorageDriver } from "./r2";
import type { StorageDriver, SaveInput, SaveResult } from "./types";

let _driver: StorageDriver | null = null;

function getDriver(): StorageDriver {
  if (!_driver) {
    const driverName = process.env.STORAGE_DRIVER || "local";
    if (driverName === "r2") {
      _driver = new R2StorageDriver();
    } else {
      throw new Error(
        `[storage] Unknown STORAGE_DRIVER "${driverName}". Supported: "r2". Refusing to start with a silent fallback.`,
      );
    }
  }
  return _driver;
}

export function saveFile(input: SaveInput): Promise<SaveResult> {
  return getDriver().save(input);
}

export function deleteFile(key: string): Promise<void> {
  return getDriver().delete(key);
}

export function fileExists(key: string): Promise<boolean> {
  return getDriver().exists(key);
}

export { buildAssetUrl } from "./url";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

export function isAllowedExt(filename: string): boolean {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return false;
  return ALLOWED_EXT.has(filename.slice(dot).toLowerCase());
}

export function mimeFromExt(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  return (
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".avif": "image/avif",
    }[ext] || "application/octet-stream"
  );
}