let currentStepperStep = 1;
const totalStepperSteps = 3;

function updateStepperProgress() {
  // 1) Progress bar
  const progressSteps = document.querySelectorAll('.stepper-progress .progress-step');
  progressSteps.forEach((step, index) => {
    if (index < currentStepperStep) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (index === currentStepperStep - 1) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });

  // 2) Marcadores/etapas
  const steps = document.querySelectorAll('.stepper-step');
  steps.forEach((step, index) => {
    if (index === currentStepperStep - 1) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // 3) Passo de licitação (mostrar/ocultar)
  const licitacaoFlag = (localStorage.getItem('licitacao') || '').toLowerCase();
  const isLicitacao = licitacaoFlag === 'true' || licitacaoFlag === 'sim' || licitacaoFlag === '1';

  const licitacaoDiv = document.getElementById('stepper-licitacao');
  const licitacaoValor = document.getElementById('licitacao-valor');

  if (licitacaoDiv) {
    licitacaoDiv.style.display = isLicitacao ? '' : 'none';
  }
  if (licitacaoValor) {
    licitacaoValor.textContent = isLicitacao ? 'Sim' : 'Não';
  }
}

// Controles básicos
function nextStep() {
  if (currentStepperStep < totalStepperSteps) {
    currentStepperStep += 1;
    updateStepperProgress();
  }
}

function prevStep() {
  if (currentStepperStep > 1) {
    currentStepperStep -= 1;
    updateStepperProgress();
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  updateStepperProgress();
  // Opcional: vincular botões
  const btnNext = document.querySelector('[data-action="stepper-next"]');
  const btnPrev = document.querySelector('[data-action="stepper-prev"]');
  if (btnNext) btnNext.addEventListener('click', nextStep);
  if (btnPrev) btnPrev.addEventListener('click', prevStep);
});
