// --- Ação customizada do botão Iniciar ---
function acaoIniciarWizard() {
    // Verifica as opções selecionadas
    const tab = document.querySelector('.tab-button.active')?.getAttribute('data-tab');
    const acao = document.getElementById('contratar')?.value;
    const tipo = document.getElementById('formalizar')?.value;
    const tipoContratacao = document.getElementById('tipo-contratacao')?.value;
    // Corrige o valor global do switch de licitação antes de abrir o wizard
    const licSwitch = document.getElementById('switch-licitacao');
    if (licSwitch) {
      window._licitacaoSim = licSwitch.getAttribute('aria-pressed') === 'true';
    }
    // Condição para abrir o wizard física (Pessoa Física)
    if (
        tab === 'locacao' &&
        acao === 'contratar' &&
        tipo === 'pessoa-fisica' &&
        tipoContratacao === 'nova-unidade'
    ) {
        abrirWizardHtml('pages/wizard-fisica.html');
    }
    // Condição para abrir o wizard jurídica (Pessoa Jurídica)
    else if (
        tab === 'locacao' &&
        acao === 'contratar' &&
        tipo === 'pessoa-juridica' &&
        tipoContratacao === 'nova-unidade'
    ) {
        abrirWizardHtml('pages/wizard-juridica.html');
    }
    // Mudança de endereço - Pessoa Física
    else if (
        tab === 'locacao' &&
        acao === 'contratar' &&
        tipo === 'pessoa-fisica' &&
        tipoContratacao === 'mudanca-endereco'
    ) {
        abrirWizardHtml('pages/wizard-fisica.html');
    }
    // Mudança de endereço - Pessoa Jurídica
    else if (
        tab === 'locacao' &&
        acao === 'contratar' &&
        tipo === 'pessoa-juridica' &&
        tipoContratacao === 'mudanca-endereco'
    ) {
        abrirWizardHtml('pages/wizard-juridica.html');
    }
    // Regularização
    else if (
        acao === 'regularizar' &&
        (tipo === 'pessoa-fisica' || tipo === 'pessoa-juridica')
    ) {
        if (tipo === 'pessoa-fisica') {
            abrirWizardHtml('pages/wizard-fisica.html');
        } else {
            abrirWizardHtml('pages/wizard-juridica.html');
        }
    }
    /**
     * Arquivo: index.js
     * Responsável pela lógica principal da página inicial, abertura de wizards, modais e controle do switch de licitação.
     * Mantém integração dinâmica entre HTML e JS, além de validações e navegação.
     */
    // Formalização
    else if (
        acao === 'formalizar' &&
        (tipo === 'pessoa-fisica' || tipo === 'pessoa-juridica')
    ) {
        if (tipo === 'pessoa-fisica') {
            abrirWizardHtml('pages/wizard-fisica.html');
        } else {
            abrirWizardHtml('pages/wizard-juridica.html');
        }
    }
    // Cessão ou Comodato
    else if (
        (tab === 'cessao' || tab === 'comodato') &&
        (tipo === 'pessoa-fisica' || tipo === 'pessoa-juridica')
    ) {
        if (tipo === 'pessoa-fisica') {
            abrirWizardHtml('pages/wizard-fisica.html');
        } else {
            abrirWizardHtml('pages/wizard-juridica.html');
        }
    }
    else {
        // Comportamento padrão caso não corresponda a nenhuma condição específica
        abrirStepper();
    }
}

// Função para abrir stepper.html (fallback genérico)
function abrirStepper() {
    abrirWizardHtml('pages/stepper.html');
}

