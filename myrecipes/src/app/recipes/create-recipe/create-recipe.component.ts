import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { IRecipe } from '../i-recipe';

@Component({
  selector: 'app-create-recipe',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css',
})
export class CreateRecipeComponent implements OnInit {
  @Input('id') recipeID?: string;
  mealForm: FormGroup;
  isEditMode = false;

  constructor(
    private supaService: SupabaseService,
    private formBuilder: FormBuilder
  ) {
    this.mealForm = this.formBuilder.group({
      strMeal: ['', [Validators.required]],
      strInstructions: ['', [Validators.required]],
      ingredients: this.formBuilder.array([]),
    });
  }

  get strMealValid() {
    return (
      this.mealForm.get('strMeal')?.valid &&
      this.mealForm.get('strMeal')?.touched
    );
  }

  ngOnInit(): void {
    if (this.recipeID) {
      this.isEditMode = true;
      this.supaService.getMeals(this.recipeID).subscribe({
        next: (meals) => {
          this.mealForm.reset(meals[0]);
          meals[0].idIngredients.forEach((i) => {
            if (i) {
              this.IngredientsArray.push(this.generateIngredientControl(i));
            }
          });
        },
        error: (err) => console.error(err),
      });
    }
  }

  getIngredientControl(): FormControl {
    const control = this.formBuilder.control('', Validators.required);
    return control;
  }

  generateIngredientControl(id: string): FormControl {
    return this.formBuilder.control(id, Validators.required);
  }

  get IngredientsArray(): FormArray {
    return this.mealForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.IngredientsArray.push(this.getIngredientControl());
  }

  delIngredient(i: number) {
    this.IngredientsArray.removeAt(i);
  }

  saveRecipe() {
    const recipeData = this.mealForm.value;

    if (this.isEditMode) {
      this.supaService.updateRecipe(this.recipeID!, recipeData).subscribe({
        next: () => alert('Receta actualizada con éxito'),
        error: (err) => console.error(err),
      });
    } else {
      this.supaService.createRecipe(recipeData).subscribe({
        next: () => alert('Receta creada con éxito'),
        error: (err) => console.error(err),
      });
    }
  }
}
