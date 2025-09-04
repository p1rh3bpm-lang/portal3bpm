// ============================================================================
//  SCRIPT PRINCIPAL DO PORTAL 3º BPM
//  - Mantém estado da UI (aba ativa, filtros, PIN do gestor)
//  - Renderiza cartões (operações/restritos), tags e busca
//  - Controla modal de PIN e acesso ao painel do Gestor
//  - Renderiza Rotina RP e Distribuição de RP por turno no painel do Gestor
//  OBS: Todo o código original foi preservado. Apenas adicionamos comentários
//       e separadores de seção para facilitar a manutenção.
// ============================================================================


// =================== CONFIGURAÇÃO ===================
// Responsável por: definir PIN de acesso do gestor.
const ADMIN_PIN = "1234"; // <<< Altere o PIN aqui



// =================== DADOS: OPERACOES (PÚBLICO) ===================
// Responsável por: definir os cartões públicos da aba "Operações Vigentes".
// Campos: title, url, desc, tags, status (Vigente|Planejada|Encerrada), periodo, responsavel
const OPERACOES = [
  {
    title: "OPO 01 – ICARUS: Garantindo a Ordem",
    url: "https://drive.google.com/file/d/17PM6esUXDYGbsgpAA7gX0BN4bdLLjOx3/view?usp=drive_link",
    desc: "Fiscalização ostensiva com blitzes estratégicas e lavratura de TCOs para prevenir acidentes, reduzir riscos e fortalecer a sensação de segurança.",
    tags: ["urbano","arapiraca"],
    status: "Vigente",
    periodo: "Seg–Qui: 08h15–09h30 | Sex–Dom: 07h45–09h00",
    responsavel: "Todas as RP e FT em Arapiraca"
  },
  {
    title: "OPO 02 – FAUNO: Sentinela das Trilhas",
    url: "https://drive.google.com/file/d/1I1fAouJ2VWihf6NCmgrs7McqFPY7ZBEN/view?usp=drive_link",
    desc: "Reforço policial e fiscalização de trânsito em zonas rurais de Arapiraca e demais cidades, prevenindo acidentes e garantindo mobilidade segura.",
    tags: ["rural","trânsito"],
    status: "Vigente",
    periodo: "Seg–Qui: 08h15–09h00 | Sex–Dom: 07h45–08h30",
    responsavel: "Todas as guarnições exceto Arapiraca"
  },
  {
    title: "OPO 03 – ÓRION: Batalhão Vigilante",
    url: "https://drive.google.com/file/d/11nKbhyXGYi2dC4zZqHFT7MCV2msxslx9/view?usp=drive_link",
    desc: "Integra ações preventivas, repressivas e de inteligência para reduzir crimes violentos, receptação e infrações viárias.",
    tags: ["urbano","rodovia"],
    status: "Vigente",
    periodo: "Seg–Qui: manhã 09h30–11h30 | tarde 15h30–17h00 | noite 20h00–21h30 | madrugada 23h00–01h00 | Sex–Dom: horários equivalentes",
    responsavel: "Todas as RP e FT do 3º BPM"
  },
  {
    title: "OPO 04 – CERBERUS: Sentinela Escolar",
    url: "https://drive.google.com/file/d/1Vl2wW08mb8OHVExRgrmwOoxg4YhRH5Z5/view?usp=drive_link",
    desc: "Proteção da comunidade escolar com ações preventivas contra transporte irregular, drogas, álcool e crimes nas imediações das escolas.",
    tags: ["escolar","prevenção"],
    status: "Vigente",
    periodo: "Seg–Qui: manhã 11h30–12h30 | tarde 17h00–19h00 | noite 21h30–23h00",
    responsavel: "Todas as guarnições exceto Arapiraca"
  },
  {
    title: "OPO 05 – AURORA: Garantindo a Ordem",
    url: "https://drive.google.com/file/d/1sBZq2oiTRCDw1EL0M7JIhQ7esJCwNhAK/view?usp=drive_link",
    desc: "Fiscalização ostensiva para coibir infrações de trânsito e condutas que coloquem terceiros em risco, com blitzes e abordagens educativas.",
    tags: ["arapiraca","trânsito"],
    status: "Vigente",
    periodo: "Seg–Qui: 05h00–06h30 | Sex–Dom: 05h30–06h30",
    responsavel: "Todas as RP e FT em Arapiraca"
  },
  {
    title: "OPO 06 – HERMES: Repressão ao Tráfico em Trânsito",
    url: "https://drive.google.com/file/d/1tyos0GgaqhHf9e9u09Wzl4Sv3BkE1UY-/view?usp=drive_link",
    desc: "Foco em repressão ao tráfico durante deslocamentos, com patrulhamentos em horários de maior risco.",
    tags: ["rodovia","tráfico"],
    status: "Vigente",
    periodo: "Sex–Dom: manhã 10h30–12h00 | tarde 18h00–19h30 | noite 22h30–00h00",
    responsavel: "Todas as guarnições exceto Arapiraca"
  }
];



