// Validation and Justification System

// Development Mode - Set to false in production
let DEVELOPMENT_MODE = true;

// Validation rules for different steps
const validationRules = {
    'processo-licitatorio': {
        required: ['numero-licitacao', 'modalidade-licitacao', 'objeto-licitacao', 'tipo-unidade', 'edital-numero', 'representante-matricula', 'representante-nome', 'valor-minimo', 'valor-maximo'],
        uploads: ['edital-upload', 'analise-upload', 'comprovante-upload'],
        standards: {
            'modalidade-licitacao': ['pregao-eletronico', 'pregao-presencial'],
            'edital-numero': /^\d{1,4}\/\d{4}$/,
            'representante-matricula': /^C\d{6}$/,
            'valor-minimo': { min: 1000, max: 50000 },
            'valor-maximo': { min: 1000, max: 100000 }
        }
    },
    'documentacao': {
        required: ['cnpj-locador', 'inscricao-imovel', 'area-imovel', 'endereco-imovel'],
        uploads: ['registro-imovel', 'alvara-funcionamento', 'vistoria-bombeiros', 'laudo-avaliacao'],
        standards: {
            'cnpj-locador': /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            'area-imovel': { min: 50, max: 5000 }
        }
    },
    'compliance': {
        required: ['finalidade-locacao', 'valor-aluguel', 'prazo-contrato'],
        standards: {
            'prazo-contrato': { min: 12, max: 120 },
            'valor-aluguel': { min: 1000, max: 50000 }
        }
    },
    'analise-juridica': {
        required: ['tipo-garantia', 'valor-garantia', 'indice-reajuste', 'risco-locacao', 'parecer-juridico'],
        standards: {
            'valor-garantia': { percentage: 0.03 } // 3% do valor do contrato
        }
    },
    'financeiro': {
        required: ['centro-custo', 'conta-contabil', 'valor-mensal', 'valor-total', 'dotacao-orcamentaria'],
        standards: {
            'centro-custo': /^\d{4}\.\d{2}\.\d{2}$/,
            'conta-contabil': /^\d{1}\.\d{1}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/
        }
    }
};

// Store for justifications and attention items
let validationState = {
    attentionItems: {},
    justifications: {},
    uploadedFiles: {},
    stepStatus: {}
};

// Initialize validation system
function initializeValidationSystem() {
    // Add validation CSS
    const validationCSS = document.createElement('link');
    validationCSS.rel = 'stylesheet';
    validationCSS.href = 'validation.css';
    document.head.appendChild(validationCSS);
    
    // Add validation listeners
    addValidationListeners();
    
    // Check initial validation state
    validateCurrentStep();
}

// Add validation event listeners
function addValidationListeners() {
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, select, textarea')) {
            validateField(e.target);
        }
    });
    
    document.addEventListener('change', (e) => {
        if (e.target.matches('input[type="file"]')) {
            handleFileUpload(e);
        }
    });
}

// Validate individual field
function validateField(field) {
    const stepKey = getStepKey(currentStep);
    const rules = validationRules[stepKey];
    
    if (!rules) return;
    
    const fieldName = field.id || field.name;
    const value = field.value.trim();
    
    // Remove existing validation classes
    const fieldWrapper = field.closest('.form-group') || field.parentElement;
    fieldWrapper.classList.remove('valid', 'invalid', 'attention');
    
    // Check if field is required
    if (rules.required && rules.required.includes(fieldName)) {
        if (!value) {
            fieldWrapper.classList.add('invalid');
            return 'required';
        }
    }
    
    // Check against standards
    if (rules.standards && rules.standards[fieldName]) {
        const standard = rules.standards[fieldName];
        const validationResult = checkStandard(fieldName, value, standard);
        
        if (validationResult === 'invalid') {
            fieldWrapper.classList.add('invalid');
            return 'invalid';
        } else if (validationResult === 'attention') {
            fieldWrapper.classList.add('attention');
            addAttentionItem(stepKey, fieldName, value);
            showJustifyButton(fieldWrapper, fieldName);
            return 'attention';
        }
    }
    
    // Field is valid
    if (value) {
        fieldWrapper.classList.add('valid');
        removeAttentionItem(stepKey, fieldName);
        hideJustifyButton(fieldWrapper);
    }
    
    return 'valid';
}

