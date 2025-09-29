// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RepositorySearchComponent } from './features/repositories/components/repository-search/repository-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'repositories', pathMatch: 'full' },
  { 
    path: 'repositories', 
    component: RepositorySearchComponent
  },
  { path: '**', redirectTo: 'repositories' }
];