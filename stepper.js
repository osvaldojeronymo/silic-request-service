// Stepper Configuration and Logic

// Configuration for different process types
const processConfig = {
    'nova-unidade': {
        withLicitacao: [
            { id: 1, label: 'Processo Licitatório', icon: '1' },
            { id: 2, label: 'Documentação', icon: '2' },
            { id: 3, label: 'Compliance', icon: '3' },
            { id: 4, label: 'Análise Jurídica e Riscos', icon: '4' },
            { id: 5, label: 'Financeiro', icon: '5' }
        ],
        withoutLicitacao: [
            { id: 1, label: 'Documentação', icon: '1' },
            { id: 2, label: 'Compliance', icon: '2' },
            { id: 3, label: 'Análise Jurídica e Riscos', icon: '3' },
            { id: 4, label: 'Financeiro', icon: '4' }
        ]
    },
    'mudanca-endereco': {
        withLicitacao: [
            { id: 1, label: 'Processo Licitatório', icon: '1' },
            { id: 2, label: 'Documentação', icon: '2' },
            { id: 3, label: 'Compliance', icon: '3' },
            { id: 4, label: 'Análise Jurídica e Riscos', icon: '4' },
            { id: 5, label: 'Financeiro', icon: '5' }
        ],
        withoutLicitacao: [
            { id: 1, label: 'Documentação', icon: '1' },
            { id: 2, label: 'Compliance', icon: '2' },
            { id: 3, label: 'Análise Jurídica e Riscos', icon: '3' },
            { id: 4, label: 'Financeiro', icon: '4' }
        ]
    }
};