// Função para abrir wizard jurídico no modal
function abrirWizardHtml(url){
    const overlay = document.getElementById('wizard-modal-overlay');
    const inner    = document.getElementById('wizard-modal-inner');
    const content  = document.getElementById('wizard-modal-content');

    // 1) abre o modal imediatamente
    if (overlay){
      overlay.style.display = 'flex';
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
      overlay.removeAttribute('aria-hidden');
    }
    if (inner) inner.innerHTML = '<div style="padding:48px;text-align:center;color:#666"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Carregando...</div>';

    // Captura seleções para header dinâmico
    const tab  = document.querySelector('.tab-button.active')?.getAttribute('data-tab');
    const acao = document.getElementById('contratar')?.value;
    const tipo = document.getElementById('formalizar')?.value;
    const tipoContratacao = document.getElementById('tipo-contratacao')?.value;

    (async () => {
      try {
        // 2) busca HTML do wizard
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Arquivo não encontrado');
        const html = await resp.text();

        // 3) parse com base relativa ao arquivo do wizard
        const base = new URL(url, window.location.href);
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // 3.1) injeta <link rel="stylesheet"> externos do wizard (se existirem)
        temp.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
          const abs = new URL(link.getAttribute('href'), base).href;
          if (![...document.head.querySelectorAll('link[rel="stylesheet"]')].some(l => l.href === abs)){
            const tag = document.createElement('link'); tag.rel='stylesheet'; tag.href=abs; document.head.appendChild(tag);
          }
        });
        // 3.2) injeta <style> inline (se houver)
        temp.querySelectorAll('style').forEach(st => document.head.appendChild(st.cloneNode(true)));

        // 4) conteúdo principal do wizard
        let main = temp.querySelector('main') || temp.querySelector('.wizard-container') || temp;
        if (!main) throw new Error('Conteúdo do wizard não encontrado.');

        // 4.1) monta header dinâmico
        if (inner){
          inner.innerHTML = '';
          const wizardHeader = document.createElement('div');
          wizardHeader.className = 'wizard-header';
          wizardHeader.innerHTML = getDynamicWizardHeader(tab, acao, tipo, tipoContratacao, url);
          inner.appendChild(wizardHeader);
          inner.appendChild(main.cloneNode(true));
        }

        // 5) executa scripts do wizard (inline + externos)
        const scripts = temp.querySelectorAll('script');
        const loads = [];
        // Carregamento dinâmico do wizard-juridica.js e inicialização
        if (url.includes('wizard-juridica.html')) {
          // Corrige caminho para ambiente local e GitHub Pages
          let basePath = window.location.pathname.split('/').slice(0, -1).join('/');
          if (!basePath.endsWith('/')) basePath += '/';
          const scriptPath = window.location.origin + basePath + 'assets/js/wizard-juridica.js';
          const tag = document.createElement('script');
          tag.src = scriptPath;
          tag.defer = true;
          tag.onload = function() {
            if (typeof initWizardJuridica === 'function') initWizardJuridica();
            setTimeout(() => {
              try { syncWizardProgress(); } catch {}
              const wizardSteps = inner?.querySelector('.wizard-steps');
              if (wizardSteps){
                const observer = new MutationObserver(() => { try { syncWizardProgress(); } catch {} });
                observer.observe(wizardSteps, { childList:true, subtree:true, attributes:true });
              }
            }, 100);
          };
          document.body.appendChild(tag);
        } else {
          scripts.forEach(s => {
            if (s.src){
              const abs = new URL(s.getAttribute('src'), base).href;
              const tag = document.createElement('script');
              tag.src = abs; tag.defer = true; if (s.type) tag.type = s.type;
              const p = new Promise((resolve, reject) => {
                tag.addEventListener('load', resolve, { once:true });
                tag.addEventListener('error', () => reject(new Error('Falha ao carregar '+abs)), { once:true });
              });
              loads.push(p);
              document.body.appendChild(tag);
            } else if (s.textContent.trim()){
              try { eval(s.textContent); } catch(e){ /* ignora falha de inline */ }
            }
          });
          if (loads.length){ try { await Promise.allSettled(loads); } catch {} }
        }
        if (content){
          const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
          const nodes = Array.from(content.querySelectorAll(FOCUSABLE)).filter(n=>!n.disabled && n.offsetParent!==null);
          if (nodes.length) (content.querySelector('[autofocus]') || nodes[0]).focus();
        }
        // 7) evento para hooks
        window.dispatchEvent(new CustomEvent('wizard:host:mounted'));
      } catch (err) {
        if (inner) inner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro: ' + err.message + '</div>';
      }
    })();
}
function getDynamicWizardHeader(tab, acao, tipo, tipoContratacao, url) {
    // Mapeamento das modalidades
    const modalidades = {
        'locacao': 'Locação',
        'cessao': 'Cessão',
        'comodato': 'Comodato'
    };
    
    // Mapeamento das ações
    const acoes = {
        'contratar': 'Contratação',
        'regularizar': 'Regularização',
        'formalizar': 'Formalização'
    };
    
    // Mapeamento dos tipos de pessoa
    const tipos = {
        'pessoa-fisica': 'Pessoa Física',
        'pessoa-juridica': 'Pessoa Jurídica'
    };
    
    // Mapeamento dos tipos de contratação
    const tiposContratacao = {
        'nova-unidade': 'Nova Unidade',
        'mudanca-endereco': 'Mudança de Endereço'
    };
    
    // Constrói o título dinâmico
    const modalidade = modalidades[tab] || 'Modalidade';
    const acaoTexto = acoes[acao] || 'Solicitação';
    const tipoTexto = tipos[tipo] || '';
    const tipoContratacaoTexto = tiposContratacao[tipoContratacao] || '';
    
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
      if (window._licitacaoSim === true) {
        descricao = 'Preencha os dados necessários para contratar à locação de uma nova unidade precedida de licitação.';
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
  const progressSteps = document.querySelectorAll('#wizard-modal-inner .wizard-progress .progress-step');
  const wizardSteps = document.querySelectorAll('#wizard-modal-inner .wizard-step');
  
  if (progressSteps.length === 0 || wizardSteps.length === 0) return;
  
  // Reset all progress steps
  progressSteps.forEach(step => {
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

// --- Integração dinâmica do Wizard ---
function abrirWizard() {
    const overlay = document.getElementById('wizard-modal-overlay');
    const inner = document.getElementById('wizard-modal-inner');
    overlay.style.display = 'flex';
    inner.innerHTML = '<div style="padding:48px;text-align:center;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Carregando...</div>';
    fetch('pages/wizard-preview.html')
      .then(r => {
        if (!r.ok) throw new Error('Arquivo não encontrado');
        return r.text();
      })
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // Pega só o conteúdo principal do wizard
        const main = temp.querySelector('main') || temp.querySelector('.wizard-container') || temp;
        inner.innerHTML = '';
        if (main && main.innerHTML.trim()) {
          inner.appendChild(main.cloneNode(true));
          // Executa scripts do wizard
          const scripts = temp.querySelectorAll('script');
          scripts.forEach(s => {
            if (s.textContent) {
              try { eval(s.textContent); } catch(e){}
            }
          });
        } else {
          inner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro: Conteúdo do wizard não encontrado.</div>';
        }
      })
      .catch(err => {
        inner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro ao carregar o wizard: ' + err.message + '</div>';
      });
}

// --- Integração dinâmica do modal de documentação ---
function abrirDocumentationModal() {
    const overlay = document.getElementById('documentation-modal-overlay');
    const inner = document.getElementById('documentation-modal-inner');
    overlay.style.display = 'flex';
    inner.innerHTML = '<div style="padding:32px;text-align:center;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Carregando documentação...</div>';
    fetch('pages/documentation-modal.html')
      .then(r => {
        if (!r.ok) throw new Error('Arquivo não encontrado');
        return r.text();
      })
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // Pega só o conteúdo principal
        const main = temp.querySelector('main') || temp.querySelector('.documentation-modal') || temp;
        inner.innerHTML = '';
        if (main && main.innerHTML.trim()) {
          inner.appendChild(main.cloneNode(true));
        } else {
          inner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro: Conteúdo da documentação não encontrado.</div>';
        }
      })
      .catch(err => {
        inner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro ao carregar a documentação: ' + err.message + '</div>';
      });
}

