// --- BASE_URL robusto: funciona em subpasta do GitHub Pages e local ---
const BASE_URL =
  import.meta?.env?.BASE_URL ??
  document.querySelector('base')?.href ??
  // pega o path "raiz" da página atual (ex.: /silic-request-service/)
  (location.origin + (location.pathname.replace(/\/[^/]*$/, '/') || '/'));

// Helper p/ montar URL absoluta a partir do BASE_URL
function assetUrl(path) {
  const clean = String(path || '').replace(/^\/+/, '');
  try { return new URL(clean, BASE_URL).toString(); }
  catch { return BASE_URL.replace(/\/?$/, '/') + clean; }
}

// helper de base path (compatível com código legado)
function withBase(path) {
  return assetUrl(path);
}
window.withBase = window.withBase || withBase;

// --- Estado do switch/hidden ---
function isComLicitacao(){
  const params = new URLSearchParams(location.search);
  const q = params.get('licitacao');
  if (q === 'sim') return true;
  if (q === 'nao') return false;
  const hidden = document.getElementById('licitacao');
  if (hidden && hidden.value) return hidden.value === 'sim';
  const btn = document.getElementById('switch-licitacao');
  if (btn) return btn.getAttribute('aria-checked') === 'true';
  return false;
}

// --- Controle único do switch de licitação ---
function setLicitacao(on) {
  const btn = document.getElementById('switch-licitacao');
  const hidden = document.getElementById('licitacao');
  
  if (btn) {
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
    const label = btn.querySelector('.toggle__label');
    if (label) label.textContent = on ? 'Sim' : 'Não';
  }
  
  if (hidden) {
    hidden.value = on ? 'sim' : 'nao';
  }
  
  // Sincroniza URL
  const url = new URL(location.href);
  url.searchParams.set('licitacao', on ? 'sim' : 'nao');
  history.replaceState(null, '', url.toString());
  
  // Dispara evento customizado
  document.dispatchEvent(new CustomEvent('licitacao:changed', {
    detail: { comLicitacao: on }
  }));
}


// --- Ação do botão Iniciar: sempre wizard-juridica com query licitacao=sim|nao ---
function acaoIniciarWizard() {
  const com = isComLicitacao();
  const url = assetUrl(`pages/wizard-juridica.html?licitacao=${com ? 'sim' : 'nao'}`);
  return abrirWizardHtml(url);
}

// Função para abrir stepper.html (fallback genérico)
function abrirStepper() {
  abrirWizardHtml(assetUrl('pages/stepper.html'));
}

// --- abre o fragmento no modal (mantém sua versão se já tiver) ---
async function abrirWizardHtml(url) {
  const overlay = document.getElementById('wizard-modal-overlay');
  const content = document.getElementById('wizard-modal-content');
  if (!overlay || !content) return;

  overlay.style.display = 'flex';
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
  overlay.removeAttribute('aria-hidden');

  let html;
  try {
    const res = await fetch(assetUrl(url), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    html = `<div style="padding:24px">
      <h2>Falha ao carregar o wizard</h2>
      <p>Recurso: <code>${url}</code><br>Erro: ${String(e)}</p>
      <button id="close-wizard-modal" class="br-button secondary mt-2">Fechar</button>
    </div>`;
  }

  content.replaceChildren();

  try {
    const com = isComLicitacao();
    const licitacaoSelectors = ['[data-step="licitacao"]','.step-licitacao','[id*="licitacao"]'];
    if (!com){
      licitacaoSelectors.forEach(sel => {
        content.querySelectorAll(sel).forEach(el => { el.style.display = 'none'; });
      });
    }
  } catch(_e) {}
// reexecuta <script> embutidos do fragmento
  content.querySelectorAll('script').forEach(s => {
    const sc = document.createElement('script');
    if (s.src) sc.src = s.src; else sc.textContent = s.textContent;
    s.replaceWith(sc);
  });

  const close = () => {
    overlay.style.opacity = '0';
    overlay.setAttribute('aria-hidden','true');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
      content.replaceChildren();
    }, 150);
  };
  content.querySelectorAll('#close-wizard-modal,[data-action="cancel"],[data-wizard-action="cancel"]').forEach(b => {
    b.addEventListener('click', close);
  });
  window.closeWizard = close;
}

