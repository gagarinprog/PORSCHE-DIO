# Porsche Sales Intelligence Dashboard — Agentes de IA

Atividade DIO: *"Criando uma Dashboard da Porsche com Agentes de IA"*.

Este projeto parte de um dashboard de vendas Porsche já construído em Excel
(limpeza de dados + KPIs + gráficos) e adiciona a camada que faltava: agentes
de IA (CrewAI) que analisam os números reais de vendas e geram insights
estruturados, servidos por uma API e exibidos em um frontend interativo.

## Arquitetura

```
[ Usuário / Dashboard ]
          │ (seleciona um modelo: 911, Taycan, Cayenne...)
          ▼
┌───────────────────────────────────────────────────────────┐
│                  FastAPI  (api/app.py)                     │
│           /api/data     /api/models     /api/analyze       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│           Crew de Agentes (CrewAI, sequencial)              │
├─────────────────────────────┬─────────────────────────────┤
│ 1. Sales Performance Analyst │ 2. Market & Regional        │
│ (unidades, receita,          │    Strategist                │
│  ticket médio por modelo)    │ (pagamento, entrega, estados)│
├─────────────────────────────┴─────────────────────────────┤
│ 3. Strategic Advisor                                        │
│ (consolida os dois anteriores em recomendações)             │
└───────────────────────────────────────────────────────────┘
          │ (JSON estruturado)
          ▼
[ Frontend (React + Recharts, tema escuro Porsche) ]
```

Os dados que alimentam os agentes vêm do próprio dashboard em Excel
(`DASH_BOARD_PORSCHE_.xlsx`, abas `Analise` e `Sanitized`), exportados para
`data/aggregates.json` via `scripts/export_data.py`. Os agentes nunca
inventam especificações técnicas: eles raciocinam em cima dos números reais
de vendas já tratados no Excel.

## Estrutura do repositório

```
porsche-ai-dashboard/
├── agents/
│   ├── agents.py         # definição dos 3 agentes (CrewAI)
│   └── crew_runner.py    # tasks + orquestração da crew
├── api/
│   └── app.py             # FastAPI (expõe os agentes ao frontend)
├── data/
│   └── aggregates.json    # dados exportados do Excel
├── scripts/
│   └── export_data.py     # regenera aggregates.json a partir do .xlsx
├── requirements.txt
├── .env.example
└── README.md
```

## Como rodar

1. Clone o repositório e crie um ambiente virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Copie `.env.example` para `.env` e preencha sua chave de API
   (OpenAI por padrão; veja o comentário em `agents/agents.py` para usar
   Claude/Anthropic no lugar).

3. (Opcional) Regenere os dados a partir do seu Excel:
   ```bash
   python scripts/export_data.py caminho/para/DASH_BOARD_PORSCHE_.xlsx
   ```

4. Suba a API:
   ```bash
   uvicorn api.app:app --reload --port 8000
   ```

5. Teste os agentes diretamente:
   ```bash
   python -m agents.crew_runner 911
   ```

6. Ou pela API:
   ```bash
   curl "http://localhost:8000/api/analyze?model=911"
   ```

## Frontend

Uma demonstração interativa do dashboard (gráficos com os dados reais +
painel de agentes de IA rodando ao vivo) está disponível como artifact nesta
conversa do Claude — inclua o screenshot dela aqui antes de submeter na DIO.
Para uma versão de produção conectada à API acima, aponte as chamadas do
frontend para `http://localhost:8000/api/analyze` no lugar da chamada direta
à API de LLM usada na demo.

## Créditos

Dados de vendas tratados a partir de `DASH_BOARD_PORSCHE_.xlsx`
(aba `Sanitized`: limpeza de datas, preços e quilometragem em formatos
inconsistentes; aba `Analise`: agregações; aba `Dashboard`: KPIs e gráficos).
