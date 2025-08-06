// Função para voltar ao portal SILIC
function voltarAoPortal() {
    // URL do portal principal
    const portalUrl = 'https://osvaldojeronymo.github.io/silic-portal-imoveis/';
    
    // Verifica se veio do portal (usando referrer ou parâmetro)
    const referrer = document.referrer;
    const hasPortalParam = window.location.search.includes('from=portal');
    
    if (referrer.includes('silic-portal') || hasPortalParam) {
        // Voltou do portal, pode usar history.back() ou window.close()
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = portalUrl;
        }
    } else {
        // Acesso direto, redireciona para o portal
        window.location.href = portalUrl;
    }
}

// Função para controlar a visibilidade do botão "Voltar ao Portal"
function initPortalButton() {
    console.log('initPortalButton chamada');
    
    // Aguardar um momento para garantir que o DOM esteja pronto
    setTimeout(function() {
        const voltarBtn = document.getElementById('voltarPortalBtn');
        const hasPortalParam = window.location.search.includes('from=portal');
        const referrer = document.referrer;
        const comeFromPortal = referrer.includes('silic-portal') || hasPortalParam;
        
        console.log('URL atual:', window.location.href);
        console.log('Parâmetros:', window.location.search);
        console.log('hasPortalParam:', hasPortalParam);
        console.log('referrer:', referrer);
        console.log('comeFromPortal:', comeFromPortal);
        console.log('voltarBtn encontrado:', !!voltarBtn);
        
        if (voltarBtn) {
            if (comeFromPortal) {
                // Usuário veio do portal - mostrar botão com força bruta
                console.log('Mostrando botão');
                voltarBtn.style.display = 'inline-flex';
                voltarBtn.style.visibility = 'visible';
                voltarBtn.style.opacity = '1';
                voltarBtn.classList.add('show');
            } else {
                // Acesso direto - esconder botão
                console.log('Escondendo botão');
                voltarBtn.style.display = 'none';
                voltarBtn.classList.remove('show');
            }
        } else {
            console.error('Botão #voltarPortalBtn não encontrado!');
        }
    }, 10);
}

// DOM Elements
const searchTabs = document.querySelectorAll('.tab-button');
const formSection = document.getElementById('form-section');
const serviceForm = document.getElementById('service-form');
const contratarInput = document.getElementById('contratar');
const valorInput = document.getElementById('valor');
const cpfInput = document.getElementById('cpf');
const telefoneInput = document.getElementById('telefone');
const campoValor = document.getElementById('campo-valor');
const campoAtoFormal = document.getElementById('campo-ato-formal');
const atoFormalSelect = document.getElementById('ato-formal');
const campoTipoContratacao = document.getElementById('campo-tipo-contratacao');
const tipoContratacaoSelect = document.getElementById('tipo-contratacao');

// Variável para controlar a aba ativa
let activeTab = 'locacao';

// Lógica para alternar campos conforme seleção
contratarInput.addEventListener('change', function() {
    const selectedAction = this.value;
    
    // Esconder todos os campos opcionais primeiro
    campoValor.style.display = 'none';
    campoAtoFormal.style.display = 'none';
    campoTipoContratacao.style.display = 'none';
    
    // Limpar valores
    valorInput.value = '';
    atoFormalSelect.value = '';
    tipoContratacaoSelect.value = '';
    
    if (selectedAction === 'formalizar') {
        // Mostrar campo "Ato Formal"
        campoAtoFormal.style.display = 'block';
    } else if (selectedAction === 'contratar') {
        // Para todas as abas na ação "Contratação", mostrar "Tipo de Contratação"
        campoTipoContratacao.style.display = 'block';
    } else if (selectedAction === 'regularizar') {
        // Sempre mostrar campo "Valor" para regularização
        campoValor.style.display = 'block';
    }
});

// Tab Switching Functionality
searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        searchTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Update active tab variable
        activeTab = tab.dataset.tab;
        
        // Reset form when changing tabs
        resetFormFields();
        
        // Update form based on selected tab
        updateFormForTab(tab.dataset.tab);
    });
});

