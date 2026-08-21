export interface SaveInput {
  originalName: string;
  buffer: Buffer;
  mime?: string;
  maxSize?: number;
}

export interface SaveResult {
  key: string;
  mime: string;
  size: number;
}

export interface StorageDriver {
  save(input: SaveInput): Promise<SaveResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  exists(key: string): Promise<boolean>;
}