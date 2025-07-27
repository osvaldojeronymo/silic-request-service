# SILIC 2.0 - Sistema de Solicitação de Serviços

## Descrição

Sistema web moderno para solicitação de serviços, desenvolvido com foco em usabilidade, responsividade e conformidade com as normas institucionais.

## Funcionalidades Principais

### **Modalidades de Contratação**
- **Locação** - Aluguel de imóveis
- **Cessão** - Ocupação de espaços com ou sem ônus
- **Comodato** - Ocupação de espaço por meio de empréstimo gratuito

### **Formulário Dinâmico**
- Campos adaptativos conforme modalidade selecionada
- Validação em tempo real
- Campos obrigatórios destacados
- Formatação automática (valores, matrículas, etc.)

### **Stepper de Etapas**
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

### **Relatórios**
- Geração de relatório consolidado
- Formato PDF/A-1
- Timestamp e identificação do usuário
- Classificação #INTERNO.CAIXA

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos e modernos
- **JavaScript ES6+** - Lógica de negócio
- **Font Awesome** - Ícones profissionais

## Design System

### **Paleta de Cores CAIXA**
- **Azul Institucional**: `#1e4a72`
- **Azul Escuro**: `#003366`
- **Estados**: Verde (#28a745), Laranja (#ffc107), Vermelho (#dc3545)

### **Tipografia**
- **Fonte Principal**: Segoe UI
- **Hierarquia**: H1-H6 bem definida
- **Legibilidade**: Contraste otimizado

## Modo de Desenvolvimento

O sistema inclui um **Modo Desenvolvedor** para facilitar testes:

- ✅ **Toggle no header** (DEV MODE)
- ✅ **Bypass de validações** obrigatórias
- ✅ **Banner visual** quando ativo
- ✅ **Logs no console** para debug

### Como usar:
1. **Ativo por padrão** durante desenvolvimento
2. **Clique no botão** no header para alternar
3. **Desative para produção** alterando `DEVELOPMENT_MODE = false`

## Estrutura de Arquivos

```
desen-request-service/
├── index.html                # Formulário principal
├── stepper.html              # Interface de etapas
├── styles.css                # Estilos principais
├── stepper.css               # Estilos do stepper
├── validation.css            # Estilos de validação
├── documentation.css         # Estilos da gestão de documentos
├── script.js                 # Lógica do formulário principal
├── stepper.js                # Lógica do stepper
├── validation.js             # Sistema de validação
├── documentation.js          # Gestão de documentos
├── logo-caixa.svg            # Logo institucional
└── README.md                 # Esta documentação
```

## Como Executar

### **Desenvolvimento Local**
1. Clone o repositório
2. Abra `index.html` em um navegador moderno
3. Ou sirva via servidor local (recomendado):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (se tiver live-server)
   npx live-server
   ```

### **Acesso Direto**
- **Formulário Principal**: `index.html`
- **Interface de Etapas**: `stepper.html`

## Checklist de Funcionalidades

### **Implementado**
- [x] Formulário dinâmico por modalidade
- [x] Stepper com navegação entre etapas
- [x] Sistema de validação completo
- [x] Gestão avançada de documentos
- [x] Modo de desenvolvimento
- [x] Interface responsiva
- [x] Paleta de cores CAIXA
- [x] Sistema de justificativas
- [x] Upload de arquivos (mock)
- [x] Geração de relatórios (mock)

### **Em Desenvolvimento**
- [ ] Integração com APIs reais
- [ ] Autenticação de usuários
- [ ] Persistência de dados
- [ ] Notificações em tempo real
- [ ] Exportação PDF real
- [ ] Integração com sistemas CAIXA

## Deploy

### **Repositório Público (Demo)**
- **Nome**: `show-request-service`
- **URL**: `https://github.com/[seu-usuario]/show-request-service`
- **Finalidade**: Demonstração pública

### **Repositório Privado (Dev)**
- **Nome**: `desen-request-service`
- **URL**: `https://github.com/[seu-usuario]/desen-request-service`
- **Finalidade**: Desenvolvimento interno

## Suporte

Para dúvidas ou sugestões:
- **Email**: osvaldo.j.neto@caixa.gov.br

## Licença

Este projeto é propriedade da **CAIXA ECONÔMICA FEDERAL** e destina-se exclusivamente ao uso interno da instituição.

---

**SILIC 2.0** - Soluções para todos os momentos.
