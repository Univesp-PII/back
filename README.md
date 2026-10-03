# API Receba PII

API inicial do Receba PII, construída com Node.js e Express. A autenticação e os dados de moradores, encomendas e histórico usam mocks em memória. Ainda não há conexão com PostgreSQL.

## Requisitos e execução

Requisitos: Node.js e npm.

```sh
npm install
npm run dev
```

O servidor fica disponível em `http://localhost:8000`. Para iniciar sem reinício automático, use `npm start`.

## Estrutura

- `server.js`: configura e inicia o servidor Express.
- `routes/`: define os endpoints de autenticação e recursos.
- `controllers/`: trata requisições e monta as respostas HTTP.
- `services/`: contém a lógica de acesso aos dados mockados.
- `entities/`: cria e normaliza os formatos das entidades.
- `mocks/`: contém os usuários, moradores, encomendas e registros de histórico de exemplo.
- `middleware/requestLogger.js`: registra requisições com resposta de erro.

## Login

`POST /api/auth/login`

Corpo JSON:

```json
{
	"email": "daniel@email.com",
	"password": "daniel"
}
```

Sucesso (`200`):

```json
{
	"message": "Login realizado com sucesso.",
	"user": {
		"id": 1,
		"nome": "Carlos Silva",
		"email": "daniel@email.com"
	}
}
```

A senha não é incluída na resposta. Credenciais incorretas retornam `401`; campos ausentes ou inválidos retornam `400`. O usuário e a senha são apenas para desenvolvimento e estão em `mocks/users.js`.

## Endpoints de dados

Cada recurso oferece os métodos abaixo:

| Método | Caminho | Ação |
| --- | --- | --- |
| `GET` | `/api/{recurso}` | Lista registros |
| `GET` | `/api/{recurso}/:id` | Busca um registro |
| `POST` | `/api/{recurso}` | Cadastra um registro |
| `PUT` | `/api/{recurso}/:id` | Atualiza um registro |
| `DELETE` | `/api/{recurso}/:id` | Remove um registro |

Os recursos são `morador`, `encomenda` e `historico`. Por exemplo: `GET /api/morador` ou `POST /api/encomenda`.

Exemplo de cadastro de morador:

```json
{
	"nomeMorador": "Joana Silva",
	"blocoMorador": "A",
	"apartamento": "101",
	"telefoneMorador": "(11) 99999-0000"
}
```

Exemplo de cadastro de encomenda:

```json
{
	"moradorId": 1,
	"nomeMorador": "Joana Silva",
	"blocoMorador": "A",
	"apartamento": "101",
	"codigo": "PKG-123",
	"empresa": "Loja",
	"entregador": "Carlos",
	"status": "pendente",
	"dataRegistro": "2026-10-03T12:00:00.000Z",
	"dataRetirada": "",
	"porteiroRegistro": "Carlos Silva",
	"porteiroRetirada": ""
}
```

Listagens, buscas e gravações bem-sucedidas retornam `{ "data": ..., "message": "..." }`. Exclusões retornam `{ "message": "..." }`. Registro não encontrado retorna `404`; corpo JSON inválido retorna `400`.

Os arquivos de dados ficam separados em `mocks/moradores.js`, `mocks/encomendas.js` e `mocks/historico.js`. Como os dados são mantidos em memória, alterações feitas durante a execução são perdidas quando o servidor reinicia.

## Logs

As atividades são descritas no terminal com a ação e o recurso, por exemplo `listou encomendas quantidade=5`, `consultou morador id=1`, `registrou retirada encomenda id=1001` ou `login recusado`. Logs técnicos de requisição (método, caminho, status e duração) aparecem somente quando a resposta tem status `400` ou superior. O sistema não registra corpos de requisição, senhas ou emails.
