import React, { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import {
  Gauge, DollarSign, Car, Award, Truck, Percent, Play, Loader2, Terminal,
} from "lucide-react";

const COLORS = {
  void: "#0A0A0C",
  panel: "#16171C",
  panelAlt: "#1C1E24",
  line: "#2A2C33",
  red: "#D5001C",
  redDim: "#7A0812",
  gold: "#C9A227",
  goldDim: "#8A7020",
  hi: "#F3F1EA",
  mid: "#9C9CA3",
  dim: "#5B5C63",
};

const DATA = {
  kpis: {
    total_units: 100,
    total_revenue: 12827800.5,
    avg_ticket: 128278.01,
    maior_venda: 286500,
    km_media: 11422.1,
    pct_entregues: 0.41,
  },
  by_model: [
    { model: "911", units: 23, revenue: 4272700, avg_ticket: 185769.57 },
    { model: "718", units: 12, revenue: 1304950, avg_ticket: 108745.83 },
    { model: "Cayenne", units: 18, revenue: 2078650, avg_ticket: 115480.56 },
    { model: "Macan", units: 17, revenue: 1338350, avg_ticket: 78726.47 },
    { model: "Panamera", units: 14, revenue: 1498450, avg_ticket: 107032.14 },
    { model: "Taycan", units: 16, revenue: 2334700.5, avg_ticket: 145918.78 },
  ],
  status: [
    { status: "Delivered", count: 41 },
    { status: "Pending", count: 17 },
    { status: "In Transit", count: 15 },
    { status: "Cancelled", count: 7 },
    { status: "Awaiting Delivery", count: 5 },
    { status: "Shipped", count: 4 },
    { status: "Awaiting Pickup", count: 4 },
    { status: "Pending Approval", count: 4 },
    { status: "Pending Review", count: 2 },
    { status: "Awaiting Review", count: 1 },
  ],
  payment: [
    { method: "Wire Transfer", count: 26 },
    { method: "Credit Card", count: 15 },
    { method: "Financing", count: 13 },
    { method: "Cash", count: 12 },
    { method: "Bank Transfer", count: 10 },
    { method: "Lease", count: 10 },
    { method: "Crypto Payment", count: 6 },
    { method: "Debit Card", count: 4 },
    { method: "ACH Payment", count: 4 },
  ],
  top_states: [
    { state: "TX", revenue: 2023400.5 }, { state: "CA", revenue: 1973350 },
    { state: "AZ", revenue: 695950 }, { state: "NV", revenue: 643400 },
    { state: "FL", revenue: 566600 }, { state: "OH", revenue: 523850 },
    { state: "NC", revenue: 510100 }, { state: "GA", revenue: 434800 },
    { state: "LA", revenue: 361400 }, { state: "VA", revenue: 358700 },
  ],
  top_sellers: [
    { seller: "Peter Lane", revenue: 519000 }, { seller: "Karen Diaz", revenue: 494000 },
    { seller: "Rachel Turner", revenue: 369800 }, { seller: "Steve Ross", revenue: 361400 },
    { seller: "Diana Long", revenue: 351600 }, { seller: "Peter Ford", revenue: 337800 },
    { seller: "Steve Gray", revenue: 315250 }, { seller: "Megan Reed", revenue: 307000 },
    { seller: "Patrick Wood", revenue: 301700 }, { seller: "Henry King", revenue: 293000 },
  ],
  revenue_by_year: [
    { year: 2020, revenue: 377300 }, { year: 2021, revenue: 858950 },
    { year: 2022, revenue: 1517600 }, { year: 2023, revenue: 2142350.5 },
    { year: 2024, revenue: 4740800 }, { year: 2025, revenue: 2525100 },
    { year: 2026, revenue: 665700 },
  ],
};

const MODELS = ["Todos", "911", "718", "Cayenne", "Macan", "Panamera", "Taycan"];

const fmtUSD = (v) =>
  v >= 1000000
    ? `$${(v / 1000000).toFixed(2)}M`
    : `$${Math.round(v).toLocaleString("en-US")}`;

function useGoogleFont() {
  useEffect(() => {
    const l1 = document.createElement("link");
    l1.rel = "stylesheet";
    l1.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l1);
    return () => document.head.removeChild(l1);
  }, []);
}

