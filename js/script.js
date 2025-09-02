// =================== CONFIGURAÇÃO ===================
const ADMIN_PIN = "1234"; // <<< Altere o PIN aqui

// Operações (público)
// Campos: title, url, desc, tags, status (Vigente|Planejada|Encerrada), periodo, responsavel
const OPERACOES = [
  {
    title: "OPO 01 – ICARUS: Garantindo a Ordem",
    url: "#",
    desc: "Fiscalização ostensiva com blitzes estratégicas e lavratura de TCOs para prevenir acidentes, reduzir riscos e fortalecer a sensação de segurança.",
    tags: ["urbano","arapiraca"],
    status: "Vigente",
    periodo: "Seg–Qui: 08h15–09h30 | Sex–Dom: 07h45–09h00",
    responsavel: "Todas as RP e FT em Arapiraca"
  },
  {
    title: "OPO 02 – FAUNO: Sentinela das Trilhas",
    url: "#",
    desc: "Reforço policial e fiscalização de trânsito em zonas rurais de Arapiraca e demais cidades, prevenindo acidentes e garantindo mobilidade segura.",
    tags: ["rural","trânsito"],
    status: "Vigente",
    periodo: "Seg–Qui: 08h15–09h00 | Sex–Dom: 07h45–08h30",
    responsavel: "Todas as guarnições exceto Arapiraca"
  },
  {
    title: "OPO 03 – ÓRION: Batalhão Vigilante",
    url: "#",
    desc: "Integra ações preventivas, repressivas e de inteligência para reduzir crimes violentos, receptação e infrações viárias.",
    tags: ["urbano","rodovia"],
    status: "Vigente",
    periodo: "Seg–Qui: manhã 09h30–11h30 | tarde 15h30–17h00 | noite 20h00–21h30 | madrugada 23h00–01h00 | Sex–Dom: horários equivalentes",
    responsavel: "Todas as RP e FT do 3º BPM"
  },
  {
    title: "OPO 04 – CERBERUS: Sentinela Escolar",
    url: "#",
    desc: "Proteção da comunidade escolar com ações preventivas contra transporte irregular, drogas, álcool e crimes nas imediações das escolas.",
    tags: ["escolar","prevenção"],
    status: "Vigente",
    periodo: "Seg–Qui: manhã 11h30–12h30 | tarde 17h00–19h00 | noite 21h30–23h00",
    responsavel: "Todas as guarnições exceto Arapiraca"
  },
  {
    title: "OPO 05 – AURORA: Garantindo a Ordem",
    url: "#",
    desc: "Fiscalização ostensiva para coibir infrações de trânsito e condutas que coloquem terceiros em risco, com blitzes e abordagens educativas.",
    tags: ["arapiraca","trânsito"],
    status: "Vigente",
    periodo: "Seg–Qui: 05h00–06h30 | Sex–Dom: 05h30–06h30",
    responsavel: "Todas as RP e FT em Arapiraca"
  },
  {
    title: "OPO 06 – HERMES: Repressão ao Tráfico em Trânsito",
    url: "#",
    desc: "Foco em repressão ao tráfico durante deslocamentos, com patrulhamentos em horários de maior risco.",
    tags: ["rodovia","tráfico"],
    status: "Vigente",
    periodo: "Sex–Dom: manhã 10h30–12h00 | tarde 18h00–19h30 | noite 22h30–00h00",
    responsavel: "Todas as guarnições exceto Arapiraca"
  }
];

// Área do Gestor (restrita)
// Campos: title, url, desc, tags, status
const RESTRITOS = [
  { title: "Mapa Tático (Sigiloso)", url: "https://exemplo.gov/gestor/mapa", desc: "Dispositivo e horários sensíveis.", tags: ["tático","intel"], status: "Vigente" },
  { title: "Escala Extra (Conf.)", url: "https://exemplo.gov/gestor/escala", desc: "Planilha com lotação.", tags: ["admin"], status: "Vigente" },
  { title: "Relatório Pós-Ação", url: "https://exemplo.gov/gestor/pos-acao", desc: "Dados operacionais.", tags: ["relatório"], status: "Encerrada" }
];

