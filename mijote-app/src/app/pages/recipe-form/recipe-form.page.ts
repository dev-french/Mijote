import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { RecipeCreateInput, RecipeUpdateInput } from '../../core/recipes/recipe.model';
import { RecipesFacade } from '../../core/recipes/recipes.facade';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.page.html',
  styleUrls: ['./recipe-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonSpinner,
  ],
})
export class RecipeFormPage implements OnInit {
  readonly form = this.formBuilder.group({
    title: this.formBuilder.control('', [Validators.required]),
    description: this.formBuilder.control(''),
    ingredients: this.formBuilder.array<FormControl<string>>([]),
    steps: this.formBuilder.array<FormControl<string>>([]),
    tagsText: this.formBuilder.control(''),
  });

  isEditMode = false;
  recipeId: string | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipesFacade: RecipesFacade,
    private readonly toastController: ToastController,
  ) {}

  get ingredientsArray(): FormArray<FormControl<string>> {
    return this.form.controls.ingredients;
  }

  get stepsArray(): FormArray<FormControl<string>> {
    return this.form.controls.steps;
  }

  async ngOnInit(): Promise<void> {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recipeId;

    this.ensureInitialRows();

    if (this.isEditMode && this.recipeId) {
      await this.loadRecipe(this.recipeId);
    }
  }

  addIngredient(value = ''): void {
    this.ingredientsArray.push(this.formBuilder.control(value));
  }

  removeIngredient(index: number): void {
    if (this.ingredientsArray.length === 1) {
      this.ingredientsArray.at(0).setValue('');
      return;
    }

    this.ingredientsArray.removeAt(index);
  }

  addStep(value = ''): void {
    this.stepsArray.push(this.formBuilder.control(value));
  }

  removeStep(index: number): void {
    if (this.stepsArray.length === 1) {
      this.stepsArray.at(0).setValue('');
      return;
    }

    this.stepsArray.removeAt(index);
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      await this.showToast('Le titre est obligatoire.');
      return;
    }

    const input = this.buildPayload();
    if (!input.title) {
      await this.showToast('Le titre est obligatoire.');
      return;
    }

    try {
      this.submitting = true;

      if (this.isEditMode && this.recipeId) {
        await this.recipesFacade.updateRecipe(this.recipeId, input);
        await this.showToast('Recette mise à jour');
        await this.router.navigate(['/recipes', this.recipeId]);
      } else {
        const id = await this.recipesFacade.createRecipe(input);
        await this.showToast('Recette enregistrée');
        await this.router.navigate(['/recipes', id]);
      }
    } catch (error) {
      await this.showToast(this.toUserMessage(error, 'Enregistrement impossible.'));
    } finally {
      this.submitting = false;
    }
  }

  private ensureInitialRows(): void {
    if (this.ingredientsArray.length === 0) {
      this.addIngredient();
    }

    if (this.stepsArray.length === 0) {
      this.addStep();
    }
  }

  private async loadRecipe(recipeId: string): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = '';

      const recipe = await this.recipesFacade.getRecipe(recipeId);
      if (!recipe) {
        this.errorMessage = 'Recette introuvable.';
        return;
      }

      this.form.patchValue({
        title: recipe.title,
        description: recipe.description,
        tagsText: recipe.tags.join(', '),
      });

      this.setArrayValues(this.ingredientsArray, recipe.ingredients);
      this.setArrayValues(this.stepsArray, recipe.steps);
    } catch (error) {
      this.errorMessage = this.toUserMessage(error, 'Chargement impossible.');
    } finally {
      this.loading = false;
    }
  }

  private setArrayValues(array: FormArray<FormControl<string>>, values: string[]): void {
    array.clear();

    if (values.length === 0) {
      array.push(this.formBuilder.control(''));
      return;
    }

    values.forEach((value) => {
      array.push(this.formBuilder.control(value));
    });
  }

  private buildPayload(): RecipeCreateInput | RecipeUpdateInput {
    const title = this.form.controls.title.value.trim();
    const description = this.form.controls.description.value.trim();

    return {
      title,
      description,
      ingredients: this.ingredientsArray.controls
        .map((control) => control.value.trim())
        .filter((value) => value.length > 0),
      steps: this.stepsArray.controls
        .map((control) => control.value.trim())
        .filter((value) => value.length > 0),
      tags: this.form.controls.tagsText.value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
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