// --- botão "Iniciar": decide a variação e abre o SEU wizard pronto ---
const WIZARD_JURIDICA_PATH = 'pages/wizard-juridica.html';

function acaoIniciarWizard() {
  const com = isComLicitacao();                        // true = com licitação
  const url = `${WIZARD_JURIDICA_PATH}?licitacao=${com ? 'sim' : 'nao'}`;
  return abrirWizardHtml(url);
}

// expõe p/ onclick="acaoIniciarWizard()"
window.acaoIniciarWizard = acaoIniciarWizard;
window.abrirWizardHtml   = abrirWizardHtml;

function getDynamicWizardHeader(tab, acao, tipo, tipoContratacao, url) {
  // Mapeamento das modalidades
  const modalidades = {
    locacao: 'Locação',
    cessao: 'Cessão',
    comodato: 'Comodato',
  };

  // Mapeamento das ações
  const acoes = {
    contratar: 'Contratação',
    regularizar: 'Regularização',
    formalizar: 'Formalização',
  };

  // Mapeamento dos tipos de pessoa
  const tipos = {
    'pessoa-fisica': 'Pessoa Física',
    'pessoa-juridica': 'Pessoa Jurídica',
  };

  // Mapeamento dos tipos de contratação (não utilizado diretamente no header no momento)
  // const tiposContratacao = {
  //   'nova-unidade': 'Nova Unidade',
  //   'mudanca-endereco': 'Mudança de Endereço',
  // };

  // Constrói o título dinâmico
  const modalidade = modalidades[tab] || 'Modalidade';
  const acaoTexto = acoes[acao] || 'Solicitação';
  const tipoTexto = tipos[tipo] || '';
  // const tipoContratacaoTexto = tiposContratacao[tipoContratacao] || '';

  // Título principal
  let titulo = `${acaoTexto} de ${modalidade}`;
  if (tipoTexto) {
    titulo += ` - ${tipoTexto}`;
  }

  // Descrição personalizada
  let descricao = '';
  // Caso especial: contratação de locação precedida de licitação
  if (
    tab === 'locacao' &&
    acao === 'contratar' &&
    tipo === 'pessoa-juridica' &&
    tipoContratacao === 'nova-unidade'
  ) {
    if (isComLicitacao()) {
      descricao =
        'Preencha os dados necessários para contratar à locação de uma nova unidade precedida de licitação.';
    } else {
      descricao = 'Preencha os dados necessários para contratar à locação de uma nova unidade.';
    }
  } else {
    descricao = `Preencha os dados necessários para `;
    if (acao === 'contratar') {
      if (tipoContratacao === 'nova-unidade') {
        descricao += `contratar uma nova unidade para ${modalidade.toLowerCase()}`;
      } else if (tipoContratacao === 'mudanca-endereco') {
        descricao += `solicitar mudança de endereço na ${modalidade.toLowerCase()}`;
      } else {
        descricao += `realizar a contratação de ${modalidade.toLowerCase()}`;
      }
    } else if (acao === 'regularizar') {
      descricao += `regularizar sua ${modalidade.toLowerCase()}`;
    } else if (acao === 'formalizar') {
      descricao += `formalizar sua ${modalidade.toLowerCase()}`;
    } else {
      descricao += `processar sua solicitação de ${modalidade.toLowerCase()}`;
    }
    if (tipoTexto) {
      descricao += ` como ${tipoTexto.toLowerCase()}`;
    }
    descricao += '.';
  }

  // Determina o número de steps baseado no tipo de processo e wizard
  let numSteps = 3; // padrão

  if (url && url.includes('wizard-fisica.html')) {
    // Wizard física sempre tem 3 steps
    numSteps = 3;
  } else if (url && url.includes('wizard-juridica.html')) {
    // Wizard jurídica (PJ) sempre tem 5 steps
    if (acao === 'contratar' && tipo === 'pessoa-juridica') {
      numSteps = 5; // Licitação, Documentação, Financeiro, Locadores, Revisão
    } else if (acao === 'regularizar') {
      numSteps = 4; // Documentação, Dados, Regularização, Revisão
    } else if (acao === 'formalizar') {
      numSteps = 3; // Dados, Formalização, Revisão
    } else {
      numSteps = 5; // padrão para PJ
    }
  }

  // Gera os steps do progress
  let progressSteps = '';
  for (let i = 0; i < numSteps; i++) {
    const activeClass = i === 0 ? 'active' : '';
    progressSteps += `<span class="progress-step ${activeClass}"></span>`;
  }

  return `
        <h2>${titulo}</h2>
        <p>${descricao}</p>
        <div class="wizard-progress">
            ${progressSteps}
        </div>
    `;
}