// =================== DADOS: RESTRITOS (GESTOR) ===================
// Responsável por: cartões da área restrita do Gestor (aba protegida por PIN).
// Campos: title, url, desc, tags, status
const RESTRITOS = [
  { title: "Mapa Tático (Sigiloso)", url: "https://exemplo.gov/gestor/mapa", desc: "Dispositivo e horários sensíveis.", tags: ["tático","intel"], status: "Vigente" },
  { title: "Escala Extra (Conf.)", url: "https://exemplo.gov/gestor/escala", desc: "Planilha com lotação.", tags: ["admin"], status: "Vigente" },
  { title: "Relatório Pós-Ação", url: "https://exemplo.gov/gestor/pos-acao", desc: "Dados operacionais.", tags: ["relatório"], status: "Encerrada" }
];



// =================== DADOS: DISTRIBUIÇÃO DE RP ===================
// Responsável por: mapa (por cidade e por turno) das RPs atribuídas.
const DISTRIBUICAO_RP = {
  "ARAPIRACA": {
    "ALFA":    [4, 7, 8, 9],
    "BRAVO":   [3, 4, 8, 9],
    "CHARLIE": [3, 5, 7, 8],
    "DELTA":   [1, 3, 8, 9]
  },
  "COITÉ DO NOIA": {
    "ALFA":    [6],
    "BRAVO":   [1],
    "CHARLIE": [1],
    "DELTA":   [5]
  },
  "CRAÍBAS": {
    "ALFA":    [1],
    "BRAVO":   [6],
    "CHARLIE": [6],
    "DELTA":   [7]
  },
  "FEIRA GRANDE": {
    "ALFA":    [2],
    "BRAVO":   [7],
    "CHARLIE": [4],
    "DELTA":   [2]
  },
  "LIMOEIRO DE ANADIA": {
    "ALFA":    [3],
    "BRAVO":   [2],
    "CHARLIE": [9],
    "DELTA":   [4]
  },
  "TAQUARANA": {
    "ALFA":    [5],
    "BRAVO":   [5],
    "CHARLIE": [2],
    "DELTA":   [6]
  }
};



// =================== DADOS: ROTINA EM GRADE ===================
// Responsável por: rotina comparativa (ARAPIRACA vs demais cidades),
// em dois perfis de período: Seg–Qui e Sex–Dom.
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



// =================== UTILIDADES (Helpers) ===================
// Responsável por: funções de seleção, armazenamento e toasts.
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



// =================== ESTADO GLOBAL DE UI ===================
// Responsável por: seleção de aba, filtros, seleção de tag e desbloqueio do gestor.
const state = { tab: "op", q: "", status: "Todos", tag: "Todos", gestorOK: false };



// =================== RENDER: TAGS & FILTROS ===================
// Responsável por: montar chips de tags/filtrar por status/tag/busca.
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



// =================== RENDER: CARTÕES (cards) ===================
// Responsável por: HTML dos cards + ações Abrir/Copiar/Compartilhar.
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
      <!-- REMOVIDO: tags -->
      <!-- ${(l.tags||[]).map(t=>`<span class="badge">#${t}</span>`).join(" ")} -->
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



// =================== RENDER: GRID ===================
// Responsável por: desenhar os cartões filtrados e tratar os cliques.
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



// =================== NAVEGAÇÃO DE ABAS ===================
// Responsável por: alternar entre "Operações" e "Gestor" e disparar renders.
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



// =================== CONTROLE DE PIN (GESTOR) ===================
// Responsável por: modal de PIN e desbloqueio local (localStorage).
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



