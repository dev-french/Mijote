import { Injectable } from '@angular/core';
import { Recipe, RecipeCreateInput, RecipeUpdateInput } from './recipe.model';
import { RecipesRepository } from './recipes.repository';

@Injectable({
  providedIn: 'root',
})
export class RecipesFacade {
  constructor(private readonly repository: RecipesRepository) {}

  async loadRecipes(): Promise<Recipe[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      console.error('[RecipesFacade] loadRecipes failed', error);
      throw new Error('Impossible de charger les recettes.');
    }
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.error('[RecipesFacade] getRecipe failed', error);
      throw new Error('Impossible de charger la recette.');
    }
  }

  async createRecipe(input: RecipeCreateInput): Promise<string> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      console.error('[RecipesFacade] createRecipe failed', error);
      throw new Error('Impossible de créer la recette.');
    }
  }

  async updateRecipe(id: string, input: RecipeUpdateInput): Promise<void> {
    try {
      await this.repository.update(id, input);
    } catch (error) {
      console.error('[RecipesFacade] updateRecipe failed', error);
      throw new Error('Impossible de modifier la recette.');
    }
  }

  async deleteRecipe(id: string): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (error) {
      console.error('[RecipesFacade] deleteRecipe failed', error);
      throw new Error('Impossible de supprimer la recette.');
    }
  }
}