// Função para sincronizar o progress bar do header com os steps do wizard
function syncWizardProgress() {
  const progressSteps = document.querySelectorAll(
    '#wizard-modal-inner .wizard-progress .progress-step'
  );
  const wizardSteps = document.querySelectorAll('#wizard-modal-inner .wizard-step');

  if (progressSteps.length === 0 || wizardSteps.length === 0) return;

  // Reset all progress steps
  progressSteps.forEach((step) => {
    step.classList.remove('active', 'completed');
  });

  // Update progress based on wizard steps
  wizardSteps.forEach((step, index) => {
    if (index < progressSteps.length) {
      if (step.classList.contains('completed')) {
        progressSteps[index].classList.add('completed');
      } else if (step.classList.contains('active')) {
        progressSteps[index].classList.add('active');
      }
    }
  });
}

// Removido abrirWizard (não utilizado) — usar abrirWizardHtml/fluxo do main.js

// Removido abrirDocumentationModal (não utilizado)

// --- Inicialização unificada ---
document.addEventListener('DOMContentLoaded', () => {
  // Inicialização do switch de licitação
  initLicitacaoSwitch();
  
  // Inicialização dos modais
  initModals();
});

function initLicitacaoSwitch() {
  const btn = document.getElementById('switch-licitacao');
  const hidden = document.getElementById('licitacao');
  const blocoLicitacao = document.getElementById('bloco-licitacao');
  
  if (!btn || !hidden) return;

  // Inicializa a partir da URL ou hidden
  const urlParams = new URLSearchParams(location.search);
  const urlValue = urlParams.get('licitacao');
  let initialState;
  
  if (urlValue === 'sim') initialState = true;
  else if (urlValue === 'nao') initialState = false;
  else initialState = hidden.value === 'sim';
  
  setLicitacao(initialState);

  // LÓGICA DE VISIBILIDADE DO SWITCH
  function deveMostrarSwitch() {
    const tabAtiva = document.querySelector('.tab-button.active')?.getAttribute('data-tab');
    const acao = document.getElementById('contratar')?.value;
    const tipo = document.getElementById('formalizar')?.value;
    const tipoContratacao = document.getElementById('tipo-contratacao')?.value;
    
    return (
      tabAtiva === 'locacao' &&
      acao === 'contratar' &&
      tipo === 'pessoa-juridica' &&
      tipoContratacao === 'nova-unidade'
    );
  }

  function atualizarVisibilidadeSwitch() {
    if (!blocoLicitacao) return;
    
    if (deveMostrarSwitch()) {
      blocoLicitacao.classList.remove('is-hidden');
    } else {
      blocoLicitacao.classList.add('is-hidden');
      // Reset do switch quando oculto
      setLicitacao(false);
    }
  }

  // Listeners para mudanças nos selects
  const selects = ['contratar', 'formalizar', 'tipo-contratacao'].map(id => 
    document.getElementById(id)).filter(Boolean);
  
  selects.forEach(select => {
    select.addEventListener('change', atualizarVisibilidadeSwitch);
  });

  // Listeners para tabs
  document.querySelectorAll('.tab-button').forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(atualizarVisibilidadeSwitch, 50); // delay para tab ativar
    });
  });

  // Verificação inicial
  atualizarVisibilidadeSwitch();
}

