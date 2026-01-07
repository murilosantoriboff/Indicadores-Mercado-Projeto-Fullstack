# 📊 Sistema de Indicadores Econômicos

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-5.1-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-orange)

Sistema Full Stack para coleta, armazenamento e análise de indicadores econômicos em tempo real, incluindo moedas internacionais e índices de inflação.

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Coleta Automática](#-coleta-automática)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Melhorias Futuras](#-melhorias-futuras)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como um desafio Full Stack para demonstrar habilidades em:

- **Backend**: Django REST Framework com PostgreSQL
- **Frontend**: React com visualização de dados
- **Automação**: Scripts Python para coleta de dados de APIs públicas
- **Deploy**: Configuração para produção com Supabase

O sistema coleta automaticamente dados de:
- **10+ moedas internacionais** (Dólar, Euro, Libra, Iene, Franco Suíço, etc.)
- **Índices de inflação** (IPCA, IPCA Acumulado)
- **APIs públicas** do Banco Central e IBGE

---

## ✨ Funcionalidades

### 🎨 Frontend (React)

#### 📊 Dashboard Interativo
- ✅ Visualização em cards de todos os indicadores
- ✅ Busca por nome em tempo real
- ✅ Filtro por tipo (moeda, índice, outro)
- ✅ Contador de resultados filtrados
- ✅ Atualização manual dos dados
- ✅ Loading states com spinners animados
- ✅ Tratamento de erros com mensagens claras

#### 📈 Comparação de Indicadores
- ✅ Seleção múltipla de indicadores
- ✅ Gráfico comparativo interativo (Chart.js)
- ✅ Tabelas com histórico de valores
- ✅ Visualização de múltiplas séries temporais
- ✅ Identificação da fonte dos dados (API, Manual, Scraping)

#### 📝 Cadastro e Gestão
- ✅ Formulário para criar novos indicadores
- ✅ Adicionar valores manualmente
- ✅ Validação de campos obrigatórios
- ✅ Feedback visual de sucesso/erro

#### 🔍 Página de Detalhes
- ✅ Visualização individual de cada indicador
- ✅ Estatísticas automáticas:
  - Valor máximo histórico
  - Valor mínimo histórico
  - Média dos valores
  - Total de registros
- ✅ Gráfico individual da evolução
- ✅ Tabela completa de valores históricos
- ✅ Navegação intuitiva (voltar para dashboard)

#### 📥 Exportação de Relatórios
- ✅ **CSV**: Formato universal, compatível com Excel
- ✅ **Excel (.xlsx)**: Com múltiplas abas e formatação
- ✅ **JSON**: Para integração com outras aplicações
- ✅ Exportação da dashboard completa
- ✅ Exportação de valores individuais por indicador
- ✅ Nome de arquivo com data automática

#### 🎨 Interface Moderna
- ✅ Design responsivo (mobile-first)
- ✅ Efeitos hover e transições suaves
- ✅ Cores e tipografia profissionais
- ✅ Cards com shadow e animações
- ✅ Badges coloridos por tipo
- ✅ Ícones e emojis para melhor UX

---

### ⚙️ Backend (Django)

#### 🗄️ Modelos de Dados
```python
# Indicador
- nome (CharField)
- tipo (CharField): moeda, indice, outro
- unidade (CharField): R$, %, etc
- descricao (TextField)
- fonte_api (URLField)
- criado_em, atualizado_em (DateTimeField)

# ValorIndicador
- indicador (ForeignKey)
- valor (DecimalField)
- data_coleta (DateTimeField)
- fonte (CharField): api, manual, scraping
```
#### 🔌 API REST
- ✅ CRUD completo de indicadores
- ✅ CRUD de valores
- ✅ Endpoint de dashboard com último valor
- ✅ Endpoint de comparação de múltiplos indicadores
- ✅ Filtros e ordenação
- ✅ Paginação configurável
- ✅ CORS configurado para desenvolvimento
- ✅ Serializers otimizados

#### 🔐 Configuração
- ✅ Variáveis de ambiente (.env)
- ✅ PostgreSQL em produção (Supabase)
- ✅ Connection pooling para estabilidade
- ✅ Settings separados por ambiente
- ✅ Static files configurados
- ✅ Migrations versionadas

#### 🤖 Automação e Scripts
💱 Coleta de Moedas (coleta_moedas_multiplas.py)
- ✅ 10 moedas coletadas simultaneamente:
  - 🇺🇸 Dólar Americano (USD)
  - 🇪🇺 Euro (EUR)
  - 🇬🇧 Libra Esterlina (GBP)
  - 🇯🇵 Iene Japonês (JPY)
  - 🇨🇭 Franco Suíço (CHF)
  - 🇨🇦 Dólar Canadense (CAD)
  - 🇦🇺 Dólar Australiano (AUD)
  - 🇦🇷 Peso Argentino (ARS)
  - 🇨🇱 Peso Chileno (CLP)
  - 🇨🇳 Yuan Chinês (CNY)
- ✅ API do Banco Central (PTAX)
- ✅ Retry automático para dias anteriores
- ✅ Tratamento de erros por moeda
- ✅ Logs detalhados com emojis

#### 📈 Coleta de Inflação (coleta_inflacao.py)
- ✅ IPCA mensal
- ✅ IPCA acumulado 12 meses
- ✅ Web scraping do site do IBGE
- ✅ BeautifulSoup para parsing HTML
- ✅ Validação de dados

#### 🔄 Integrador Django (integrador.py)
- ✅ Conecta coletores com banco de dados
- ✅ Cria ou atualiza indicadores automaticamente
- ✅ Evita duplicatas (verificação por data)
- ✅ Atualiza tipos vazios de indicadores existentes
- ✅ Relatório completo de execução
- ✅ Contadores de sucessos/erros

#### 🛠️ Scripts Utilitários
- ✅ corrigir_tipos_indicadores.py: Corrige tipos vazios no banco
- ✅ executar_coleta.bat: Atalho Windows para coleta
- ✅ Ativação automática do ambiente virtual

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia            | Versão | Uso                   |
| --------------------- | ------ | --------------------- |
| Python                | 3.12   | Linguagem principal   |
| Django                | 5.1    | Framework web         |
| Django REST Framework | 3.15   | API REST              |
| psycopg               | 3.2    | Driver PostgreSQL     |
| python-decouple       | 3.8    | Variáveis de ambiente |
| requests              | 2.32   | Requisições HTTP      |
| beautifulsoup4        | 4.12   | Web scraping          |
| python-dotenv         | 1.0    | Gerenciamento .env    |

### Frontend
| Tecnologia       | Versão | Uso                 |
| ---------------- | ------ | ------------------- |
| React            | 18.3   | Framework UI        |
| React Router DOM | 6.x    | Roteamento          |
| Axios            | 1.7    | HTTP client         |
| Chart.js         | 4.4    | Gráficos            |
| react-chartjs-2  | 5.2    | Integração Chart.js |
| XLSX             | 0.18   | Exportação Excel    |

### Banco de Dados
| Tecnologia     | Uso                      |
| -------------- | ------------------------ |
| PostgreSQL     | Banco de dados principal |
| Supabase       | PostgreSQL em nuvem      |
| Session Pooler | Conexão IPv4 estável     |

### Api Externas
| API                  | Uso                 |
| -------------------- | ------------------- |
| Banco Central (PTAX) | Cotações de moedas  |
| IBGE                 | Índices de inflação |

---

## 🏗️ Arquitetura
```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────▼──────────┐
          │   Frontend (React)    │
          │  - Dashboard          │
          │  - Comparação         │
          │  - Cadastro           │
          │  - Detalhes           │
          │  - Exportação         │
          └───────────┬───────────┘
                      │ HTTP/REST
          ┌───────────▼───────────┐
          │  Backend (Django)     │
          │  - API REST           │
          │  - Serializers        │
          │  - ViewSets           │
          │  - Admin              │
          └───────────┬───────────┘
                      │ ORM
          ┌───────────▼───────────┐
          │  PostgreSQL/Supabase  │
          │  - Indicadores        │
          │  - ValoresIndicador   │
          └───────────────────────┘
                      ▲
                      │
          ┌───────────┴───────────┐
          │  Scripts Python       │
          │  - Coleta Moedas      │
          │  - Coleta Inflação    │
          │  - Integrador         │
          └───────────┬───────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │                                   │
┌───▼────┐                      ┌───────▼───────┐
│ Bacen  │                      │     IBGE      │
│  API   │                      │  (Scraping)   │
└────────┘                      └───────────────┘
```
---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
  - Python 3.12 ou superior
  - Node.js 18.0 ou superior
  - npm ou yarn
  - PostgreSQL (ou conta Supabase)
  - Git (opcional)
Verificar versões
```bash
python --version
node --version
npm --version
```

---

## 🚀 Instalação

1️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/projeto-indicadores-mercado.git
cd projeto-indicadores-mercado
```

2️⃣ Configurar Backend
```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

3️⃣ Configurar Frontend
```bash
cd frontend
npm install
```

---

## ⚙️ Configuração

#### 1️⃣ Configurar Banco de Dados
Opção A: Supabase (Recomendado)
  - Criar conta em supabase.com
  - Criar novo projeto
  - Ir em Settings → Database
  - Copiar Connection String com Session Pooler
Opção B: PostgreSQL Local
```bash
# Criar banco de dados
createdb indicadores_db

# Ou via psql:
psql -U postgres
CREATE DATABASE indicadores_db;
```

#### 2️⃣ Variáveis de Ambiente
Crie o arquivo backend/.env:

```.env
# Banco de Dados (Supabase com Session Pooler)
DB_NAME=postgres
DB_USER=postgres.seuprojeto
DB_PASSWORD=sua_senha_aqui
DB_HOST=aws-1-sa-east-1.pooler.supabase.com
DB_PORT=5432

# Django
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Gerar SECRET_KEY:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

#### 3️⃣ Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```
#### 4️⃣ Criar Superusuário

```bash
python manage.py createsuperuser
```

---

## ▶️ Executando o Projeto

Backend (Django)
```bash
cd backend
python manage.py runserver
```
Acessar:
- API: http://127.0.0.1:8000/api/
- Admin: http://127.0.0.1:8000/admin/

Frontend (React)
```bash
cd frontend
npm start
```
Acessar: http://localhost:3000

---

## 🤖 Coleta Automática

Executar Manualmente
```bash
# Ativar ambiente virtual
venv\Scripts\activate
```
# Executar coleta
python scripts/integrador.py
Usar Atalho Windows
```bash
# Duplo clique em:
scripts/executar_coleta.bat
```
Agendar Coleta (Windows Task Scheduler)
- Abrir Agendador de Tarefas
- Criar Tarefa Básica
- Nome: "Coleta Indicadores"
- Acionador: Diariamente às 9h
- Ação: Iniciar programa
- Programa: C:\caminho\scripts\executar_coleta.bat

Agendar Coleta (Linux Cron)
```bash
# Editar crontab
crontab -e
```
O que a coleta faz:
- ✅ Coleta 10 moedas do Banco Central
- ✅ Coleta índices de inflação do IBGE
- ✅ Cria indicadores automaticamente se não existirem
- ✅ Adiciona novos valores sem duplicar
- ✅ Atualiza tipos vazios
- ✅ Gera relatório de execução

---

## 📂 Estrutura do Projeto

```
projeto-indicadores-mercado/
│
├── backend/                      # Django Backend
│   ├── core/                     # Configurações do projeto
│   │   ├── __init__.py
│   │   ├── settings.py          # Configurações principais
│   │   ├── urls.py              # URLs principais
│   │   └── wsgi.py
│   │
│   ├── indicadores/             # App principal
│   │   ├── migrations/          # Migrations do banco
│   │   ├── __init__.py
│   │   ├── admin.py             # Admin Django
│   │   ├── models.py            # Modelos (Indicador, ValorIndicador)
│   │   ├── serializers.py       # Serializers DRF
│   │   ├── views.py             # ViewSets da API
│   │   └── urls.py              # URLs da API
│   │
│   ├── manage.py                # Gerenciador Django
│   ├── .env                     # Variáveis de ambiente (NÃO COMMITAR)
│   └── db.sqlite3               # Banco SQLite (dev)
│
├── frontend/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── IndicadorCard.js
│   │   │   ├── IndicadorCard.css
│   │   │   ├── GraficoComparacao.js
│   │   │   ├── GraficoComparacao.css
│   │   │   ├── ExportarRelatorio.js
│   │   │   ├── ExportarRelatorio.css
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   │
│   │   ├── pages/               # Páginas
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── Comparacao.js
│   │   │   ├── Comparacao.css
│   │   │   ├── Cadastro.js
│   │   │   ├── Cadastro.css
│   │   │   ├── Detalhes.js
│   │   │   └── Detalhes.css
│   │   │
│   │   ├── services/            # Serviços
│   │   │   └── api.js           # Configuração Axios
│   │   │
│   │   ├── App.js               # Componente principal
│   │   ├── App.css
│   │   ├── index.js             # Entry point
│   │   └── index.css
│   │
│   ├── package.json             # Dependências Node
│   └── package-lock.json
│
├── scripts/                     # Scripts Python
│   ├── coleta_bacen.py          # [DEPRECATED] Coleta antiga
│   ├── coleta_moedas_multiplas.py  # Coleta 10+ moedas
│   ├── coleta_inflacao.py       # Coleta IPCA
│   ├── integrador.py            # Integrador principal
│   ├── corrigir_tipos_indicadores.py  # Utilitário
│   └── executar_coleta.bat      # Atalho Windows
│
├── venv/                        # Ambiente virtual Python (NÃO COMMITAR)
│
├── .gitignore                   # Arquivos ignorados pelo Git
├── requirements.txt             # Dependências Python
└── README.md                    # Esta documentação
```

---

## 🔌 API Endpoints

Base URL
```text
http://127.0.0.1:8000/api/
```
Indicadores
| Método | Endpoint                         | Descrição                   |
| ------ | -------------------------------- | --------------------------- |
| GET    | /indicadores/                    | Listar todos os indicadores |
| POST   | /indicadores/                    | Criar novo indicador        |
| GET    | /indicadores/{id}/               | Buscar indicador por ID     |
| PUT    | /indicadores/{id}/               | Atualizar indicador         |
| DELETE | /indicadores/{id}/               | Deletar indicador           |
| GET    | /indicadores/dashboard/          | Dashboard com último valor  |
| GET    | /indicadores/comparar/?ids=1,2,3 | Comparar múltiplos          |

Valores

| Método | Endpoint                 | Descrição               |
| ------ | ------------------------ | ----------------------- |
| GET    | /valores/                | Listar todos os valores |
| POST   | /valores/                | Criar novo valor        |
| GET    | /valores/?indicador={id} | Valores de um indicador |

Exemplos de Requisição
GET Dashboard
```bash
curl http://127.0.0.1:8000/api/indicadores/dashboard/
```
Resposta:

```json
[
  {
    "id": 1,
    "nome": "Dólar Americano",
    "tipo": "moeda",
    "unidade": "R$",
    "ultimo_valor": "6.0850",
    "data_ultima_atualizacao": "2026-01-05T10:30:00Z",
    "fonte_api": "https://olinda.bcb.gov.br/...",
    "descricao": "Cotação do Dólar..."
  }
]
```
POST Criar Indicador
```bash
curl -X POST http://127.0.0.1:8000/api/indicadores/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bitcoin",
    "tipo": "cripto",
    "unidade": "USD",
    "descricao": "Criptomoeda"
  }'
```
GET Comparar
```bash
curl "http://127.0.0.1:8000/api/indicadores/comparar/?ids=1,2,3"
```

---

## 🎓 Melhorias Futuras

Curto Prazo
- Modo escuro (dark mode)
- Filtros de período nos gráficos (7d, 30d, 3m, 1a)
- Notificações quando indicador atinge determinado valor
- Paginação na tabela de valores históricos
- Ordenação customizada nas tabelas

Médio Prazo
- Adicionar mais moedas (criptomoedas via CoinGecko)
- Adicionar mais índices (SELIC, CDI, IGPM, INPC)
- Gráficos de candlestick para moedas
- Comparação de variação percentual
- Previsões com Machine Learning (ARIMA, Prophet)
- Sistema de usuários com autenticação JWT
- Permissões (admin vs usuário comum)

Longo Prazo
- App mobile (React Native)
- Notificações push
- Webhooks para integração externa
- API pública com rate limiting
- Testes automatizados (100% coverage)
- CI/CD com GitHub Actions
- Docker e Docker Compose
- Deploy automatizado

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

Murilo Santori Boff

GitHub: https://github.com/murilosantoriboff
LinkedIn: https://www.linkedin.com/in/murilo-boff-a423b3234/

--

## 📝 Notas de Desenvolvimento

Problemas Resolvidos Durante o Desenvolvimento
1. DNS do Supabase
Problema: Erro getaddrinfo failed ao conectar com Supabase
Solução: Usar Session Pooler com IPv4: aws-1-sa-east-1.pooler.supabase.com

2. Indicadores sem Tipo
Problema: Indicadores criados automaticamente ficavam sem tipo
Solução: Script corrigir_tipos_indicadores.py e atualização do integrador

3. React Hook useEffect Warning
Problema: Warning de dependência faltando no useEffect
Solução: Usar useCallback para memorizar função de filtro

4. CORS no Django
Problema: Frontend não conseguia acessar API
Solução: Configurar django-cors-headers e CORS_ALLOWED_ORIGINS