// Reset form fields when changing tabs
function resetFormFields() {
    contratarInput.value = '';
    campoValor.style.display = 'none';
    campoAtoFormal.style.display = 'none';
    campoTipoContratacao.style.display = 'none';
    valorInput.value = '';
    atoFormalSelect.value = '';
    tipoContratacaoSelect.value = '';
}

// Update form based on selected tab
function updateFormForTab(tabType) {
    // Form is now standardized with select options
    // No need to update placeholders or suggestions
}

// Update suggestions based on service type (no longer needed with select)
function updateSuggestions(serviceType) {
    // Function kept for compatibility but no longer used
}

// Autocomplete functionality (removed since we now use select)
// contratarInput.addEventListener('input', function() {
//     // Autocomplete code removed
// });

// Select suggestion (removed since we now use select)
// function selectSuggestion(suggestion) {
//     // Function removed
// }

// Close suggestions when clicking outside (removed since we now use select)
// document.addEventListener('click', function(e) {
//     // Function removed
// });

// Money input formatting
valorInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    value = value.replace('.', ',');
    this.value = 'R$ ' + value;
});

// CPF input formatting
cpfInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.value = value;
});

// Phone input formatting
telefoneInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    this.value = value;
});

// Main action function
function iniciarSolicitacao() {
    const contratar = document.getElementById('contratar').value;
    const formalizar = document.getElementById('formalizar').value;
    const valor = document.getElementById('valor').value;
    const atoFormal = document.getElementById('ato-formal').value;
    const tipoContratacao = document.getElementById('tipo-contratacao').value;
    
    // Validation
    if (!contratar) {
        alert('Por favor, selecione uma ação.');
        return;
    }
    
    if (!formalizar) {
        alert('Por favor, selecione o tipo.');
        return;
    }
    
    // Validação específica para cada ação
    if (contratar === 'contratar' && !tipoContratacao) {
        alert('Por favor, selecione o tipo de contratação.');
        return;
    }
    
    if (contratar === 'regularizar' && !valor) {
        alert('Por favor, informe o valor.');
        return;
    }
    
    if (contratar === 'formalizar' && !atoFormal) {
        alert('Por favor, selecione o ato formal.');
        return;
    }
    
    // If it's a "contratar" action, redirect to stepper page
    if (contratar === 'contratar') {
        // Store process information for stepper page
        localStorage.setItem('processoTipo', tipoContratacao);
        localStorage.setItem('processoModalidade', activeTab);
        localStorage.setItem('processoAcao', contratar);
        
        window.location.href = `stepper.html?tipo=${tipoContratacao}&modalidade=${activeTab}`;
        return;
    }
    
    // For other actions, show search interface first to select a property
    if (contratar === 'regularizar' || contratar === 'formalizar') {
        // Store process information for later use
        localStorage.setItem('processoTipo', formalizar);
        localStorage.setItem('processoModalidade', activeTab);
        localStorage.setItem('processoAcao', contratar);
        localStorage.setItem('processoValor', valor || '');
        localStorage.setItem('processoAtoFormal', atoFormal || '');
        
        // Show property search interface
        mostrarPesquisaImoveis();
        return;
    }
    
    // Default case: show the regular form
    // Show form section with animation
    formSection.style.display = 'block';
    formSection.classList.add('fade-in');
    
    // Scroll to form
    formSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Pre-fill some form data with proper action labels
    const acaoLabels = {
        'contratar': 'Contratar',
        'regularizar': 'Regularizar', 
        'formalizar': 'Formalizar'
    };
    
    const tipoLabels = {
        'pessoa-fisica': 'Pessoa Física',
        'pessoa-juridica': 'Pessoa Jurídica'
    };
    
    const atoFormalLabels = {
        'prorrogacao': 'Prorrogação',
        'rescisao': 'Rescisão',
        'alteracao-titularidade': 'Alteração de Titularidade',
        'acrescimo-supressao-area': 'Acréscimo/Supressão de Área',
        'recebimento-imovel': 'Recebimento de Imóvel',
        'antecipacao-parcela': 'Antecipação de Parcela',
        'revisao-aluguel': 'Revisão do Aluguel',
        'reajuste-aluguel': 'Reajuste do Aluguel',
        'apostilamento': 'Apostilamento'
    };
    
    const tipoContratacaoLabels = {
        'nova-unidade': 'Nova unidade',
        'mudanca-endereco': 'Mudança de endereço'
    };
    
    const servicoDetalhes = document.getElementById('servico-detalhes');
    let detalhes = `Ação: ${acaoLabels[contratar]}\nTipo: ${tipoLabels[formalizar]}`;
    
    if (tipoContratacao && contratar === 'contratar') {
        detalhes += `\nTipo de Contratação: ${tipoContratacaoLabels[tipoContratacao]}`;
    }
    
    if (valor && contratar === 'regularizar') {
        detalhes += `\nValor estimado: ${valor}`;
    }
    
    if (atoFormal && contratar === 'formalizar') {
        detalhes += `\nAto Formal: ${atoFormalLabels[atoFormal]}`;
    }
    
    servicoDetalhes.value = detalhes;
}

