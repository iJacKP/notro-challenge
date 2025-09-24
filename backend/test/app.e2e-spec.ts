// test/repository.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GithubAdapter } from '../src/infra/adapters/github.adapter';
import { SearchRepositoriesUseCase } from '../src/core/use-cases/search-repositories.usecase';

// Mock da API do GitHub
jest.mock('../src/infra/adapters/github.adapter');
const MockedGithubAdapter = GithubAdapter as jest.MockedClass<typeof GithubAdapter>;

describe('RepositoryResolver (E2E)', () => {
  let app: INestApplication;
  let adapter: GithubAdapter;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    adapter = moduleFixture.get<GithubAdapter>(GithubAdapter);
  });

  afterAll(async () => {
    await app.close();
  });

  it('✅ Deve retornar repositórios válidos para uma query', async () => {
    // Mock da resposta da API
    MockedGithubAdapter.prototype.searchRepositories.mockResolvedValueOnce([
      {
        name: 'repo1',
        url: 'url',
        description: 'desc',
        stars: 1,
        watchers: 2,
        issues: 3,
      },
    ]);

    const query = `
      query {
        searchRepositories(query: "nestjs", page: 1) {
          name
          url
          description
          stars
          watchers
          issues
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(HttpStatus.OK);

    expect(res.body.data.searchRepositories).toHaveLength(1);
    expect(res.body.data.searchRepositories[0]).toMatchObject({
      name: 'repo1',
      url: 'url',
      description: 'desc',
      stars: 1,
      watchers: 2,
      issues: 3,
    });
  });

  it('🚨 Deve retornar erro BadRequest para query muito curta', async () => {
    const query = `
      query {
        searchRepositories(query: "a", page: 1) {
          name
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      
    expect(res.body.errors[0].message).toBe(
      'A pesquisa deve ter pelo menos 2 caracteres.',
    );
  });

  it('🚨 Deve retornar erro 404 quando não há repositórios', async () => {
    MockedGithubAdapter.prototype.searchRepositories.mockRejectedValueOnce({
      response: { status: 404 },
      isAxiosError: true,
    });

    const query = `
      query {
        searchRepositories(query: "notfound", page: 1) {
          name
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })

    expect(res.body.errors[0].message).toBe('Erro ao buscar repositórios.');
  });
});