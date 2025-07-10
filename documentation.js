// Documentation Management System

// Sample data structure
const documentationData = {
    property: {
        name: "ED - CAIXA Rio de Janeiro Norte, RJ",
        code: "20000001",
        location: "Rio de Janeiro",
        address: "Rua JK, 2408",
        status: "Ativo",
        tenants: "1 locador(es) vinculado(s)"
    },
    documents: {
        property: [
            {
                id: "matricula-imovel",
                title: "Matrícula do Imóvel (até 60 dias)",
                type: "document",
                status: "entregue",
                description: "Documento do imóvel",
                statusText: "Documento entregue e aprovado"
            },
            {
                id: "certidao-negativa",
                title: "Certidão Negativa IPTU Atualizada",
                type: "document",
                status: "entregue",
                description: "Documento do imóvel",
                statusText: "Documento entregue e aprovado"
            },
            {
                id: "averbacao-edificacao",
                title: "Averbação de Edificação",
                type: "document",
                status: "em-analise",
                description: "Documento do imóvel",
                statusText: "Documento em processo de análise"
            },
            {
                id: "permissao-atividade",
                title: "Permissão Atividade Bancária - Poder Público",
                type: "document",
                status: "entregue",
                description: "Documento do imóvel",
                statusText: "Documento entregue e aprovado"
            },
            {
                id: "comprovacao-legislacao",
                title: "Comprovação Legislação Local",
                type: "document",
                status: "entregue",
                description: "Documento do imóvel",
                statusText: "Documento entregue e aprovado"
            }
        ],
        tenants: [
            {
                id: "tenant-1",
                name: "João Silva Santos 1",
                cpf: "123.456.789-00",
                type: "Pessoa Física",
                documents: [
                    {
                        id: "cpf",
                        title: "CPF",
                        status: "entregue",
                        description: "Documento entregue e aprovado"
                    },
                    {
                        id: "rg",
                        title: "RG",
                        status: "entregue",
                        description: "Documento entregue e aprovado"
                    },
                    {
                        id: "comprovante-renda",
                        title: "Comprovante de Renda",
                        status: "pendente",
                        description: "Aguardando entrega do documento"
                    }
                ]
            }
        ]
    },
    technicalReport: {
        area: "1250.50",
        totalValue: "150000.00",
        caixaValue: "90000.00",
        tenantValue: "60000.00",
        totalDuration: "18",
        caixaDuration: "12",
        tenantDuration: "6"
    },
    summary: {
        delivered: 6,
        pending: 1,
        inAnalysis: 1,
        rejected: 0
    }
};

// Modal management
function openDocumentationModal() {
    const modal = document.getElementById('documentation-modal');
    if (modal) {
        modal.classList.add('active');
        populateDocumentationModal();
        document.body.style.overflow = 'hidden';
    }
}