// Check field against standards
function checkStandard(fieldName, value, standard) {
    if (typeof standard === 'object' && standard.min !== undefined) {
        const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (numValue < standard.min || numValue > standard.max) {
            return 'attention';
        }
    }
    
    if (standard instanceof RegExp) {
        if (!standard.test(value)) {
            return 'attention';
        }
    }
    
    if (Array.isArray(standard)) {
        if (!standard.includes(value)) {
            return 'attention';
        }
    }
    
    return 'valid';
}

// Add attention item
function addAttentionItem(stepKey, fieldName, value) {
    if (!validationState.attentionItems[stepKey]) {
        validationState.attentionItems[stepKey] = {};
    }
    
    validationState.attentionItems[stepKey][fieldName] = {
        value: value,
        timestamp: new Date().toISOString(),
        justified: false
    };
    
    updateStepStatus(stepKey);
}

// Remove attention item
function removeAttentionItem(stepKey, fieldName) {
    if (validationState.attentionItems[stepKey]) {
        delete validationState.attentionItems[stepKey][fieldName];
        
        if (Object.keys(validationState.attentionItems[stepKey]).length === 0) {
            delete validationState.attentionItems[stepKey];
        }
    }
    
    updateStepStatus(stepKey);
}

// Show justify button
function showJustifyButton(fieldWrapper, fieldName) {
    // Remove existing button
    const existingButton = fieldWrapper.querySelector('.justify-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Create justify button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'justify-button';
    button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Justificar item fora do padrão';
    button.onclick = () => openJustificationModal(fieldName);
    
    fieldWrapper.appendChild(button);
}

// Hide justify button
function hideJustifyButton(fieldWrapper) {
    const button = fieldWrapper.querySelector('.justify-button');
    if (button) {
        button.remove();
    }
}

// Open justification modal
function openJustificationModal(fieldName) {
    const stepKey = getStepKey(currentStep);
    const attentionItem = validationState.attentionItems[stepKey]?.[fieldName];
    const existingJustification = validationState.justifications[stepKey]?.[fieldName];
    
    const modal = createJustificationModal(fieldName, attentionItem, existingJustification);
    document.body.appendChild(modal);
    
    // Focus on textarea
    setTimeout(() => {
        const textarea = modal.querySelector('textarea');
        if (textarea) textarea.focus();
    }, 100);
}

// Create justification modal
function createJustificationModal(fieldName, attentionItem, existingJustification) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Justificativa - ${getFieldLabel(fieldName)}</h3>
                <button type="button" class="modal-close" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Valor fora do padrão:</label>
                    <input type="text" value="${attentionItem?.value || ''}" readonly class="form-control" style="background: #f8f9fa;">
                </div>
                
                <div class="form-group">
                    <label for="justification-text">Justificativa: <span style="color: #dc3545;">*</span></label>
                    <textarea id="justification-text" rows="4" class="form-control" 
                        placeholder="Descreva a justificativa para este item estar fora do padrão estabelecido...">${existingJustification?.text || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Documentos Comprobatórios (opcional):</label>
                    <div class="file-upload-area" onclick="document.getElementById('justification-files').click()">
                        <div class="file-upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="file-upload-text">Clique aqui ou arraste arquivos</div>
                        <div class="file-upload-hint">PDF, DOC, DOCX até 10MB cada</div>
                    </div>
                    <input type="file" id="justification-files" class="hidden-file-input" multiple 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                    <div id="uploaded-files-list" class="uploaded-files"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal(this)">Cancelar</button>
                <button type="button" class="btn-primary" onclick="saveJustification('${fieldName}')">Salvar Justificativa</button>
            </div>
        </div>
    `;
    
    // Add file upload handlers
    addFileUploadHandlers(modal);
    
    // Load existing files if any
    if (existingJustification?.files) {
        displayUploadedFiles(modal, existingJustification.files);
    }
    
    return modal;
}

// Add file upload handlers
function addFileUploadHandlers(modal) {
    const fileInput = modal.querySelector('#justification-files');
    const uploadArea = modal.querySelector('.file-upload-area');
    
    fileInput.addEventListener('change', (e) => {
        handleJustificationFiles(e.target.files, modal);
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleJustificationFiles(e.dataTransfer.files, modal);
    });
}

// Handle justification files
function handleJustificationFiles(files, modal) {
    const filesList = modal.querySelector('#uploaded-files-list');
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert(`Arquivo ${file.name} excede o tamanho máximo de 10MB`);
            return;
        }
        
        const fileElement = createFileElement(file);
        filesList.appendChild(fileElement);
    });
}

// Create file element
function createFileElement(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    
    fileDiv.innerHTML = `
        <i class="fas fa-file-pdf file-icon"></i>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="file-remove" onclick="removeFile(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    fileDiv.dataset.file = JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
    });
    
    return fileDiv;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove file
