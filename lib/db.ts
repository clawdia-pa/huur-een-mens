import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:db/huur-een-mens.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function queryAll(sql: string, params: any[] = []): Promise<any[]> {
  const result = await client.execute({ sql, args: params });
  return result.rows as any[];
}

export async function queryOne(sql: string, params: any[] = []): Promise<any> {
  const result = await client.execute({ sql, args: params });
  return (result.rows[0] as any) || null;
}

export async function run(sql: string, params: any[] = []): Promise<any> {
  const result = await client.execute({ sql, args: params });
  return { lastID: result.lastInsertRowid, changes: result.rowsAffected };
}
