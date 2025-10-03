/**
 * App Component - Main application interface
 * Based on original HTML structure with TypeScript/modern approach
 */

export class AppComponent {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = this.getTemplate();
    this.setupEventListeners();
  }

  private getTemplate(): string {
    return `
      <!-- Header -->
      <header class="header">
        <nav class="navbar">
          <div class="nav-container">
            <div class="nav-logo">
              <img src="/assets/images/logo-caixa.svg" alt="Caixa" class="logo">
            </div>
            <div class="nav-text">
              <h1 class="system-title">SILIC 2.0</h1>
              <p class="system-subtitle">Protótipo - Assinador Digital</p>
            </div>
            <div class="nav-actions">
              <button id="voltarPortalBtn" class="btn-voltar-portal">
                <i class="fas fa-arrow-left"></i>
                <span data-i18n="back-to-portal">Voltar ao Portal de Imóveis</span>
              </button>
            </div>
          </div>
        </nav>      
      </header>

      <!-- Loading indicator -->
      <div id="loading" class="loading hidden" aria-hidden="true">
        <div class="spinner" aria-label="Carregando..."></div>
      </div>

      <!-- Main Content -->
      <main id="main-content" class="container" role="main">
        <!-- Error/Success Messages -->
        <div id="alert-container" class="alert-container" aria-live="polite" role="alert"></div>
        
        <section class="card">
          <h2 data-i18n="portal-title">Portal de Assinatura Digital</h2>
          <p class="description" data-i18n="portal-description">
            Assine seus documentos de forma segura e digital com certificação válida.
          </p>
          
          <form id="signForm" novalidate aria-labelledby="portal-title">
            <!-- Multiple Documents Section -->
            <div class="form-group">
              <label for="docUpload" data-i18n="select-documents">Selecione os documentos:</label>
              <input 
                type="file" 
                id="docUpload" 
                name="docUpload" 
                accept=".pdf,.docx,.txt" 
                required 
                multiple
                aria-describedby="doc-help"
                class="file-input"
              >
              <small id="doc-help" class="help-text" data-i18n="doc-help">
                Formatos aceitos: PDF, DOCX, TXT (máximo 10MB por arquivo, até 10 arquivos)
              </small>
              <div class="error-message" id="docUpload-error" role="alert"></div>
              
              <!-- Selected Files Preview -->
              <div id="selectedFiles" class="selected-files hidden">
                <h4>Documentos Selecionados:</h4>
                <ul id="filesList" class="files-list"></ul>
                <button type="button" id="clearFiles" class="btn-clear">
                  <i class="fas fa-times"></i> Limpar Todos
                </button>
              </div>
            </div>

            <!-- Upload Progress -->
            <div id="uploadProgress" class="upload-progress hidden">
              <div class="progress-bar">
                <div id="progressFill" class="progress-fill" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  <span id="progressText" class="progress-text">0%</span>
                </div>
              </div>
            </div>

            <!-- Certificate Selection -->
            <div class="form-group">
              <label for="certificate" data-i18n="select-certificate">Selecione seu certificado digital:</label>
              <select id="certificate" name="certificate" required aria-describedby="cert-help">
                <option value="" data-i18n="choose-certificate">Escolha um certificado...</option>
              </select>
              <small id="cert-help" class="help-text" data-i18n="cert-help">
                Certifique-se de que seu certificado digital está conectado
              </small>
              <div class="error-message" id="certificate-error" role="alert"></div>
            </div>

            <!-- PIN/Password -->
            <div class="form-group">
              <label for="pin" data-i18n="certificate-pin">PIN do certificado:</label>
              <input 
                type="password" 
                id="pin" 
                name="pin" 
                required 
                autocomplete="current-password"
                aria-describedby="pin-help"
                minlength="4"
                maxlength="8"
              >
              <small id="pin-help" class="help-text" data-i18n="pin-help">
                Digite o PIN do seu certificado digital
              </small>
              <div class="error-message" id="pin-error" role="alert"></div>
            </div>

            <!-- Signature Reason -->
            <div class="form-group">
              <label for="reason" data-i18n="signature-reason">Motivo da assinatura:</label>
              <select id="reason" name="reason" required aria-describedby="reason-help">
                <option value="" data-i18n="select-reason">Selecione o motivo...</option>
                <option value="aprovacao" data-i18n="reason-approval">Aprovação</option>
                <option value="validacao" data-i18n="reason-validation">Validação</option>
                <option value="concordancia" data-i18n="reason-agreement">Concordância</option>
                <option value="autorizacao" data-i18n="reason-authorization">Autorização</option>
              </select>
              <small id="reason-help" class="help-text" data-i18n="reason-help">
                Escolha o motivo que melhor descreve sua assinatura
              </small>
              <div class="error-message" id="reason-error" role="alert"></div>
            </div>

            <!-- Location -->
            <div class="form-group">
              <label for="location" data-i18n="signature-location">Local da assinatura:</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                aria-describedby="location-help"
                placeholder="Ex: Brasília, DF"
              >
              <small id="location-help" class="help-text" data-i18n="location-help">
                Opcional: Informe o local onde está assinando
              </small>
            </div>

            <!-- Terms and Conditions -->
            <div class="form-group">
              <div class="checkbox-group">
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms" data-i18n="accept-terms">
                  Aceito os <a href="#" id="termsLink">termos e condições</a> de uso
                </label>
              </div>
              <div class="error-message" id="terms-error" role="alert"></div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" id="previewBtn" class="btn btn-secondary" disabled>
                <i class="fas fa-eye"></i>
                <span data-i18n="preview">Pré-visualizar</span>
              </button>
              <button type="submit" id="signBtn" class="btn btn-primary" disabled>
                <i class="fas fa-signature"></i>
                <span data-i18n="sign-documents">Assinar Documentos</span>
              </button>
            </div>
          </form>
        </section>

        <!-- Document Preview Section -->
        <section id="previewSection" class="card hidden">
          <h3 data-i18n="document-preview">Pré-visualização dos Documentos</h3>
          <div id="previewContainer" class="preview-container"></div>
          <div class="preview-actions">
            <button type="button" id="closePreview" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              <span data-i18n="close">Fechar</span>
            </button>
          </div>
        </section>
      </main>

      <!-- Signature Progress Modal -->
      <div id="signatureModal" class="modal hidden" role="dialog" aria-labelledby="signatureModalTitle" aria-hidden="true">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="signatureModalTitle" data-i18n="signing-progress">Progresso da Assinatura</h3>
          </div>
          <div class="modal-body">
            <div class="signing-progress">
              <div class="progress-steps">
                <div class="step active" id="step1">
                  <i class="fas fa-check"></i>
                  <span data-i18n="validating-certificate">Validando certificado</span>
                </div>
                <div class="step" id="step2">
                  <i class="fas fa-file-signature"></i>
                  <span data-i18n="signing-documents">Assinando documentos</span>
                </div>
                <div class="step" id="step3">
                  <i class="fas fa-download"></i>
                  <span data-i18n="preparing-download">Preparando download</span>
                </div>
              </div>
              <div class="progress-bar">
                <div id="signProgressFill" class="progress-fill" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  <span id="signProgressText" class="progress-text">0%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" id="cancelSigning" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              <span data-i18n="cancel">Cancelar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Terms Modal -->
      <div id="termsModal" class="modal hidden" role="dialog" aria-labelledby="termsModalTitle" aria-hidden="true">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="termsModalTitle" data-i18n="terms-title">Termos e Condições de Uso</h3>
            <button type="button" class="modal-close" aria-label="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="terms-content" data-i18n="terms-content">
              <!-- Terms content will be loaded here -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close">
              <span data-i18n="close">Fechar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <p>&copy; 2025 CAIXA - SILIC 2.0. <span data-i18n="all-rights-reserved">Todos os direitos reservados.</span></p>
          <div class="footer-links">
            <a href="#" data-i18n="privacy-policy">Política de Privacidade</a>
            <a href="#" data-i18n="support">Suporte</a>
            <a href="#" data-i18n="help">Ajuda</a>
          </div>
        </div>
      </footer>
    `;
  }

  private setupEventListeners(): void {
    // Back to portal button
    const backBtn = document.getElementById('voltarPortalBtn');
    if (backBtn) {
      backBtn.addEventListener('click', this.handleBackToPortal.bind(this));
    }

    // Clear files button
    const clearBtn = document.getElementById('clearFiles');
    if (clearBtn) {
      clearBtn.addEventListener('click', this.handleClearFiles.bind(this));
    }

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
      previewBtn.addEventListener('click', this.handlePreview.bind(this));
    }

    // Close preview button
    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', this.handleClosePreview.bind(this));
    }

    // Terms link
    const termsLink = document.getElementById('termsLink');
    if (termsLink) {
      termsLink.addEventListener('click', this.handleShowTerms.bind(this));
    }

    // Modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', this.handleCloseModal.bind(this));
    });
  }

  private handleBackToPortal(): void {
    if (confirm('Deseja realmente voltar ao portal? Todos os dados não salvos serão perdidos.')) {
      window.location.href = '/portal-imoveis';
    }
  }

  private handleClearFiles(): void {
    const fileInput = document.getElementById('docUpload') as HTMLInputElement;
    const selectedFiles = document.getElementById('selectedFiles');
    
    if (fileInput) {
      fileInput.value = '';
    }
    
    if (selectedFiles) {
      selectedFiles.classList.add('hidden');
    }
  }

  private handlePreview(): void {
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
      previewSection.classList.remove('hidden');
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private handleClosePreview(): void {
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
      previewSection.classList.add('hidden');
    }
  }

  private handleShowTerms(event: Event): void {
    event.preventDefault();
    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
      termsModal.classList.remove('hidden');
      termsModal.setAttribute('aria-hidden', 'false');
    }
  }

  private handleCloseModal(): void {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
}