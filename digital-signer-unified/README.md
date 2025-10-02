# SILIC Digital Signer Unified

![Deploy Status](https://github.com/osvaldojeronymo/silic-digital-signer/actions/workflows/deploy.yml/badge.svg)

Portal unificado de Assinatura Digital SILIC 2.0 - Combinando as melhores práticas dos projetos original e moderno.

## 🚀 Sobre o Projeto

Este projeto unifica dois projetos de assinatura digital da SILIC:
- **digital-signer** (v1.0.0) - Implementação em HTML/CSS/JS tradicional
- **digital-signer-modern** (v2.0.0) - Implementação moderna com TypeScript

O resultado é uma aplicação moderna com TypeScript + Vite + SCSS, mantendo todas as funcionalidades e melhorias de acessibilidade de ambos os projetos.

## ✨ Funcionalidades

- 🔐 **Assinatura Digital Segura** - Suporte a certificados digitais A1 e A3
- 📄 **Múltiplos Documentos** - Assine vários documentos de uma vez
- 🌐 **Internacionalização** - Suporte a múltiplos idiomas
- ♿ **Acessibilidade** - Seguindo padrões WCAG 2.1
- 📱 **Responsivo** - Interface adaptável para todos os dispositivos
- 🛡️ **Segurança** - Headers de segurança e validação robusta
- ⚡ **Performance** - Build otimizado com Vite e code splitting
- 🧪 **Qualidade** - Linting, testes e análise de código

## 🛠️ Tecnologias

- **TypeScript** - Tipagem estática e desenvolvimento mais seguro
- **Vite** - Build tool moderna e rápida
- **SCSS** - CSS com superpoderes
- **ESLint + Prettier** - Qualidade e consistência do código
- **Vitest** - Framework de testes unitários
- **Playwright** - Testes end-to-end
- **PWA** - Progressive Web App com service worker

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚀 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/osvaldojeronymo/silic.git
   cd silic/digital-signer-unified
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   ```
   http://localhost:3000
   ```

## 📜 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run preview` - Preview da build de produção
- `npm run serve` - Servidor da build de produção na porta 3000

### Build
- `npm run build` - Gera a build de produção
- `npm run analyze` - Analisa o bundle de produção

## 🌐 Deploy (GitHub Pages)

O deploy é automatizado via GitHub Actions (`.github/workflows/deploy.yml`). Ao fazer push no branch `feature/unified-v3` (durante a fase de migração) ou `main` (após merge), a action:

1. Instala dependências (`npm ci`)
2. Executa a build (`npm run build`)
3. Publica o conteúdo de `dist` no GitHub Pages

URL de produção: https://osvaldojeronymo.github.io/silic-digital-signer/

O arquivo `vite.config.ts` define `base: '/silic-digital-signer/'`, garantindo caminhos corretos em produção.

### Testar build localmente
```bash
npm run build
npx serve dist
```

### Problemas comuns
- Página sem estilos: verifique se a base está correta e se o deploy apontou para a pasta `dist`.
- 404 em refresh: usar rotas relativas (SPA simples) ou fallback manual.
- Cache antigo: forçar refresh (Ctrl+F5) ou rodar novamente o workflow.

### Deploy manual (fallback)
Gerar build e subir artefato manualmente:
```bash
npm run build
```
Depois, na aba Pages do repositório, selecionar GitHub Actions como fonte (já configurado pela action).


### Qualidade de Código
- `npm run lint` - Executa todos os linters
- `npm run lint:ts` - Linting do TypeScript
- `npm run lint:css` - Linting do CSS/SCSS
- `npm run lint:html` - Validação do HTML
- `npm run format` - Formata o código com Prettier

### Testes
- `npm run test` - Executa todos os testes
- `npm run test:unit` - Testes unitários com Vitest
- `npm run test:e2e` - Testes end-to-end com Playwright

### Análise
- `npm run lighthouse` - Relatório Lighthouse de performance

## 📁 Estrutura do Projeto

```
digital-signer-unified/
├── public/                 # Arquivos estáticos
│   └── assets/
│       └── images/        # Imagens e ícones
├── src/
│   ├── components/        # Componentes da aplicação
│   │   └── AppComponent.ts
│   ├── styles/           # Estilos SCSS
│   │   ├── main.scss     # Arquivo principal de estilos
│   │   ├── _variables.scss
│   │   ├── _base.scss
│   │   └── components/   # Estilos dos componentes
│   ├── types/            # Definições de tipos TypeScript
│   ├── utils/            # Utilitários e helpers
│   │   ├── i18n.ts       # Internacionalização
│   │   ├── validation.ts # Validação de formulários
│   │   └── index.ts      # Utilitários gerais
│   └── main.ts           # Ponto de entrada da aplicação
├── index.html            # Template HTML principal
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── vite.config.ts        # Configuração Vite
├── .eslintrc.json        # Configuração ESLint
├── .prettierrc.json      # Configuração Prettier
├── .stylelintrc.yml      # Configuração Stylelint
└── README.md
```

## 🔧 Configuração

### Certificados Digitais

O sistema suporta certificados digitais A1 (software) e A3 (hardware/token). Para configurar:

1. Instale os drivers do seu certificado
2. Configure o middleware adequado
3. Teste a conectividade no portal

### Internacionalização

Para adicionar novos idiomas:

1. Edite `src/utils/i18n.ts`
2. Adicione as traduções necessárias
3. Configure o idioma padrão

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Convenções de Código

- **TypeScript** - Tipagem obrigatória para todas as funções
- **ESLint** - Seguir as regras configuradas
- **Prettier** - Formatação automática
- **Commits** - Usar conventional commits
- **CSS** - Usar BEM methodology para classes

## 🛡️ Segurança

- Headers de segurança configurados
- Validação de entrada em todos os formulários  
- Sanitização de dados
- Content Security Policy ativo
- Certificados validados server-side

## 📊 Performance

- Code splitting automático
- Lazy loading de componentes
- Compressão gzip/brotli
- Service Worker para cache
- Bundle analysis disponível

## 📄 Licença

Este projeto é propriedade da CAIXA - SILIC 2.0 Team.

## 👥 Equipe

- **CAIXA - SILIC 2.0 Team**
- **Desenvolvedor:** Osvaldo Jerônimo

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/osvaldojeronymo/silic/issues)
- **Documentação:** [Wiki do Projeto](https://github.com/osvaldojeronymo/silic/wiki)
- **Email:** silic@caixa.gov.br

---

**SILIC 2.0** - Sistema Integrado de Logística Imobiliária da Caixa