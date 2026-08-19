"""
Agentes de IA do Dashboard Porsche — Sales Intelligence
=========================================================

Três agentes especializados, orquestrados com CrewAI, analisam os dados
reais de vendas exportados do dashboard (data/aggregates.json) e devolvem
um payload JSON estruturado para alimentar o frontend.

    1. Sales Performance Analyst  -> métricas de desempenho por modelo
    2. Market & Regional Strategist -> canais de pagamento, entrega, praças
    3. Strategic Advisor -> consolida os dois anteriores em recomendações

Configuração do LLM
--------------------
Por padrão usamos a OpenAI (gpt-4o-mini), igual ao material da DIO.
Se preferir usar a Claude API da Anthropic, troque o bloco `get_llm()`
para `ChatAnthropic(model="claude-sonnet-4-6")` (requer `langchain-anthropic`
e a variável ANTHROPIC_API_KEY no .env).
"""

import os
from crewai import Agent
from langchain_openai import ChatOpenAI


def get_llm():
    """Carrega o LLM a partir das variáveis de ambiente (.env)."""
    return ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.3,
    )


def build_agents(llm=None):
    llm = llm or get_llm()

    sales_analyst = Agent(
        role="Porsche Sales Performance Analyst",
        goal=(
            "Analisar o desempenho de vendas por modelo (unidades, receita, "
            "ticket médio) e apontar quais linhas estão performando acima "
            "ou abaixo da média, com base nos dados reais fornecidos."
        ),
        backstory=(
            "Analista de performance comercial especializado na linha "
            "Porsche (911, 718, Cayenne, Macan, Panamera, Taycan). "
            "Trabalha sempre em cima de números reais de vendas, nunca "
            "inventa dados que não estejam no contexto fornecido."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

    market_strategist = Agent(
        role="Market & Regional Strategist",
        goal=(
            "Analisar canais de pagamento, status de entrega e concentração "
            "geográfica de receita (estados/vendedores) para identificar "
            "riscos operacionais e oportunidades comerciais."
        ),
        backstory=(
            "Estrategista de mercado automotivo de luxo, com foco em "
            "distribuição regional, eficiência do funil de entrega e mix "
            "de formas de pagamento."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

    strategic_advisor = Agent(
        role="Strategic Advisor",
        goal=(
            "Consolidar as análises técnica e de mercado em um resumo "
            "executivo com recomendações objetivas e priorizadas."
        ),
        backstory=(
            "Consultor sênior que traduz análises técnicas em decisões de "
            "negócio para a diretoria comercial da Porsche."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

    return sales_analyst, market_strategist, strategic_advisor
