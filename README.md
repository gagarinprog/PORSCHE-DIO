# PORSCHE-DIO

Este repositório contém o projeto "porsche-ai-dashboard" empacotado no arquivo porsche-ai-dashboard.zip. Extraí o ZIP em um branch separado e adicionei documentação e arquivos de limpeza para tornar o repositório utilizável.

Resumo do que há no ZIP (detectado automaticamente):
- api/ (backend Python, entrypoint: api/app.py)
- frontend/ (componente React: PorscheDashboard.jsx)
- agents/ (agentes e scripts)
- scripts/ (utilitários, ex: export_data.py)
- data/ (ex.: aggregates.json)
- requirements.txt
- README.md (documentação dentro do ZIP)

Próximos passos recomendados (automáticos ou manuais):
1. Extrair o ZIP para o diretório porsche-ai-dashboard/ (veja comandos abaixo).
2. Remover qualquer diretório .git que venha dentro do ZIP (evitar repositório aninhado).
3. Criar um ambiente virtual e instalar as dependências Python.
4. Confirmar se o frontend precisa de um package.json e scaffold (CRA/Vite) antes de rodar.

Comandos sugeridos (na máquina local após clonar):
```bash
# extrair conteúdo do ZIP para o diretório atual
unzip porsche-ai-dashboard.zip -d .
# remover repositório git interno, caso exista
rm -rf porsche-ai-dashboard/.git
# criar e ativar venv Python
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r porsche-ai-dashboard/requirements.txt
# rodar backend (verifique api/app.py)
python porsche-ai-dashboard/api/app.py
```

Se preferir, eu posso (com sua autorização) extrair o ZIP diretamente no branch e remover o .git interno; por ora criei este branch com documentação e arquivos de organização.

Se quiser que eu aplique a extração automática e abra um PR com todos os arquivos do projeto, diga "Extrair e abrir PR".