// Content for each step
const stepContent = {
    'processo-licitatorio': {
        title: 'Processo Licitatório',
        content: `
            <h2>Processo Licitatório</h2>
            <p>Nesta etapa, você deve fornecer informações sobre o processo licitatório que precedeu esta contratação.</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="tipo-unidade">Tipo de Unidade <span style="color: #dc3545;">*</span></label>
                    <select id="tipo-unidade" name="tipo-unidade" class="form-control">
                        <option value="">Selecione o tipo</option>
                        <option value="rede-varejo">Rede Varejo</option>
                        <option value="demais-unidades">Demais Unidades</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="modalidade-licitacao">Modalidade de Licitação <span style="color: #dc3545;">*</span></label>
                    <select id="modalidade-licitacao" name="modalidade-licitacao" class="form-control">
                        <option value="">Selecione a modalidade</option>
                        <option value="pregao-eletronico">Pregão Eletrônico</option>
                        <option value="pregao-presencial">Pregão Presencial</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edital-numero">
                        Edital <span style="color: #dc3545;">*</span>
                        <small class="form-hint">Formato: número/ano (ex: 001/2025)</small>
                    </label>
                    <input type="text" id="edital-numero" name="edital-numero" class="form-control" placeholder="Ex: 001/2025" pattern="[0-9]{1,4}/[0-9]{4}">
                </div>
                <div class="form-group">
                    <label for="numero-licitacao">
                        Licitação <span style="color: #dc3545;">*</span>
                        <small class="form-hint">Número e ano do processo licitatório</small>
                    </label>
                    <input type="text" id="numero-licitacao" name="numero-licitacao" class="form-control" placeholder="Ex: 001/2025">
                </div>
            </div>
            
            <div class="form-group">
                <label for="objeto-licitacao">Objeto da Licitação <span style="color: #dc3545;">*</span></label>
                <textarea id="objeto-licitacao" name="objeto-licitacao" rows="3" class="form-control" placeholder="Descreva o objeto da licitação..."></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="representante-matricula">Matrícula do Representante CAIXA <span style="color: #dc3545;">*</span></label>
                    <input type="text" id="representante-matricula" name="representante-matricula" class="form-control" placeholder="C123456" maxlength="7">
                </div>
                <div class="form-group">
                    <label for="representante-nome">Nome do Representante CAIXA <span style="color: #dc3545;">*</span></label>
                    <input type="text" id="representante-nome" name="representante-nome" class="form-control" placeholder="Nome completo">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="valor-minimo">Valor Mínimo Ofertado (R$) <span style="color: #dc3545;">*</span></label>
                    <input type="text" id="valor-minimo" name="valor-minimo" class="form-control" placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label for="valor-maximo">Valor Máximo Ofertado (R$) <span style="color: #dc3545;">*</span></label>
                    <input type="text" id="valor-maximo" name="valor-maximo" class="form-control" placeholder="R$ 0,00">
                </div>
            </div>
            
            <div class="form-group">
                <label>Upload do Edital e/ou Minuta do Contrato/Termo de Cessão <span style="color: #dc3545;">*</span></label>
                <div class="file-upload-area" onclick="document.getElementById('edital-upload').click()">
                    <div class="file-upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="file-upload-text">Clique aqui ou arraste o arquivo do edital/minuta</div>
                    <div class="file-upload-hint">PDF, DOC, DOCX até 50MB</div>
                </div>
                <input type="file" id="edital-upload" class="hidden-file-input" accept=".pdf,.doc,.docx">
                <div id="edital-files-list" class="uploaded-files"></div>
            </div>
            
            <div class="form-group">
                <label>Upload da Análise do Edital/Minuta <span style="color: #dc3545;">*</span></label>
                <div class="file-upload-area" onclick="document.getElementById('analise-upload').click()">
                    <div class="file-upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="file-upload-text">Clique aqui ou arraste o arquivo da análise</div>
                    <div class="file-upload-hint">PDF, DOC, DOCX até 50MB</div>
                </div>
                <input type="file" id="analise-upload" class="hidden-file-input" accept=".pdf,.doc,.docx">
                <div id="analise-files-list" class="uploaded-files"></div>
            </div>
            
            <div class="form-group">
                <label>Comprovante de Status Vencedor <span style="color: #dc3545;">*</span></label>
                <div class="form-row" style="margin-bottom: 0.75rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="comprovante-tipo" style="font-weight: normal;">Tipo de Comprovante:</label>
                        <select id="comprovante-tipo" name="comprovante-tipo" class="form-control">
                            <option value="">Selecione o tipo</option>
                            <option value="upload">Upload de Arquivo</option>
                            <option value="link">Link/URL</option>
                        </select>
                    </div>
                </div>
                
                <div id="comprovante-upload-area" style="display: none;">
                    <div class="file-upload-area" onclick="document.getElementById('comprovante-upload').click()">
                        <div class="file-upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="file-upload-text">Clique aqui ou arraste o comprovante</div>
                        <div class="file-upload-hint">PDF, DOC, DOCX, JPG, PNG até 10MB</div>
                    </div>
                    <input type="file" id="comprovante-upload" class="hidden-file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                    <div id="comprovante-files-list" class="uploaded-files"></div>
                </div>
                
                <div id="comprovante-link-area" style="display: none;">
                    <input type="url" id="comprovante-link" name="comprovante-link" class="form-control" placeholder="https://exemplo.com/comprovante">
                </div>
            </div>
            
            <div class="validation-summary" id="validation-summary" style="display: none;">
                <h4><i class="fas fa-exclamation-triangle"></i> Itens que Requerem Atenção</h4>
                <div id="validation-items"></div>
            </div>
            
            <div class="report-section">
                <div class="report-header">
                    <h4 class="report-title">Relatório de Validação</h4>
                    <button type="button" class="generate-report-btn" onclick="generateValidationReport()">
                        <i class="fas fa-file-pdf"></i>
                        Gerar Relatório PDF/A-1
                    </button>
                </div>
                <div class="report-info">
                    Este relatório consolida todas as etapas com pontos de atenção, justificativas inseridas e documentos anexados. 
                    Será classificado como #INTERNO.CAIXA e registrado no histórico do processo digital.
                </div>
            </div>
        `
    },
    'documentacao': {
        title: 'Documentação',
        content: `
            <h2>Documentação Necessária</h2>
            <p>Nesta etapa, você deve anexar e verificar toda a documentação necessária para o processo.</p>
            
            <div class="form-group">
                <label for="cnpj-locador">CNPJ do Locador</label>
                <input type="text" id="cnpj-locador" name="cnpj-locador" placeholder="00.000.000/0000-00">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="inscricao-imovel">Inscrição do Imóvel</label>
                    <input type="text" id="inscricao-imovel" name="inscricao-imovel" placeholder="Inscrição municipal/estadual">
                </div>
                <div class="form-group">
                    <label for="area-imovel">Área do Imóvel (m²)</label>
                    <input type="number" id="area-imovel" name="area-imovel" placeholder="0.00">
                </div>
            </div>
            
            <div class="form-group">
                <label for="endereco-imovel">Endereço Completo do Imóvel</label>
                <textarea id="endereco-imovel" name="endereco-imovel" rows="3" placeholder="Rua, número, bairro, cidade, estado, CEP..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Documentos Obrigatórios</label>
                <div style="margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Certidão de Registro do Imóvel
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Alvará de Funcionamento
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Certificado de Vistoria do Corpo de Bombeiros
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Laudo de Avaliação do Imóvel
                    </label>
                </div>
            </div>
            
            <div class="form-group" style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; border: 1px solid #1e4a72;">
                <h3 style="color: #1e4a72; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-folder-open"></i>
                    Gestão Avançada de Documentos
                </h3>
                <p style="margin-bottom: 1rem; color: #666;">
                    Acesse o sistema completo de gestão de documentos para uma experiência mais detalhada, 
                    incluindo status de documentos, relatórios técnicos e gestão de locadores.
                </p>
                <button 
                    type="button" 
                    onclick="openDocumentationModal()" 
                    style="background: #1e4a72; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.3s ease;"
                    onmouseover="this.style.background='#003366'"
                    onmouseout="this.style.background='#1e4a72'"
                >
                    <i class="fas fa-external-link-alt"></i>
                    Abrir Gestão Avançada de Documentos
                </button>
            </div>
        `
    },
    'compliance': {
        title: 'Compliance',
        content: `
            <h2>Análise de Compliance</h2>
            <p>Verificação de conformidade com políticas internas e regulamentações.</p>
            
            <div class="form-group">
                <label for="finalidade-locacao">Finalidade da Locação</label>
                <select id="finalidade-locacao" name="finalidade-locacao">
                    <option value="">Selecione a finalidade</option>
                    <option value="agencia-bancaria">Agência Bancária</option>
                    <option value="posto-atendimento">Posto de Atendimento</option>
                    <option value="escritorio-administrativo">Escritório Administrativo</option>
                    <option value="deposito">Depósito</option>
                    <option value="estacionamento">Estacionamento</option>
                    <option value="outros">Outros</option>
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="valor-aluguel">Valor do Aluguel (R$)</label>
                    <input type="text" id="valor-aluguel" name="valor-aluguel" placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label for="prazo-contrato">Prazo do Contrato (meses)</label>
                    <input type="number" id="prazo-contrato" name="prazo-contrato" placeholder="0">
                </div>
            </div>
            
            <div class="form-group">
                <label>Verificações de Compliance</label>
                <div style="margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Locador não consta em listas restritivas
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Imóvel em conformidade com zoneamento
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Ausência de conflitos de interesse
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Conformidade com políticas ESG
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="observacoes-compliance">Observações</label>
                <textarea id="observacoes-compliance" name="observacoes-compliance" rows="3" placeholder="Observações adicionais sobre compliance..."></textarea>
            </div>
        `
    },
    'analise-juridica': {
        title: 'Análise Jurídica e Riscos',
        content: `
            <h2>Análise Jurídica e Riscos</h2>
            <p>Avaliação dos aspectos jurídicos e identificação de possíveis riscos.</p>
            
            <div class="form-group">
                <label for="tipo-garantia">Tipo de Garantia</label>
                <select id="tipo-garantia" name="tipo-garantia">
                    <option value="">Selecione o tipo de garantia</option>
                    <option value="fianca-bancaria">Fiança Bancária</option>
                    <option value="seguro-fianca">Seguro Fiança</option>
                    <option value="caucao">Caução</option>
                    <option value="fiador">Fiador</option>
                    <option value="nenhuma">Nenhuma</option>
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="valor-garantia">Valor da Garantia (R$)</label>
                    <input type="text" id="valor-garantia" name="valor-garantia" placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label for="indice-reajuste">Índice de Reajuste</label>
                    <select id="indice-reajuste" name="indice-reajuste">
                        <option value="">Selecione o índice</option>
                        <option value="igpm">IGP-M</option>
                        <option value="ipca">IPCA</option>
                        <option value="inpc">INPC</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Análise de Riscos</label>
                <div style="margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="radio" name="risco-locacao" value="baixo" style="margin-right: 0.5rem; width: auto;">
                        Risco Baixo
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="radio" name="risco-locacao" value="medio" style="margin-right: 0.5rem; width: auto;">
                        Risco Médio
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="radio" name="risco-locacao" value="alto" style="margin-right: 0.5rem; width: auto;">
                        Risco Alto
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="parecer-juridico">Parecer Jurídico</label>
                <textarea id="parecer-juridico" name="parecer-juridico" rows="4" placeholder="Descreva o parecer jurídico..."></textarea>
            </div>
        `
    },
    'financeiro': {
        title: 'Análise Financeira',
        content: `
            <h2>Análise Financeira</h2>
            <p>Validação final dos aspectos financeiros e orçamentários.</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="centro-custo">Centro de Custo</label>
                    <input type="text" id="centro-custo" name="centro-custo" placeholder="Código do centro de custo">
                </div>
                <div class="form-group">
                    <label for="conta-contabil">Conta Contábil</label>
                    <input type="text" id="conta-contabil" name="conta-contabil" placeholder="Código da conta contábil">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="valor-mensal">Valor Mensal (R$)</label>
                    <input type="text" id="valor-mensal" name="valor-mensal" placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label for="valor-total">Valor Total do Contrato (R$)</label>
                    <input type="text" id="valor-total" name="valor-total" placeholder="R$ 0,00">
                </div>
            </div>
            
            <div class="form-group">
                <label for="dotacao-orcamentaria">Dotação Orçamentária</label>
                <input type="text" id="dotacao-orcamentaria" name="dotacao-orcamentaria" placeholder="Código da dotação orçamentária">
            </div>
            
            <div class="form-group">
                <label>Aprovações Necessárias</label>
                <div style="margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Aprovação Orçamentária
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Aprovação Gerencial
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem; font-weight: normal;">
                        <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                        Aprovação da Diretoria
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="observacoes-financeiro">Observações Financeiras</label>
                <textarea id="observacoes-financeiro" name="observacoes-financeiro" rows="3" placeholder="Observações adicionais sobre aspectos financeiros..."></textarea>
            </div>
        `
    }
};