function removeFile(button) {
    button.closest('.uploaded-file').remove();
}

// Save justification
function saveJustification(fieldName) {
    const modal = document.querySelector('.modal-overlay');
    const text = modal.querySelector('#justification-text').value.trim();
    
    if (!text) {
        alert('Por favor, insira uma justificativa.');
        return;
    }
    
    const stepKey = getStepKey(currentStep);
    
    // Initialize justifications object
    if (!validationState.justifications[stepKey]) {
        validationState.justifications[stepKey] = {};
    }
    
    // Get uploaded files
    const fileElements = modal.querySelectorAll('.uploaded-file');
    const files = Array.from(fileElements).map(el => JSON.parse(el.dataset.file));
    
    // Save justification
    validationState.justifications[stepKey][fieldName] = {
        text: text,
        files: files,
        timestamp: new Date().toISOString(),
        user: getCurrentUser()
    };
    
    // Mark attention item as justified
    if (validationState.attentionItems[stepKey]?.[fieldName]) {
        validationState.attentionItems[stepKey][fieldName].justified = true;
    }
    
    // Update UI
    updateStepStatus(stepKey);
    updateJustifyButton(fieldName);
    
    closeModal(modal.querySelector('.modal-close'));
    
    alert('Justificativa salva com sucesso!');
}

// Update justify button
function updateJustifyButton(fieldName) {
    const stepKey = getStepKey(currentStep);
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const fieldWrapper = field.closest('.form-group');
    const button = fieldWrapper?.querySelector('.justify-button');
    
    if (button && validationState.justifications[stepKey]?.[fieldName]) {
        button.innerHTML = '<i class="fas fa-check-circle"></i> Item justificado';
        button.style.background = '#28a745';
        button.style.borderColor = '#28a745';
        button.style.color = 'white';
    }
}

// Close modal
function closeModal(closeButton) {
    const modal = closeButton.closest('.modal-overlay');
    modal.remove();
}

// Update step status
function updateStepStatus(stepKey) {
    const stepIndex = getStepIndexByKey(stepKey);
    const stepElement = document.querySelector(`.step:nth-child(${stepIndex})`);
    
    if (!stepElement) return;
    
    const hasAttentionItems = validationState.attentionItems[stepKey] && 
        Object.keys(validationState.attentionItems[stepKey]).length > 0;
    
    const allItemsJustified = hasAttentionItems && 
        Object.values(validationState.attentionItems[stepKey]).every(item => item.justified);
    
    // Remove existing attention classes
    stepElement.classList.remove('attention');
    
    // Add attention badge if needed
    let badge = stepElement.querySelector('.attention-badge');
    
    if (hasAttentionItems && !allItemsJustified) {
        stepElement.classList.add('attention');
        
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'attention-badge';
            badge.textContent = '!';
            stepElement.appendChild(badge);
        }
    } else if (badge) {
        badge.remove();
    }
}

// Get step index by key
function getStepIndexByKey(stepKey) {
    const stepKeys = hasLicitacao ? 
        ['processo-licitatorio', 'documentacao', 'compliance', 'analise-juridica', 'financeiro'] :
        ['documentacao', 'compliance', 'analise-juridica', 'financeiro'];
    
    return stepKeys.indexOf(stepKey) + 1;
}

// Validate current step
function validateCurrentStep() {
    // In development mode, always allow progression
    if (DEVELOPMENT_MODE) {
        console.log('🚀 DEVELOPMENT MODE: Validação ignorada para facilitar o desenvolvimento');
        return true;
    }
    
    const stepKey = getStepKey(currentStep);
    const rules = validationRules[stepKey];
    
    if (!rules) return true;
    
    let isValid = true;
    
    // Validate required fields
    rules.required?.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const result = validateField(field);
            if (result === 'invalid' || result === 'required') {
                isValid = false;
            }
        }
    });
    
    // Check if all attention items are justified
    const attentionItems = validationState.attentionItems[stepKey];
    if (attentionItems) {
        const unjustifiedItems = Object.values(attentionItems).filter(item => !item.justified);
        if (unjustifiedItems.length > 0) {
            isValid = false;
        }
    }
    
    return isValid;
}