// Cancel form function
function cancelarSolicitacao() {
    formSection.style.display = 'none';
    formSection.classList.remove('fade-in');
    
    // Scroll back to search form
    document.querySelector('.search-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Form submission
serviceForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['nome', 'cpf', 'email', 'telefone'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    
    if (missingFields.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Por favor, informe um e-mail válido.');
        return;
    }
    
    // Validate CPF
    if (!validateCPF(data.cpf)) {
        alert('Por favor, informe um CPF válido.');
        return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Simulate form submission
    setTimeout(() => {
        alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset form
        this.reset();
        cancelarSolicitacao();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }, 2000);
});

// CPF validation function
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
        return false;
    }
    
    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) {
        checkDigit = 0;
    }
    if (checkDigit !== parseInt(cpf.charAt(9))) {
        return false;
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) {
        checkDigit = 0;
    }
    return checkDigit === parseInt(cpf.charAt(10));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animations
function animateOnScroll() {
    // TEMPORARIAMENTE DESABILITADO PARA DEBUG
    // const elements = document.querySelectorAll('.service-card, .form-container');
    
    // elements.forEach(element => {
    //     const elementTop = element.getBoundingClientRect().top;
    //     const elementVisible = 150;
        
    //     if (elementTop < window.innerHeight - elementVisible) {
    //         element.classList.add('fade-in');
    //     }
    // });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial suggestions
    updateSuggestions('locacao');
    
    // Initialize scroll animations - TEMPORARIAMENTE DESABILITADO
    // animateOnScroll();
    
    // Garantir estado inicial correto dos campos
    const campoValor = document.getElementById('campo-valor');
    const campoAtoFormal = document.getElementById('campo-ato-formal');
    
    if (campoValor) campoValor.style.display = 'none';
    if (campoAtoFormal) campoAtoFormal.style.display = 'none';
    
    // Add CSS for suggestion items
    const style = document.createElement('style');
    style.textContent = `
        .suggestion-item {
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s ease;
        }
        
        .suggestion-item:hover {
            background-color: #f8f9fa;
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
        
        .suggestions {
            max-height: 200px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar controle do botão "Voltar ao Portal" quando a página carregar
    console.log('Chamando initPortalButton no DOMContentLoaded');
    initPortalButton();
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(function() {
        console.log('Executando initPortalButton novamente após timeout');
        initPortalButton();
    }, 500);
});

// ==============================================
// SEÇÃO DE RESULTADOS DE PESQUISA
// ==============================================

// Dados mock para simular resultados de pesquisa
const mockImoveis = [
    {
        codigo: 'IMV001',
        denominacao: 'Edifício Central',
        local: 'Centro - São Paulo/SP',
        status: 'disponivel',
        locadores: 'João Silva, Maria Santos'
    },
    {
        codigo: 'IMV002', 
        denominacao: 'Complexo Empresarial Norte',
        local: 'Barra Funda - São Paulo/SP',
        status: 'ocupado',
        locadores: 'Empresa ABC Ltda'
    },
    {
        codigo: 'IMV003',
        denominacao: 'Prédio Administrativo Sul',
        local: 'Vila Olímpia - São Paulo/SP', 
        status: 'manutencao',
        locadores: '-'
    },
    {
        codigo: 'IMV004',
        denominacao: 'Centro de Distribuição',
        local: 'Guarulhos - SP',
        status: 'disponivel',
        locadores: 'Transportadora XYZ'
    },
    {
        codigo: 'IMV005',
        denominacao: 'Loja Comercial Centro',
        local: 'Centro - Rio de Janeiro/RJ',
        status: 'reservado',
        locadores: 'Comercial Rio Ltda'
    },
    {
        codigo: 'IMV006',
        denominacao: 'Galpão Industrial',
        local: 'Duque de Caxias - RJ',
        status: 'disponivel',
        locadores: '-'
    }
];

let currentPage = 1;
let itemsPerPage = 10;
let filteredImoveis = [];

// Função principal para mostrar a seção de pesquisa
function mostrarPesquisaImoveis() {
    const searchSection = document.getElementById('search-results-section');
    const formSection = document.getElementById('form-section');
    
    // Esconder formulário se estiver visível
    if (formSection) {
        formSection.style.display = 'none';
    }
    
    // Mostrar seção de pesquisa
    searchSection.style.display = 'block';
    searchSection.classList.add('fade-in');
    
    // Scroll suave para a seção
    searchSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Inicializar com estrutura da tabela visível
    mostrarEstruturaTabela();
}

// Função para mostrar a estrutura da tabela (headers) antes da pesquisa
function mostrarEstruturaTabela() {
    const tableContainer = document.getElementById('table-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsMeta = document.getElementById('results-meta');
    const noResults = document.getElementById('no-results');
    const pagination = document.getElementById('pagination');
    
    // Mostrar tabela vazia com headers
    tableContainer.style.display = 'block';
    
    // Esconder outros elementos
    loadingIndicator.style.display = 'none';
    resultsMeta.style.display = 'none';
    noResults.style.display = 'none';
    pagination.style.display = 'none';
    
    // Limpar tbody
    const tbody = document.getElementById('results-tbody');
    tbody.innerHTML = '';
}

// Função para buscar imóveis
function buscarImoveis() {
    const searchInput = document.getElementById('search-imovel').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    const loadingIndicator = document.getElementById('loading-indicator');
    const tableContainer = document.getElementById('table-container');
    const resultsMeta = document.getElementById('results-meta');
    const noResults = document.getElementById('no-results');
    const pagination = document.getElementById('pagination');
    
    // Mostrar loading
    loadingIndicator.style.display = 'flex';
    tableContainer.style.display = 'none';
    resultsMeta.style.display = 'none';
    noResults.style.display = 'none';
    pagination.style.display = 'none';
    
    // Simular delay de pesquisa
    setTimeout(() => {
        // Filtrar dados
        filteredImoveis = mockImoveis.filter(imovel => {
            const matchSearch = !searchInput || 
                imovel.codigo.toLowerCase().includes(searchInput) ||
                imovel.denominacao.toLowerCase().includes(searchInput) ||
                imovel.local.toLowerCase().includes(searchInput);
                
            const matchStatus = !statusFilter || imovel.status === statusFilter;
            
            return matchSearch && matchStatus;
        });
        
        // Esconder loading
        loadingIndicator.style.display = 'none';
        
        if (filteredImoveis.length > 0) {
            // Mostrar resultados
            currentPage = 1;
            renderResultados();
            tableContainer.style.display = 'block';
            resultsMeta.style.display = 'flex';
            pagination.style.display = 'flex';
        } else {
            // Mostrar mensagem de sem resultados
            noResults.style.display = 'block';
        }
    }, 1500); // 1.5 segundos de loading para simular busca real
}

// Função para renderizar os resultados na tabela
function renderResultados() {
    const tbody = document.getElementById('results-tbody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageResults = filteredImoveis.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageResults.forEach(imovel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${imovel.codigo}</strong></td>
            <td>${imovel.denominacao}</td>
            <td>${imovel.local}</td>
            <td><span class="status-tag ${imovel.status}">${getStatusLabel(imovel.status)}</span></td>
            <td>${imovel.locadores}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action primary" onclick="visualizarImovel('${imovel.codigo}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${imovel.status === 'disponivel' ? 
                        `<button class="btn-action secondary" onclick="selecionarImovel('${imovel.codigo}')">
                            <i class="fas fa-check"></i> Selecionar
                        </button>` : ''
                    }
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Atualizar informações de paginação
    updatePaginationInfo();
}

// Função para obter label do status
function getStatusLabel(status) {
    const labels = {
        'disponivel': 'Disponível',
        'ocupado': 'Ocupado', 
        'manutencao': 'Manutenção',
        'reservado': 'Reservado'
    };
    return labels[status] || status;
}

// Função para atualizar informações de paginação
function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredImoveis.length / itemsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    btnPrev.disabled = currentPage <= 1;
    btnNext.disabled = currentPage >= totalPages;
}

// Funções de navegação
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderResultados();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredImoveis.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderResultados();
    }
}

// Função para mudar itens por página
function changeItemsPerPage() {
    const select = document.getElementById('items-per-page');
    itemsPerPage = parseInt(select.value);
    currentPage = 1;
    renderResultados();
}

// Função para limpar filtros
function limparFiltros() {
    document.getElementById('search-imovel').value = '';
    document.getElementById('status-filter').value = '';
    mostrarEstruturaTabela();
}

// Funções de ação da tabela
function visualizarImovel(codigo) {
    alert(`Visualizando detalhes do imóvel: ${codigo}`);
}

function selecionarImovel(codigo) {
    const imovel = mockImoveis.find(i => i.codigo === codigo);
    if (confirm(`Deseja selecionar o imóvel "${imovel.denominacao}" (${codigo})?`)) {
        alert(`Imóvel ${codigo} selecionado! Redirecionando para formulário de solicitação...`);
        // Aqui você pode redirecionar para o formulário ou próxima etapa
    }
}

// ==============================================
// INTEGRAÇÃO COM FUNÇÃO PRINCIPAL
// ==============================================

// Event listeners para a seção de pesquisa
document.addEventListener('DOMContentLoaded', function() {
    // Buscar com Enter no campo de pesquisa
    const searchInput = document.getElementById('search-imovel');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarImoveis();
            }
        });
    }
    
    // Inicializar wizard financeiro se estiver presente
    initWizardFinanceiro();
});

// =================================================================== 
// WIZARD FINANCEIRO FUNCTIONS
// ===================================================================

function initWizardFinanceiro() {
    // Função para adicionar novo locador
    const addLocadorBtn = document.getElementById('adicionar-locador');
    if (addLocadorBtn) {
        addLocadorBtn.addEventListener('click', function() {
            const container = document.getElementById('dados-bancarios-container');
            const novoLocador = document.createElement('div');
            novoLocador.classList.add('banco-block');
            
            // Contador para identificar o número do locador
            const locadores = container.querySelectorAll('.banco-block');
            const numeroLocador = locadores.length + 1;
            
            novoLocador.innerHTML = `
              <input type="text" placeholder="Agência" class="agencia" name="agencia_${numeroLocador}">
              <input type="text" placeholder="Número e nome da agência" class="agencia-nome" name="agencia_nome_${numeroLocador}">
              <input type="text" placeholder="Conta" class="conta" name="conta_${numeroLocador}">
              <select class="tipo-conta" name="tipo_conta_${numeroLocador}">
                <option value="corrente">Corrente</option>
                <option value="poupanca">Poupança</option>
              </select>
              <button type="button" class="remover-locador" onclick="removerLocador(this)">
                <i class="fas fa-trash"></i> Remover Locador
              </button>
            `;
            
            container.appendChild(novoLocador);
            
            // Adiciona animação de entrada
            novoLocador.style.opacity = '0';
            novoLocador.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              novoLocador.style.transition = 'all 0.3s ease';
              novoLocador.style.opacity = '1';
              novoLocador.style.transform = 'translateY(0)';
            }, 10);
        });
    }
    
    // Eventos dos botões de navegação do wizard financeiro
    const anteriorBtn = document.getElementById('anterior');
    const proximoBtn = document.getElementById('proximo');
    
    if (anteriorBtn) {
        anteriorBtn.addEventListener('click', function() {
            console.log('Voltando ao passo anterior...');
            // Aqui você pode implementar a navegação entre steps
        });
    }
    
    if (proximoBtn) {
        proximoBtn.addEventListener('click', function() {
            if (validarFormularioFinanceiro()) {
                const dadosFinanceiros = coletarDadosFormularioFinanceiro();
                console.log('Dados financeiros coletados:', dadosFinanceiros);
                console.log('Avançando ao próximo passo...');
                // Aqui você pode implementar a navegação entre steps
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }
    
    // Aplicar máscaras e validações em tempo real
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('agencia') || e.target.classList.contains('conta')) {
            aplicarMascaraNumerica(e.target);
        }
    });
    
    // Efeitos visuais para campos do wizard financeiro
    const financeiroInputs = document.querySelectorAll('#wizard-modal-inner input, #wizard-modal-inner select');
    financeiroInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#4a90e2';
            this.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#ddd';
                this.style.boxShadow = 'none';
            }
        });
    });
}

// Validação do formulário financeiro
function validarFormularioFinanceiro() {
    const formaPagamento = document.getElementById('forma-pagamento');
    const agencias = document.querySelectorAll('.agencia');
    const contas = document.querySelectorAll('.conta');
    
    let valido = true;
    
    if (formaPagamento && !formaPagamento.value) {
        valido = false;
    }
    
    agencias.forEach(agencia => {
        if (!agencia.value.trim()) {
            agencia.style.borderColor = '#dc3545';
            valido = false;
        } else {
            agencia.style.borderColor = '#ddd';
        }
    });
    
    contas.forEach(conta => {
        if (!conta.value.trim()) {
            conta.style.borderColor = '#dc3545';
            valido = false;
        } else {
            conta.style.borderColor = '#ddd';
        }
    });
    
    return valido;
}

// Função para coletar dados do formulário financeiro
function coletarDadosFormularioFinanceiro() {
    const formaPagamento = document.getElementById('forma-pagamento');
    const locadores = [];
    
    document.querySelectorAll('.banco-block').forEach((block, index) => {
        const agencia = block.querySelector('.agencia')?.value;
        const agenciaNome = block.querySelector('.agencia-nome')?.value;
        const conta = block.querySelector('.conta')?.value;
        const tipoConta = block.querySelector('.tipo-conta')?.value;
        
        if (agencia && conta) {
            locadores.push({
                id: index + 1,
                agencia: agencia,
                agenciaNome: agenciaNome,
                conta: conta,
                tipoConta: tipoConta
            });
        }
    });
    
    return {
        formaPagamento: formaPagamento ? formaPagamento.value : '',
        locadores: locadores,
        resumo: {
            valorAluguel: 'R$ 3.000,00',
            parcelas: 12,
            vencimento: '15 de cada mês'
        }
    };
}

// Máscara para campos numéricos
function aplicarMascaraNumerica(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value;
}

// Atualização do progresso do wizard financeiro
function atualizarProgressoFinanceiro(step) {
    const steps = document.querySelectorAll('.progress .step');
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

// Função global para remover locador
function removerLocador(button) {
    const bancoBlock = button.closest('.banco-block');
    
    // Animação de saída
    bancoBlock.style.transition = 'all 0.3s ease';
    bancoBlock.style.opacity = '0';
    bancoBlock.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        bancoBlock.remove();
    }, 300);
}

// API pública do Wizard Financeiro
window.WizardFinanceiro = {
    validarFormulario: function() {
        return document.querySelector('.wizard-financeiro-container') !== null;
    },
    
    coletarDados: function() {
        return coletarDadosFormularioFinanceiro();
    },
    
    limparFormulario: function() {
        const formaPagamento = document.getElementById('forma-pagamento');
        if (formaPagamento) formaPagamento.value = '';
        
        document.querySelectorAll('.banco-block').forEach((block, index) => {
            if (index > 0) { // Mantém o primeiro locador
                block.remove();
            } else {
                block.querySelectorAll('input').forEach(input => input.value = '');
                const select = block.querySelector('select');
                if (select) select.selectedIndex = 0;
            }
        });
    }
};
