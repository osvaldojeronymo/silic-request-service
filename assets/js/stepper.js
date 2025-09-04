let currentStepperStep = 1;
const totalStepperSteps = 3;

function updateStepperProgress() {
    // Atualiza progress bar
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

    // Atualiza steps
    const steps = document.querySelectorAll('.stepper-step');
    steps.forEach((step, index) => {
        if (index === currentStepperStep - 1) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    // Exibe/oculta passo licitação conforme localStorage
    const licitacao = localStorage.getItem('licitacao');
    const licitacaoDiv = document.getElementById('stepper-licitacao');
    const licitacaoValor = document.getElementById('licitacao-valor');
    });
    /**
            licitacaoDiv.style.display = '';