function Redline() {
  const ticks = Array.from({ length: 48 });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 14, gap: 3, margin: "28px 0", opacity: 0.9 }}>
      {ticks.map((_, i) => {
        const inRed = i > 39;
        return (
          <div
            key={i}
            style={{
              width: 2,
              height: i % 4 === 0 ? 14 : 8,
              background: inRed ? COLORS.red : COLORS.line,
            }}
          />
        );
      })}
      <div style={{ flex: 1, height: 1, background: COLORS.line, marginLeft: 8 }} />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }) {
  return (
    <div style={{
      background: COLORS.panel, borderLeft: `2px solid ${accent ? COLORS.red : COLORS.line}`,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.mid }}>
        <Icon size={13} strokeWidth={1.75} />
        <span style={{ fontFamily: "Inter", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, fontWeight: 600, color: COLORS.hi, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}

function ChartCard({ title, children, height = 260 }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: "18px 18px 8px" }}>
      <div style={{ fontFamily: "Oswald", fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.hi, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

function tooltipStyle() {
  return {
    contentStyle: { background: COLORS.panelAlt, border: `1px solid ${COLORS.line}`, borderRadius: 4, fontFamily: "Inter", fontSize: 12 },
    labelStyle: { color: COLORS.hi },
    itemStyle: { color: COLORS.mid },
  };
}

async function callClaude(system, userText) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userText }],
    }),
  });
  const data = await resp.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}

