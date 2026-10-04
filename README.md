# Receba PII - API

API desenvolvida como parte do projeto integrador Receba PII. O sistema apoia a rotina de portaria no registro e acompanhamento de encomendas destinadas aos moradores de um condomínio.

## Objetivo

Disponibilizar ao front-end serviços para autenticar porteiros e administrar moradores, encomendas e o histórico de entregas e retiradas. Os dados são armazenados em PostgreSQL hospedado no Supabase.

## Funcionalidades

- Login de porteiro.
- Cadastro, consulta, atualização e remoção de moradores.
- Registro e gerenciamento de encomendas.
- Registro e consulta do histórico de movimentações.
- Atualização do status da encomenda quando ela é retirada.

## Tecnologias

- Node.js e Express para a API REST.
- PostgreSQL para persistência dos dados.
- Supabase como serviço de hospedagem do banco.
- `pg` para comunicação com PostgreSQL e `bcryptjs` para validar senhas com hash.

## Organização do projeto

- `server.js`: configuração e inicialização do servidor.
- `routes/`: definição dos caminhos HTTP.
- `controllers/`: validação das requisições e montagem das respostas.
- `services/`: regras da aplicação e acesso ao banco.
- `entities/`: normalização dos dados das entidades.
- `database/`: conexão, estrutura SQL e carga inicial para demonstração.

O fluxo principal segue `rota → controller → service → PostgreSQL`.

## Como executar

Requisitos: Node.js e npm.

1. Instale as dependências:

   ```sh
   npm install
   ```

2. Crie seu arquivo local de configuração:

   ```sh
   cp .env.example .env
   ```

3. No `.env`, configure `DATABASE_URL` com a connection string do Session Pooler do Supabase e mantenha `PGSSL=true`. Não compartilhe nem versione o arquivo `.env`.

4. No SQL Editor do Supabase, execute o conteúdo de `database/schema.sql`.

5. Para carregar os registros de demonstração, execute:

   ```sh
   npm run db:seed
   ```

6. Inicie a API em modo de desenvolvimento:

   ```sh
   npm run dev
   ```

A API ficará disponível em `http://localhost:8000`. O Nodemon reinicia o servidor quando os arquivos são alterados.

## Principais rotas

Login:

```text
POST /api/auth/login
```

Recursos `morador`, `encomenda` e `historico` oferecem as operações abaixo:

| Método | Caminho | Operação |
| --- | --- | --- |
| `GET` | `/api/{recurso}` | Listar registros |
| `GET` | `/api/{recurso}/:id` | Consultar um registro |
| `POST` | `/api/{recurso}` | Cadastrar um registro |
| `PUT` | `/api/{recurso}/:id` | Atualizar um registro |
| `DELETE` | `/api/{recurso}/:id` | Remover um registro |

As respostas de consulta e gravação incluem os dados em `data` e uma mensagem em `message`. Os códigos HTTP indicam o resultado da operação, como `200` para sucesso, `201` para cadastro, `400` para requisição inválida e `404` para registro não encontrado.

## Dados de demonstração

O comando `npm run db:seed` carrega exemplos definidos em `mocks/` e um usuário de demonstração para o login. A senha desse usuário é armazenada no banco usando hash bcrypt. Esses dados servem para desenvolvimento e apresentação acadêmica; altere-os para qualquer ambiente além da demonstração.
