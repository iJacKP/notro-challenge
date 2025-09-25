import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RepositoriesService } from '../../services/repositories.service';
import { Repository } from '../../../../core/entities/repository.entity';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RepositoryCardComponent } from '../repository-card/repository-card.component';
import { RepositoryModalComponent } from '../repository-modal/repository-modal.component';

@Component({
  selector: 'app-repository-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    RepositoryCardComponent,
  ],
  templateUrl: './repository-search.component.html',
  styleUrls: ['./repository-search.component.scss'],
})
export class RepositorySearchComponent {
  query = '';
  searchTerm = '';
  page = 1;
  repositories$: Observable<Repository[]> = of([]);
  loading = false;
  hasResults = true;
  errorMessage = '';
  selectedRepo: Repository | null = null;

  constructor(private repositoriesService: RepositoriesService, private dialog: MatDialog) {}

search(resetPage = false) {
  const trimmed = this.query.trim();
  if (!trimmed) return;

  if (resetPage) this.page = 1;

  this.searchTerm = trimmed; // salva o termo confirmado

  this.fetchRepositories();
}

  fetchRepositories() {
    if (!this.searchTerm) return;

    this.loading = true;
    this.repositories$ = this.repositoriesService
      .searchRepositories(this.searchTerm, this.page)
      .pipe(
        tap((results) => {
          this.loading = false;
          this.hasResults = results.length > 0;
          this.errorMessage = '';
        }),
        catchError((err) => {
          this.loading = false;
          this.hasResults = false;
          this.errorMessage = 'Erro ao buscar repositórios.';
          return of([]);
        })
      );
  }

  goToFirstPage() {
  if (this.page !== 1) {
    this.page = 1;
    this.search();
    }
  }

  nextPage() {
    if (this.hasResults && this.searchTerm) {
      this.page++;
      this.fetchRepositories();
    }
  }

  prevPage() {
    if (this.page > 1 && this.hasResults && this.searchTerm) {
      this.page--;
      this.fetchRepositories();
    }
  }



  openModal(repo: Repository) {
    this.dialog.open(RepositoryModalComponent, {
      data: repo,
      width: '400px',
    });
  }

  closeModal() {
    this.selectedRepo = null;
  }
}
