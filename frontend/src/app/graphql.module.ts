// src/app/features/repositories/services/repositories.service.ts
import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Repository } from './core/entities/repository.entity';

export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($query: String!, $page: Int!) {
    searchRepositories(query: $query, page: $page) {
      id
      name
      url
      description
      stars
      watchers
      issues
      forks
      language
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {
  private apollo = inject(Apollo);

  searchRepositories(query: string, page: number = 1): Observable<Repository[]> {
    console.log('🔍 Buscando repositórios:', query, 'página:', page);
    
    return this.apollo.watchQuery({
      query: SEARCH_REPOSITORIES,
      variables: { query, page },
      fetchPolicy: 'cache-first'
    }).valueChanges.pipe(
      map((result: any) => {
        console.log('✅ Resultado recebido:', result.data?.searchRepositories?.length || 0, 'itens');
        return result.data?.searchRepositories || [];
      })
    );
  }
}