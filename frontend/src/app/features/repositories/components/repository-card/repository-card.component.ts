import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Repository } from '../../../../core/entities/repository.entity';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './repository-card.component.html',
  styleUrls: ['./repository-card.component.scss'],
})
export class RepositoryCardComponent {
  @Input() repo!: Repository;
  @Output() openDetails = new EventEmitter<Repository>();

  handleClick() {
    this.openDetails.emit(this.repo);
  }
}
