// Script de teste para componentes críticos
console.log('=== TESTE DE COMPONENTES SILIC 2.0 ===\n');

// Teste 1: Verificar elementos DOM
console.log('1. ELEMENTOS DOM:');
const elementsToCheck = [
  'switch-licitacao',
  'licitacao',
  'contratar', 
  'formalizar',
  'wizard-modal-overlay'
];

elementsToCheck.forEach(id => {
  const el = document.getElementById(id);
  console.log(`  ✓ #${id}:`, el ? 'ENCONTRADO' : '❌ NÃO ENCONTRADO');
});

// Teste 2: Verificar switch de licitação
console.log('\n2. SWITCH DE LICITAÇÃO:');
const switchEl = document.getElementById('switch-licitacao');
const hiddenEl = document.getElementById('licitacao');

if (switchEl && hiddenEl) {
  console.log('  ✓ Elementos do switch encontrados');
  console.log('  - aria-checked inicial:', switchEl.getAttribute('aria-checked'));
  console.log('  - valor hidden inicial:', hiddenEl.value);
  console.log('  - isComLicitacao():', typeof isComLicitacao !== 'undefined' ? isComLicitacao() : 'função não encontrada');
  console.log('  - setLicitacao disponível:', typeof setLicitacao !== 'undefined');
} else {
  console.log('  ❌ Elementos do switch não encontrados');
}

// Teste 3: Verificar função acaoIniciarWizard
console.log('\n3. FUNÇÃO INICIAR WIZARD:');
if (typeof window.acaoIniciarWizard === 'function') {
  console.log('  ✓ acaoIniciarWizard disponível');
} else {
  console.log('  ❌ acaoIniciarWizard NÃO disponível');
}

// Teste 4: Verificar função abrirWizardHtml
console.log('\n4. FUNÇÃO ABRIR WIZARD HTML:');
if (typeof window.abrirWizardHtml === 'function') {
  console.log('  ✓ abrirWizardHtml disponível');
} else {
  console.log('  ❌ abrirWizardHtml NÃO disponível');
}

// Teste 5: Simular clique no switch
console.log('\n5. TESTE DO SWITCH:');
if (switchEl) {
  const initialState = switchEl.getAttribute('aria-checked') === 'true';
  console.log('  - Estado inicial:', initialState ? 'Sim' : 'Não');
  
  // Simular clique
  switchEl.click();
  
  const newState = switchEl.getAttribute('aria-checked') === 'true';
  const hiddenValue = hiddenEl ? hiddenEl.value : 'N/A';
  
  console.log('  - Estado após clique:', newState ? 'Sim' : 'Não');
  console.log('  - Hidden value:', hiddenValue);
  console.log('  - URL param licitacao:', new URLSearchParams(location.search).get('licitacao'));
  console.log('  - Mudou estado:', initialState !== newState ? '✓ SIM' : '❌ NÃO');
}

console.log('\n=== FIM DOS TESTES ===');
