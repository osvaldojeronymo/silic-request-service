// assets/js/switch-licitacao.js

(function () {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const elBlock   = $('#bloco-licitacao');
  const elSwitch  = $('#lic-switch');
  const elState   = $('#lic-state');
  const elHidden  = $('#licitacao');
  const selAcao   = $('#contratar');
  const selTipo   = $('#formalizar');
  const selTipoCt = $('#tipo-contratacao');

  function abaAtiva() {
    return $('.tab-button.active')?.getAttribute('data-tab') || '';
  }

  function txt(sel) {
    if (!sel) return '';
    const opt = sel.options[sel.selectedIndex];
    const t = (opt ? opt.textContent : sel.value) || '';
    return t.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  }

  function deveMostrar() {
    const tab  = abaAtiva();                   // "locacao" | "cessao" | "comodato"
    const acao = selAcao ? selAcao.value : ''; // valores já são sem acento
    const tipo = selTipo ? selTipo.value : '';
    const tctr = txt(selTipoCt);               // vamos pelo texto ("Nova unidade")
    return (
      tab === 'locacao' &&
      acao === 'contratar' &&
      tipo === 'pessoa-juridica' &&
      tctr.includes('nova') && tctr.includes('unidade')
    );
  }

  function aplicarVisibilidade() {
    if (!elBlock) return;
    if (deveMostrar()) {
      elBlock.classList.remove('is-hidden');
    } else {
      elBlock.classList.add('is-hidden');
      // reset seguro
      if (elHidden) elHidden.value = 'nao';
      if (elSwitch) elSwitch.setAttribute('aria-checked', 'false');
      if (elState)  elState.textContent = 'Não';
    }
  }

  function toggleSwitch() {
    if (!elSwitch) return;
    const checked = elSwitch.getAttribute('aria-checked') === 'true';
    elSwitch.setAttribute('aria-checked', String(!checked));
    if (elState)  elState.textContent = !checked ? 'Sim' : 'Não';
    if (elHidden) elHidden.value = !checked ? 'sim' : 'nao';
  }

  // Eventos
  document.addEventListener('click', (e) => {
    if (e.target.closest('#lic-switch')) toggleSwitch();
    if (e.target.closest('.tab-button')) aplicarVisibilidade();
  });

  if (elSwitch) {
    elSwitch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSwitch();
      }
    });
  }

  [selAcao, selTipo, selTipoCt].forEach(el => el?.addEventListener('change', aplicarVisibilidade));

  // Primeira avaliação ao carregar
  document.addEventListener('DOMContentLoaded', aplicarVisibilidade);
})();
