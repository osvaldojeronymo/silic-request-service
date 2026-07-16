/* wizard-modal.js - vanilla JS, event-delegated wizard controller
 * Works with dynamically injected HTML (innerHTML/fetch).
 * Author: ChatGPT (for Osvaldo)
 */
(function () {
  'use strict';
  if (window.__WIZARD_MODAL_INIT__) return;
  window.__WIZARD_MODAL_INIT__ = true;

  // Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // State container
  const Wizard = {
    current: 0,
    steps: [],
    initialized: false,
  };

  // Open modal and (optionally) load HTML into it
  async function abrirWizardHtml(url) {
    const overlay = $('#wizard-modal-overlay');
    const inner = $('#wizard-modal-inner');
    const content = $('#wizard-modal-content');

    if (!overlay || !inner || !content) {
      console.warn('[wizard] Elementos do modal não encontrados.');
      return;
    }

    // Optional: load external HTML into content (abre após carregar)
    if (url) {
      try {
        content.innerHTML = '<div style="padding:16px">Carregando...</div>';
        const resolved = window.withBase ? window.withBase(url) : url;
        const resp = await fetch(resolved, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        content.innerHTML = html;
        // abre somente depois que há conteúdo
        overlay.style.display = 'flex';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.removeAttribute('aria-hidden');
      } catch (err) {
        console.error('[wizard] Falha ao carregar HTML:', err);
        content.innerHTML = `<div style="padding:16px;color:#b00020">Erro ao carregar conteúdo: ${String(err)}</div>`;
        // evita modal vazio
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        overlay.setAttribute('aria-hidden', 'true');
      }
    }

    // Ensure events & steps are wired
    initWizard();
  }

  // Close modal helper
  function fecharWizard() {
    const overlay = $('#wizard-modal-overlay');
    const content = $('#wizard-modal-content');
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    // Optional: clear content if you want a clean slate next open
    if (content) {
      // content.innerHTML = ''; // keep or clear depending on your flow
    }
  }

  // Initialize event delegation once
  function initWizard() {
    const content = $('#wizard-modal-content');
    if (!content) return;

    // Build steps list (panels marked with .wizard-step and data-step-index)
    Wizard.steps = $$('.wizard-step', content).sort(
      (a, b) => (Number(a.dataset.stepIndex) || 0) - (Number(b.dataset.stepIndex) || 0)
    );

    // If no explicit panels, try ARIA role="tabpanel"
    if (Wizard.steps.length === 0) {
      Wizard.steps = $$('[role="tabpanel"]', content);
      Wizard.steps.forEach((el, i) => (el.dataset.stepIndex ??= String(i)));
    }

    // Default to first step active
    Wizard.current = Math.max(0, Math.min(Wizard.current, Math.max(0, Wizard.steps.length - 1)));
    updateStep();

    // Wire delegated clicks just once
    if (!Wizard.initialized) {
      document.addEventListener('click', onDelegatedClick, true);
      document.addEventListener('keydown', onKeydown);
      Wizard.initialized = true;
    }
  }

  // Event delegation for any button/link with [data-wizard-action]
  function onDelegatedClick(evt) {
    const trigger = evt.target.closest('[data-wizard-action]');
    if (!trigger) return;

    const action = trigger.getAttribute('data-wizard-action');
    if (!action) return;

    // Prevent default for <button type="submit"> or <a href="#">
    evt.preventDefault();

    switch (action) {
      case 'next':
        goToStep(Wizard.current + 1);
        break;
      case 'prev':
        goToStep(Wizard.current - 1);
        break;
      case 'goto': {
        const idx = Number(trigger.getAttribute('data-step-index'));
        if (!Number.isNaN(idx)) goToStep(idx);
        break;
      }
      case 'cancel':
      case 'close':
        fecharWizard();
        break;
      default:
        console.warn('[wizard] Ação desconhecida:', action);
    }
  }

  // Keyboard UX: Esc closes, Ctrl+ArrowRight/Left navigate
  function onKeydown(evt) {
    if (evt.key === 'Escape') {
      fecharWizard();
      return;
    }
    if (evt.ctrlKey && (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft')) {
      evt.preventDefault();
      goToStep(Wizard.current + (evt.key === 'ArrowRight' ? 1 : -1));
    }
  }

  // Step switcher
  function goToStep(nextIndex) {
    if (Wizard.steps.length === 0) return;
    const clamped = Math.max(0, Math.min(nextIndex, Wizard.steps.length - 1));
    if (clamped === Wizard.current) return;
    Wizard.current = clamped;
    updateStep();
  }

  // UI update for active panel + header bullets (if present)
  function updateStep() {
    const content = $('#wizard-modal-content');
    if (!content) return;

    Wizard.steps.forEach((panel, i) => {
      const active = i === Wizard.current;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    // Optional: reflect state on header items with [data-step-index]
    const headers = $$('[data-step-index]', content);
    headers.forEach((el) => {
      const i = Number(el.getAttribute('data-step-index'));
      el.classList.toggle('is-active', i === Wizard.current);
      el.setAttribute('aria-selected', i === Wizard.current ? 'true' : 'false');
      el.setAttribute('tabindex', i === Wizard.current ? '0' : '-1');
    });

    // Enable/disable buttons if they have data-bound attributes
    const btnPrev = $('[data-wizard-action="prev"]', content);
    const btnNext = $('[data-wizard-action="next"]', content);
    if (btnPrev) btnPrev.disabled = Wizard.current === 0;
    if (btnNext) btnNext.disabled = Wizard.current === Wizard.steps.length - 1;
  }

  // Public API on window for existing code compatibility
  window.abrirWizardHtml = abrirWizardHtml;
  window.fecharWizard = fecharWizard;
  window.goToStep = goToStep;
  window.initWizard = initWizard;

  // Auto-bind if modal is already on screen (e.g., HTML embedded on page)
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = $('#wizard-modal-overlay');
    if (overlay) {
      initWizard();
    }
  });
})();

(function () {
  'use strict';
  const KEY = 'silic.hu.locacao.v1';
  const LIMIT = 2 * 1024 * 1024;
  const PROFILES = {
    ANALISTA_OPERACIONAL: 'Analista Operacional',
    GESTAO_OPERACIONAL: 'Gestão Operacional',
    ANALISTA_CONTRATOS: 'Analista Contratos',
    GESTOR_CONTRATOS: 'Gestor Contratos',
    JURIDICO: 'Área Jurídica',
    TECNICA: 'Área Técnica'
  };
  const META = {
    qualificacao: ['Visão geral e qualificação', 'Complete os dados que qualificam a demanda.'],
    licitacao: ['Licitação', 'Registre o certame e as evidências da vitória da CAIXA.'],
    propostas: ['Propostas e consulta pública', 'Localize ou cadastre as propostas e registre a escolha.'],
    imovel: ['Documentação do imóvel', 'Inclua os documentos que comprovam a regularidade do imóvel.'],
    locador: ['Documentação do locador', 'Cadastre locadores, representantes e dados de pagamento.'],
    autorizacoes: ['Autorizações e laudo', 'Registre justificativas, autorizações, laudo, negociação e riscos.'],
    juridico: ['Jurídico', 'Registre as consultas e análises da unidade jurídica CAIXA.'],
    aprovacao: ['Solicitar aprovação', 'Revise, encaminhe e acompanhe o ciclo da solicitação.']
  };
  let state = null;
  let current = 0;
  let errors = new Set();
  let landlord = {};
  let savedAt = '';
  const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const value = (name) => state?.fields?.[name] ?? '';
  const yes = (name) => value(name) === 'sim';
  const stamp = () => new Date().toISOString();
  const bytesLabel = (n) => n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;

  function fresh(config) {
    return {
      version: 1, id: `SILIC-${Date.now().toString().slice(-8)}`, profile: 'ANALISTA_OPERACIONAL',
      status: 'Em rascunho', config, fields: {}, attachments: [], landlords: [], proposals: [],
      adjustment: '', notification: '',
      history: [{at: stamp(), actor: 'Analista Operacional', action: 'Solicitação criada', detail: 'Em rascunho'}]
    };
  }
  function load(config) {
    try {
      const found = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (found?.version === 1 && found.config?.finalidade === config.finalidade) {
        found.fields ||= {}; found.attachments ||= []; found.landlords ||= []; found.proposals ||= []; found.history ||= [];
        return found;
      }
    } catch (e) { console.warn('[HU] Rascunho inválido', e); }
    return fresh(config);
  }
  function save(message = false) {
    if (!state) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    savedAt = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
    const label = document.querySelector('.hu-saved');
    if (label) label.textContent = `${message ? 'Rascunho salvo' : 'Salvo automaticamente'} às ${savedAt}`;
  }
  function flow() {
    const list = ['qualificacao'];
    if (state.config.finalidade === 'nova-unidade' && state.config.licitacao) list.push('licitacao');
    if (!state.config.licitacao && ['nova-unidade','mudanca-endereco'].includes(state.config.finalidade)) list.push('propostas');
    return list.concat(['imovel','locador','autorizacoes','juridico','aprovacao']);
  }
  function opt(v, label, selected) {
    return `<option value="${esc(v)}"${String(v) === String(selected) ? ' selected' : ''}>${esc(label)}</option>`;
  }
  function field(name, label, o = {}) {
    const type = o.type || 'text';
    const cls = `hu-field${o.full ? ' full' : ''}`;
    const required = o.required ? ' class="hu-required"' : '';
    let control = '';
    if (type === 'textarea') control = `<textarea id="hu-${name}" data-field="${name}" placeholder="${esc(o.placeholder || '')}">${esc(value(name))}</textarea>`;
    else if (type === 'select') control = `<select id="hu-${name}" data-field="${name}">${opt('','Selecione',value(name))}${(o.choices || []).map(x => opt(x[0],x[1],value(name))).join('')}</select>`;
    else control = `<input id="hu-${name}" data-field="${name}" type="${type}" value="${esc(value(name))}"${o.min !== undefined ? ` min="${o.min}"` : ''}${o.step ? ` step="${o.step}"` : ''}>`;
    return `<div class="${cls}"><label${required} for="hu-${name}">${esc(label)}</label>${control}${o.hint ? `<small class="hu-hint">${esc(o.hint)}</small>` : ''}</div>`;
  }
  function attachmentBox(step, types) {
    const rows = state.attachments.filter(a => a.step === step);
    return `<fieldset class="hu-section"><legend>Anexos</legend><div class="hu-grid">
      <div class="hu-field"><label>Tipo do documento</label><select id="attachment-type-${step}">${opt('','Selecione','')}${types.map(x => opt(x[0],x[1],'')).join('')}</select></div>
      <div class="hu-field"><label>Arquivo</label><input id="attachment-file-${step}" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"><small class="hu-hint">PDF, DOC, DOCX, PNG ou JPEG. Pacote limitado a 2 MB.</small></div></div>
      <button class="hu-btn" data-action="add-attachment" data-step="${step}" type="button">Adicionar anexo</button>
      <div class="hu-table-wrap"><table class="hu-table"><thead><tr><th>Tipo</th><th>Arquivo</th><th>Tamanho</th><th>Ações</th></tr></thead><tbody>
      ${rows.length ? rows.map(a => `<tr><td>${esc(a.typeLabel)}</td><td>${esc(a.name)}</td><td>${bytesLabel(a.size)}</td><td><button class="hu-btn small" data-action="download-attachment" data-id="${a.id}" type="button">Baixar</button> <button class="hu-btn small danger" data-action="delete-attachment" data-id="${a.id}" type="button">Excluir</button></td></tr>`).join('') : '<tr><td class="hu-empty" colspan="4">Nenhum anexo incluído.</td></tr>'}
      </tbody></table></div></fieldset>`;
  }
  function qualification() {
    return `<div class="hu-grid">${field('sap','Número SAP da edificação',{hint:'Opcional, quando disponível.'})}${field('unidade','Nome da unidade',{required:true})}${field('endereco','Endereço da unidade',{required:true,full:true})}${field('valorGlobal','Valor global da demanda (R$)',{type:'number',required:true,min:0.01,step:'0.01'})}${field('responsavel','Responsável pelo preenchimento',{required:true})}</div>
      <div class="hu-notice"><strong>Jornada:</strong> Locação · Contratação · ${esc(state.config.finalidadeLabel)} · ${state.config.licitacao ? 'com' : 'sem'} licitação.</div>`;
  }
  function licitation() {
    return `<div class="hu-grid">${field('tipoUnidade','Tipo de unidade',{type:'select',required:true,choices:[['rede','Rede Varejo'],['demais','Demais unidades']]})}${field('edital','Identificação do edital (número/ano)',{required:true})}${field('representante','Representante CAIXA (matrícula e nome)',{required:true})}${field('valorMin','Valor mínimo ofertado (R$)',{type:'number',required:true,min:0})}${field('valorMax','Valor máximo ofertado (R$)',{type:'number',required:true,min:0})}${field('obsLicitacao','Observações',{type:'textarea',full:true})}</div>
      ${attachmentBox('licitacao',[['edital','Edital/minuta/termo'],['analise','Análise do edital/minuta/termo'],['vencedora','Comprovação de vencedora'],['outro','Outro']])}`;
  }
  function propertyDocs() {
    return `${field('obsImovel','Observações sobre a documentação do imóvel',{type:'textarea',full:true})}${attachmentBox('imovel',[['matricula','Matrícula do imóvel'],['iptu','Certidão do IPTU'],['permissao','Permissão para atividade bancária'],['outro','Outro']])}`;
  }
  function landlordRows() {
    return state.landlords.length ? state.landlords.map((l,i) => `<tr><td>${l.type === 'pf' ? 'Pessoa física' : 'Pessoa jurídica'}</td><td>${esc(l.name)}</td><td>${esc(l.document)}</td><td>${l.related === 'sim' ? 'Sim' : 'Não'}</td><td>${esc(l.percentage)}%</td><td><button class="hu-btn small" data-action="edit-landlord" data-index="${i}" type="button">Editar</button> <button class="hu-btn small danger" data-action="delete-landlord" data-index="${i}" type="button">Excluir</button></td></tr>`).join('') : '<tr><td class="hu-empty" colspan="6">Nenhum locador cadastrado.</td></tr>';
  }
  function landlordStep() {
    const d = landlord;
    const draft = (n,l,t='text') => `<div class="hu-field"><label class="hu-required">${l}</label>${t === 'select' ? `<select data-landlord="${n}">${opt('','Selecione',d[n])}${n === 'type' ? opt('pf','Pessoa física',d[n])+opt('pj','Pessoa jurídica',d[n]) : opt('sim','Sim',d[n])+opt('nao','Não',d[n])}</select>` : `<input data-landlord="${n}" type="${t}" value="${esc(d[n] || '')}">`}</div>`;
    return `<fieldset class="hu-section"><legend>Locadores</legend><div class="hu-grid cols-3">${draft('type','Tipo','select')}${draft('name','Nome/Razão social')}${draft('document','CPF/CNPJ')}${draft('related','Parte relacionada?','select')}${draft('percentage','Percentual destinado (%)','number')}</div>
      <button class="hu-btn primary" data-action="save-landlord" type="button">${d.editIndex !== undefined ? 'Atualizar' : 'Incluir'} locador</button>
      <div class="hu-table-wrap"><table class="hu-table"><thead><tr><th>Tipo</th><th>Nome</th><th>CPF/CNPJ</th><th>Relacionada</th><th>%</th><th>Ações</th></tr></thead><tbody>${landlordRows()}</tbody></table></div></fieldset>
      <fieldset class="hu-section"><legend>Representação e recebedor divergente</legend><div class="hu-grid">${field('temRepresentante','Possui representante legal?',{type:'select',choices:[['sim','Sim'],['nao','Não']]})}${yes('temRepresentante') ? field('repDoc','CPF/CNPJ do representante',{required:true})+field('repNome','Nome do representante',{required:true}) : ''}${field('temRecebedor','Possui recebedor divergente?',{type:'select',choices:[['sim','Sim'],['nao','Não']]})}${yes('temRecebedor') ? field('recebedorTipo','Natureza do recebedor',{type:'select',required:true,choices:[['pf','Pessoa física'],['pj','Pessoa jurídica']]})+field('recebedorDoc','CPF/CNPJ do recebedor',{required:true})+field('recebedorNome','Nome do recebedor',{required:true}) : ''}</div></fieldset>
      <fieldset class="hu-section"><legend>Pagamento</legend><div class="hu-grid cols-3">${field('preComprometimento','Pré-comprometimento ERP/SAP',{required:true})}${field('vencimento','Vencimento do aluguel',{type:'date',required:true})}${field('pagamento','Forma de pagamento',{type:'select',required:true,choices:[['transferencia','Transferência'],['gru','GRU'],['boleto','Boleto']]})}${field('banco','Banco',{required:value('pagamento') === 'transferencia'})}${field('agencia','Agência e DV',{required:value('pagamento') === 'transferencia'})}${field('operacao','Operação/Produto')}${field('conta','Conta e DV',{required:value('pagamento') === 'transferencia'})}${field('obsLocador','Observações',{type:'textarea',full:true})}</div></fieldset>
      ${attachmentBox('locador',[['identificacao','Identificação do locador/cônjuge'],['ato','Ato constitutivo e alterações'],['certidoes','Certidões'],['representacao','Instrumento de representação'],['recebedor','Documentos do recebedor'],['outro','Outro']])}`;
  }
  function proposalRows() {
    return state.proposals.length ? state.proposals.map((p,i) => `<tr><td>${esc(p.address)}</td><td>${esc(p.received)}</td><td>${esc(p.area)}</td><td>R$ ${Number(p.rent).toLocaleString('pt-BR')}</td><td><select data-proposal="${i}" data-proposal-field="status">${opt('','Selecione',p.status)}${opt('aprovada','Aprovada/Escolhida',p.status)}${opt('recusada','Recusada',p.status)}</select></td><td><input data-proposal="${i}" data-proposal-field="justification" value="${esc(p.justification || '')}"></td><td><button class="hu-btn small" data-action="detail-proposal" data-index="${i}" type="button">Detalhar</button> <button class="hu-btn small danger" data-action="delete-proposal" data-index="${i}" type="button">Excluir</button></td></tr>`).join('') : '<tr><td class="hu-empty" colspan="7">Nenhuma proposta localizada ou cadastrada.</td></tr>';
  }
  function proposals() {
    return `<div class="hu-notice">A API SICVE/SILIC 2.0 está simulada neste piloto local. A interface e as regras de escolha estão funcionais.</div><div class="hu-grid">${field('temConsulta','Você possui o número da consulta pública?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}${yes('temConsulta') ? field('consulta','Número da consulta pública',{required:true}) : ''}</div>
      <button class="hu-btn primary" data-action="${yes('temConsulta') ? 'search-proposals' : 'add-proposal'}" type="button">${yes('temConsulta') ? 'Buscar consulta' : 'Cadastrar proposta manual'}</button>
      <div class="hu-table-wrap"><table class="hu-table"><thead><tr><th>Endereço</th><th>Recebimento</th><th>m²</th><th>Valor mensal</th><th>Status</th><th>Justificativa</th><th>Ações</th></tr></thead><tbody>${proposalRows()}</tbody></table></div>
      ${attachmentBox('propostas',[['proposta','Proposta'],['projeto','Projeto arquitetônico'],['matricula','Matrícula'],['iptu','IPTU'],['agua','Registro de água/luz'],['autorizacao','Autorização do poder público'],['outro','Outro']])}`;
  }
  function risk(name,label) {
    return field(name,label,{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})+(yes(name) ? field(`${name}Descricao`,`Descrição — ${label}`,{type:'textarea',required:true}) : '');
  }
  function authorizations() {
    const large = yes('rta') && Number(value('area')) > 550;
    return `<fieldset class="hu-section"><legend>Fundamentação e aprovações</legend><div class="hu-grid">${field('justificativa','Justificativas da contratação',{type:'textarea',required:true})}${field('custoBeneficio','Relação custo-benefício',{type:'textarea',required:true})}${field('aderencia','Aderência ao plano estratégico CAIXA',{type:'textarea',required:true,full:true})}${field('plano','Plano de Aquisições ou concordância da DE',{type:'select',required:true,choices:[['plano','Plano de Aquisições'],['de','Concordância da DE'],['nao','Não possui']]})}${value('plano') === 'plano' ? field('planoId','ID do Plano de Aquisições',{required:true})+'<div class="hu-field"><label>&nbsp;</label><button class="hu-btn" data-action="search-plan" type="button">Buscar plano</button></div>' : ''}</div></fieldset>
      <fieldset class="hu-section"><legend>RTA e laudo</legend><div class="hu-grid cols-3">${field('rta','Possui RTA?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}${yes('rta') ? field('area','Área contratada (m²)',{type:'number',required:true,min:0}) : ''}${large ? field('benfeitorias','Benfeitorias não recuperáveis (R$)',{type:'number',required:true})+field('valorVenal','Possui valor venal?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})+field('parecer','Número/data do parecer CAIXA',{required:true})+field('percentual','Percentual benfeitorias/valor venal',{type:'number',required:true})+field('manifestacaoNegocio','Manifestação do negócio',{type:'textarea',required:true})+field('manifestacaoInfra','Manifestação da infraestrutura',{type:'textarea',required:true}) : ''}${field('laudoData','Data do laudo',{type:'date',required:true})}${field('laudoNumero','Número do laudo',{required:true})}${field('laudoEmpresa','Empresa responsável',{required:true})}${field('laudoCnpj','CNPJ da empresa',{required:true})}${field('laudoMin','Valor mínimo mensal',{type:'number',required:true})}${field('laudoMedio','Valor médio mensal',{type:'number',required:true})}${field('laudoMax','Valor máximo mensal',{type:'number',required:true})}${field('laudoAssinado','Laudo assinado?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}</div></fieldset>
      <fieldset class="hu-section"><legend>Negociação e riscos</legend><div class="hu-grid cols-3">${field('vigencia','Vigência (meses)',{type:'number',required:true,min:1})}${field('carencia','Possui carência?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}${yes('carencia') ? field('carenciaDias','Dias de carência',{type:'number',required:true,min:1}) : ''}${field('reajuste','Índice de reajuste',{required:true})}${field('modalidade','Modalidade contratual',{type:'select',required:true,choices:[['simplificado','Contrato simplificado'],['suspensivas','Condições suspensivas'],['locador','Minuta do locador']]})}${field('clausulas','Cláusulas fora do modelo padrão?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}${yes('clausulas') ? field('clausulasTexto','Transcrição das cláusulas',{type:'textarea',required:true,full:true}) : ''}${field('criticidade','Criticidade da segurança da informação',{type:'select',required:true,choices:[['inexistente','Inexistente'],['baixo','Baixo'],['medio','Médio'],['alto','Alto'],['maximo','Máximo']]})}${field('dadosPessoais','Há tratamento de dados pessoais?',{type:'select',required:true,choices:[['sim','Sim'],['nao','Não']]})}${risk('riscoSocial','Risco social?')}${risk('riscoAmbiental','Risco ambiental?')}${risk('riscoClimatico','Risco climático?')}${field('obsAutorizacoes','Observações',{type:'textarea',full:true})}</div></fieldset>
      ${attachmentBox('autorizacoes',[['de','Autorização da DE'],['autorizacoes','Outras autorizações'],['rta','RTA'],['arquitetura','Parecer Arquitetura/Engenharia'],['laudo','Laudo do imóvel'],['responsabilidades','Responsabilidades acordadas'],['minuta','Minuta negociada'],['outro','Outro']])}`;
  }
  function legal() {
    return `<div class="hu-grid">${field('analiseJuridica','Consultas/análise jurídica',{type:'textarea',required:true,full:true})}${field('obsJuridico','Observações jurídicas',{type:'textarea',full:true})}</div>${attachmentBox('juridico',[['consulta','Consulta/análise jurídica'],['parecer','Parecer jurídico'],['outro','Outro']])}`;
  }
  function availableActions() {
    const p = state.profile, s = state.status;
    if (p === 'ANALISTA_OPERACIONAL' && s === 'Em rascunho') return '<button class="hu-btn primary" data-action="request-approval" type="button">Solicitar aprovação</button>';
    if (p === 'ANALISTA_OPERACIONAL' && s === 'Pendente Ajuste') return '<button class="hu-btn primary" data-action="confirm-adjustment" type="button">Confirmar ajuste</button>';
    if (p === 'GESTAO_OPERACIONAL' && ['Aguardando aprovação','Aguardando envio','Pendente Ajuste'].includes(s)) return '<button class="hu-btn" data-action="request-adjustment" type="button">Ajustar</button> <button class="hu-btn primary" data-action="manager-send" type="button">Enviar solicitação</button>';
    if (['ANALISTA_CONTRATOS','GESTOR_CONTRATOS'].includes(p) && s === 'Enviada pelo gestor') return '<button class="hu-btn primary" data-action="start-analysis" type="button">Iniciar análise</button>';
    return '<span class="hu-hint">Nenhuma transição disponível para este perfil e situação.</span>';
  }
  function approval() {
    const total = state.attachments.reduce((s,a) => s + a.size, 0);
    return `<div class="hu-notice"><strong>Perfil ativo:</strong> ${esc(PROFILES[state.profile])}. As ações respeitam as permissões da HU.</div>
      <fieldset class="hu-section"><legend>Encaminhamento</legend><p><strong>Situação:</strong> ${esc(state.status)} ${state.notification ? '<span class="hu-badge">Atualização</span>' : ''}</p>${state.adjustment ? `<p><strong>Ajuste solicitado:</strong> ${esc(state.adjustment)}</p>` : ''}<div class="hu-action-group">${availableActions()}</div></fieldset>
      <fieldset class="hu-section"><legend>Pacote para o GID</legend><p>O ZIP inclui dossiê Markdown, dados JSON e anexos.</p><p><strong>Anexos:</strong> ${state.attachments.length} · ${bytesLabel(total)} de ${bytesLabel(LIMIT)}</p><button class="hu-btn" data-action="export-zip" type="button">Gerar ZIP do dossiê</button></fieldset>
      <fieldset class="hu-section"><legend>Histórico</legend>${state.history.slice().reverse().map(h => `<div class="hu-history"><strong>${esc(h.action)}</strong><span>${esc(h.actor)} · ${esc(h.detail || '')}</span><time>${new Date(h.at).toLocaleString('pt-BR')}</time></div>`).join('')}</fieldset>`;
  }
  const panels = {qualificacao:qualification, licitacao:licitation, propostas:proposals, imovel:propertyDocs, locador:landlordStep, autorizacoes:authorizations, juridico:legal, aprovacao:approval};

  function render() {
    const root = document.getElementById('wizard-modal-content');
    if (!root || !state) return;
    const list = flow();
    current = Math.max(0, Math.min(current, list.length - 1));
    const key = list[current], [title,lead] = META[key];
    root.style.maxWidth = '1180px'; root.style.width = '96vw'; root.style.padding = '0';
    root.innerHTML = `<div class="hu-modal" data-testid="hu-workflow"><header class="hu-header"><div class="hu-header-top"><div><h2>Solicitação de locação</h2><p>${esc(state.id)} · ${esc(state.config.finalidadeLabel)}</p></div><span class="hu-status">${esc(state.status)}</span></div></header>
      <div class="hu-toolbar"><label>Perfil em simulação <select id="hu-profile">${Object.entries(PROFILES).map(x => opt(x[0],x[1],state.profile)).join('')}</select></label><span class="hu-saved">${savedAt ? `Salvo às ${savedAt}` : 'Rascunho com salvamento automático'}</span><button class="hu-btn small" data-action="close" type="button">Fechar</button></div>
      <div class="hu-layout"><ol class="hu-steps">${list.map((s,i) => `<li><button class="hu-step-button${i === current ? ' is-active' : ''}${errors.has(s) ? ' has-error' : ''}" data-action="goto" data-index="${i}" type="button"><span class="hu-step-number">${i+1}</span><span>${esc(META[s][0])}</span></button></li>`).join('')}</ol>
      <section class="hu-panel" data-step="${key}"><h3>${esc(title)}</h3><p class="hu-lead">${esc(lead)}</p><div id="hu-errors"></div>${panels[key]()}<footer class="hu-footer-actions"><div class="hu-action-group"><button class="hu-btn" data-action="save-draft" type="button">Salvar rascunho</button></div><div class="hu-action-group"><button class="hu-btn" data-action="prev" type="button"${current === 0 ? ' disabled' : ''}>Anterior</button>${current < list.length - 1 ? '<button class="hu-btn primary" data-action="next" type="button">Próximo</button>' : ''}</div></footer></section></div></div>`;
  }
  function configFromHome() {
    const purpose = document.getElementById('tipo-contratacao')?.value || '';
    const labels = {'nova-unidade':'Nova unidade','mudanca-endereco':'Mudança de endereço',regularizar:'Regularização'};
    const on = document.getElementById('licitacao')?.value === 'sim' || document.getElementById('switch-licitacao')?.getAttribute('aria-checked') === 'true';
    return {modalidade:document.querySelector('.tab-button.active')?.dataset.tab || 'locacao', solicitacao:document.getElementById('contratar')?.value || '', pessoa:document.getElementById('formalizar')?.value || '', finalidade:purpose, finalidadeLabel:labels[purpose] || purpose, licitacao:purpose === 'nova-unidade' && on};
  }
  function openWorkflow() {
    const config = configFromHome();
    if (!config.solicitacao || !config.pessoa || !config.finalidade) return alert('Selecione Solicitação, Pessoa e Finalidade antes de iniciar.');
    if (config.modalidade !== 'locacao' || config.solicitacao !== 'contratar') return alert('As HUs deste piloto abrangem Locação > Contratação.');
    state = load(config); state.config = config; current = 0; errors.clear();
    const overlay = document.getElementById('wizard-modal-overlay');
    if (!overlay) return;
    Object.assign(overlay.style,{display:'flex',visibility:'visible',opacity:'1',width:'100%',height:'100%',pointerEvents:'auto'});
    overlay.removeAttribute('hidden'); overlay.setAttribute('aria-hidden','false'); render();
  }
  function closeWorkflow() {
    save();
    const overlay = document.getElementById('wizard-modal-overlay');
    if (overlay) { Object.assign(overlay.style,{display:'none',visibility:'hidden',opacity:'0'}); overlay.setAttribute('aria-hidden','true'); }
  }
  function requirements(step) {
    const map = {
      qualificacao:['unidade','endereco','valorGlobal','responsavel'],
      licitacao:['tipoUnidade','edital','representante','valorMin','valorMax'],
      propostas:['temConsulta'], imovel:[],
      locador:['preComprometimento','vencimento','pagamento'],
      autorizacoes:['justificativa','custoBeneficio','aderencia','plano','rta','laudoData','laudoNumero','laudoEmpresa','laudoCnpj','laudoMin','laudoMedio','laudoMax','laudoAssinado','vigencia','carencia','reajuste','modalidade','clausulas','criticidade','dadosPessoais','riscoSocial','riscoAmbiental','riscoClimatico'],
      juridico:['analiseJuridica'], aprovacao:[]
    };
    const list = [...(map[step] || [])];
    if (step === 'propostas' && yes('temConsulta')) list.push('consulta');
    if (step === 'locador' && yes('temRepresentante')) list.push('repDoc','repNome');
    if (step === 'locador' && yes('temRecebedor')) list.push('recebedorTipo','recebedorDoc','recebedorNome');
    if (step === 'locador' && value('pagamento') === 'transferencia') list.push('banco','agencia','conta');
    if (step === 'autorizacoes' && value('plano') === 'plano') list.push('planoId');
    if (step === 'autorizacoes' && yes('rta')) list.push('area');
    if (step === 'autorizacoes' && yes('carencia')) list.push('carenciaDias');
    if (step === 'autorizacoes' && yes('clausulas')) list.push('clausulasTexto');
    ['riscoSocial','riscoAmbiental','riscoClimatico'].forEach(r => { if (yes(r)) list.push(`${r}Descricao`); });
    return list;
  }
  function requiredFiles(step) {
    return {licitacao:['edital','analise','vencedora'], imovel:['matricula','iptu','permissao'], autorizacoes:['laudo'], juridico:['consulta']}[step] || [];
  }
  function validate(step, show = true) {
    const missing = requirements(step).filter(n => String(value(n)).trim() === '');
    if (step === 'locador' && !state.landlords.length) missing.push('locadores');
    if (step === 'propostas' && (!state.proposals.length || state.proposals.some(p => !p.status || !String(p.justification || '').trim()))) missing.push('propostas');
    requiredFiles(step).forEach(t => { if (!state.attachments.some(a => a.step === step && a.type === t)) missing.push(`anexo:${t}`); });
    errors[missing.length ? 'add' : 'delete'](step);
    if (show && missing.length) {
      const box = document.getElementById('hu-errors');
      if (box) box.innerHTML = `<div class="hu-error-summary" role="alert"><strong>Favor preencher o(s) campo(s) obrigatório(s)!</strong><br>Há ${missing.length} pendência(s) nesta etapa.</div>`;
      const first = missing.find(n => document.querySelector(`[data-field="${n}"]`));
      const input = first && document.querySelector(`[data-field="${first}"]`);
      input?.setAttribute('aria-invalid','true'); input?.focus();
    }
    return missing;
  }
  function validateAll() {
    const bad = flow().filter(s => s !== 'aprovacao' && validate(s,false).length);
    if (bad.length) { current = flow().indexOf(bad[0]); render(); validate(bad[0],true); }
    return bad;
  }
  function transition(status,action,detail='') {
    state.status = status; state.history.push({at:stamp(),actor:PROFILES[state.profile],action,detail:detail || status}); save(true); render();
  }
  async function addAttachment(step) {
    const select = document.getElementById(`attachment-type-${step}`);
    const input = document.getElementById(`attachment-file-${step}`);
    const file = input?.files?.[0];
    if (!select?.value || !file) return alert('Selecione o tipo do documento e o arquivo.');
    if (!['pdf','doc','docx','png','jpg','jpeg'].includes(file.name.split('.').pop().toLowerCase())) return alert('Formato não aceito.');
    if (file.size > LIMIT || state.attachments.reduce((s,a) => s+a.size,0)+file.size > LIMIT) return alert('O arquivo ou o conjunto de anexos ultrapassa 2 MB.');
    const data = await new Promise((resolve,reject) => { const r = new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); });
    const item = {id:crypto.randomUUID?.() || String(Date.now()),step,type:select.value,typeLabel:select.options[select.selectedIndex].text,name:file.name,size:file.size,mime:file.type,data};
    const same = state.attachments.findIndex(a => a.step === step && a.type === select.value);
    if (same >= 0 && confirm('Já existe este tipo de documento. Substituir?')) state.attachments.splice(same,1,item); else state.attachments.push(item);
    save(); render();
  }
  function addProposal(manual=false) {
    const n = state.proposals.length + 1;
    const address = manual ? prompt('Endereço do imóvel/terreno:') : `Imóvel ${n} — Setor Bancário, Brasília/DF`;
    if (!address) return;
    state.proposals.push({address,received:new Date().toLocaleDateString('pt-BR'),area:manual ? Number(prompt('Área em m²:') || 0) : 420+n*75,rent:manual ? Number(prompt('Valor mensal:') || 0) : 28000+n*3500,ceiling:'3,20 m',bathrooms:4,parking:n%2 ? 'Não':'Sim — 8 vagas',ready:'Sim',groundFloor:'Sim',status:'',justification:''});
    save(); render();
  }
  function dossier() {
    const out = [`# Dossiê ${state.id}`,'',`- Situação: ${state.status}`,`- Finalidade: ${state.config.finalidadeLabel}`,`- Licitação prévia: ${state.config.licitacao ? 'Sim':'Não'}`,'','## Dados'];
    Object.entries(state.fields).forEach(x => out.push(`- ${x[0]}: ${x[1]}`));
    out.push('','## Locadores'); state.landlords.forEach(l => out.push(`- ${l.name} — ${l.document} — ${l.percentage}%`));
    out.push('','## Propostas'); state.proposals.forEach(p => out.push(`- ${p.address} — ${p.status} — ${p.justification}`));
    out.push('','## Anexos'); state.attachments.forEach(a => out.push(`- ${a.typeLabel}: ${a.name}`));
    out.push('','## Histórico'); state.history.forEach(h => out.push(`- ${new Date(h.at).toLocaleString('pt-BR')} — ${h.actor}: ${h.action}`));
    return out.join('\n');
  }
  const crcTable = (() => { const t=new Uint32Array(256); for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
  const u16=n=>[n&255,(n>>>8)&255], u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
  function crc32(b){let c=0xffffffff;for(const x of b)c=crcTable[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
  function zip(entries) {
    const enc=new TextEncoder(), locals=[], centrals=[]; let offset=0;
    entries.forEach(e=>{const name=enc.encode(e.name),crc=crc32(e.bytes),local=new Uint8Array([80,75,3,4,...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(e.bytes.length),...u32(e.bytes.length),...u16(name.length),...u16(0),...name,...e.bytes]),central=new Uint8Array([80,75,1,2,...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(e.bytes.length),...u32(e.bytes.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]);locals.push(local);centrals.push(central);offset+=local.length;});
    const size=centrals.reduce((s,a)=>s+a.length,0),end=new Uint8Array([80,75,5,6,...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(size),...u32(offset),...u16(0)]);
    return new Blob([...locals,...centrals,end],{type:'application/zip'});
  }
  function exportZip() {
    const enc=new TextEncoder(), clean={...state,attachments:state.attachments.map(a=>({id:a.id,step:a.step,type:a.type,typeLabel:a.typeLabel,name:a.name,size:a.size,mime:a.mime}))};
    const entries=[{name:'dossie-solicitacao.md',bytes:enc.encode(dossier())},{name:'solicitacao.json',bytes:enc.encode(JSON.stringify(clean,null,2))},...state.attachments.map(a=>({name:`anexos/${a.step}/${a.name.replace(/[^\w.\-À-ÿ]/g,'_')}`,bytes:Uint8Array.from(atob(a.data.split(',')[1]),c=>c.charCodeAt(0))}))];
    const blob=zip(entries); if(blob.size>LIMIT)return alert(`O ZIP possui ${bytesLabel(blob.size)} e ultrapassa 2 MB.`);
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.id}-dossie.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  async function click(e) {
    const launch=e.target.closest('button[onclick*="acaoIniciarWizard"]');
    if(launch&&!e.target.closest('.hu-modal')){e.preventDefault();e.stopImmediatePropagation();return openWorkflow();}
    const b=e.target.closest('[data-action]'); if(!b||!e.target.closest('.hu-modal'))return;
    e.preventDefault(); const a=b.dataset.action;
    if(a==='close')return closeWorkflow(); if(a==='save-draft')return save(true); if(a==='goto'){current=Number(b.dataset.index);return render();} if(a==='prev'){current--;return render();}
    if(a==='next'){if(!validate(flow()[current]).length){current++;render();}return;}
    if(a==='add-attachment')return addAttachment(b.dataset.step);
    if(a==='download-attachment'){const x=state.attachments.find(x=>x.id===b.dataset.id);if(x){const d=document.createElement('a');d.href=x.data;d.download=x.name;d.click();}return;}
    if(a==='delete-attachment'){if(confirm('Excluir este anexo?')){state.attachments=state.attachments.filter(x=>x.id!==b.dataset.id);save();render();}return;}
    if(a==='save-landlord'){if(!landlord.type||!landlord.name||!landlord.document||!landlord.related||!landlord.percentage)return alert('Preencha os campos obrigatórios do locador.');if(landlord.editIndex!==undefined)state.landlords[landlord.editIndex]={...landlord};else state.landlords.push({...landlord});landlord={};save();return render();}
    if(a==='edit-landlord'){landlord={...state.landlords[Number(b.dataset.index)],editIndex:Number(b.dataset.index)};return render();}
    if(a==='delete-landlord'){if(confirm('Excluir este locador?')){state.landlords.splice(Number(b.dataset.index),1);save();render();}return;}
    if(a==='search-proposals'){if(!value('consulta'))return alert('Informe o número da consulta pública.');if(!state.proposals.length){addProposal();addProposal();}return;}
    if(a==='add-proposal')return addProposal(true);
    if(a==='delete-proposal'){state.proposals.splice(Number(b.dataset.index),1);save();return render();}
    if(a==='detail-proposal'){const p=state.proposals[Number(b.dataset.index)];return alert(`Endereço: ${p.address}\nÁrea: ${p.area} m²\nAluguel: R$ ${p.rent}\nPé-direito: ${p.ceiling}\nSanitários: ${p.bathrooms}\nEstacionamento: ${p.parking}\nPronto: ${p.ready}\nTérreo: ${p.groundFloor}`);}
    if(a==='search-plan')return alert(`Plano ${value('planoId')||'(não informado)'} localizado na simulação local.`);
    if(a==='request-approval'){if(!validateAll().length)transition('Aguardando aprovação','Aprovação solicitada');return;}
    if(a==='request-adjustment'){const d=prompt('Descreva o ajuste necessário:');if(d){state.adjustment=d;state.notification='Ajuste solicitado';transition('Pendente Ajuste','Devolvida para ajuste',d);}return;}
    if(a==='confirm-adjustment'){if(confirm('Você confirma os ajustes necessários?')){state.notification='Ajuste concluído';transition('Aguardando envio','Ajuste confirmado',state.adjustment);}return;}
    if(a==='manager-send'){if(confirm('Você confirma o envio desta solicitação?')){state.notification='';transition('Enviada pelo gestor','Enviada à contratação');}return;}
    if(a==='start-analysis')return transition('Em análise','Análise contratual iniciada');
    if(a==='export-zip')return exportZip();
  }
  function input(e) {
    const t=e.target;
    if(t.matches('[data-field]')){state.fields[t.dataset.field]=t.value;save();if(['temRepresentante','temRecebedor','pagamento','temConsulta','plano','rta','area','carencia','clausulas','riscoSocial','riscoAmbiental','riscoClimatico'].includes(t.dataset.field))render();}
    else if(t.matches('[data-landlord]'))landlord[t.dataset.landlord]=t.value;
    else if(t.matches('[data-proposal-field]')){state.proposals[Number(t.dataset.proposal)][t.dataset.proposalField]=t.value;save();}
    else if(t.id==='hu-profile'){state.profile=t.value;save();render();}
  }
  document.addEventListener('click',click,true);
  document.addEventListener('input',input);
  document.addEventListener('change',input);
  window.acaoIniciarWizard=openWorkflow;
  window.SilicHUWorkflow={open:openWorkflow,steps:()=>state?flow():[],clear:()=>localStorage.removeItem(KEY),validateAll};
})();
