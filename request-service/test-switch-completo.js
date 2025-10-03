// Teste forçado do switch de licitação
console.log('=== TESTE FORÇADO DO SWITCH ===');

// 1. Forçar a exibição do bloco
const bloco = document.getElementById('bloco-licitacao');
if (bloco) {
    console.log('✅ Bloco encontrado, forçando exibição...');
    bloco.classList.remove('is-hidden');
    console.log('✅ Bloco agora visível');
} else {
    console.log('❌ Bloco não encontrado');
}

// 2. Testar elementos
const btn = document.getElementById('switch-licitacao');
const hidden = document.getElementById('licitacao');

console.log('\n=== ELEMENTOS ===');
console.log('Switch encontrado:', !!btn);
console.log('Hidden encontrado:', !!hidden);

if (btn && hidden) {
    console.log('\n=== ESTADO INICIAL ===');
    console.log('ARIA checked:', btn.getAttribute('aria-checked'));
    console.log('Hidden value:', hidden.value);
    console.log('URL param:', new URLSearchParams(location.search).get('licitacao'));
    
    // 3. Testar funções
    console.log('\n=== FUNÇÕES ===');
    console.log('isComLicitacao existe:', typeof isComLicitacao !== 'undefined');
    console.log('setLicitacao existe:', typeof setLicitacao !== 'undefined');
    
    if (typeof isComLicitacao !== 'undefined') {
        console.log('isComLicitacao():', isComLicitacao());
    }
    
    // 4. Testar setLicitacao
    if (typeof setLicitacao !== 'undefined') {
        console.log('\n=== TESTE setLicitacao(true) ===');
        setLicitacao(true);
        console.log('ARIA após:', btn.getAttribute('aria-checked'));
        console.log('Hidden após:', hidden.value);
        console.log('URL após:', new URLSearchParams(location.search).get('licitacao'));
        
        console.log('\n=== TESTE setLicitacao(false) ===');
        setLicitacao(false);
        console.log('ARIA após:', btn.getAttribute('aria-checked'));
        console.log('Hidden após:', hidden.value);
        console.log('URL após:', new URLSearchParams(location.search).get('licitacao'));
    }
    
    // 5. Testar clique
    console.log('\n=== TESTE CLIQUE ===');
    const estadoAntes = isComLicitacao();
    console.log('Estado antes do clique:', estadoAntes);
    btn.click();
    const estadoDepois = isComLicitacao();
    console.log('Estado depois do clique:', estadoDepois);
    console.log('Clique funcionou:', estadoAntes !== estadoDepois);
}

console.log('\n=== FIM DOS TESTES ===');
