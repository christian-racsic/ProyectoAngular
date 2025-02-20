import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SearchService } from '../../services/search-service.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  logged: boolean = false;
  searchForm: FormGroup;
  user: User | null = null;
  searchResults: any[] = []; 

  constructor(
    private supaService: SupabaseService,
    private formBuilder: FormBuilder,
    private searchService: SearchService
  ) {
    this.searchForm = this.formBuilder.group({
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    this.supaService.loggedSubject.subscribe(logged => {
      this.logged = logged;
      if (logged) {
        this.supaService.getUserInfo().subscribe(user => {
          this.user = user;
        });
      } else {
        this.user = null;
      }
    });

    this.supaService.isLogged();

    this.searchForm.get('searchInput')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(query => {
      this.searchRecipes(query);
    });
  }

  search() {
    const query = this.searchForm.get('searchInput')?.value;
    if (query) {
      this.searchRecipes(query);
    }
  }

  searchRecipes(query: string) {
    this.searchService.searchRecipes(query).subscribe(recipes => {
      this.searchResults = recipes;
      console.log('Recetas encontradas:', recipes);
    });
  }

  logout() {
    this.supaService.logout().subscribe(() => {
      this.user = null;
      this.logged = false;
    });
  }
}
