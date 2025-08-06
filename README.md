# SILIC 2.0 - Sistema de Solicitações CAIXA

> **Protótipo - Solicitações de Serviços** | Sistema integrado para locação, cessão e comodato de imóveis

---

## 🎯 Visão Geral

O SILIC 2.0 é um sistema moderno e responsivo para solicitações de serviços da CAIXA, oferecendo wizards dinâmicos e uma experiência de usuário otimizada para diferentes tipos de persona e necessidades.

### 🏢 Modalidades Disponíveis
- **Locação:** Contratação, Regularização, Formalização
- **Cessão:** Processo simplificado e seguro
- **Comodato:** Soluções com segurança e confiabilidade

### 👥 Personas Atendidas
- **Pessoa Física:** Wizard financeiro simplificado
- **Pessoa Jurídica:** Wizard principal com fluxo completo

---

## 📁 Estrutura do Projeto

```
silic-request-service/
├── index.html                    # Página principal com sistema de roteamento
├── README.md                     # Documentação unificada (este arquivo)
├── assets/
│   ├── css/
│   │   └── style.css            # Estilos consolidados e responsivos
│   ├── js/
│   │   ├── main.js              # JavaScript principal
│   │   └── documentacao.json    # Dados de documentação
│   └── images/
│       └── logo-caixa.svg       # Logo institucional
└── pages/
    ├── stepper.html             # Stepper genérico (fallback)
    ├── wizard-fisica.html       # Wizard para Pessoa Física
    └── wizard-juridica.html     # Wizard para Pessoa Jurídica
```

---

## 🧙‍♂️ Sistema de Wizards

### **Roteamento Inteligente**

O sistema utiliza condições dinâmicas para direcionar usuários ao wizard adequado:

```javascript
function acaoIniciarWizard() {
    const tab = document.querySelector('.tab-button.active')?.getAttribute('data-tab');
    const acao = document.getElementById('contratar')?.value;
    const tipo = document.getElementById('formalizar')?.value;
    const tipoContratacao = document.getElementById('tipo-contratacao')?.value;
    
    // Wizard Física (Pessoa Física)
    if (tab === 'locacao' && acao === 'contratar' && 
        tipo === 'pessoa-fisica' && tipoContratacao === 'nova-unidade') {
        abrirWizardHtml('pages/wizard-fisica.html');
    }
    
    // Wizard Jurídica (Pessoa Jurídica)
    else if (tab === 'locacao' && acao === 'contratar' && 
             tipo === 'pessoa-juridica' && tipoContratacao === 'nova-unidade') {
        abrirWizardHtml('pages/wizard-juridica.html');
    }
    
    // Fallback para casos não específicos
    else {
        abrirStepper(); // Usa stepper.html genérico
    }
}
```

### **1. Wizard Física** (`pages/wizard-fisica.html`)

**Persona:** Pessoa Física  
**Foco:** Dados bancários e informações financeiras simplificadas

#### **Funcionalidades:**
- ✅ **Formulário de dados bancários** com validação
- ✅ **Múltiplos locadores** (adicionar/remover dinamicamente)
- ✅ **Resumo de valores** em tempo real
- ✅ **Navegação progressiva** com validação por etapa
- ✅ **Design responsivo** otimizado para mobile

#### **Estrutura dos Steps:**
1. **Dados Bancários:** Forma de pagamento, agência, conta
2. **Locadores:** Informações de múltiplos locadores
3. **Revisão:** Resumo final antes do envio

#### **Objeto de Dados Coletados:**
```javascript
{
  formaPagamento: "deposito|pix|ted",
  locadores: [
    {
      id: 1,
      agencia: "1234",
      agenciaNome: "Agência Centro",
      conta: "56789-0",
      tipoConta: "corrente|poupanca"
    }
  ],
  resumo: {
    valorAluguel: "R$ 3.000,00",
    parcelas: 12,
    vencimento: "15 de cada mês"
  }
}
```

### **2. Wizard Jurídica** (`pages/wizard-juridica.html`)

**Persona:** Pessoa Jurídica  
**Foco:** Fluxo completo com documentação, licitação e dados corporativos

