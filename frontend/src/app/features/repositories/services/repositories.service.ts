import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Repository } from '../../../core/entities/repository.entity';

@Injectable({
  providedIn: 'root',
})
export class RepositoriesService {
  constructor(private apollo: Apollo) {}

  searchRepositories(query: string, page = 1): Observable<Repository[]> {
    const PAGE_SIZE = 10; // items por página

    return this.apollo
      .watchQuery<any>({
        query: gql`
          query SearchRepositories($query: String!, $page: Int!) {
            searchRepositories(query: $query, page: $page) {
              name
              url
              description
              stars
              watchers
              issues
            }
          }
        `,
        variables: { query, page },
      })
      .valueChanges.pipe(map((result) => result.data.searchRepositories));
  }
}