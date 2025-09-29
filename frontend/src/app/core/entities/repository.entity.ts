// src/app/core/entities/repository.entity.ts
export interface Repository {
  name: string;
  url: string;
  description: string;
  stars: number;
  watchers: number;
  issues: number;
}