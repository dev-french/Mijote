import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

const DB_NAME = 'recipes-db';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private initPromise: Promise<void> | null = null;
  private initialized = false;
  private sqliteAvailable = true;
  private initError: string | null = null;

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeInternal();
    return this.initPromise;
  }

  async ready(): Promise<void> {
    await this.init();
  }

  isReady(): boolean {
    return this.initialized;
  }

  isSqliteAvailable(): boolean {
    return this.sqliteAvailable;
  }

  getInitError(): string | null {
    return this.initError;
  }

  getDb(): SQLiteDBConnection {
    if (!this.initialized || !this.db) {
      const reason = this.initError ? ` (${this.initError})` : '';
      throw new Error(`Database is not ready${reason}`);
    }

    return this.db;
  }

  private async initializeInternal(): Promise<void> {
    try {
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        this.sqliteAvailable = false;
        this.initError = 'SQLite plugin is not available on web in this setup.';
        return;
      }

      await this.sqlite.checkConnectionsConsistency();
      const connectionStatus = await this.sqlite.isConnection(DB_NAME, false);

      this.db = connectionStatus.result
        ? await this.sqlite.retrieveConnection(DB_NAME, false)
        : await this.sqlite.createConnection(
            DB_NAME,
            false,
            'no-encryption',
            1,
            false,
          );

      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS recipes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          ingredients_json TEXT,
          steps_json TEXT,
          tags_json TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
      `);

      this.initialized = true;
      this.initError = null;
    } catch (error) {
      this.initialized = false;
      this.initError = 'SQLite initialization failed';
      console.error('[DbService] init failed', error);
      throw error;
    }
  }
}