#### **Funcionalidades:**
- ✅ **Processo licitatório** completo
- ✅ **Gestão de documentação** corporativa
- ✅ **Dados financeiros** empresariais
- ✅ **Múltiplos locadores** com validação CNPJ
- ✅ **Revisão final** com todas as informações

#### **Estrutura dos Steps:**
1. **Licitação:** Dados do processo licitatório
2. **Documentação:** Upload e validação de documentos
3. **Financeiro:** Dados bancários empresariais
4. **Locadores:** Informações dos locadores
5. **Revisão:** Confirmação final

### **3. Stepper Genérico** (`pages/stepper.html`)

**Uso:** Fallback para combinações não cobertas pelos wizards específicos  
**Características:** Interface genérica e adaptável

#### **Funcionalidades:**
- ✅ **Formulário básico** com dados essenciais
- ✅ **Validação simples** para campos obrigatórios
- ✅ **Review dinâmico** dos dados informados
- ✅ **Protocolo de confirmação** gerado automaticamente
- ✅ **Suporte a CPF/CNPJ** com formatação automática

#### **Estrutura dos Steps:**
1. **Informações Básicas:** Nome, documento, e-mail, telefone
2. **Dados da Solicitação:** Modalidade, ação, observações
3. **Revisão e Confirmação:** Review final e protocolo

---

## 🎨 Design System

### **Paleta de Cores CAIXA**
```css
:root {
    --primary: #003366;           /* Azul CAIXA principal */
    --primary-light: #0056b3;     /* Azul claro */
    --accent: #F39200;            /* Laranja CAIXA */
    --success: #28a745;           /* Verde sucesso */
    --warning: #ffc107;           /* Amarelo aviso */
    --error: #dc3545;             /* Vermelho erro */
}
```

### **Componentes Visuais**

#### **Headers Dinâmicos**
Sistema de cabeçalhos que se adaptam automaticamente às escolhas do usuário:

```javascript
function getDynamicWizardHeader(tab, acao, tipo, tipoContratacao, url) {
    // Título: "Contratação de Locação - Pessoa Física"
    // Descrição: "Preencha os dados necessários para contratar uma nova unidade..."
    // Progress bar: Adaptado ao número de steps do wizard
}
```

#### **Progress Bar Responsivo**
```css
.wizard-progress {
    display: flex;
    gap: 4px;
    margin: 0 0 8px 8px;
}

.wizard-progress .progress-step {
    flex: 1;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    transition: background-color 0.3s ease;
}

.wizard-progress .progress-step.active {
    background: #4a90e2;
}

.wizard-progress .progress-step.completed {
    background: #28a745;
}
```

