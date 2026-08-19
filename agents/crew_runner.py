"""
Orquestração da Crew — transforma os dados do dashboard em insights.

run_porsche_crew(model_name) monta o contexto (recorte dos dados reais
para o modelo escolhido, ou tudo se model_name == "all"), dispara os três
agentes em sequência e devolve um JSON pronto para o frontend consumir.
"""

import json
import os
from pathlib import Path

from crewai import Crew, Process, Task

from agents.agents import build_agents

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "aggregates.json"


def load_data() -> dict:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def filter_for_model(data: dict, model_name: str) -> dict:
    if not model_name or model_name.lower() == "all":
        return data
    model_row = next(
        (m for m in data["by_model"] if m["model"].lower() == model_name.lower()),
        None,
    )
    return {
        "kpis": data["kpis"],
        "selected_model": model_row,
        "status": data["status"],
        "payment": data["payment"],
        "top_states": data["top_states"],
        "top_sellers": data["top_sellers"],
        "revenue_by_year": data["revenue_by_year"],
    }


def run_porsche_crew(model_name: str = "all") -> dict:
    data = load_data()
    context = filter_for_model(data, model_name)
    context_json = json.dumps(context, ensure_ascii=False)

    sales_analyst, market_strategist, strategic_advisor = build_agents()

    task_sales = Task(
        description=(
            "Aqui estão os dados reais de vendas Porsche (JSON): "
            f"{context_json}\n\n"
            f"Modelo em foco: {model_name}. Analise unidades vendidas, "
            "receita e ticket médio. Aponte 2-3 conclusões objetivas."
        ),
        expected_output=(
            "JSON com as chaves: performance_summary (string), "
            "highlights (lista de strings)."
        ),
        agent=sales_analyst,
    )

    task_market = Task(
        description=(
            "Usando os mesmos dados, analise status de entrega, formas de "
            "pagamento, estados líderes em receita e top vendedores. "
            "Aponte riscos (ex: % de cancelamentos/pendências) e "
            "oportunidades regionais."
        ),
        expected_output=(
            "JSON com as chaves: market_summary (string), "
            "risks (lista de strings), opportunities (lista de strings)."
        ),
        agent=market_strategist,
        context=[task_sales],
    )

    task_advisor = Task(
        description=(
            "Com base nas duas análises anteriores, escreva um resumo "
            "executivo e até 3 recomendações priorizadas para a diretoria "
            "comercial."
        ),
        expected_output=(
            "JSON com as chaves: summary (string), "
            "recommendations (lista de strings)."
        ),
        agent=strategic_advisor,
        context=[task_sales, task_market],
    )

    crew = Crew(
        agents=[sales_analyst, market_strategist, strategic_advisor],
        tasks=[task_sales, task_market, task_advisor],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return {
        "model": model_name,
        "sales_analysis": task_sales.output.raw if task_sales.output else None,
        "market_analysis": task_market.output.raw if task_market.output else None,
        "advisor_summary": task_advisor.output.raw if task_advisor.output else None,
        "raw": str(result),
    }


if __name__ == "__main__":
    import sys

    model = sys.argv[1] if len(sys.argv) > 1 else "all"
    output = run_porsche_crew(model)
    print(json.dumps(output, indent=2, ensure_ascii=False))