// Current state
let currentStep = 1;
let currentProcess = 'nova-unidade';
let hasLicitacao = false;
let steps = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get process type from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    currentProcess = urlParams.get('tipo') || localStorage.getItem('processoTipo') || 'nova-unidade';
    
    // Update page title
    const tipoProcesso = document.getElementById('tipo-processo');
    tipoProcesso.textContent = currentProcess === 'nova-unidade' ? 'Nova Unidade' : 'Mudança de Endereço';
    
    // Initialize stepper
    updateStepper();
    loadStepContent();
    
    // Add money input formatting
    addMoneyFormatting();
});

// Toggle licitacao
function toggleLicitacao() {
    const toggle = document.getElementById('licitacao-toggle');
    hasLicitacao = toggle.checked;
    
    // Reset to first step when changing licitacao status
    currentStep = 1;
    
    // Update stepper
    updateStepper();
    loadStepContent();
}

// Update stepper based on current configuration
function updateStepper() {
    const stepperElement = document.getElementById('stepper');
    const config = hasLicitacao ? processConfig[currentProcess].withLicitacao : processConfig[currentProcess].withoutLicitacao;
    
    steps = config;
    
    // Clear existing steps
    stepperElement.innerHTML = '';
    
    // Create steps
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'step';
        
        if (index + 1 < currentStep) {
            stepElement.classList.add('completed');
        } else if (index + 1 === currentStep) {
            stepElement.classList.add('active');
        }
        
        stepElement.innerHTML = `
            <div class="step-circle">${step.icon}</div>
            <div class="step-label">${step.label}</div>
        `;
        
        stepperElement.appendChild(stepElement);
    });
    
    // Update progress line
    stepperElement.className = `stepper progress-${currentStep}`;
}

