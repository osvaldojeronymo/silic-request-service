// SCRIPT DE DEBUG - Cole no console do navegador
console.log('=== DEBUG SWITCH LICITAÇÃO ===');

// 1. Verificar elementos básicos
const bloco = document.getElementById('bloco-licitacao');
const btn = document.getElementById('switch-licitacao');
const hidden = document.getElementById('licitacao');

console.log('Elementos encontrados:');
console.log('- Bloco licitacao:', !!bloco);
console.log('- Switch:', !!btn);
console.log('- Hidden:', !!hidden);

if (bloco) {
  console.log('- Bloco tem classe is-hidden:', bloco.classList.contains('is-hidden'));
  console.log('- Classes do bloco:', bloco.className);
}

// 2. Verificar valores dos selects
const tabAtiva = document.querySelector('.tab-button.active')?.getAttribute('data-tab');
const acao = document.getElementById('contratar')?.value;
const tipo = document.getElementById('formalizar')?.value;
const tipoContratacao = document.getElementById('tipo-contratacao')?.value;

console.log('\nValores dos controles:');
console.log('- Tab ativa:', tabAtiva);
console.log('- Ação (contratar):', acao);
console.log('- Tipo (formalizar):', tipo);
console.log('- Tipo contratação:', tipoContratacao);

// 3. Testar condição manual
const deveMostrar = (
  tabAtiva === 'locacao' &&
  acao === 'contratar' &&
  tipo === 'pessoa-juridica' &&
  tipoContratacao === 'nova-unidade'
);

console.log('\nCondição para mostrar switch:');
console.log('- Deve mostrar:', deveMostrar);

// 4. Forçar exibição para teste
if (bloco) {
  console.log('\nForçando exibição do switch...');
  bloco.classList.remove('is-hidden');
  console.log('- Switch agora visível!');
  
  // Testar funções se existirem
  if (typeof setLicitacao !== 'undefined') {
    console.log('- setLicitacao disponível ✓');
    console.log('- Testando setLicitacao(true)...');
    setLicitacao(true);
    console.log('- Estado após setLicitacao:', btn ? btn.getAttribute('aria-checked') : 'botão não encontrado');
  } else {
    console.log('- setLicitacao NÃO disponível ❌');
  }
  
  if (typeof isComLicitacao !== 'undefined') {
    console.log('- isComLicitacao disponível ✓');
    console.log('- Estado atual:', isComLicitacao());
  } else {
    console.log('- isComLicitacao NÃO disponível ❌');
  }
}

console.log('\n=== FIM DEBUG ===');