#### **Estados dos Steps**
- 🔘 **Padrão:** Cinza (#333) - não iniciado
- 🔵 **Ativo:** Negrito (#333) - step atual
- ✅ **Concluído:** Cinza com opacidade (rgba(51,51,51,0.65)) - finalizado

---

## 🛠️ Arquitetura Técnica

### **CSS Consolidado** (`assets/css/style.css`)

#### **Modal Responsivo Unificado**
```css
#wizard-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

#wizard-modal-overlay.hidden {
    display: none !important;
}

.wizard-content {
    background: white;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

#### **Navegação Responsiva**
```css
.wizard-navigation {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
}

.wizard-navigation button {
    min-width: 120px;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .wizard-navigation {
        flex-direction: column;
        gap: 8px;
    }
    
    .wizard-navigation button {
        width: 100%;
    }
}
```

### **JavaScript Modular** (`assets/js/main.js`)

#### **Sistema de Roteamento**
```javascript
function abrirWizardHtml(url) {
    const overlay = document.getElementById('wizard-modal-overlay');
    const content = document.getElementById('wizard-content');
    
    // Buscar conteúdo dinamicamente
    fetch(url)
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            overlay.classList.remove('hidden');
            
            // Executar scripts do wizard carregado
            const scripts = content.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
            });
        });
}
```

#### **Headers Dinâmicos**
```javascript
function getDynamicWizardHeader(tab, acao, tipo, tipoContratacao, url) {
    const config = {
        'wizard-financeiro.html': {
            title: `${acao.charAt(0).toUpperCase() + acao.slice(1)} de ${tab.charAt(0).toUpperCase() + tab.slice(1)} - Pessoa Física`,
            description: "Preencha os dados financeiros necessários para processar sua solicitação de nova unidade."
        },
        'wizard.html': {
            title: `${acao.charAt(0).toUpperCase() + acao.slice(1)} de ${tab.charAt(0).toUpperCase() + tab.slice(1)} - Pessoa Jurídica`,
            description: "Complete o processo de contratação com todas as informações corporativas necessárias."
        }
    };
    
    const filename = url.split('/').pop();
    return config[filename] || {
        title: "SILIC 2.0 - Solicitação de Serviços",
        description: "Preencha as informações necessárias para sua solicitação."
    };
}
```

---

## 🔧 Melhorias Implementadas

### **1. Integração Visual Completa**

#### **Problema Solucionado:**
- Inconsistências visuais entre wizard-financeiro e wizard principal
- Headers estáticos que não refletiam o contexto do usuário
- Problemas de responsividade em diferentes tamanhos de tela

#### **Solução Implementada:**
- ✅ **Consolidação CSS:** Estilos do wizard-financeiro aplicados ao wizard principal
- ✅ **Headers Dinâmicos:** Títulos e descrições gerados automaticamente baseados nas seleções
- ✅ **Design Responsivo:** Layout adaptável para desktop, tablet e mobile

#### **Resultado:**
```css
/* Aplicado a ambos os wizards */
.wizard-step h3 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.4em;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}
```

### **2. Sistema de Navegação Unificado**

#### **Funcionalidades:**
- **Navegação Progressiva:** Steps sequenciais com validação
- **Navegação Livre:** Possibilidade de voltar a steps anteriores
- **Estados Visuais:** Indicadores claros do progresso atual

#### **Progress Bar Inteligente:**
```javascript
function updateProgressBar(currentStep, totalSteps) {
    const progressBar = document.querySelector('.wizard-progress');
    const steps = progressBar.querySelectorAll('.progress-step');
    
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}
```

### **3. Modal Responsivo e Acessível**

#### **Problema Original:**
```css
/* CSS problemático que causava overlay branco persistente */
#wizard-modal-overlay.hidden {
    visibility: hidden;
    opacity: 0;
}
```

#### **Solução Implementada:**
```css
/* CSS corrigido para fechar modal completamente */
#wizard-modal-overlay.hidden {
    display: none !important;
}
```

#### **Melhorias de Acessibilidade:**
- ✅ **Foco Automático:** Modal recebe foco ao abrir
- ✅ **Tecla ESC:** Fecha o modal
- ✅ **Click Outside:** Fecha ao clicar fora do conteúdo
- ✅ **Navegação por Tab:** Ordem lógica de navegação

```javascript
// Event listeners para acessibilidade
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharWizard();
    }
});

overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
        fecharWizard();
    }
});
```

### **4. Validação e Feedback Visual**

#### **Sistema de Validação em Tempo Real:**
```javascript
function validateStep(stepElement) {
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}
```

#### **Estados Visuais dos Campos:**
```css
.form-group input.error,
.form-group select.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-group input:focus,
.form-group select:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}
```

---

## 📱 Responsividade

### **Breakpoints Definidos**
```css
/* Mobile First */
@media (max-width: 768px) {
    .wizard-content {
        width: 95%;
        margin: 20px auto;
        max-height: 85vh;
    }
    
    .wizard-navigation {
        flex-direction: column;
        gap: 8px;
    }
    
    .form-row {
        flex-direction: column;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .wizard-content {
        width: 85%;
        max-width: 700px;
    }
}

@media (min-width: 1025px) {
    .wizard-content {
        max-width: 800px;
        width: 80%;
    }
}
```

### **Layout Adaptável**
- **Mobile (< 768px):** Layout vertical, botões empilhados, formulários simplificados
- **Tablet (768px - 1024px):** Layout intermediário, navegação otimizada
- **Desktop (> 1024px):** Layout completo, todas as funcionalidades visíveis

---

## 🚀 Como Usar

### **1. Inicialização**
```bash
# Servir arquivos localmente
python -m http.server 8000
# ou
npx live-server
```

### **2. Acessar a Aplicação**
```
http://localhost:8000
```

### **3. Fluxo de Uso**
1. **Selecionar modalidade:** Locação, Cessão ou Comodato
2. **Escolher ação:** Contratar, Regularizar ou Formalizar
3. **Definir tipo:** Pessoa Física ou Jurídica
4. **Especificar contratação:** Nova Unidade ou outras opções
5. **Clicar "Iniciar":** Sistema redireciona automaticamente para o wizard adequado

### **4. Desenvolvimento**
```javascript
// Adicionar nova condição de roteamento
function acaoIniciarWizard() {
    // ... condições existentes ...
    
    // Nova condição
    else if (tab === 'cessao' && acao === 'contratar') {
        abrirWizardHtml('pages/wizard-cessao.html');
    }
}
```

---

## 🔍 Logs e Debug

### **Console Logs Implementados**
```javascript
// Debug do roteamento
console.log('Roteamento:', { tab, acao, tipo, tipoContratacao });

// Debug da navegação
console.log('Navegando para step:', currentStep);

// Debug da validação
console.log('Validação do step:', stepNumber, 'resultado:', isValid);
```

### **Erros Comuns e Soluções**

| Problema | Causa | Solução |
|----------|-------|---------|
| Modal não fecha | CSS visibility vs display | Usar `display: none !important` |
| Header não atualiza | Cache do getDynamicWizardHeader | Verificar condições de roteamento |
| Progress bar incorreta | Número de steps não atualizado | Contar steps dinamicamente |
| Formulário não valida | Event listeners não anexados | Verificar carregamento do script |

---

## 📈 Performance

### **Otimizações Implementadas**
- ✅ **CSS Consolidado:** Um único arquivo para todos os estilos
- ✅ **JavaScript Modular:** Carregamento dinâmico apenas quando necessário
- ✅ **Lazy Loading:** Conteúdo dos wizards carregado sob demanda
- ✅ **Compressão de Assets:** Imagens otimizadas (SVG)

### **Métricas de Carregamento**
- **First Paint:** < 1s
- **DOM Interactive:** < 1.5s
- **Load Complete:** < 2s

---

## 🔮 Próximos Passos

### **Funcionalidades Planejadas**
- [ ] **Wizard para Cessão:** Fluxo específico para modalidade de cessão
- [ ] **Wizard para Comodato:** Interface dedicada para comodato
- [ ] **Dashboard de Acompanhamento:** Área para acompanhar solicitações
- [ ] **Integração com APIs:** Validação de dados em tempo real
- [ ] **Sistema de Notificações:** Alertas e atualizações de status

### **Melhorias Técnicas**
- [ ] **Testes Automatizados:** Jest ou Cypress para cobertura de testes
- [ ] **Build Pipeline:** Webpack ou Vite para otimização
- [ ] **PWA:** Service Workers para funcionalidade offline
- [ ] **Acessibilidade:** Certificação WCAG 2.1 AA

---

## 🤝 Contribuindo

### **Estrutura de Commits**
```
feat: adiciona nova funcionalidade
fix: corrige bug específico
style: ajustes de CSS/UI
refactor: refatoração de código
docs: atualização de documentação
```

### **Padrões de Código**
- **CSS:** BEM methodology
- **JavaScript:** ES6+ com const/let
- **HTML:** Semantic HTML5
- **Acessibilidade:** ARIA attributes

---

## 📄 Licença

**CAIXA ECONÔMICA FEDERAL**  
Sistema interno - Todos os direitos reservados

---

**Versão:** 2.0  
**Última atualização:** Dezembro 2024  
**Desenvolvido para:** CAIXA Econômica Federal
- Estilos base do sistema
- Componentes de modal e wizard
- Estilos específicos do wizard financeiro
- Design responsivo unificado

### **JavaScript Consolidado** (`assets/js/main.js`)
- Funções principais do sistema
- Lógica de navegação entre wizards
- Funcionalidades do wizard financeiro
- APIs públicas para integração

### **HTML Modular** (`pages/`)
- Cada wizard em arquivo separado
- Importação dinâmica via modal
- Compartilhamento de assets centralizados

## 🚀 Como Usar

### **Teste do Wizard Financeiro:**
1. Selecione: **Locação** → **Contratação** → **Pessoa Física** → **Nova Unidade**
2. Clique em **"Iniciar"**
3. O wizard financeiro abrirá com formulário bancário

### **Teste do Wizard Principal:**
1. Selecione: **Locação** → **Contratação** → **Pessoa Jurídica** → **Nova Unidade**  
2. Clique em **"Iniciar"**
3. O wizard completo abrirá

## 📱 Características

- ✅ **Responsivo:** Funciona em mobile e desktop
- ✅ **Modular:** Código organizado e reutilizável  
- ✅ **Consolidado:** CSS/JS únicos por tipo
- ✅ **Performático:** Carregamento otimizado
- ✅ **Acessível:** Navegação por teclado e leitores

## 🔧 Desenvolvimento

### **Adicionar Nova Funcionalidade:**
1. CSS → `assets/css/style.css`
2. JavaScript → `assets/js/main.js`  
3. HTML → `pages/novo-componente.html`

### **Integração com Backend:**
```javascript
// Use a API pública do WizardFinanceiro
const dados = window.WizardFinanceiro.coletarDados();
// Envie para sua API
```

## 📖 Documentação Adicional

- `WIZARD-FINANCEIRO-README.md` - Detalhes específicos do wizard financeiro
- `ANEXO II - CHECKLIST DOCUMENTAÇÃO...docx` - Documentação CAIXA

## 🧪 Funcionalidades Avançadas

### **Stepper de Etapas Completo**
- **Processo Licitatório** - Dados da licitação
- **Documentação** - Gestão de documentos
- **Compliance** - Análise de conformidade
- **Análise Jurídica** - Notas Jurídicas
- **Financeiro** - Dados orçamentários e financeiros

### **Sistema de Validação**
- Validação de campos obrigatórios
- Padrões normativos (ex: matrícula C999999)
- Sistema de justificativas para exceções
- Upload de documentos comprobatórios
- Pontos de atenção automáticos

### **Gestão de Documentos**
- Interface avançada inspirada em sistemas corporativos
- Status de documentos (Entregue, Pendente, Em Análise, Rejeitado)
- Relatório técnico integrado
- Gestão de múltiplos locadores
- Resumo visual com contadores

## 💻 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos e modernos
- **JavaScript ES6+** - Interatividade dinâmica
- **Font Awesome** - Iconografia
- **Design System CAIXA** - Identidade visual

## 🏗️ Estrutura Final do Projeto

```
silic-request-service/
├── index.html                    # ✅ Página principal única
├── README.md                     # ✅ Documentação atualizada
├── assets/
│   ├── css/
│   │   └── style.css            # ✅ CSS consolidado
│   ├── js/
│   │   ├── main.js              # ✅ JavaScript consolidado
│   │   └── documentacao.json    # ✅ Dados essenciais
│   └── images/
│       └── logo-caixa.svg       # ✅ Assets necessários
└── pages/                        # ✅ Componentes modulares
    ├── stepper.html             # ✅ Modal stepper
    ├── wizard.html              # ✅ Wizard PJ
    └── wizard-financeiro.html   # ✅ Wizard PF
```

**🎯 Resultado:** Estrutura limpa seguindo padrões internacionais - apenas arquivos essenciais!

---

**Desenvolvido para:** CAIXA Econômica Federal  
**Sistema:** SILIC 2.0 - Protótipo  
**Versão:** 2.0  
**Data:** Agosto 2025
- **Finalidade**: Desenvolvimento interno

## Suporte

Para dúvidas ou sugestões:
- **Email**: osvaldo.j.neto@caixa.gov.br

## Licença

Este projeto é propriedade da **CAIXA ECONÔMICA FEDERAL** e destina-se exclusivamente ao uso interno da instituição.

---

**SILIC 2.0** - Soluções para todos os momentos.
