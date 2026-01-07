# 📡 Documentação da API

## Base URL

```
http://127.0.0.1:8000/api/
```

## Autenticação
Atualmente a API não requer autenticação (desenvolvimento).

---

## Endpoints

### 📊 Indicadores

#### Listar Todos

```http
GET /indicadores/
```
Resposta:

```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [...]
}
```
Dashboard

```text
GET /indicadores/dashboard/
```
Retorna indicadores com último valor.

Criar
```text
POST /indicadores/
Content-Type: application/json

{
  "nome": "Nome do Indicador",
  "tipo": "moeda",
  "unidade": "R$",
  "descricao": "Descrição opcional",
  "fonte_api": "https://..."
}
```
Buscar por ID

```text
GET /indicadores/{id}/
```
Atualizar

```text
PUT /indicadores/{id}/
Content-Type: application/json

{
  "nome": "Novo Nome",
  ...
}
```

Deletar

```text
DELETE /indicadores/{id}/
```
Comparar

```text
GET /indicadores/comparar/?ids=1,2,3
```
---

## 💰 Valores

Listar Todos
```text
GET /valores/
```
Filtrar por Indicador
```text
GET /valores/?indicador=1
```
Criar
```text
POST /valores/
Content-Type: application/json

{
  "indicador": 1,
  "valor": "6.0850",
  "fonte": "api"
}
```

---

## Códigos de Status

| Código | Significado                              |
| ------ | ---------------------------------------- |
| 200    | OK - Sucesso                             |
| 201    | Created - Recurso criado                 |
| 204    | No Content - Deletado com sucesso        |
| 400    | Bad Request - Dados inválidos            |
| 404    | Not Found - Recurso não encontrado       |
| 500    | Internal Server Error - Erro no servidor |

---

## Exemplos com cURL

Exemplos com cURL

Listar Indicadores

```bash
curl http://127.0.0.1:8000/api/indicadores/
```
Criar Indicador
```bash
curl -X POST http://127.0.0.1:8000/api/indicadores/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bitcoin",
    "tipo": "cripto",
    "unidade": "USD"
  }'
```
Comparar Indicadores
```bash
curl "http://127.0.0.1:8000/api/indicadores/comparar/?ids=1,2,3"
```