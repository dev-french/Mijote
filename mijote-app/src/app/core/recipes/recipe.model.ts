export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface RecipeCreateInput {
  title: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
}

export interface RecipeUpdateInput {
  title: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
}
