
# Notro Challenge

Aplicação fullstack para pesquisar repositórios do GitHub por nome, visualizar informações relevantes e navegar com paginação.

Frontend em Angular 18+ e backend em NestJS + GraphQL, seguindo boas práticas de arquitetura, testes e organização.

## ✅ Requisitos atendidos

- 	Frontend em Angular 18+
-   Backend em Node.js (NestJS + GraphQL)
-   Consumo de API pública (GitHub)
-   Paginação via API
-   Boas práticas de código e organização


## 📦 Estrutura do projeto

```bash
├── frontend   # Angular 18+ app (UI/UX)
├── backend    # NestJS API (GraphQL + GitHub API)
├── docker-compose.yml # compose file com configuração para rodar os containers da aplicação
├── package.json # package.json contendo scripts para iniciar a aplicação
└── README.md  # este arquivo
```
## Pré-requisitos

- Node.js 20+
- NPM 9+
- (opcional) Docker + Docker Compose


## 🚀 Como rodar o projeto

1. Clonar o repositório

```bash
git clone https://github.com/iJacKP/notro-challenge.git
cd notro-challenge
```

2. Rodar sem Docker (O projeto já tem scripts na raiz usando concurrently. Suba frontend e backend juntos:):

```bash
npm install
npm run dev
```

Isso vai iniciar:
- Backend: http://localhost:3000/graphql
- Frontend: http://localhost:4200

3. Rodar com Docker (modo demo):

```bash
npm run docker:up:detached
```

- Backend → http://localhost:3000/graphql
- Frontend → http://localhost:4200

⚠️ Alterações no código não são refletidas automaticamente no Docker (modo apenas para testes rápidos).
Para desenvolvimento, use os comandos npm run dev.


## 🧪 Rodando os testes

Frontend:
```bash
cd frontend
npm test
```

Backend:
```bash
cd backend
npm test
```

## 📖 Funcionalidades
- 🔎 Pesquisar repositórios por nome
- 📊 Exibir informações: nome, descrição, URL, estrelas, watchers, issues
- 📑 Paginação integrada com API do GitHub
- 🎨 Layout simples e organizado (Angular Material)
- ⚡ Camada intermediária (NestJS) com tratamento de erros e arquitetura modular

##  🛠️ Tecnologias utilizadas

Frontend:
- Angular 18+
- Apollo Angular (GraphQL)
- Angular Material
- RxJS


Backend
- Node.js 20+ / NestJS 11
- GraphQL (Apollo Server)
- Axios (chamadas HTTP)
- Cache Manager

Infra
- Docker & Docker Compose
- Render (deploy backend)
- Vercel (deploy frontend)

Variáveis de ambiente:

Backend precisa de um token do GitHub para chamadas autenticadas.
Crie um arquivo .env dentro de backend/:

GITHUB_TOKEN=<seu_token_aqui>

Nota: Para gerar um token, vá em GitHub → Settings → Developer Settings → Personal Access Tokens → Generate token.


## 🌍 Deploy
- Frontend → Vercel
- Backend → Render

- Live Demo → [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://notro-challenge.vercel.app/)