function closeDocumentationModal() {
    const modal = document.getElementById('documentation-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Populate modal with data
function populateDocumentationModal() {
    // Property information
    const propertyInfo = document.querySelector('.doc-property-info');
    if (propertyInfo) {
        propertyInfo.innerHTML = `
            <div class="doc-info-item">
                <div class="doc-info-label">Imóvel:</div>
                <div class="doc-info-value">${documentationData.property.name}</div>
                <div class="doc-info-details">Código: ${documentationData.property.code}</div>
            </div>
            <div class="doc-info-item">
                <div class="doc-info-label">Localização:</div>
                <div class="doc-info-value">${documentationData.property.location}</div>
                <div class="doc-info-details">${documentationData.property.address}</div>
            </div>
            <div class="doc-info-item">
                <div class="doc-info-label">Status:</div>
                <div class="doc-info-value">${documentationData.property.status}</div>
                <div class="doc-info-details">${documentationData.property.tenants}</div>
            </div>
        `;
    }

    // Property documents
    const propertyDocs = document.getElementById('property-documents');
    if (propertyDocs) {
        propertyDocs.innerHTML = documentationData.documents.property.map(doc => `
            <div class="doc-item">
                <div class="doc-item-header">
                    <div class="doc-item-title">${doc.title}</div>
                    <div class="doc-status ${doc.status}">${getStatusText(doc.status)}</div>
                </div>
                <div class="doc-item-content">
                    <i class="fas fa-file-alt doc-item-icon document"></i>
                    ${doc.description}<br>
                    Status: ${doc.statusText}
                </div>
            </div>
        `).join('');
    }

    // Technical report
    const technicalInputs = document.querySelectorAll('.doc-technical-report input');
    technicalInputs.forEach(input => {
        const fieldName = input.id.replace('tech-', '');
        if (documentationData.technicalReport[fieldName]) {
            input.value = documentationData.technicalReport[fieldName];
        }
    });

    // Tenants section
    const tenantsSection = document.getElementById('tenants-section');
    if (tenantsSection) {
        tenantsSection.innerHTML = documentationData.documents.tenants.map(tenant => `
            <div class="doc-person">
                <div class="doc-person-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="doc-person-info">
                    <div class="doc-person-name">${tenant.name}</div>
                    <div class="doc-person-details">${tenant.cpf} | ${tenant.type}</div>
                </div>
            </div>
            <div class="doc-person-docs">
                ${tenant.documents.map(doc => `
                    <div class="doc-person-doc doc-status ${doc.status}">
                        <strong>${doc.title}</strong><br>
                        ${getStatusText(doc.status)}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // Summary
    const summary = documentationData.summary;
    document.querySelector('.doc-summary-item.entregues .doc-summary-number').textContent = summary.delivered;
    document.querySelector('.doc-summary-item.pendentes .doc-summary-number').textContent = summary.pending;
    document.querySelector('.doc-summary-item.analise .doc-summary-number').textContent = summary.inAnalysis;
    document.querySelector('.doc-summary-item.rejeitados .doc-summary-number').textContent = summary.rejected;
}

// Helper functions
function getStatusText(status) {
    const statusMap = {
        'entregue': 'Entregue',
        'pendente': 'Pendente',
        'em-analise': 'Em Análise',
        'rejeitado': 'Rejeitado'
    };
    return statusMap[status] || status;
}

// Action handlers
function clearDocumentation() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        // Reset form
        document.querySelectorAll('.doc-technical-report input').forEach(input => {
            input.value = '';
        });
        console.log('Documentação limpa');
    }
}

function saveReport() {
    // Collect form data
    const reportData = {
        area: document.getElementById('tech-area')?.value,
        totalValue: document.getElementById('tech-totalValue')?.value,
        caixaValue: document.getElementById('tech-caixaValue')?.value,
        tenantValue: document.getElementById('tech-tenantValue')?.value,
        totalDuration: document.getElementById('tech-totalDuration')?.value,
        caixaDuration: document.getElementById('tech-caixaDuration')?.value,
        tenantDuration: document.getElementById('tech-tenantDuration')?.value
    };
    
    console.log('Salvando relatório:', reportData);
    
    // Show success message
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Salvo!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function validateData() {
    // Validation logic
    const requiredFields = ['tech-area', 'tech-totalValue', 'tech-caixaValue', 'tech-tenantValue'];
    let valid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#dc3545';
            valid = false;
        } else if (field) {
            field.style.borderColor = '#28a745';
        }
    });
    
    if (valid) {
        alert('Dados validados com sucesso!');
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

function generateReport() {
    console.log('Gerando relatório...');
    
    // Simulate report generation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Gerando...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = 'Relatório Gerado!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    }, 1500);
}

function updateStatus() {
    console.log('Atualizando status...');
    
    // Simulate status update
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Atualizando...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = 'Status Atualizado!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    }, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('doc-modal')) {
            closeDocumentationModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDocumentationModal();
        }
    });
    
    // Format currency inputs
    document.addEventListener('input', function(e) {
        if (e.target.id && e.target.id.includes('Value')) {
            let value = e.target.value.replace(/\D/g, '');
            value = (value / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            e.target.value = value;
        }
    });
});
