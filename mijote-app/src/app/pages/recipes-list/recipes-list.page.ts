import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { Recipe } from '../../core/recipes/recipe.model';
import { RecipesFacade } from '../../core/recipes/recipes.facade';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.page.html',
  styleUrls: ['./recipes-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonNote,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class RecipesListPage {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm = '';
  loading = true;
  errorMessage = '';

  constructor(
    private readonly recipesFacade: RecipesFacade,
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
  ) {
    addIcons({ add, createOutline, trashOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadRecipes();
  }

  async onCreate(): Promise<void> {
    await this.router.navigate(['/recipes/new']);
  }

  async onOpen(recipeId: string): Promise<void> {
    await this.router.navigate(['/recipes', recipeId]);
  }

  async onEdit(recipeId: string): Promise<void> {
    await this.router.navigate(['/recipes', recipeId, 'edit']);
  }

  async onDelete(recipe: Recipe): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Supprimer la recette',
      message: `Confirmer la suppression de \"${recipe.title}\" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            void this.deleteRecipe(recipe.id);
          },
        },
      ],
    });

    await alert.present();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLocaleLowerCase();

    if (!term) {
      this.filteredRecipes = [...this.recipes];
      return;
    }

    this.filteredRecipes = this.recipes.filter((recipe) =>
      recipe.title.toLocaleLowerCase().includes(term),
    );
  }

  private async loadRecipes(): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.recipes = await this.recipesFacade.loadRecipes();
      this.applyFilter();
    } catch (error) {
      this.recipes = [];
      this.filteredRecipes = [];
      this.errorMessage = this.toUserMessage(error, 'Impossible de charger les recettes.');
    } finally {
      this.loading = false;
    }
  }

  private async deleteRecipe(recipeId: string): Promise<void> {
    try {
      await this.recipesFacade.deleteRecipe(recipeId);
      await this.showToast('Recette supprimée');
      await this.loadRecipes();
    } catch (error) {
      await this.showToast(this.toUserMessage(error, 'Suppression impossible.'));
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1600,
      position: 'bottom',
    });

    await toast.present();
  }

  private toUserMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return fallback;
  }
}
