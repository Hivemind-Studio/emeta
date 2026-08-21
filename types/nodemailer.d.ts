// Minimal ambient declaration for nodemailer (avoid @types dep in prod image)
declare module "nodemailer" {
  export interface TransporterOptions {
    host: string;
    port: number;
    secure?: boolean;
    auth?: { user: string; pass: string };
  }
  export interface SendMailOptions {
    from?: string;
    to?: string;
    cc?: string;
    replyTo?: string;
    subject?: string;
    text?: string;
    html?: string;
  }
  export interface Transporter {
    sendMail(opts: SendMailOptions): Promise<{ messageId: string }>;
  }
  export function createTransport(opts: TransporterOptions): Transporter;
  const _default: { createTransport: typeof createTransport };
  export default _default;
}
