// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Apollo GraphQL
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

const uri = 'http://localhost:3000/graphql';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        cache: new InMemoryCache(),
        link: httpLink.create({ uri }),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-first',
          },
        },
      }),
      deps: [HttpLink],
    },
  ]
};