// Get current user (mock function)
function getCurrentUser() {
    return {
        id: 'user123',
        name: 'João Silva',
        matricula: '123456'
    };
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        'numero-licitacao': 'Número da Licitação',
        'data-licitacao': 'Data da Licitação',
        'modalidade-licitacao': 'Modalidade de Licitação',
        'objeto-licitacao': 'Objeto da Licitação',
        'representante-matricula': 'Matrícula do Representante CAIXA',
        'valor-minimo': 'Valor Mínimo',
        'valor-maximo': 'Valor Máximo',
        'cnpj-locador': 'CNPJ do Locador',
        'area-imovel': 'Área do Imóvel',
        'prazo-contrato': 'Prazo do Contrato',
        'valor-aluguel': 'Valor do Aluguel'
    };
    
    return labels[fieldName] || fieldName;
}

// Generate validation report
function generateValidationReport() {
    const report = {
        processId: `PROC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: getCurrentUser(),
        attentionItems: validationState.attentionItems,
        justifications: validationState.justifications,
        uploadedFiles: validationState.uploadedFiles,
        classification: '#INTERNO.CAIXA'
    };
    
    // Here you would typically send this to the backend to generate PDF/A-1
    console.log('Validation Report:', report);
    
    alert('Relatório de validação gerado com sucesso! (Em produção seria exportado como PDF/A-1)');
    
    return report;
}

// Override the nextStep function to include validation
const originalNextStep = nextStep;
nextStep = function() {
    if (!validateCurrentStep()) {
        const stepKey = getStepKey(currentStep);
        const attentionItems = validationState.attentionItems[stepKey];
        
        if (attentionItems && Object.keys(attentionItems).length > 0) {
            const unjustifiedCount = Object.values(attentionItems).filter(item => !item.justified).length;
            if (unjustifiedCount > 0) {
                alert(`Esta etapa possui ${unjustifiedCount} item(ns) que requerem justificativa antes de prosseguir.`);
                return;
            }
        }
        
        alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
        return;
    }
    
    originalNextStep();
};

// Development Mode Toggle
function toggleDevelopmentMode() {
    DEVELOPMENT_MODE = !DEVELOPMENT_MODE;
    const button = document.getElementById('dev-mode-toggle');
    
    if (DEVELOPMENT_MODE) {
        button.textContent = '🚀 DEV MODE: ON';
        button.style.background = 'rgba(40, 167, 69, 0.3)';
        button.style.borderColor = 'rgba(40, 167, 69, 0.6)';
        console.log('🚀 Modo de desenvolvimento ATIVADO - Validações ignoradas');
        showDevBanner();
    } else {
        button.textContent = '🔒 DEV MODE: OFF';
        button.style.background = 'rgba(220, 53, 69, 0.3)';
        button.style.borderColor = 'rgba(220, 53, 69, 0.6)';
        console.log('🔒 Modo de desenvolvimento DESATIVADO - Validações ativas');
        hideDevBanner();
    }
    
    // Update button navigation state
    updateNavigationButtons();
}

// Show development banner
function showDevBanner() {
    let banner = document.getElementById('dev-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'dev-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            text-align: center;
            padding: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
        `;
        banner.innerHTML = '🚀 MODO DESENVOLVEDOR ATIVO - Validações desabilitadas para facilitar testes';
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Adjust body padding
        document.body.style.paddingTop = '40px';
    }
}

// Hide development banner
function hideDevBanner() {
    const banner = document.getElementById('dev-banner');
    if (banner) {
        banner.remove();
        document.body.style.paddingTop = '0';
    }
}

// Function to update development mode on page load
function initializeDevelopmentMode() {
    const button = document.getElementById('dev-mode-toggle');
    if (button && DEVELOPMENT_MODE) {
        button.style.background = 'rgba(40, 167, 69, 0.3)';
        button.style.borderColor = 'rgba(40, 167, 69, 0.6)';
        showDevBanner();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeDevelopmentMode, 100);
});

// Initialize validation when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize validation after a small delay to ensure other scripts are loaded
    setTimeout(initializeValidationSystem, 500);
});