// Load content for current step
function loadStepContent() {
    const contentElement = document.getElementById('step-content');
    const stepKey = getStepKey(currentStep);
    const content = stepContent[stepKey];
    
    if (content) {
        contentElement.innerHTML = content.content;
        contentElement.classList.add('fade-in');
        
        // Add money formatting to new inputs
        addMoneyFormatting();
        
        setTimeout(() => {
            contentElement.classList.remove('fade-in');
        }, 500);
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Get step key based on current step and configuration
function getStepKey(stepNumber) {
    if (hasLicitacao) {
        switch (stepNumber) {
            case 1: return 'processo-licitatorio';
            case 2: return 'documentacao';
            case 3: return 'compliance';
            case 4: return 'analise-juridica';
            case 5: return 'financeiro';
        }
    } else {
        switch (stepNumber) {
            case 1: return 'documentacao';
            case 2: return 'compliance';
            case 3: return 'analise-juridica';
            case 4: return 'financeiro';
        }
    }
}

// Navigation functions
function nextStep() {
    if (currentStep < steps.length) {
        currentStep++;
        updateStepper();
        loadStepContent();
    } else {
        // Final step - submit process
        submitProcess();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepper();
        loadStepContent();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === steps.length) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar';
    } else {
        nextBtn.innerHTML = 'Próxima <i class="fas fa-chevron-right"></i>';
    }
}

// Submit process
function submitProcess() {
    // Here you would typically collect all form data and submit to the backend
    alert('Processo enviado com sucesso! Você receberá atualizações sobre o andamento.');
    
    // Redirect back to main form
    voltarFormulario();
}

// Go back to main form
function voltarFormulario() {
    window.location.href = 'index.html';
}

// Add money formatting to money inputs
function addMoneyFormatting() {
    const moneyInputs = document.querySelectorAll('input[id*="valor"], input[id*="garantia"]');
    
    moneyInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = (value / 100).toFixed(2);
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            value = value.replace('.', ',');
            this.value = 'R$ ' + value;
        });
    });
    
    // Add matricula formatting
    const matriculaInput = document.getElementById('representante-matricula');
    if (matriculaInput) {
        matriculaInput.addEventListener('input', function() {
            let value = this.value.toUpperCase().replace(/[^C\d]/g, '');
            
            // Ensure it starts with C
            if (value && !value.startsWith('C')) {
                value = 'C' + value.replace(/C/g, '');
            }
            
            // Limit to C + 6 digits
            if (value.length > 7) {
                value = value.substring(0, 7);
            }
            
            this.value = value;
        });
        
        // Auto-add C if user starts typing numbers
        matriculaInput.addEventListener('keydown', function(e) {
            if (this.value === '' && /\d/.test(e.key)) {
                e.preventDefault();
                this.value = 'C' + e.key;
            }
        });
    }
    
    // Add comprovante type handler
    const comprovanteSelect = document.getElementById('comprovante-tipo');
    if (comprovanteSelect) {
        comprovanteSelect.addEventListener('change', function() {
            const uploadArea = document.getElementById('comprovante-upload-area');
            const linkArea = document.getElementById('comprovante-link-area');
            
            if (this.value === 'upload') {
                uploadArea.style.display = 'block';
                linkArea.style.display = 'none';
            } else if (this.value === 'link') {
                uploadArea.style.display = 'none';
                linkArea.style.display = 'block';
            } else {
                uploadArea.style.display = 'none';
                linkArea.style.display = 'none';
            }
        });
    }
    
    // Add file upload handlers for new upload areas
    addFileUploadHandlersForStepContent();
}