// Rotina RP em grade comparativa: Hora | ARAPIRACA | Demais Cidades
const ROTINA_GRID = {
  "Seg–Qui": [
    { hora: "07:00–07:25", arapiraca: "Cautela de armamentos, equipamentos e veículos", demais: "Cautela de armamentos, equipamentos e veículos" },
    { hora: "07:25–07:30", arapiraca: "Formatura matinal", demais: "Formatura matinal" },
    { hora: "07:30–07:45", arapiraca: "Preleção – Oficial de Operações", demais: "Preleção – Oficial de Operações" },
    { hora: "07:45–08:15", arapiraca: "Instrução Geral Básica", demais: "Instrução Geral Básica" },
    { hora: "08:15–09:00", arapiraca: "OPO 01 – ICARUS", demais: "OPO 02 – FAUNO" },
    { hora: "09:00–09:30", arapiraca: "Deslocamento da tropa", demais: "Deslocamento da tropa" },
    { hora: "09:30–11:30", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "11:30–12:30", arapiraca: "OPO 04 – CERBERUS", demais: "OPO 04 – CERBERUS" },
    { hora: "12:30–15:30", arapiraca: "Almoço / Prontidão", demais: "Almoço / Prontidão" },
    { hora: "15:30–17:00", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "17:00–19:00", arapiraca: "OPO 04 – CERBERUS", demais: "OPO 04 – CERBERUS" },
    { hora: "19:00–20:00", arapiraca: "Jantar / Prontidão", demais: "Jantar / Prontidão" },
    { hora: "20:00–21:30", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "21:30–23:00", arapiraca: "OPO 04 – CERBERUS", demais: "OPO 04 – CERBERUS" },
    { hora: "23:00–01:00", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "01:00–05:00", arapiraca: "Prontidão", demais: "Prontidão" },
    { hora: "05:00–06:00", arapiraca: "OPO 05 – AURORA", demais: "OPO 02 – FAUNO" },
    { hora: "06:00–06:30", arapiraca: "Recolhimento à Sede do 3º BPM", demais: "Recolhimento à Sede do 3º BPM" },
    { hora: "06:30–07:00", arapiraca: "Desarme de armamentos, equipamentos e veículos", demais: "Desarme de armamentos, equipamentos e veículos" }
  ],
  "Sex–Dom": [
    { hora: "07:00–07:25", arapiraca: "Cautela de armamentos, equipamentos e veículos", demais: "Cautela de armamentos, equipamentos e veículos" },
    { hora: "07:25–07:30", arapiraca: "Formatura matinal", demais: "Formatura matinal" },
    { hora: "07:30–07:45", arapiraca: "Preleção – Oficial de Operações", demais: "Preleção – Oficial de Operações" },
    { hora: "07:45–08:30", arapiraca: "OPO 01 – ICARUS", demais: "OPO 02 – FAUNO" },
    { hora: "08:30–09:00", arapiraca: "Deslocamento da tropa", demais: "Deslocamento da tropa" },
    { hora: "09:00–10:30", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "10:30–12:00", arapiraca: "OPO 06 – HERMES", demais: "OPO 06 – HERMES" },
    { hora: "12:00–16:00", arapiraca: "Almoço / Prontidão", demais: "Almoço / Prontidão" },
    { hora: "16:00–18:00", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "18:00–19:30", arapiraca: "OPO 06 – HERMES", demais: "OPO 06 – HERMES" },
    { hora: "19:30–21:00", arapiraca: "Jantar / Prontidão", demais: "Jantar / Prontidão" },
    { hora: "21:00–22:30", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "22:30–00:00", arapiraca: "OPO 06 – HERMES", demais: "OPO 06 – HERMES" },
    { hora: "00:00–02:00", arapiraca: "OPO 03 – ÓRION", demais: "OPO 03 – ÓRION" },
    { hora: "02:00–05:30", arapiraca: "Prontidão", demais: "Prontidão" },
    { hora: "05:30–06:10", arapiraca: "OPO 05 – AURORA", demais: "OPO 02 – FAUNO" },
    { hora: "06:10–06:30", arapiraca: "Recolhimento à Sede do 3º BPM", demais: "Recolhimento à Sede do 3º BPM" },
    { hora: "06:30–07:00", arapiraca: "Desarme de armamentos, equipamentos e veículos", demais: "Desarme de armamentos, equipamentos e veículos" }
  ]
};

