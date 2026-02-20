import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { Recipe, RecipeCreateInput, RecipeUpdateInput } from './recipe.model';

interface RecipeRow {
  id: string;
  title: string;
  description: string | null;
  ingredients_json: string | null;
  steps_json: string | null;
  tags_json: string | null;
  created_at: number;
  updated_at: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesRepository {
  constructor(private readonly dbService: DbService) {}

  async getAll(): Promise<Recipe[]> {
    const db = await this.getReadyDb();

    const result = await db.query(
      `SELECT id, title, description, ingredients_json, steps_json, tags_json, created_at, updated_at
       FROM recipes
       ORDER BY created_at DESC`,
    );

    return ((result.values ?? []) as RecipeRow[]).map((row) => this.rowToRecipe(row));
  }

  async getById(id: string): Promise<Recipe | null> {
    const db = await this.getReadyDb();

    const result = await db.query(
      `SELECT id, title, description, ingredients_json, steps_json, tags_json, created_at, updated_at
       FROM recipes
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    const row = (result.values?.[0] as RecipeRow | undefined) ?? undefined;
    return row ? this.rowToRecipe(row) : null;
  }

  async create(input: RecipeCreateInput): Promise<string> {
    const db = await this.getReadyDb();

    const id = this.generateId();
    const now = Date.now();
    const payload = this.normalizeInput(input);

    await db.run(
      `INSERT INTO recipes (
        id, title, description, ingredients_json, steps_json, tags_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        payload.title,
        payload.description,
        JSON.stringify(payload.ingredients),
        JSON.stringify(payload.steps),
        JSON.stringify(payload.tags),
        now,
        now,
      ],
    );

    return id;
  }

  async update(id: string, input: RecipeUpdateInput): Promise<void> {
    const db = await this.getReadyDb();

    const payload = this.normalizeInput(input);
    const now = Date.now();

    await db.run(
      `UPDATE recipes
       SET title = ?, description = ?, ingredients_json = ?, steps_json = ?, tags_json = ?, updated_at = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.description,
        JSON.stringify(payload.ingredients),
        JSON.stringify(payload.steps),
        JSON.stringify(payload.tags),
        now,
        id,
      ],
    );
  }

  async remove(id: string): Promise<void> {
    const db = await this.getReadyDb();
    await db.run('DELETE FROM recipes WHERE id = ?', [id]);
  }

  private async getReadyDb() {
    await this.dbService.ready();

    if (!this.dbService.isSqliteAvailable()) {
      throw new Error('SQLite is unavailable in this platform. Use Android build.');
    }

    return this.dbService.getDb();
  }

  private rowToRecipe(row: RecipeRow): Recipe {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? '',
      ingredients: this.safeParseArray(row.ingredients_json),
      steps: this.safeParseArray(row.steps_json),
      tags: this.safeParseArray(row.tags_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private normalizeInput(input: RecipeCreateInput | RecipeUpdateInput) {
    return {
      title: input.title.trim(),
      description: (input.description ?? '').trim(),
      ingredients: this.normalizeList(input.ingredients),
      steps: this.normalizeList(input.steps),
      tags: this.normalizeList(input.tags),
    };
  }

  private normalizeList(values: string[] | undefined): string[] {
    if (!values) {
      return [];
    }

    return values.map((value) => value.trim()).filter((value) => value.length > 0);
  }

  private safeParseArray(value: string | null): string[] {
    if (!value) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }

      return [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const rand = Math.random() * 16 | 0;
      const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
      return value.toString(16);
    });
  }
}
