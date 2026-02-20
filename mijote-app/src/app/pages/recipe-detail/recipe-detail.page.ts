import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { Recipe } from '../../core/recipes/recipe.model';
import { RecipesFacade } from '../../core/recipes/recipes.facade';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
  ],
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe | null = null;
  recipeId: string | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipesFacade: RecipesFacade,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.recipeId = this.route.snapshot.paramMap.get('id');

    if (!this.recipeId) {
      this.errorMessage = 'Identifiant manquant.';
      this.loading = false;
      return;
    }

    await this.loadRecipe(this.recipeId);
  }

  async onEdit(): Promise<void> {
    if (!this.recipeId) {
      return;
    }

    await this.router.navigate(['/recipes', this.recipeId, 'edit']);
  }

  async onDelete(): Promise<void> {
    if (!this.recipe) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Supprimer la recette',
      message: `Confirmer la suppression de \"${this.recipe.title}\" ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            void this.deleteRecipe();
          },
        },
      ],
    });

    await alert.present();
  }

  private async loadRecipe(recipeId: string): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = '';

      const recipe = await this.recipesFacade.getRecipe(recipeId);
      if (!recipe) {
        this.errorMessage = 'Recette introuvable.';
        this.recipe = null;
        return;
      }

      this.recipe = recipe;
    } catch (error) {
      this.recipe = null;
      this.errorMessage = this.toUserMessage(error, 'Chargement impossible.');
    } finally {
      this.loading = false;
    }
  }

  private async deleteRecipe(): Promise<void> {
    if (!this.recipeId) {
      return;
    }

    try {
      await this.recipesFacade.deleteRecipe(this.recipeId);
      await this.showToast('Recette supprimée');
      await this.router.navigate(['/recipes']);
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
