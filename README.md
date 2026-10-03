# API Receba PII

API inicial do projeto Receba PII, feita com Node.js e Express. Nesta etapa, o login usa um usuário mockado em `mocks/users.js`; ainda não há conexão com banco de dados.

## Executar

Requisitos: Node.js e npm.

```sh
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.

## Login

`POST http://localhost:3000/api/auth/login`

Corpo JSON:

```json
{
	"email": "admin@email.com",
	"password": "admin"
}
```

O login de demonstração retorna `200` e os dados do usuário sem a senha. Credenciais incorretas retornam `401`; campos ausentes ou inválidos retornam `400`.

Essas credenciais existem apenas para desenvolvimento. Na próxima etapa, o mock poderá ser substituído pelo acesso ao PostgreSQL.
