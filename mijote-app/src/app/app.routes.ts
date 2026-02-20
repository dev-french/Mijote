import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full',
  },
  {
    path: 'recipes/new',
    loadComponent: () =>
      import('./pages/recipe-form/recipe-form.page').then((m) => m.RecipeFormPage),
  },
  {
    path: 'recipes/:id/edit',
    loadComponent: () =>
      import('./pages/recipe-form/recipe-form.page').then((m) => m.RecipeFormPage),
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail.page').then(
        (m) => m.RecipeDetailPage,
      ),
  },
  {
    path: 'recipes',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/recipes-list/recipes-list.page').then(
        (m) => m.RecipesListPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'recipes',
  },
];
