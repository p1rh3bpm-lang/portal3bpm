// =================== CONFIGURAÇÃO ===================
const ADMIN_PIN = "1234"; // <<< Altere o PIN aqui

// Operações (público)
// Campos: title, url, desc, tags, status (Vigente|Planejada|Encerrada), periodo, responsavel
const OPERACOES = [
  { title: "OP VIGILÂNCIA CENTRO", url: "https://exemplo.gov/operacao1", desc: "Patrulhamento reforçado em área comercial.", tags: ["urbano","centro"], status: "Vigente", periodo: "01–15/09/2025", responsavel: "Cap. Silva" },
  { title: "OP RODOVIAS LESTE", url: "https://exemplo.gov/operacao2", desc: "Bloqueios e abordagens em eixos viários.", tags: ["rodovia"], status: "Planejada", periodo: "20–28/09/2025", responsavel: "Ten. Souza" },
  { title: "OP FEIRA SEGURA", url: "https://exemplo.gov/operacao3", desc: "Pontos-base em horários de pico.", tags: ["urbano","feira"], status: "Encerrada", periodo: "10–18/08/2025", responsavel: "Sgt. Lima" }
];

// Área do Gestor (restrita)
// Campos: title, url, desc, tags, status
const RESTRITOS = [
  { title: "Mapa Tático (Sigiloso)", url: "https://exemplo.gov/gestor/mapa", desc: "Dispositivo e horários sensíveis.", tags: ["tático","intel"], status: "Vigente" },
  { title: "Escala Extra (Conf.)", url: "https://exemplo.gov/gestor/escala", desc: "Planilha com lotação.", tags: ["admin"], status: "Vigente" },
  { title: "Relatório Pós-Ação", url: "https://exemplo.gov/gestor/pos-acao", desc: "Dados operacionais.", tags: ["relatório"], status: "Encerrada" }
];

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
  state.tab = tab; state.tag = "Todos"; // reset tag ao mudar de aba
  $("#tab-op").setAttribute("aria-selected", tab==="op");
  $("#tab-gestor").setAttribute("aria-selected", tab==="gestor");
  $("#painel-op").hidden = tab!=="op";
  $("#painel-gestor").hidden = tab!=="gestor";
  renderTags(); renderGrid();
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
