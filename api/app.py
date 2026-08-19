"""
API que conecta o frontend do dashboard aos agentes de IA.

Endpoints:
    GET /api/data                -> dados agregados (para os gráficos)
    GET /api/analyze?model=911   -> dispara a crew e devolve os insights
    GET /api/models              -> lista de modelos disponíveis

Rodar localmente:
    uvicorn api.app:app --reload --port 8000
"""

import json
import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(str(Path(__file__).resolve().parent.parent))

load_dotenv()

from agents.crew_runner import load_data, run_porsche_crew  # noqa: E402

app = FastAPI(title="Porsche Sales Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/data")
def get_data():
    return load_data()


@app.get("/api/models")
def get_models():
    data = load_data()
    return {"models": ["all"] + [m["model"] for m in data["by_model"]]}


@app.get("/api/analyze")
def analyze(model: str = Query(default="all")):
    result = run_porsche_crew(model)
    return result


@app.get("/")
def health():
    return {"status": "ok", "service": "porsche-ai-dashboard-api"}