<hr style="border:0;border-top:1px dashed var(--ring);margin:18px 0;">
<h2 style="margin:0 0 6px 0;font-size:18px;">Distribuição de RP por Turno</h2>
<div class="muted" style="margin-bottom:8px">Consulta por turno e por cidade.</div>

<div class="toolbar">
  <label class="muted">Turno:</label>
  <select id="turnoSel" class="input">
    <option value="ALFA">ALFA</option>
    <option value="BRAVO">BRAVO</option>
    <option value="CHARLIE">CHARLIE</option>
    <option value="DELTA">DELTA</option>
  </select>

  <label class="muted">Cidade:</label>
  <input id="buscaCidade" class="input" placeholder="Ex.: Arapiraca, Craíbas..." style="max-width:260px">

  <button id="btnLimparFiltro" class="btn">Limpar</button>
</div>

<div class="table-wrap">
  <table class="rotina" id="tabelaDistrib">
    <thead>
      <tr>
        <th style="width:260px">Cidade</th>
        <th>RPs atribuídas no turno</th>
      </tr>
    </thead>
    <tbody><!-- preenchido via JS --></tbody>
  </table>
</div>


// =================== Utilidades ===================
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const store = { get k(){ return "bpmPortalPrefs"; }, read(){ try{ return JSON.parse(localStorage.getItem(this.k))||{} }catch{ return {} } }, write(d){ localStorage.setItem(this.k, JSON.stringify(d)); } };

const clicksStore = (ns) => ({
  key: url => `${ns}::${url}`,
  get(url){ return parseInt(localStorage.getItem(this.key(url))||"0",10); },
  add(url){ const n = this.get(url)+1; localStorage.setItem(this.key(url), String(n)); return n; },
  all(list){ return list.map(l=>({ title:l.title, url:l.url, clicks:this.get(l.url) })); }
});

function toast(msg){ const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(()=> el.classList.remove("show"), 1800); }

// =================== Estado ===================
const state = { tab: "op", q: "", status: "Todos", tag: "Todos", gestorOK: false };

function uniqueTags(list){ const s = new Set(); list.forEach(l => (l.tags||[]).forEach(t => s.add(t))); return ["Todos", ...Array.from(s).sort((a,b)=>a.localeCompare(b))]; }

function renderTags(){
  const list = state.tab === "op" ? OPERACOES : RESTRITOS;
  const wrap = $("#tags");
  wrap.innerHTML = uniqueTags(list).map(t=>`<button class="chip" role="button" aria-pressed="${state.tag===t}" data-tag="${t}">${t}</button>`).join("");
  wrap.onclick = (e)=>{ const btn = e.target.closest(".chip"); if(!btn) return; state.tag = btn.dataset.tag; renderGrid(); };
}

function matches(l){
  const byStatus = state.status === "Todos" || (l.status||"") === state.status;
  const byTag = state.tag === "Todos" || (l.tags||[]).includes(state.tag);
  const q = state.q.trim().toLowerCase();
  if(!q) return byStatus && byTag;
  const blob = `${l.title} ${l.desc||""} ${l.url} ${(l.periodo||"")} ${(l.responsavel||"")}`.toLowerCase();
  return byStatus && byTag && blob.includes(q);
}