function parseJsonLoose(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

export default function PorscheDashboard() {
  useGoogleFont();
  const [selected, setSelected] = useState("Todos");
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState([]);
  const [salesOut, setSalesOut] = useState(null);
  const [marketOut, setMarketOut] = useState(null);
  const [advisorOut, setAdvisorOut] = useState(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [lines]);

  const pushLine = (t) => setLines((prev) => [...prev, t]);

  const contextForSelection = () => {
    if (selected === "Todos") return DATA;
    const row = DATA.by_model.find((m) => m.model === selected);
    return { kpis: DATA.kpis, selected_model: row, status: DATA.status, payment: DATA.payment, top_states: DATA.top_states, top_sellers: DATA.top_sellers, revenue_by_year: DATA.revenue_by_year };
  };

  const runAgents = async () => {
    setRunning(true);
    setLines([]);
    setSalesOut(null); setMarketOut(null); setAdvisorOut(null);
    const ctx = JSON.stringify(contextForSelection());

    try {
      pushLine(`> Sales Performance Analyst analisando ${selected}...`);
      const salesText = await callClaude(
        "Você é o Porsche Sales Performance Analyst. Analise unidades, receita e ticket médio a partir de dados reais fornecidos. Nunca invente números. Responda APENAS em JSON, sem markdown, com as chaves: performance_summary (string, 2-3 frases em português), highlights (array de até 3 strings curtas).",
        `Dados reais de vendas: ${ctx}\nModelo em foco: ${selected}.`
      );
      const salesJson = parseJsonLoose(salesText);
      setSalesOut(salesJson || { performance_summary: salesText, highlights: [] });
      pushLine(`✓ Sales Performance Analyst concluído.`);

      pushLine(`> Market & Regional Strategist processando canais e praças...`);
      const marketText = await callClaude(
        "Você é o Market & Regional Strategist da Porsche. Analise status de entrega, formas de pagamento, estados e vendedores líderes. Responda APENAS em JSON, sem markdown, com as chaves: market_summary (string, 2-3 frases em português), risks (array de até 3 strings), opportunities (array de até 3 strings).",
        `Dados reais: ${ctx}\nAnálise do Sales Analyst: ${JSON.stringify(salesJson || salesText)}`
      );
      const marketJson = parseJsonLoose(marketText);
      setMarketOut(marketJson || { market_summary: marketText, risks: [], opportunities: [] });
      pushLine(`✓ Market & Regional Strategist concluído.`);

      pushLine(`> Strategic Advisor consolidando recomendações...`);
      const advisorText = await callClaude(
        "Você é o Strategic Advisor da diretoria comercial Porsche. Consolide as duas análises anteriores em um resumo executivo. Responda APENAS em JSON, sem markdown, com as chaves: summary (string, 2-3 frases em português), recommendations (array de até 3 strings priorizadas).",
        `Sales Analyst: ${JSON.stringify(salesJson || salesText)}\nMarket Strategist: ${JSON.stringify(marketJson || marketText)}`
      );
      const advisorJson = parseJsonLoose(advisorText);
      setAdvisorOut(advisorJson || { summary: advisorText, recommendations: [] });
      pushLine(`✓ Strategic Advisor concluído. Análise pronta.`);
    } catch (e) {
      pushLine(`✗ Erro ao consultar os agentes: ${String(e)}`);
    } finally {
      setRunning(false);
    }
  };

  const byModelData = DATA.by_model.map((m) => ({ ...m, isSel: selected === "Todos" ? false : m.model === selected }));

  return (
    <div style={{ "--fg": COLORS.hi, background: COLORS.void, color: COLORS.hi, fontFamily: "Inter", padding: 24, minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Oswald", fontWeight: 600, fontSize: 26, letterSpacing: "0.02em" }}>PORSCHE</div>
          <div style={{ color: COLORS.mid, fontSize: 13, marginTop: 2 }}>Sales Intelligence Dashboard — agentes de IA</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {MODELS.map((m) => (
            <button
              key={m}
              onClick={() => setSelected(m)}
              style={{
                fontFamily: "JetBrains Mono", fontSize: 12, padding: "6px 12px",
                background: selected === m ? COLORS.red : "transparent",
                color: selected === m ? COLORS.hi : COLORS.mid,
                border: `1px solid ${selected === m ? COLORS.red : COLORS.line}`,
                borderRadius: 3, cursor: "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <Redline />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: COLORS.line, border: `1px solid ${COLORS.line}` }}>
        <KpiTile icon={DollarSign} label="Receita total" value={fmtUSD(DATA.kpis.total_revenue)} accent />
        <KpiTile icon={Car} label="Vendas (qtd)" value={DATA.kpis.total_units} />
        <KpiTile icon={Gauge} label="Ticket médio" value={fmtUSD(DATA.kpis.avg_ticket)} />
        <KpiTile icon={Award} label="Maior venda" value={fmtUSD(DATA.kpis.maior_venda)} />
        <KpiTile icon={Percent} label="% Entregues" value={`${Math.round(DATA.kpis.pct_entregues * 100)}%`} />
        <KpiTile icon={Truck} label="KM média" value={DATA.kpis.km_media.toLocaleString("en-US")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginTop: 20 }}>
        <ChartCard title="Vendas por modelo">
          <ResponsiveContainer>
            <BarChart data={byModelData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="model" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <Tooltip {...tooltipStyle()} formatter={(v) => fmtUSD(v)} />
              <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                {byModelData.map((d, i) => (
                  <Cell key={i} fill={d.isSel ? COLORS.red : COLORS.goldDim} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Receita por ano do modelo">
          <ResponsiveContainer>
            <BarChart data={DATA.revenue_by_year} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="year" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <Tooltip {...tooltipStyle()} formatter={(v) => fmtUSD(v)} />
              <Bar dataKey="revenue" radius={[3, 3, 0, 0]} fill={COLORS.gold} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status de entrega" height={280}>
          <ResponsiveContainer>
            <BarChart data={DATA.status} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="status" type="category" width={110} tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]} fill={COLORS.red}>
                <LabelList dataKey="count" position="right" fill={COLORS.mid} fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Forma de pagamento" height={280}>
          <ResponsiveContainer>
            <BarChart data={DATA.payment} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="method" type="category" width={110} tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]} fill={COLORS.gold}>
                <LabelList dataKey="count" position="right" fill={COLORS.mid} fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 estados por receita" height={300}>
          <ResponsiveContainer>
            <BarChart data={DATA.top_states} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <YAxis dataKey="state" type="category" width={40} tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} formatter={(v) => fmtUSD(v)} />
              <Bar dataKey="revenue" radius={[0, 3, 3, 0]} fill={COLORS.red} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 vendedores por receita" height={300}>
          <ResponsiveContainer>
            <BarChart data={DATA.top_sellers} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}k`} />
              <YAxis dataKey="seller" type="category" width={95} tick={{ fill: COLORS.mid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} formatter={(v) => fmtUSD(v)} />
              <Bar dataKey="revenue" radius={[0, 3, 3, 0]} fill={COLORS.gold} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Redline />

      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "Oswald", fontSize: 15, letterSpacing: "0.04em", textTransform: "uppercase" }}>Agentes de IA</div>
            <div style={{ color: COLORS.mid, fontSize: 12, marginTop: 2 }}>Sales Performance Analyst → Market & Regional Strategist → Strategic Advisor</div>
          </div>
          <button
            onClick={runAgents}
            disabled={running}
            style={{
              display: "flex", alignItems: "center", gap: 8, fontFamily: "JetBrains Mono", fontSize: 13,
              padding: "9px 16px", background: running ? COLORS.dim : COLORS.red, color: COLORS.hi,
              border: "none", borderRadius: 3, cursor: running ? "default" : "pointer",
            }}
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "Rodando..." : "Rodar agentes de IA"}
          </button>
        </div>

        {lines.length > 0 && (
          <div
            ref={consoleRef}
            style={{
              background: COLORS.void, border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 12,
              fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.gold, maxHeight: 130, overflowY: "auto", marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.mid, marginBottom: 6 }}>
              <Terminal size={12} /> live feed
            </div>
            {lines.map((l, i) => <div key={i} style={{ lineHeight: 1.6 }}>{l}</div>)}
          </div>
        )}

        {(salesOut || marketOut || advisorOut) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {salesOut && (
              <div style={{ borderLeft: `2px solid ${COLORS.gold}`, background: COLORS.panelAlt, padding: 14 }}>
                <div style={{ fontFamily: "Oswald", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.gold, marginBottom: 8 }}>Sales Performance Analyst</div>
                <p style={{ fontSize: 13, color: COLORS.hi, margin: "0 0 8px", lineHeight: 1.6 }}>{salesOut.performance_summary}</p>
                <ul style={{ margin: 0, paddingLeft: 16, color: COLORS.mid, fontSize: 12.5, lineHeight: 1.7 }}>
                  {(salesOut.highlights || []).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {marketOut && (
              <div style={{ borderLeft: `2px solid ${COLORS.gold}`, background: COLORS.panelAlt, padding: 14 }}>
                <div style={{ fontFamily: "Oswald", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.gold, marginBottom: 8 }}>Market & Regional Strategist</div>
                <p style={{ fontSize: 13, color: COLORS.hi, margin: "0 0 8px", lineHeight: 1.6 }}>{marketOut.market_summary}</p>
                <ul style={{ margin: 0, paddingLeft: 16, color: COLORS.mid, fontSize: 12.5, lineHeight: 1.7 }}>
                  {(marketOut.risks || []).map((r, i) => <li key={`r${i}`}>⚠ {r}</li>)}
                  {(marketOut.opportunities || []).map((o, i) => <li key={`o${i}`}>↗ {o}</li>)}
                </ul>
              </div>
            )}
            {advisorOut && (
              <div style={{ borderLeft: `2px solid ${COLORS.red}`, background: COLORS.panelAlt, padding: 14 }}>
                <div style={{ fontFamily: "Oswald", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.red, marginBottom: 8 }}>Strategic Advisor</div>
                <p style={{ fontSize: 13, color: COLORS.hi, margin: "0 0 8px", lineHeight: 1.6 }}>{advisorOut.summary}</p>
                <ul style={{ margin: 0, paddingLeft: 16, color: COLORS.mid, fontSize: 12.5, lineHeight: 1.7 }}>
                  {(advisorOut.recommendations || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