// Add file upload handlers for step content
function addFileUploadHandlersForStepContent() {
    const uploadAreas = document.querySelectorAll('.file-upload-area');
    
    uploadAreas.forEach(area => {
        const input = area.parentElement.querySelector('input[type="file"]');
        if (!input) return;
        
        // Remove existing listeners
        const newArea = area.cloneNode(true);
        area.parentNode.replaceChild(newArea, area);
        
        const newInput = newArea.parentElement.querySelector('input[type="file"]');
        
        newInput.addEventListener('change', (e) => {
            handleStepFileUpload(e.target.files, newInput);
        });
        
        newArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            newArea.classList.add('dragover');
        });
        
        newArea.addEventListener('dragleave', () => {
            newArea.classList.remove('dragover');
        });
        
        newArea.addEventListener('drop', (e) => {
            e.preventDefault();
            newArea.classList.remove('dragover');
            handleStepFileUpload(e.dataTransfer.files, newInput);
        });
    });
}

// Handle step file upload
function handleStepFileUpload(files, input) {
    const filesList = input.parentElement.querySelector('.uploaded-files');
    if (!filesList) return;
    
    Array.from(files).forEach(file => {
        const maxSize = input.id.includes('edital') || input.id.includes('analise') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            alert(`Arquivo ${file.name} excede o tamanho máximo de ${maxSizeMB}MB`);
            return;
        }
        
        const fileElement = createStepFileElement(file);
        filesList.appendChild(fileElement);
    });
}

// Create step file element
function createStepFileElement(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    
    const iconClass = getFileIcon(file.type);
    
    fileDiv.innerHTML = `
        <i class="${iconClass} file-icon"></i>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="file-remove" onclick="removeFile(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return fileDiv;
}

// Get file icon based on type
function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
