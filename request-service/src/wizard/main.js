import '../assets/css/style.css';
import '../assets/css/switch.css';     // (se existir)


// 2) Traga SEU JavaScript atual (o mesmo que hoje ativa o wizard, botões etc.)
//    Obs.: ajuste o caminho se o seu arquivo principal tiver outro nome ou pasta.
try {
  await import('../assets/js/index.js');  // <- use o seu arquivo JS existente
} catch (e) {
  console.warn('Aviso: não encontrei assets/js/index.js; ajuste o caminho em src/main.ts', e);
}

// 3) Qualquer inicialização que você já fazia no onload/DOMContentLoaded pode ser chamada aqui:
document.addEventListener('DOMContentLoaded', () => {
  // Se você expõe funções globais (ex.: window.abrirWizardHtml), você pode chamá-las aqui se precisar.
  // Exemplo:
  // (window as any).inicializarWizard?.();
});
