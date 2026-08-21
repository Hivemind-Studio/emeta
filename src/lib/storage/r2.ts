import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import type { StorageDriver, SaveInput, SaveResult } from "./types";

/**
 * Cloudflare R2 driver (S3-compatible). Objects stored under a KEY_PREFIX
 * ("everest-electronics/") inside the shared "denova" bucket. The DB stores the
 * PREFIX-FREE relative key; the prefix + bucket + public URL are driver concerns.
 */
export class R2StorageDriver implements StorageDriver {
  private client: S3Client;
  private bucket: string;
  private prefix: string;
  private publicBase: string;
  private maxEdge = 1600;
  private quality = 82;

  constructor() {
    const ep = process.env.CDN_ENDPOINT;
    const access = process.env.CDN_ACCESS_KEY;
    const secret = process.env.CDN_SECRET_KEY;
    const bucket = process.env.CDN_BUCKET;
    if (!ep || !access || !secret || !bucket) {
      throw new Error(
        "[storage:r2] Missing R2 config. Set CDN_ENDPOINT, CDN_ACCESS_KEY, CDN_SECRET_KEY, CDN_BUCKET.",
      );
    }
    this.bucket = bucket;
    this.prefix = (process.env.CDN_KEY_PREFIX || "").replace(/^\/+|\/+$/g, "");
    this.publicBase = (
      process.env.NEXT_PUBLIC_CDN_URL || process.env.CDN_PUBLIC_URL || ""
    ).replace(/\/+$/, "");
    this.client = new S3Client({
      endpoint: ep,
      region: process.env.CDN_REGION || "auto",
      credentials: { accessKeyId: access, secretAccessKey: secret },
      forcePathStyle: true,
    });
  }

  private objectKey(key: string): string {
    return this.prefix ? `${this.prefix}/${key}` : key;
  }

  async save(input: SaveInput): Promise<SaveResult> {
    const maxSize = input.maxSize ?? 12 * 1024 * 1024;
    if (input.buffer.byteLength > maxSize) {
      throw new Error(`File exceeds ${Math.floor(maxSize / 1024 / 1024)}MB limit.`);
    }

    let body = input.buffer;
    let mime = input.mime || "image/webp";
    try {
      const image = sharp(input.buffer, { failOn: "none" });
      const meta = await image.metadata();
      if (meta.width) {
        body = await image
          .rotate()
          .resize({
            width: meta.width > this.maxEdge ? this.maxEdge : undefined,
            height: meta.height && meta.height > this.maxEdge ? this.maxEdge : undefined,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: this.quality })
          .toBuffer();
        mime = "image/webp";
      }
    } catch {
      body = input.buffer;
    }

    const sub = new Date().toISOString().slice(0, 7);
    const base = path
      .basename(input.originalName || "asset", path.extname(input.originalName || ""))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    const id = `${base || "asset"}-${crypto.randomBytes(4).toString("hex")}.webp`;
    const key = `${sub}/${id}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.objectKey(key),
        Body: body,
        ContentType: mime,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { key, mime, size: body.byteLength };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key) }),
    );
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key) }),
      );
      return true;
    } catch {
      return false;
    }
  }

  getUrl(key: string): string {
    return this.publicBase
      ? `${this.publicBase}/${this.prefix}/${key}`
      : `${this.prefix ? `/${this.prefix}` : ""}/${key}`;
  }
}