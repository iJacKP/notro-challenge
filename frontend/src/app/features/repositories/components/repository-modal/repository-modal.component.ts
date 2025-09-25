import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Repository } from '../../../../core/entities/repository.entity';

@Component({
  selector: 'app-repository-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.scss'],
})
export class RepositoryModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public repo: Repository) {}
}