function cardHTML(l, nsStore){
  const cs = nsStore.get(l.url);
  const safeURL = l.url.replace(/&/g, "&amp;");
  const badge = (l.status==="Vigente"?"ok":(l.status==="Planejada"?"warn":"danger"));
  return `
  <article class="card" role="listitem" data-url="${safeURL}">
    <div class="counter" title="Cliques registrados neste navegador">${cs} clique${cs!==1?"s":""}</div>
    <h3>${l.title}</h3>
    <div class="meta">
      ${l.status?`<span class="badge ${badge}">${l.status}</span>`:""}
      ${l.periodo?`<span class="badge">${l.periodo}</span>`:""}
      ${l.responsavel?`<span class="badge">Resp.: ${l.responsavel}</span>`:""}
      ${(l.tags||[]).map(t=>`<span class="badge">#${t}</span>`).join(" ")}
    </div>
    ${l.desc ? `<p>${l.desc}</p>` : ""}
    <div class="actions">
      <button class="btn primary" data-act="open" aria-label="Abrir ${l.title}">Abrir</button>
      <button class="btn" data-act="copy" aria-label="Copiar link de ${l.title}">Copiar</button>
      <button class="btn" data-act="share" aria-label="Compartilhar ${l.title}">Compartilhar</button>
    </div>
    <div class="url">${safeURL}</div>
  </article>`
}

function renderGrid(){
  const list = (state.tab === "op" ? OPERACOES : RESTRITOS).filter(matches);
  const grid = state.tab === "op" ? $("#grid-op") : $("#grid-gestor");
  const empty = state.tab === "op" ? $("#empty-op") : $("#empty-gestor");
  const ns = state.tab === "op" ? clicksStore("op") : clicksStore("gestor");
  grid.innerHTML = list.map(l=>cardHTML(l, ns)).join("");
  empty.hidden = list.length > 0;

  grid.onclick = async (e)=>{
    const btn = e.target.closest(".btn"); if(!btn) return;
    const card = e.target.closest(".card");
    const url = card.dataset.url; const act = btn.dataset.act;
    if(act === "open"){
      const w = window.open(url, "_blank");
      ns.add(url);
      card.querySelector(".counter").textContent = `${ns.get(url)} cliques`;
      if(!w) toast("Navegador bloqueou pop-up. Permita pop-ups para abrir.");
    }
    if(act === "copy"){ try{ await navigator.clipboard.writeText(url); toast("Link copiado!"); } catch{ toast("Não foi possível copiar."); } }
    if(act === "share"){
      if(navigator.share){ try{ await navigator.share({ title: document.title, text: card.querySelector("h3").textContent, url }); } catch{} }
      else { try{ await navigator.clipboard.writeText(url); toast("Compartilhar não suportado — link copiado!"); } catch{ toast("Compartilhar não suportado."); } }
    }
  };
}

function switchTab(tab){
  state.tab = tab;
  state.tag = "Todos";

  $("#tab-op")?.setAttribute("aria-selected", tab==="op");
  $("#tab-gestor")?.setAttribute("aria-selected", tab==="gestor");

  $("#painel-op").hidden = tab!=="op";
  $("#painel-gestor").hidden = tab!=="gestor";

  if (tab === "op" || tab === "gestor") {
    renderTags();
    renderGrid();
  }

  // >>> renderiza a Rotina somente quando o painel do Gestor estiver ativo
  if (tab === "gestor") {
    renderRotinaIntoGestor();
  }
}

function ensureGestor(){
  if(state.gestorOK) return switchTab("gestor");
  $("#modal").classList.add("show");
  $("#pin").focus();
}

function checkPin(){
  const v = $("#pin").value.trim();
  if(!v) return;
  if(v === ADMIN_PIN){
    state.gestorOK = true; localStorage.setItem("bpmPortalGestorOK", "1");
    $("#modal").classList.remove("show");
    switchTab("gestor");
  } else {
    toast("PIN incorreto");
  }
}

function renderVersion(){
  const d = new Date();
  $("#versao").textContent = `v1 • ${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;
}

const ROTINA = [
  {
    periodo: "Segunda a Quinta",
    horarios: [
      { hora: "07h00 – 07h25", atividade: "Cautela dos armamentos, equipamentos e veículos" },
      { hora: "07h25 – 07h30", atividade: "Apresentação para Formatura Matinal" },
      { hora: "07h30 – 07h45", atividade: "Preleção com o Oficial de Operações" },
      { hora: "07h45 – 08h15", atividade: "Instrução Geral Básica" },
      { hora: "08h15 – 09h00", atividade: "OPO 01 – ICARUS / OPO 02 – FAUNO" },
      { hora: "09h00 – 09h30", atividade: "Deslocamento da Tropa" },
      { hora: "09h30 – 11h30", atividade: "OPO 03 – ÓRION" },
      { hora: "11h30 – 12h30", atividade: "OPO 04 – CERBERUS" },
      { hora: "12h30 – 15h30", atividade: "Almoço / Prontidão" },
      { hora: "15h30 – 17h00", atividade: "OPO 03 – ÓRION" },
      { hora: "17h00 – 19h00", atividade: "OPO 04 – CERBERUS" },
      { hora: "19h00 – 20h00", atividade: "Jantar / Prontidão" },
      { hora: "20h00 – 21h30", atividade: "OPO 03 – ÓRION" },
      { hora: "21h30 – 23h00", atividade: "OPO 04 – CERBERUS" },
      { hora: "23h00 – 01h00", atividade: "OPO 03 – ÓRION" },
      { hora: "01h00 – 05h00", atividade: "Prontidão" },
      { hora: "05h00 – 06h00", atividade: "OPO 05 – AURORA / OPO 02 – FAUNO" },
      { hora: "06h00 – 06h30", atividade: "Recolhimento à Sede do 3º BPM" },
      { hora: "06h30 – 07h00", atividade: "Desarme dos armamentos, equipamentos e veículos" }
    ]
  },
  {
    periodo: "Sexta a Domingo",
    horarios: [
      { hora: "07h00 – 07h25", atividade: "Cautela dos armamentos, equipamentos e veículos" },
      { hora: "07h25 – 07h30", atividade: "Apresentação para Formatura Matinal" },
      { hora: "07h30 – 07h45", atividade: "Preleção com o Oficial de Operações" },
      { hora: "07h45 – 08h30", atividade: "OPO 01 – ICARUS / OPO 02 – FAUNO" },
      { hora: "08h30 – 09h00", atividade: "Deslocamento da Tropa" },
      { hora: "09h00 – 10h30", atividade: "OPO 03 – ÓRION" },
      { hora: "10h30 – 12h00", atividade: "OPO 06 – HERMES" },
      { hora: "12h00 – 16h00", atividade: "Almoço / Prontidão" },
      { hora: "16h00 – 18h00", atividade: "OPO 03 – ÓRION" },
      { hora: "18h00 – 19h30", atividade: "OPO 06 – HERMES" },
      { hora: "19h30 – 21h00", atividade: "Jantar / Prontidão" },
      { hora: "21h00 – 22h30", atividade: "OPO 03 – ÓRION" },
      { hora: "22h30 – 00h00", atividade: "OPO 06 – HERMES" },
      { hora: "00h00 – 02h00", atividade: "OPO 03 – ÓRION" },
      { hora: "02h00 – 05h30", atividade: "Prontidão" },
      { hora: "05h30 – 06h10", atividade: "OPO 05 – AURORA / OPO 02 – FAUNO" },
      { hora: "06h10 – 06h30", atividade: "Recolhimento à Sede do 3º BPM" },
      { hora: "06h30 – 07h00", atividade: "Desarme dos armamentos, equipamentos e veículos" }
    ]
  }
];

function parseInterval(hhmm) {
  // "07:45–08:30" -> [dateStart, dateEnd] hoje na TZ local
  const [a,b] = hhmm.split("–");
  const [sh, sm] = a.split(":").map(Number);
  const [eh, em] = b.split(":").map(Number);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0);
  return [start, end];
}

