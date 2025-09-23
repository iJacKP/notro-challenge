import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RepositoriesService } from '../../services/repositories.service';
import { Repository } from '../../../../core/entities/repository.entity';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repository-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
  ],
  templateUrl: './repository-search.component.html',
  styleUrls: ['./repository-search.component.scss'],
})
export class RepositorySearchComponent {
  query = '';
  page = 1;
  repositories$: Observable<Repository[]> = of([]);
  loading = false;

  constructor(private repositoriesService: RepositoriesService) {}

  search() {
    if (!this.query.trim()) return;

    this.loading = true;
    this.repositories$ = this.repositoriesService
      .searchRepositories(this.query, this.page)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          console.error(err);
          this.loading = false;
          return of([]);
        })
      );
  }

  nextPage() {
    this.page++;
    this.search();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.search();
    }
  }
}