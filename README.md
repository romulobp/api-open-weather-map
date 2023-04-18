## API Adonis 5 -  Open Weather Map

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- AdonisJS 5
- Node 18
- Typescript
- MySQL
- Swagger

O objetivo deste projeto é fornecer uma integração à API da Open Weather Map.

## Principais características

- Agendamento de tarefas com scheduler
- Comandos para atualizar dados de uma ou mais cidades:
  Todas cidades: 
  ```
  node ace weather
  ```
  Pelos ids: 
  ```
  node ace weather 1 3 
  ```

- Validação de dados ao efetuar o patch
- Integração com a API da Open Weather Map
- Tratamento de exceções
- Testes unitários
- Organização do código em Models, Services e Controllers
- Utilização do Docker para facilitar o gerenciamento do banco de dados MySQL

## Rotas:

GET - http://127.0.0.1:3333/api/live-weather

PATCH - http://127.0.0.1:3333/api/city/:id

SWAGGER - http://127.0.0.1:3333/docs

## Pré-requisitos

- Docker
- Docker compose
- Node 18

## Instruções para instalação e execução


1. Instalar dependências: 
```
npm i
```

2. Docker - MySQL: 
```
docker-compose up -d
```

3. Rodar Migrations e seeds: 
```
npm run fresh
```

4. Executar o projeto em mode dev:
```
npm run dev
```
