declare module '@vercel/node' {
  import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http';

  export interface VercelRequest extends IncomingMessage {
    body?: unknown;
    query: Record<string, string | string[] | undefined>;
    headers: IncomingHttpHeaders;
    method?: string;
  }

  export interface VercelResponse extends ServerResponse {
    status(code: number): this;
    json(body: unknown): this;
    send(body: unknown): this;
    setHeader(name: string, value: string | string[]): this;
  }
}
