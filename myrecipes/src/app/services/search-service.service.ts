import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from, map } from 'rxjs';
import { IRecipe } from '../recipes/i-recipe';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  
  searchRecipes(query: string): Observable<IRecipe[]> {
    return from(
      this.supabase
        .from('meals')
        .select('*')
        .ilike('strMeal', `%${query}%`) 
    ).pipe(map(({ data }) => data || []));
  }
}
