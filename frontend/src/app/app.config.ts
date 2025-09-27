// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Apollo GraphQL
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

const uri = `${environment.apiUrl}`;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const http = httpLink.create({ uri });

        const headersLink = setContext(() => ({
          headers: {
            'x-apollo-operation-name': 'default',
          },
        }));

        return {
          cache: new InMemoryCache(),
          link: headersLink.concat(http),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'cache-first',
            },
          },
        };
      },
      deps: [HttpLink],
    },
  ]
};
