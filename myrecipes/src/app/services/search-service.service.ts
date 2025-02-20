import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, from, map } from 'rxjs';
import { IRecipe } from '../recipes/i-recipe';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private supabase: SupabaseClient;

  public searchSubject = new BehaviorSubject<string>('');
  searchObservable = this.searchSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  updateSearch(query: string) {
    this.searchSubject.next(query);
    this.searchRecipes(query).subscribe();
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
