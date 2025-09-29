import { Component } from '@angular/core';
import { RepositorySearchComponent } from './features/repositories/components/repository-search/repository-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RepositorySearchComponent],
  template: `<app-repository-search></app-repository-search>`,
})
export class AppComponent {}