function initModals() {
  // --- Fecha modais (mantenha seu código atual) ---
  // Wizard
  const wizardOverlay = document.getElementById('wizard-modal-overlay');
  const closeWizardBtn = document.getElementById('close-wizard-modal');

  function closeWizardModal() {
    wizardOverlay.style.display = 'none';
    wizardOverlay.style.visibility = 'hidden';
    wizardOverlay.style.opacity = '0';
    wizardOverlay.setAttribute('aria-hidden', 'true');
    document.getElementById('wizard-modal-inner').innerHTML = '';
  }

  if (closeWizardBtn) {
    closeWizardBtn.onclick = closeWizardModal;
  }
  
  // Documentation
  const docOverlay = document.getElementById('documentation-modal-overlay');
  const closeDocBtn = document.getElementById('close-documentation-modal');
  if (closeDocBtn) {
    closeDocBtn.onclick = function () {
      docOverlay.style.display = 'none';
      document.getElementById('documentation-modal-inner').innerHTML = '';
    };
  }
  docOverlay.addEventListener('click', function (e) {
    if (e.target === docOverlay) {
      docOverlay.style.display = 'none';
      document.getElementById('documentation-modal-inner').innerHTML = '';
    }
  });
}

// --- Handler unificado para cliques no switch ---
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('#switch-licitacao');
  if (!btn) return;
  
  const currentState = isComLicitacao();
  setLicitacao(!currentState);
});

// Injeta "Abrir Wizard" APENAS quando ?dev=1
(function injectDevWizardButton() {
  try {
    const params = new URLSearchParams(location.search);
    const isDev = params.get('dev') === '1';
    if (!isDev) return;

    const container =
      document.querySelector('.actions-inline') ||
      document.querySelector('.search-form .actions-inline') ||
      document.querySelector('.search-container .actions-inline');

    if (!container) return;
    if (document.getElementById('abrir-wizard-button')) return; // já existe?

    const btn = document.createElement('button');
    btn.id = 'abrir-wizard-button';
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = 'Abrir Wizard';

    // tenta abrir o wizard pela função disponível
    btn.addEventListener('click', () => {
      const open = window.abrirWizard || window.acaoIniciarWizard || function () {};
      try {
        open();
      } catch (e) {
        console.debug('abrir-wizard-button click handler erro ignorado:', e);
      }
    });

    container.appendChild(btn);
  } catch (e) {
    console.debug('injectDevWizardButton erro ignorado:', e);
  }
})();

// --- PATCH: sync licitacao switch and lazy-load wizard ---
(function(){
  try {
    // --- Switch já inicializado no DOMContentLoaded (código robusto) ---
    // Removido código duplicado para evitar conflitos
    
    const openBtns = document.querySelectorAll("[data-open-wizard]");
    let wizardLoaded = false;
    async function ensureWizardJs(){
      if (wizardLoaded) return; wizardLoaded = true;
      const s = document.createElement("script");
      s.src = withBase("assets/js/wizard-juridica.js");
      document.head.appendChild(s);
    }
    openBtns.forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        await ensureWizardJs();
        setTimeout(()=>{},0);
      });
    });
  } catch(e){ console.warn("PATCH licitacao/wizard loader error", e); }
})();