// =================== VERSÃO (rodapé) ===================
// Responsável por: mostrar data/hora de build simples.
function renderVersion(){
  const d = new Date();
  $("#versao").textContent = `v1 • ${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;
}



// =================== ROTINA RP (parsing e render) ===================
// Responsável por: destacar intervalo atual, montar tabela e permitir impressão.
const ROTINA = [
  // (mantido apenas como referência; o app usa ROTINA_GRID)
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
  // 0=Dom ... 6=Sáb  -> Seg–Qui ou Sex–Dom
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

  // Eventos da toolbar
  const sel = document.querySelector("#rotinaSel");
  sel?.addEventListener("change", e => {
    const k = e.target.value;
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



// =================== DISTRIBUIÇÃO DE RP (render) ===================
// Responsável por: preencher a tabela de cidades x RPs atribuidas por turno.
function renderDistribuicaoRP() {
  const turno = (document.querySelector("#turnoSel")?.value || "ALFA").toUpperCase();
  const filtro = (document.querySelector("#buscaCidade")?.value || "").trim().toLowerCase();

  const tbody = document.querySelector("#tabelaDistrib tbody");
  if (!tbody) return;

  // ordena cidades por nome
  const cidades = Object.keys(DISTRIBUICAO_RP).sort((a,b) => a.localeCompare(b));

  const linhas = cidades
    .filter(c => !filtro || c.toLowerCase().includes(filtro))
    .map(cidade => {
      const rps = (DISTRIBUICAO_RP[cidade] && DISTRIBUICAO_RP[cidade][turno]) || [];
      const htmlRps = rps.length
        ? rps.map(n => `<span class="rp-badge">RP ${String(n).padStart(2,'0')}</span>`).join(" ")
        : `<span class="muted">—</span>`;
      return `<tr><td><b>${cidade}</b></td><td>${htmlRps}</td></tr>`;
    })
    .join("");

  tbody.innerHTML = linhas || `<tr><td colspan="2" class="muted">Nada encontrado para esse filtro.</td></tr>`;
}



// =================== INICIALIZAÇÃO (bootstrap da página) ===================
// Responsável por: conectar eventos, restaurar PIN, definir aba inicial e
//                   injetar Rotina + Distribuição quando o painel do Gestor abre.
(function init(){
  renderVersion();
  
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Abas
  $("#tab-op").addEventListener("click", ()=> switchTab("op"));
  $("#tab-gestor").addEventListener("click", ()=> ensureGestor());

  // Filtros comuns (Operações/Gestor)
  $("#q").addEventListener("input", e=>{ state.q = e.target.value; renderGrid(); });
  $("#statusSel").addEventListener("change", e=>{ state.status = e.target.value; renderGrid(); });

  // PIN Gestor
  $("#pinBtn").addEventListener("click", checkPin);
  $("#pin").addEventListener("keydown", e=>{ if(e.key==="Enter") checkPin(); });

  // Restaurar desbloqueio do gestor (localStorage)
  if(localStorage.getItem("bpmPortalGestorOK") === "1"){ state.gestorOK = true; }

  // ======= Monkey-patch para inserir Rotina & Distribuição no momento certo =======
  // Guardamos a referência da switchTab original e acrescentamos chamadas extras
  // quando a aba "gestor" é ativada, além de ligar listeners dos filtros RP.
 const _oldSwitchTab = switchTab;
switchTab = function(tab) {
  _oldSwitchTab(tab);

  if (tab === "gestor") {
    // 1) Distribuição primeiro
    if (typeof renderDistribuicaoRP === "function") renderDistribuicaoRP();

    // 2) Rotina depois
    if (typeof renderRotinaIntoGestor === "function") renderRotinaIntoGestor();

    // Liga listeners de turno/cidade/limpar (apenas uma vez)
    const turnoSel = document.querySelector("#turnoSel");
    const buscaCidade = document.querySelector("#buscaCidade");
    const btnLimpar = document.querySelector("#btnLimparFiltro");

    if (turnoSel && !turnoSel._wired) {
      turnoSel.addEventListener("change", renderDistribuicaoRP);
      turnoSel._wired = true;
    }
    if (buscaCidade && !buscaCidade._wired) {
      buscaCidade.addEventListener("input", renderDistribuicaoRP);
      buscaCidade._wired = true;
    }
    if (btnLimpar && !btnLimpar._wired) {
      btnLimpar.addEventListener("click", () => {
        if (turnoSel) turnoSel.value = "ALFA";
        if (buscaCidade) buscaCidade.value = "";
        renderDistribuicaoRP();
      });
      btnLimpar._wired = true;
    }
  }
};
  // ======= FIM do patch =======

  // Navegação direta via hash (#gestor) respeitando PIN
  const hash = location.hash.replace('#','');
  if (hash === 'gestor') {
    if(state.gestorOK) switchTab('gestor'); else ensureGestor();
  } else {
    switchTab('op');
  }
})();
