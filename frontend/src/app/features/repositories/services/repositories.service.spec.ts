// // src/app/features/repositories/services/repositories.service.spec.ts
// import { TestBed } from '@angular/core/testing';
// import { Apollo } from 'apollo-angular';
// import { of } from 'rxjs';
// import { RepositoriesService, SEARCH_REPOSITORIES } from './repositories.service';

// describe('RepositoriesService', () => {
//   let service: RepositoriesService;
//   let apolloMock: any;

//   beforeEach(() => {
//     // Mock do Apollo
//     apolloMock = {
//       watchQuery: jest.fn().mockReturnValue({
//         valueChanges: of({
//           data: {
//             searchRepositories: [
//               {
//                 id: 1,
//                 name: 'test-repo',
//                 url: 'https://github.com/test/repo',
//                 description: 'Test repository',
//                 stars: 100,
//                 watchers: 50,
//                 issues: 10
//               }
//             ]
//           }
//         })
//       })
//     };

//     TestBed.configureTestingModule({
//       providers: [
//         RepositoriesService,
//         { provide: Apollo, useValue: apolloMock }
//       ]
//     });

//     service = TestBed.inject(RepositoriesService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should search repositories', (done) => {
//     service.searchRepositories('test', 1).subscribe(result => {
//       expect(result.length).toBe(1);
//       expect(result[0].name).toBe('test-repo');
//       done();
//     });
//   });
// });