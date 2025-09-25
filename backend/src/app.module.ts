import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RepositoryResolver } from './application/graphql/repository.resolver';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { GithubAdapter } from './infra/adapters/github.adapter';
import { SearchRepositoriesUseCase } from './core/use-cases/search-repositories.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 300,
      max: 100,
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      introspection: true,
    }),
  ],
  providers: [RepositoryResolver, GithubAdapter, SearchRepositoriesUseCase],
})
export class AppModule {}