document.addEventListener('DOMContentLoaded', function() {
  // --- Switch Precedida de Licitação ---
  const licSwitch = document.getElementById('lic-switch');
  const licState = document.getElementById('lic-state');
  const licInput = document.getElementById('licitacao');

  function updateSwitchUI(checked) {
    licSwitch.setAttribute('aria-checked', checked ? 'true' : 'false');
    licState.textContent = checked ? 'Sim' : 'Não';
    licInput.value = checked ? 'sim' : 'nao';
    window._licitacaoSim = checked;
  }

  if (licSwitch && licState && licInput) {
    const initialChecked = licSwitch.getAttribute('aria-checked') === 'true';
    updateSwitchUI(initialChecked);

    licSwitch.addEventListener('click', function() {
      const checked = licSwitch.getAttribute('aria-checked') !== 'true';
      updateSwitchUI(checked);
    });

    licSwitch.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        const checked = licSwitch.getAttribute('aria-checked') !== 'true';
        updateSwitchUI(checked);
        e.preventDefault();
      }
    });
  }

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
    // Removido: não fecha o modal ao clicar fora do conteúdo
    // wizardOverlay.addEventListener('click', function(e) {
    //   if (e.target === wizardOverlay) {
    //     closeWizardModal();
    //   }
    // });
  // Documentation
  const docOverlay = document.getElementById('documentation-modal-overlay');
  const closeDocBtn = document.getElementById('close-documentation-modal');
  if (closeDocBtn) {
    closeDocBtn.onclick = function() {
      docOverlay.style.display = 'none';
      document.getElementById('documentation-modal-inner').innerHTML = '';
    };
  }
  docOverlay.addEventListener('click', function(e) {
    if (e.target === docOverlay) {
      docOverlay.style.display = 'none';
      document.getElementById('documentation-modal-inner').innerHTML = '';
    }
  });
});
// --- PATCH: sync licitacao switch and lazy-load wizard ---
(function(){
  try {
    const licSwitch = document.querySelector("#switch-licitacao, [data-switch-licitacao]");
    if (licSwitch){
      window._licitacaoSim = !!(licSwitch.checked || licSwitch.getAttribute("aria-checked")==="true");
      licSwitch.addEventListener("change", () => { window._licitacaoSim = !!licSwitch.checked; });
    }
    let wizardLoaded = false;
    function ensureWizardJs(){
      if (wizardLoaded) return; wizardLoaded = true;
      const s = document.createElement("script");
      s.src = "assets/js/wizard-juridica.js";
      document.head.appendChild(s);
    }
    document.addEventListener("click",(e)=>{
      const b = e.target.closest("[data-open-wizard], #btnIniciar, .open-wizard, [data-action='open-wizard']");
      if (b) ensureWizardJs();
    }, true);
  } catch(e){ console.warn("PATCH licitacao/wizard loader error", e); }
})();

// --- PATCH: loader/licitação + opener ---
(function(){
  try{
    // switch "Precedida de Licitação?" defensivo
    const licSwitch = document.querySelector("#switch-licitacao, [data-switch-licitacao]");
    if (licSwitch){
      window._licitacaoSim = !!(licSwitch.checked || licSwitch.getAttribute("aria-checked")==="true");
      licSwitch.addEventListener("change", ()=>{ window._licitacaoSim = !!licSwitch.checked; });
    }
    // evita 'checklist is not defined'
    if (typeof window.checklist !== "function") window.checklist = function(){};

    // carrega wizard-juridica.js 1x ao clicar em "Iniciar"
    let wizardLoaded = false;
    function ensureWizardJs(){
      if (wizardLoaded) return; wizardLoaded = true;
      const s=document.createElement("script");
      s.src="assets/js/wizard-juridica.js";
      document.head.appendChild(s);
    }
    document.addEventListener("click", (e)=>{
      const b=e.target.closest("[data-open-wizard], #btnIniciar, .open-wizard, [data-action='open-wizard']");
      if (b) ensureWizardJs();
    }, true);
  }catch(e){ console.warn("patch opener err", e); }
})();
