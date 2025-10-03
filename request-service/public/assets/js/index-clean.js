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

// --- Funções do Wizard ---
function acaoIniciarWizard() {
  const com = isComLicitacao();
  const url = assetUrl(`pages/wizard-juridica.html?licitacao=${com ? 'sim' : 'nao'}`);
  return abrirWizardHtml(url);
}

async function abrirWizardHtml(url) {
  const overlay = document.getElementById('wizard-modal-overlay');
  const content = document.getElementById('wizard-modal-content');
  
  if (!overlay || !content) {
    console.error('Modal overlay ou content não encontrado');
    return;
  }

  content.replaceChildren();

  try {
    console.log('Carregando wizard:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Move o conteúdo do body para o modal
    const bodyContent = tempDiv.querySelector('body');
    if (bodyContent) {
      content.innerHTML = bodyContent.innerHTML;
    } else {
      content.innerHTML = html;
    }

    // Executa scripts
    const scripts = content.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // Script externo
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.type = script.type || 'text/javascript';
        document.head.appendChild(newScript);
      } else if (script.textContent) {
        // Script inline
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
      }
    });

    // Mostra o modal
    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.setAttribute('aria-hidden', 'false');
    
    console.log('Wizard aberto com sucesso');
    
    // Inicializa wizard se a função existir
    if (typeof window.initWizardJuridica === 'function') {
      setTimeout(() => window.initWizardJuridica(), 100);
    }
    
  } catch (error) {
    console.error('Erro ao abrir wizard:', error);
    content.innerHTML = `<div style="padding: 2rem; text-align: center;">
      <h3>Erro ao carregar wizard</h3>
      <p>${error.message}</p>
      <button onclick="document.getElementById('wizard-modal-overlay').style.display='none'">Fechar</button>
    </div>`;
    
    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
  }
}

// FORÇAR NO ESCOPO GLOBAL
window.isComLicitacao = isComLicitacao;
window.setLicitacao = setLicitacao;
window.acaoIniciarWizard = acaoIniciarWizard;

console.log('=== SCRIPT CARREGADO COM SUCESSO ===');
console.log('isComLicitacao definida:', typeof isComLicitacao);
console.log('setLicitacao definida:', typeof setLicitacao);
console.log('window.isComLicitacao:', typeof window.isComLicitacao);
console.log('window.setLicitacao:', typeof window.setLicitacao);

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado - inicializando switch...');
  
  const btn = document.getElementById('switch-licitacao');
  const hidden = document.getElementById('licitacao');
  const blocoLicitacao = document.getElementById('bloco-licitacao');
  
  if (!btn || !hidden) {
    console.log('Elementos do switch não encontrados');
    return;
  }

  // Inicializa a partir da URL ou hidden
  const urlParams = new URLSearchParams(location.search);
  const urlValue = urlParams.get('licitacao');
  let initialState;
  
  if (urlValue === 'sim') initialState = true;
  else if (urlValue === 'nao') initialState = false;
  else initialState = hidden.value === 'sim';
  
  setLicitacao(initialState);
  console.log('Switch inicializado com estado:', initialState);

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
    
    const deveMostrar = deveMostrarSwitch();
    console.log('Deve mostrar switch:', deveMostrar);
    
    if (deveMostrar) {
      blocoLicitacao.classList.remove('is-hidden');
      console.log('Switch visível');
    } else {
      blocoLicitacao.classList.add('is-hidden');
      setLicitacao(false);
      console.log('Switch oculto');
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
      setTimeout(atualizarVisibilidadeSwitch, 50);
    });
  });

  // Verificação inicial
  atualizarVisibilidadeSwitch();
  
  // Inicializar modais
  initModals();
});

function initModals() {
  // Wizard modal
  const wizardOverlay = document.getElementById('wizard-modal-overlay');
  const closeWizardBtn = document.getElementById('close-wizard-modal');

  function closeWizardModal() {
    if (wizardOverlay) {
      wizardOverlay.style.display = 'none';
      wizardOverlay.style.visibility = 'hidden';
      wizardOverlay.style.opacity = '0';
      wizardOverlay.setAttribute('aria-hidden', 'true');
      const inner = document.getElementById('wizard-modal-inner');
      if (inner) inner.innerHTML = '';
    }
  }

  if (closeWizardBtn) {
    closeWizardBtn.onclick = closeWizardModal;
  }
  
  // Documentation modal  
  const docOverlay = document.getElementById('documentation-modal-overlay');
  const closeDocBtn = document.getElementById('close-documentation-modal');
  if (closeDocBtn) {
    closeDocBtn.onclick = function () {
      docOverlay.style.display = 'none';
      const inner = document.getElementById('documentation-modal-inner');
      if (inner) inner.innerHTML = '';
    };
  }
  if (docOverlay) {
    docOverlay.addEventListener('click', function (e) {
      if (e.target === docOverlay) {
        docOverlay.style.display = 'none';
        const inner = document.getElementById('documentation-modal-inner');
        if (inner) inner.innerHTML = '';
      }
    });
  }
}
});

// --- Handler para cliques no switch ---
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('#switch-licitacao');
  if (!btn) return;
  
  const currentState = isComLicitacao();
  setLicitacao(!currentState);
  console.log('Switch clicado, novo estado:', !currentState);
});