// --- PATCH: wizard normalize buttons (fallback em runtime) ---
(function(){
  try {
  function normalizeWizardButtons(root=document){
      const labels = [
        { re: /(avançar|avancar)/i, act: 'next' },
        { re: /voltar/i,            act: 'prev' },
        { re: /cancelar/i,          act: 'cancel' },
        { re: /fechar/i,            act: 'close' }
      ];
      root.querySelectorAll('button, a[role="button"], a.br-button, a.btn, a.button').forEach(el=>{
        if (el.hasAttribute('data-wizard-action')) return;
        const txt = (el.textContent||'').trim().toLowerCase();
        for (const {re, act} of labels){
          if (re.test(txt)){ el.setAttribute('data-wizard-action', act); break; }
        }
      });
      const idMap = { btnNext:'next', btnNextStep:'next', btnPrev:'prev', btnBack:'prev', btnCancel:'cancel', btnClose:'close' };
      Object.entries(idMap).forEach(([id,act])=>{
        const el = (root === document) ? document.getElementById(id) : root.querySelector(`#${id}`);
        if (el && !el.hasAttribute('data-wizard-action')) el.setAttribute('data-wizard-action', act);
      });
    }
    document.addEventListener('click', (e)=>{
      if (e.target.closest('[data-open-wizard]')) setTimeout(()=> normalizeWizardButtons(document), 50);
    });
    const overlay = document.getElementById('wizard-modal-overlay');
    if (overlay){
      const obs = new MutationObserver(()=> normalizeWizardButtons(overlay));
      obs.observe(overlay, { childList: true, subtree: true });
    }
  } catch(err){ console.warn('wizard normalize buttons: skip', err); }
})();

// ---- Guard definitivo: só abre wizard após gesto do usuário e intercepta sobrescritas ----
(() => {
  let allowOpen = false;
  document.addEventListener('click', () => {
    allowOpen = true;
    setTimeout(() => { allowOpen = false; }, 1500);
  }, true);

  const real = window.abrirWizardHtml;
  window.abrirWizardHtml = function(url) {
    if (!allowOpen) {
      console.debug('[guard] bloqueado abrirWizardHtml sem clique:', url);
      return;
    }
    return real && real.apply(this, arguments);
  };
})();



// Se por algum motivo alguém mostrar o overlay sem conteúdo, esconda de volta
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('wizard-modal-overlay');
  const inner = document.getElementById('wizard-modal-inner');
  if (!overlay || !inner) return;

  const hideIfEmpty = () => {
    if (overlay.style.display !== 'none' && inner.children.length === 0) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
  };

  // Garantia inicial
  hideIfEmpty();

  // Observa mudanças e corrige se necessário
  new MutationObserver(hideIfEmpty).observe(overlay, { childList: true, subtree: true, attributes: true });
});
// ---- FIM do código customizado do botão Iniciar ----

// --- FIM index.js --- 

// [DELEGATED_WIZARD_HANDLERS] Delegação de eventos dentro do conteúdo do wizard
(function setupWizardDelegation(){
  const container = document.getElementById('wizard-modal-content');
  if (!container) return;
  container.addEventListener('click', function(e){
    const t = e.target.closest('[data-action], #btn-avancar, #btn-cancelar');
    if (!t) return;
    const action = t.getAttribute('data-action') || (t.id === 'btn-avancar' ? 'avancar' : (t.id === 'btn-cancelar' ? 'cancel' : null));
    if (!action) return;
    e.preventDefault();
    if (action === 'cancel') {
      const closeBtn = document.getElementById('close-wizard-modal');
      if (closeBtn) closeBtn.click();
      return;
    }
    if (action === 'avancar') {
      const current = container;
      const invalid = Array.from(current.querySelectorAll('input[required], select[required], textarea[required]'))
        .filter(el => el.offsetParent !== null && !el.value);
      if (invalid.length){
        invalid[0].focus();
        const warn = document.createElement('div');
        warn.className = 'br-message warning mt-2';
        warn.innerHTML = '<div class="content"><span class="message-title">Preencha os campos obrigatórios</span></div>';
        t.closest('form')?.prepend(warn);
        setTimeout(()=> warn.remove(), 3000);
        return;
      }
      const evt = new CustomEvent('wizard:next', {bubbles:true});
      container.dispatchEvent(evt);
      return;
    }
  });
})();
