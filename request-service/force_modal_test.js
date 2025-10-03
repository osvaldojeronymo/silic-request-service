
// TESTE: Forçar exibição do modal
console.log('=== FORÇANDO MODAL ===');

const overlay = document.getElementById('wizard-modal-overlay');
const content = document.getElementById('wizard-modal-content');

if (overlay && content) {
    console.log('Elementos encontrados, forçando display...');
    
    // Forçar estilos de exibição
    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    content.style.display = 'block';
    content.style.backgroundColor = 'white';
    content.style.padding = '20px';
    content.style.borderRadius = '8px';
    content.style.maxWidth = '90%';
    content.style.maxHeight = '90%';
    content.style.overflow = 'auto';
    
    console.log('Estilos aplicados. Modal deve estar visível agora.');
    console.log('Overlay display:', overlay.style.display);
    console.log('Content display:', content.style.display);
} else {
    console.log('Elementos não encontrados:', {overlay: npm run devoverlay, content: npm run devcontent});
}

