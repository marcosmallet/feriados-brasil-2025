# API Feriados Brasil 2025

API REST para consulta de feriados nacionais, estaduais e municipais do Brasil em 2025.

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar a API
npm start
```

A API estará disponível em `http://localhost:3000`

## Endpoints Disponíveis

### GET /
Retorna informações sobre a API e documentação dos endpoints.

### GET /feriados
Lista todos os feriados com filtros opcionais.

**Parâmetros de consulta:**
- `meses`: Lista de meses separados por vírgula (01-12)
- `tipos`: Lista de tipos separados por vírgula (NACIONAL, ESTADUAL, MUNICIPAL)
- `estados`: Lista de UFs separadas por vírgula (SP, RJ, MG, etc.)
- `nome`: Busca textual no nome ou descrição do feriado
- `data`: Data específica no formato DD/MM

**Exemplo:**
```
GET /feriados?meses=01,12&tipos=NACIONAL
GET /feriados?estados=SP,RJ&nome=natal
```

### GET /feriados/nacionais
Lista apenas feriados nacionais.

**Parâmetros de consulta:**
- `meses`: Lista de meses (01-12)
- `nome`: Busca textual
- `data`: Data específica (DD/MM)

### GET /feriados/estaduais
Lista feriados estaduais.

**Parâmetros de consulta:**
- `meses`: Lista de meses (01-12)
- `estados`: Lista de UFs
- `nome`: Busca textual
- `data`: Data específica (DD/MM)

### GET /feriados/municipais
Lista feriados municipais.

**Parâmetros de consulta:**
- `meses`: Lista de meses (01-12)
- `estados`: Lista de UFs
- `nome`: Busca textual
- `data`: Data específica (DD/MM)

### GET /feriados/data/:data
Busca feriados por data específica.

**Parâmetros:**
- `data`: Data no formato DD/MM (ex: 25/12)

**Exemplo:**
```
GET /feriados/data/25/12
```

### GET /estados
Lista todos os estados brasileiros com seus códigos UF.

### GET /stats
Retorna estatísticas dos feriados (total por tipo, por mês, etc.).

## Formato de Resposta

Todas as respostas são em formato JSON:

```json
{
  "total": 10,
  "feriados": [
    {
      "data": "01/01/2025",
      "nome": "Ano Novo",
      "tipo": "NACIONAL",
      "descricao": "O Ano-Novo ou Réveillon...",
      "uf": "",
      "municipio": ""
    }
  ]
}
```

## Códigos de Status HTTP

- `200`: Sucesso
- `400`: Erro de validação (formato de data inválido, etc.)
- `404`: Rota não encontrada
- `500`: Erro interno do servidor

## Exemplos de Uso

### JavaScript/Fetch
```javascript
// Buscar todos os feriados nacionais
fetch('http://localhost:3000/feriados/nacionais')
  .then(response => response.json())
  .then(data => console.log(data));

// Buscar feriados de dezembro
fetch('http://localhost:3000/feriados?meses=12')
  .then(response => response.json())
  .then(data => console.log(data));
```

### cURL
```bash
# Buscar feriados de São Paulo
curl "http://localhost:3000/feriados?estados=SP"

# Buscar feriado do Natal
curl "http://localhost:3000/feriados/data/25/12"
```

## Estrutura dos Dados

Os dados dos feriados contêm:
- `data`: Data no formato DD/MM/AAAA
- `nome`: Nome do feriado
- `tipo`: NACIONAL, ESTADUAL ou MUNICIPAL
- `descricao`: Descrição detalhada do feriado
- `uf`: Código do estado (para feriados estaduais/municipais)
- `municipio`: Nome do município (para feriados municipais)

## Tecnologias Utilizadas

- Node.js
- Express.js
- CORS para permitir requisições cross-origin

## Créditos

Baseado no projeto original de [marcosmallet/feriados-brasil-2025](https://github.com/marcosmallet/feriados-brasil-2025).

