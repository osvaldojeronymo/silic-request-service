// Slider Switch funcionalidade
document.addEventListener('DOMContentLoaded', function() {
  var slider = document.getElementById('switch-licitacao');
  if (slider) {
    var sliderText = document.getElementById('slider-text');
    var licitacaoInput = document.getElementById('licitacao');
    function updateSliderState(pressed) {
      slider.setAttribute('aria-pressed', String(pressed));
      if (sliderText) sliderText.textContent = pressed ? 'Sim' : 'Não';
      if (licitacaoInput) licitacaoInput.value = pressed ? 'sim' : 'nao';
    }
    slider.addEventListener('click', function() {
      var pressed = slider.getAttribute('aria-pressed') === 'true';
      updateSliderState(!pressed);
    });
    slider.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        var pressed = slider.getAttribute('aria-pressed') === 'true';
        updateSliderState(!pressed);
      }
    });
    // Inicializa estado
    updateSliderState(false);
  }
});
/**
 * Arquivo: main.js
 * Responsável por funções utilitárias, manipulação de elementos fixos, navegação, acessibilidade e integração com o portal.
 * Mantém compatibilidade com IDs/classes do HTML e organiza helpers e eventos globais.
 */

// app.optimized.js — SILIC 2.0 (consolidado)
// Este arquivo substitui duplicações, organiza responsabilidades e evita reflows desnecessários.
// Mantém compatibilidade com IDs/classes do seu HTML atual.