function isNowBetween(hhmm) {
  const now = new Date();
  const [start, end] = parseInterval(hhmm);
  return now >= start && now <= end;
}

function badgeFor(text) {
  // Detecta “OPO XX – NOME” e devolve span com badge
  const m = text.match(/OPO\\s*\\d+\\s*–\\s*([A-ZÁÉÍÓÚÃÕÇ]+|ÓRION)/i);
  if (!m) return text;
  const nome = m[1].toUpperCase().replace("Ó", "Ó").replace("ORION","ÓRION");
  return text.replace(m[0], `<span class="badge-opo badge-${nome}">${m[0]}</span>`);
}

function rotinaPeriodoAtualKey() {
  // 0=Dom ... 6=Sáb
  const d = new Date().getDay();
  return (d>=1 && d<=4) ? "Seg–Qui" : "Sex–Dom";
}

function renderRotinaIntoGestor() {
  const wrap = document.querySelector("#rotina-rp");
  if (!wrap) return;

  const key = rotinaPeriodoAtualKey();
  const rows = ROTINA_GRID[key] || [];
  let nextInfo = "";

  // Descobre a próxima atividade
  const now = new Date();
  const next = rows.find(r => {
    const [start] = parseInterval(r.hora);
    return start > now;
  });
  if (next) {
    nextInfo = `Próxima: <b>${next.hora}</b> — <b>Arapiraca:</b> ${next.arapiraca} | <b>Demais:</b> ${next.demais}`;
  }

  // Toolbar (seleção de período + ações)
  const toolbar = `
    <div class="toolbar">
      <label class="muted">Período:</label>
      <select id="rotinaSel" class="input">
        ${Object.keys(ROTINA_GRID).map(k=>`<option value="${k}" ${k===key?'selected':''}>${k}</option>`).join("")}
      </select>
      <button id="btnPrint" class="btn">Imprimir/Salvar PDF</button>
      <span class="muted" id="nextInfo" style="margin-left:auto">${nextInfo}</span>
    </div>
  `;

  // Tabela
  const table = `
    <div class="table-wrap">
      <table class="rotina">
        <thead>
          <tr><th style="width:140px">Hora</th><th>ARAPIRACA</th><th>Demais Cidades</th></tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr class="${isNowBetween(r.hora) ? 'now' : ''}">
              <td><b>${r.hora}</b></td>
              <td>${badgeFor(r.arapiraca)}</td>
              <td>${badgeFor(r.demais)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  wrap.innerHTML = toolbar + table;

  // Eventos
  const sel = document.querySelector("#rotinaSel");
  sel?.addEventListener("change", e => {
    // Renderiza outro período mantendo no painel
    const k = e.target.value;
    // troca os rows e redesenha apenas tbody + próxima atividade
    const rows2 = ROTINA_GRID[k] || [];
    const tbody = wrap.querySelector("tbody");
    tbody.innerHTML = rows2.map(r => `
      <tr class="${isNowBetween(r.hora) ? 'now' : ''}">
        <td><b>${r.hora}</b></td>
        <td>${badgeFor(r.arapiraca)}</td>
        <td>${badgeFor(r.demais)}</td>
      </tr>
    `).join("");

    const now2 = new Date();
    const next2 = rows2.find(r => parseInterval(r.hora)[0] > now2);
    const nextEl = document.querySelector("#nextInfo");
    nextEl.innerHTML = next2 ? `Próxima: <b>${next2.hora}</b> — <b>Arapiraca:</b> ${next2.arapiraca} | <b>Demais:</b> ${next2.demais}` : "";
  });

  document.querySelector("#btnPrint")?.addEventListener("click", () => window.print());
}



// =================== Inicialização ===================
(function init(){
  renderVersion();

  $("#tab-op").addEventListener("click", ()=> switchTab("op"));
  $("#tab-gestor").addEventListener("click", ()=> ensureGestor());

  $("#q").addEventListener("input", e=>{ state.q = e.target.value; renderGrid(); });
  $("#statusSel").addEventListener("change", e=>{ state.status = e.target.value; renderGrid(); });

  $("#pinBtn").addEventListener("click", checkPin);
  $("#pin").addEventListener("keydown", e=>{ if(e.key==="Enter") checkPin(); });

  // Restaurar desbloqueio do gestor
  if(localStorage.getItem("bpmPortalGestorOK") === "1"){ state.gestorOK = true; }

  // Navegação direta para gestor via hash: #gestor (se já desbloqueado)
  if(location.hash.replace('#','') === 'gestor'){
    if(state.gestorOK) switchTab('gestor'); else ensureGestor();
  } else {
    switchTab('op');
  }
})();
