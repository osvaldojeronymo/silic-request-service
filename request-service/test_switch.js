
// Script de teste do switch de licitação
console.log('=== TESTE DO SWITCH DE LICITAÇÃO ===');

// 1. Verificar elementos necessários
const btn = document.getElementById('switch-licitacao');
const hidden = document.getElementById('licitacao');
const bloco = document.getElementById('bloco-licitacao');

console.log('Elementos encontrados:');
console.log('- Switch:', npm run devbtn);
console.log('- Hidden:', npm run devhidden);
console.log('- Bloco:', npm run devbloco);

if (btn && hidden) {
    // 2. Testar estado inicial
    console.log('Estado inicial:');
    console.log('- ARIA:', btn.getAttribute('aria-checked'));
    console.log('- Hidden value:', hidden.value);
    console.log('- URL licitacao param:', new URLSearchParams(location.search).get('licitacao'));
    
    // 3. Testar função isComLicitacao
    console.log('- isComLicitacao():', typeof isComLicitacao !== 'undefined' ? isComLicitacao() : 'função não encontrada');
    
    // 4. Testar setLicitacao
    if (typeof setLicitacao !== 'undefined') {
        console.log('\nTestando setLicitacao(true):');
        setLicitacao(true);
        console.log('- ARIA após set:', btn.getAttribute('aria-checked'));
        console.log('- Hidden após set:', hidden.value);
        console.log('- URL após set:', new URLSearchParams(location.search).get('licitacao'));
    } else {
        console.log('Função setLicitacao não encontrada');
    }
}