(() => {
  'use strict';

  // =====================
  // Helpers base
  // =====================
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const cls = (el, name, onOff) => el && el.classList.toggle(name, !!onOff);
  const setHidden = (el, hide) => { if(!el) return; cls(el, 'is-hidden', !!hide); el.setAttribute('aria-hidden', hide ? 'true' : 'false'); };

  // =====================
  // Elementos fixos
  // =====================
  const els = {
    // formulário & selects
    form:           $('#service-form'),
    contratar:      $('#contratar'),
    formalizar:     $('#formalizar'),
    tipoContr:      $('#tipo-contratacao'),
    // campos condicionais
    campoValor:     $('#campo-valor'),
    campoAto:       $('#campo-ato-formal'),
    campoTipo:      $('#campo-tipo-contratacao'),
    // switch licitação
    blocoLic:       $('#bloco-licitacao'),
    licSwitch:      $('#lic-switch'),
    licState:       $('#lic-state'),
    licHidden:      $('#licitacao'),
    // tabs
    tabButtons:     $$('.tab-button'),
    // modais wizard
    wizOverlay:     $('#wizard-modal-overlay'),
    wizContent:     $('#wizard-modal-content'),
    wizInner:       $('#wizard-modal-inner'),
    wizClose:       $('#close-wizard-modal'),
    // modais documentação
    docOverlay:     $('#documentation-modal-overlay'),
    docInner:       $('#documentation-modal-inner'),
    docClose:       $('#close-documentation-modal'),
    // portal
    voltarPortalBtn: $('#voltarPortalBtn'),
  };

  // =====================
  // Voltar ao portal + botão
  // =====================
  function veioDoPortal(){
    const ref = document.referrer || '';
    const hasParam = window.location.search.includes('from=portal');
    return /silic-portal/i.test(ref) || hasParam;
  }
  function voltarAoPortal(){
    const portalUrl = 'https://osvaldojeronymo.github.io/silic-portal-imoveis/';
    if (veioDoPortal() && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = portalUrl;
    }
  }
  function initPortalButton(){
    const btn = els.voltarPortalBtn;
  if(!btn) return;
  if (veioDoPortal()) btn.classList.add('show');
  else btn.classList.remove('show');
  btn.onclick = voltarAoPortal;
  }

  // =====================
  // Acessibilidade: Tabs
  // =====================
  function enhanceTabs(){
    const tabs = els.tabButtons;
    if(!tabs.length) return;
    tabs.forEach((btn, i) => {
      btn.setAttribute('role','tab');
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
      on(btn, 'keydown', e => {
        if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.click(); next.focus();
      });
      on(btn, 'click', () => {
        tabs.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('tabindex', b===btn ? '0' : '-1'); });
        updateVisibility();
      });
    });
  }

  // =====================
  // Focus trap para modal
  // =====================
  function trapFocusWithin(modal){
    if(!modal) return;
    const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const nodes = $$(FOCUSABLE, modal).filter(n=>!n.disabled && n.offsetParent !== null);
    if(!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length-1];
    function loop(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    on(modal, 'keydown', loop);
    (modal.querySelector('[autofocus]') || first).focus();
  }

  // =====================
  // Switch "Precedida de licitação?"
  // =====================
  const lic = (() => {
    const sw  = els.licSwitch, txt = els.licState, hid = els.licHidden;
    if(!sw || !txt || !hid) {
      return { get:()=> 'nao', set:()=>{}, toggle:()=>{}, init:()=>{} };
    }
    const set = (on) => {
      const v = on ? 'sim' : 'nao';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      txt.textContent = on ? 'Sim' : 'Não';
      hid.value = v;
  txt.classList.remove('ativo'); // remove efeito visual, ambos iguais
      // pulso visual opcional
      sw.classList.add('pulse'); setTimeout(()=> sw.classList.remove('pulse'), 450);
    };
    const get = () => sw.getAttribute('aria-checked') === 'true';
    const toggle = () => set(!get());
    const init = () => {
      set(false); // sempre inicia em 'Não'
    };
    on(sw, 'click', (e)=>{ e.preventDefault(); toggle(); }, { passive: true });
    on(sw, 'keydown', (e)=>{
      if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowLeft'){ e.preventDefault(); set(false); }
      else if (e.key === 'ArrowRight'){ e.preventDefault(); set(true); }
    });
    on(els.form, 'reset', ()=> set(false));
    init();
    return { get:()=> (get() ? 'sim' : 'nao'), set:(v)=> set(v==='sim'), toggle, init };
  })();

  // =====================
  // Visibilidade de campos (sem “buracos”)
  // =====================
  function activeTabKey(){
    return $('.tab-button.active')?.dataset.tab || 'locacao';
  }
  function mustShowLicitacao(){
    const tab  = activeTabKey();
    const acao = els.contratar?.value;
    const tipo = els.formalizar?.value;
    const tipoContr = els.tipoContr?.value;
    return tab === 'locacao' && acao === 'contratar' && tipo === 'pessoa-juridica' && tipoContr === 'nova-unidade';
  }
  function updateVisibility(){
    const acao = els.contratar?.value || '';
    if (els.campoValor) els.campoValor.style.display = (acao === 'regularizar') ? '' : 'none';
    if (els.campoAto)   els.campoAto.style.display   = (acao === 'formalizar') ? '' : 'none';
    //if (els.campoTipo)  els.campoTipo.style.display  = (acao === 'contratar')  ? '' : 'none';

    const showLic = mustShowLicitacao();
    setHidden(els.blocoLic, !showLic);
    if(showLic) lic.set('nao'); // reforça reset ao exibir
    else lic.set('nao'); // reforça reset ao ocultar
  }
  // listens
  on(document, 'change', (e)=>{
    const id = e.target?.id;
    if (id === 'contratar' || id === 'formalizar' || id === 'tipo-contratacao') updateVisibility();
  });

  // =====================
  // Wizard modal (carrega HTML por fetch)
  // =====================
  function openWizardModal(){
    if (!els.wizOverlay) return;
    els.wizOverlay.style.display = 'flex';
    els.wizOverlay.style.visibility = 'visible';
    els.wizOverlay.style.opacity = '1';
    els.wizOverlay.removeAttribute('aria-hidden');
    trapFocusWithin(els.wizContent);
  }
  function closeWizardModal(){
    if (!els.wizOverlay) return;
    els.wizOverlay.style.display = 'none';
    els.wizOverlay.style.visibility = 'hidden';
    els.wizOverlay.style.opacity = '0';
    els.wizOverlay.setAttribute('aria-hidden','true');
    if (els.wizInner) els.wizInner.innerHTML = '';
  }
  // Removido: não fecha o modal ao clicar fora do conteúdo
  // on(els.wizOverlay, 'click', (e)=> { if (e.target === els.wizOverlay) closeWizardModal(); });
  on(els.wizClose,   'click', closeWizardModal);

  async function abrirWizardHtml(url){
  if (!url || !els.wizInner) return;
  els.wizInner.innerHTML = '';
  document.querySelectorAll('script[data-wizard-script]').forEach(s => s.remove());
  openWizardModal();
  els.wizInner.innerHTML = '<div style="padding:32px;text-align:center;color:#666">Carregando…</div>';
  try{
    const resp = await fetch(url, { cache: 'no-store' });
    if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const main = temp.querySelector('main, .wizard-financeiro-container, .wizard-container') || temp;
    els.wizInner.innerHTML = '';
    els.wizInner.appendChild(main.cloneNode(true));
    // Para wizard-juridica.html, carrega e executa o JS como texto APÓS inserir o HTML e aguarda DOM
    if (url.includes('wizard-juridica.html')) {
      try {
        const jsResp = await fetch('assets/js/wizard-juridica.js', { cache: 'no-store' });
        if (jsResp.ok) {
          const jsCode = await jsResp.text();
          // Aguarda até que #wizardSteps e #wizardContent estejam disponíveis
          let tries = 0;
          function tryInitWizard(){
            const stepsDiv = document.getElementById('wizardSteps');
            const contentDiv = document.getElementById('wizardContent');
            if (stepsDiv && contentDiv) {
              try { eval(jsCode); } catch(e){}
            } else if (tries < 10) {
              tries++;
              setTimeout(tryInitWizard, 30);
            }
          }
          tryInitWizard();
        }
      } catch(e) { els.wizInner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro ao carregar o wizard: ' + e.message + '</div>'; return; }
    }
    temp.querySelectorAll('script').forEach(s => {
      if (s.textContent.trim()) {
        try { eval(s.textContent); } catch(e) { /* ignora erro de inline */ }
      }
    });
    window.dispatchEvent(new CustomEvent('wizard:host:mounted'));
  }catch(err){
    els.wizInner.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro ao carregar o wizard: ' + err.message + '</div>';
  }
  }
  // expõe para HTML existente
  window.abrirWizardHtml = abrirWizardHtml;

  // Botão principal "Iniciar"
  window.acaoIniciarWizard = function acaoIniciarWizard(){
    const tab = activeTabKey();
    const acao = els.contratar?.value;
    const tipo = els.formalizar?.value;
    const tipoContr = els.tipoContr?.value;
    if (tab === 'locacao' && acao === 'contratar') {
      if (tipo === 'pessoa-fisica') abrirWizardHtml('pages/wizard-fisica.html');
      else if (tipo === 'pessoa-juridica') abrirWizardHtml('pages/wizard-juridica.html');
      else openWizardModal();
    } else {
      openWizardModal();
    }
  };

  // =====================
  // Documentação (JSON)
  // =====================
  async function buildDocumentationList(){
    const container = els.docInner;
    if(!container) return;
    container.innerHTML = '<div style="padding:24px;text-align:center;color:#666;">Carregando documentação…</div>';
    try{
      const res = await fetch('documentacao.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('documentacao.json não encontrado');
      const json = await res.json();

      // Suporta dois formatos: {documentacao:[...] } ou array direto
      const buckets = Array.isArray(json) ? json : (json.documentacao || json.itens || []);
      const wrap = document.createElement('div');
      wrap.style.cssText = 'padding:16px 20px; display:grid; gap:14px;';

      buckets.forEach(cat => {
        // cat pode já ser "documento" único
        if (cat.titulo && (cat.descricao || cat.url) && !cat.documentos){
          const li = document.createElement('div');
          li.style.cssText = 'padding:10px 12px; border:1px solid #e7e7e7; border-radius:10px; background:#fff;';
          li.innerHTML = `<div style="font-weight:700; color:#222;">${cat.titulo}</div>
                          ${cat.descricao ? `<div style="color:#444; font-size:.95rem;">${cat.descricao}</div>` : ''}
                          ${cat.url ? `<div style="margin-top:6px;"><a href="${cat.url}" target="_blank" rel="noopener">Abrir</a></div>` : ''}`;
          wrap.appendChild(li);
          return;
        }

        const section = document.createElement('section');
        section.style.marginBottom = '6px';
        const header = document.createElement('div');
        header.style.cssText = 'font-weight:700; margin:0 0 6px 0; color:#222;';
        header.textContent = cat.categoria || cat.titulo || 'Documentos';
        section.appendChild(header);

        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style:none; padding:0; margin:0; display:grid; gap:8px;';
        (cat.documentos || []).forEach(doc => {
          const li = document.createElement('li');
          li.style.cssText = 'padding:10px 12px; border:1px solid #e7e7e7; border-radius:10px; background:#fff;';
          li.innerHTML = `<div style="font-weight:700; color:#222;">${doc.titulo || 'Documento'}</div>
                          ${doc.descricao ? `<div style="color:#444; font-size:.95rem;">${doc.descricao}</div>` : ''}
                          ${doc.url ? `<div style="margin-top:6px;"><a href="${doc.url}" target="_blank" rel="noopener">Abrir</a></div>` : ''}`;
          ul.appendChild(li);
        });
        section.appendChild(ul);
        wrap.appendChild(section);
      });

      container.innerHTML = '';
      container.appendChild(wrap);
    } catch(err){
      container.innerHTML = '<div style="padding:48px;text-align:center;color:#c00;">Erro ao carregar a documentação: ' + err.message + '</div>';
    }
  }
  // abre/fecha modal documentação
  function openDocModal(){ if(els.docOverlay){ els.docOverlay.style.display = 'flex'; } }
  function closeDocModal(){ if(els.docOverlay){ els.docOverlay.style.display = 'none'; els.docInner && (els.docInner.innerHTML=''); } }
  on(els.docOverlay, 'click', (e)=> { if (e.target === els.docOverlay) closeDocModal(); });
  on(els.docClose,   'click', closeDocModal);

  // Observa abertura por estilo inline
  if (els.docOverlay){
    const obs = new MutationObserver(()=>{
      const visible = els.docOverlay && getComputedStyle(els.docOverlay).display !== 'none';
      if (visible) buildDocumentationList();
    });
    obs.observe(els.docOverlay, { attributes: true, attributeFilter: ['style'] });
  }

  // =====================
  // Busca de imóveis (mock) + paginação
  // =====================
  const mockImoveis = [
    { codigo:'IMV001', denominacao:'Edifício Central',           local:'Centro - São Paulo/SP',     status:'disponivel', locadores:'João Silva, Maria Santos' },
    { codigo:'IMV002', denominacao:'Complexo Empresarial Norte',  local:'Barra Funda - São Paulo/SP',status:'ocupado',    locadores:'Empresa ABC Ltda' },
    { codigo:'IMV003', denominacao:'Prédio Administrativo Sul',   local:'Vila Olímpia - São Paulo/SP',status:'manutencao',locadores:'-' },
    { codigo:'IMV004', denominacao:'Centro de Distribuição',      local:'Guarulhos - SP',            status:'disponivel', locadores:'Transportadora XYZ' },
    { codigo:'IMV005', denominacao:'Loja Comercial Centro',       local:'Centro - Rio de Janeiro/RJ',status:'reservado',  locadores:'Comercial Rio Ltda' },
    { codigo:'IMV006', denominacao:'Galpão Industrial',           local:'Duque de Caxias - RJ',      status:'disponivel', locadores:'-' },
  ];
  let currentPage = 1;
  let itemsPerPage = 10;
  let filteredImoveis = [];

  function mostrarPesquisaImoveis(){
    const searchSection = $('#search-results-section');
    const formSection   = $('#form-section');
    if (formSection) formSection.style.display = 'none';
    if (searchSection){
      searchSection.style.display = 'block';
      searchSection.classList.add('fade-in');
      searchSection.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    mostrarEstruturaTabela();
  }
  function mostrarEstruturaTabela(){
    const tableContainer = $('#table-container');
    const loadingIndicator= $('#loading-indicator');
    const resultsMeta    = $('#results-meta');
    const noResults      = $('#no-results');
    const pagination     = $('#pagination');
    if (tableContainer) tableContainer.style.display = 'block';
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (resultsMeta) resultsMeta.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
    const tbody = $('#results-tbody'); if (tbody) tbody.innerHTML = '';
  }
  function buscarImoveis(){
    const searchInput = ($('#search-imovel')?.value || '').toLowerCase();
    const statusFilter= $('#status-filter')?.value || '';
    const loadingIndicator= $('#loading-indicator');
    const tableContainer = $('#table-container');
    const resultsMeta    = $('#results-meta');
    const noResults      = $('#no-results');
    const pagination     = $('#pagination');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (tableContainer) tableContainer.style.display = 'block';
    if (resultsMeta) resultsMeta.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
    // Skeleton
    const tbody = $('#results-tbody');
    if (tbody) {
      tbody.innerHTML = Array(5).fill().map(() => `
        <tr class="skeleton-row">
          <td><div class="skeleton-box"></div></td>
          <td><div class="skeleton-box"></div></td>
          <td><div class="skeleton-box"></div></td>
          <td><div class="skeleton-box"></div></td>
          <td><div class="skeleton-box"></div></td>
          <td><div class="skeleton-box"></div></td>
        </tr>
      `).join('');
    }

    setTimeout(()=>{
      filteredImoveis = mockImoveis.filter(imovel => {
        const s = searchInput;
        const matchSearch = !s || imovel.codigo.toLowerCase().includes(s) || imovel.denominacao.toLowerCase().includes(s) || imovel.local.toLowerCase().includes(s);
        const matchStatus = !statusFilter || imovel.status === statusFilter;
        return matchSearch && matchStatus;
      });
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (filteredImoveis.length){
        currentPage = 1;
        renderResultados();
        if (tableContainer) tableContainer.style.display = 'block';
        if (resultsMeta) resultsMeta.style.display = 'flex';
        if (pagination) pagination.style.display = 'flex';
      } else {
        if (noResults) noResults.style.display = 'block';
      }
    }, 500);
  }
  function renderResultados(){
    const tbody = $('#results-tbody'); if (!tbody) return;
    const start = (currentPage - 1) * itemsPerPage;
    const end   = start + itemsPerPage;
    const page  = filteredImoveis.slice(start, end);
    tbody.innerHTML = '';
    page.forEach(imovel => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${imovel.codigo}</strong></td>
        <td>${imovel.denominacao}</td>
        <td>${imovel.local}</td>
        <td><span class="status-tag ${imovel.status}">${getStatusLabel(imovel.status)}</span></td>
        <td>${imovel.locadores}</td>
        <td>
          <div class="table-actions">
            <button class="btn-action primary" data-cmd="ver" data-id="${imovel.codigo}">
              <i class="fas fa-eye"></i> Ver
            </button>
            ${imovel.status==='disponivel' ?
              `<button class="btn-action secondary" data-cmd="sel" data-id="${imovel.codigo}">
                 <i class="fas fa-check"></i> Selecionar
               </button>` : ''}
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
    updatePaginationInfo();
  }
  function getStatusLabel(s){ return ({disponivel:'Disponível',ocupado:'Ocupado',manutencao:'Manutenção',reservado:'Reservado'})[s] || s; }
  function updatePaginationInfo(){
    const total = Math.ceil(filteredImoveis.length / itemsPerPage) || 1;
    const el = $('#pagination-info'); if (el) el.textContent = `Página ${currentPage} de ${total}`;
    const btnPrev = $('#btn-prev'), btnNext = $('#btn-next');
    if (btnPrev) btnPrev.disabled = currentPage <= 1;
    if (btnNext) btnNext.disabled = currentPage >= total;
  }
  function previousPage(){ if (currentPage > 1){ currentPage--; renderResultados(); } }
  function nextPage(){ const total = Math.ceil(filteredImoveis.length / itemsPerPage) || 1; if (currentPage < total){ currentPage++; renderResultados(); } }
  function changeItemsPerPage(){ const sel = $('#items-per-page'); if (!sel) return; itemsPerPage = parseInt(sel.value || '10', 10); currentPage = 1; renderResultados(); }
  function limparFiltros(){ const s=$('#search-imovel'), f=$('#status-filter'); if(s) s.value=''; if(f) f.value=''; mostrarEstruturaTabela(); }
  on(document, 'click', (e)=>{
    const btn = e.target.closest('.btn-action'); if (!btn) return;
    const cmd = btn.getAttribute('data-cmd'); const id = btn.getAttribute('data-id');
    if (cmd === 'ver') alert(`Visualizando detalhes do imóvel: ${id}`);
    if (cmd === 'sel') {
      const item = filteredImoveis.find(i=> i.codigo === id) || mockImoveis.find(i=> i.codigo === id);
      if (item && confirm(`Deseja selecionar o imóvel "${item.denominacao}" (${id})?`)) {
        alert(`Imóvel ${id} selecionado!`);
      }
    }
  });
  // Expor busca básica
  window.buscarImoveis = buscarImoveis;
  window.previousPage  = previousPage;
  window.nextPage      = nextPage;
  window.changeItemsPerPage = changeItemsPerPage;
  window.limparFiltros = limparFiltros;
  window.mostrarPesquisaImoveis = mostrarPesquisaImoveis;

  // =====================
  // Formulário principal
  // =====================
  function iniciarSolicitacao(){
    const contratar = els.contratar?.value || '';
    const formal    = els.formalizar?.value || '';
    const valor     = $('#valor')?.value || '';
    const atoFormal = $('#ato-formal')?.value || '';
    const tipoContr = els.tipoContr?.value || '';
    const licitacao = els.licHidden?.value || 'nao';

    if (!contratar) return alert('Por favor, selecione uma ação.');
    if (!formal)    return alert('Por favor, selecione o tipo.');
    if (contratar === 'contratar' && !tipoContr) return alert('Por favor, selecione o tipo de contratação.');
    if (contratar === 'regularizar' && !valor)   return alert('Por favor, informe o valor.');
    if (contratar === 'formalizar'  && !atoFormal) return alert('Por favor, selecione o ato formal.');

    const tab = activeTabKey();

    if (contratar === 'contratar') {
      localStorage.setItem('processoTipo', tipoContr);
      localStorage.setItem('processoModalidade', tab);
      localStorage.setItem('processoAcao', contratar);
      localStorage.setItem('licitacao', licitacao);
      window.location.href = `stepper.html?tipo=${tipoContr}&modalidade=${tab}`;
      return;
    }

    if (contratar === 'regularizar' || contratar === 'formalizar') {
      localStorage.setItem('processoTipo', formal);
      localStorage.setItem('processoModalidade', tab);
      localStorage.setItem('processoAcao', contratar);
      localStorage.setItem('processoValor', valor || '');
      localStorage.setItem('processoAtoFormal', atoFormal || '');
      mostrarPesquisaImoveis();
      return;
    }
  }
  window.iniciarSolicitacao = iniciarSolicitacao;

  // Cancelar (seção de formulário)
  function cancelarSolicitacao(){
    const formSection = $('#form-section');
    if (formSection){ formSection.style.display = 'none'; formSection.classList.remove('fade-in'); }
    $('.search-form')?.scrollIntoView({ behavior:'smooth', block:'center' });
  }
  window.cancelarSolicitacao = cancelarSolicitacao;

  // =====================
  // Wizard Financeiro (helpers básicos)
  // =====================
  function initWizardFinanceiro(){
    const addBtn = $('#adicionar-locador');
    on(addBtn, 'click', ()=>{
      const container = $('#dados-bancarios-container'); if(!container) return;
      const novo = document.createElement('div'); novo.className = 'banco-block';
      const count = container.querySelectorAll('.banco-block').length + 1;
      novo.innerHTML = `
        <input type="text" placeholder="Agência" class="agencia" name="agencia_${count}">
        <input type="text" placeholder="Número e nome da agência" class="agencia-nome" name="agencia_nome_${count}">
        <input type="text" placeholder="Conta" class="conta" name="conta_${count}">
        <select class="tipo-conta" name="tipo_conta_${count}">
          <option value="corrente">Corrente</option>
          <option value="poupanca">Poupança</option>
        </select>
        <button type="button" class="remover-locador" onclick="removerLocador(this)">
          <i class="fas fa-trash"></i> Remover Locador
        </button>`;
      container.appendChild(novo);
      novo.style.opacity='0'; novo.style.transform='translateY(-10px)';
      requestAnimationFrame(()=>{ novo.style.transition='all .3s ease'; novo.style.opacity='1'; novo.style.transform='translateY(0)'; });
    });

    on(document, 'input', (e)=>{
      if (e.target.classList.contains('agencia') || e.target.classList.contains('conta')) {
        e.target.value = e.target.value.replace(/\D/g,'');
      }
    });
  }
  window.initWizardFinanceiro = initWizardFinanceiro;

  function validarFormularioFinanceiro(){
    const forma = $('#forma-pagamento');
    const agencias = $$('.agencia');
    const contas   = $$('.conta');
    let ok = true;
    if (forma && !forma.value) ok = false;
    agencias.forEach(a => { a.style.borderColor = a.value.trim()? '#ddd':'#dc3545'; if(!a.value.trim()) ok=false; });
    contas.forEach(c => { c.style.borderColor = c.value.trim()? '#ddd':'#dc3545'; if(!c.value.trim()) ok=false; });
    return ok;
  }
  function coletarDadosFormularioFinanceiro(){
    const forma = $('#forma-pagamento');
    const locadores = [];
    $$('.banco-block').forEach((b, i)=>{
      const agencia = $('.agencia', b)?.value || '';
      const agenciaNome = $('.agencia-nome', b)?.value || '';
      const conta  = $('.conta', b)?.value || '';
      const tipo   = $('.tipo-conta', b)?.value || '';
      if (agencia && conta) locadores.push({ id: i+1, agencia, agenciaNome, conta, tipoConta: tipo });
    });
    return {
      formaPagamento: forma ? forma.value : '',
      locadores,
      resumo: { valorAluguel:'R$ 3.000,00', parcelas:12, vencimento:'15 de cada mês' }
    };
  }
  function removerLocador(btn){
    const block = btn.closest('.banco-block'); if(!block) return;
    block.style.transition = 'all .3s ease';
    block.style.opacity='0'; block.style.transform='translateY(-10px)';
    setTimeout(()=> block.remove(), 300);
  }
  window.WizardFinanceiro = {
    validarFormulario: validarFormularioFinanceiro,
    coletarDados: coletarDadosFormularioFinanceiro,
    limparFormulario: function(){
      const forma = $('#forma-pagamento'); if (forma) forma.value='';
      $$('.banco-block').forEach((b, i)=>{
        if (i>0) b.remove();
        else{
          $$('input', b).forEach(inp=> inp.value='');
          const sel = $('select', b); if (sel) sel.selectedIndex = 0;
        }
      });
    }
  };
  window.removerLocador = removerLocador;

  // =====================
  // Smooth anchors
  // =====================
  on(document, 'click', (e)=>{
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const target = $(a.getAttribute('href')); if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior:'smooth', block:'start' });
  });

  // =====================
  // DOM Ready
  // =====================
  document.addEventListener('DOMContentLoaded', () => {
    enhanceTabs();
    initPortalButton();
    updateVisibility();
    // wizard financeiro: inicializa quando presente
    if ($('#wizard-modal-inner')) initWizardFinanceiro();
  });

  // API pública auxiliar
  window.SILIC = {
    voltarAoPortal,
    updateVisibility,
    abrirWizardHtml,
    openWizardModal,
    closeWizardModal,
    openDocModal,
    closeDocModal,
    buildDocumentationList
  };

})();
