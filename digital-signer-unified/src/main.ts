/**
 * SILIC Digital Signer - Main Entry Point
 * Unified TypeScript implementation
 */

import './styles/main.scss';
import { i18n } from './utils/i18n';
import { FormValidator } from './utils/validation';
import { Utils } from './utils';
import { AppComponent } from './components/AppComponent';
import type { DocumentInfo, SignatureData } from './types';

class SilicDigitalSigner {
  private appComponent: AppComponent | null = null;
  private formValidator: FormValidator | null = null;
  private currentDocument: DocumentInfo | null = null;
  private uploadProgress: HTMLElement | null = null;
  private statusMessage: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      console.log('🚀 SILIC Digital Signer inicializando...');
      
      // Initialize internationalization
      await i18n.init();
      
      console.log('✅ i18n inicializado com sucesso!');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupApp());
      } else {
        this.setupApp();
      }
    } catch (error) {
      console.error('Error initializing SILIC Digital Signer:', error);
    }
  }

  private setupApp(): void {
    // Get app container and render the application
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      throw new Error('App container not found');
    }

    // Create and render the main app component
    this.appComponent = new AppComponent(appContainer);
    this.appComponent.render();

    // Setup application functionality
    this.setupFormValidation();
    this.setupFileUpload();
    this.setupEventListeners();
    this.setupAccessibility();
    this.updateUI();
  }

  private setupFormValidation(): void {
    const form = Utils.getElement<HTMLFormElement>('#signForm');
    if (form) {
      this.formValidator = new FormValidator(form);
      
      // Listen for form submission
      form.addEventListener('submit', this.handleFormSubmit.bind(this));

      // Exemplo de trigger de validação inicial para evitar variável não utilizada
      // Trigger de validação inicial leve (apenas se campo já tiver valor)
      const nameInput = Utils.getElement<HTMLInputElement>('#signerName');
      if (nameInput && this.formValidator && nameInput.value) {
        this.formValidator.validateField('signerName', nameInput.value);
      }
    }
  }

  private setupFileUpload(): void {
    const fileInput = Utils.getElement<HTMLInputElement>('#docUpload');
    const dropZone = Utils.getElement<HTMLElement>('#uploadDropZone');
    
    if (fileInput && dropZone) {
      // File input change
      fileInput.addEventListener('change', this.handleFileSelect.bind(this));
      
      // Drag and drop
      dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
      dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
      dropZone.addEventListener('drop', this.handleDrop.bind(this));
      
      // Click to select
      dropZone.addEventListener('click', () => fileInput.click());
    }
  }

  private setupEventListeners(): void {
    // Back to portal button
    const backButton = Utils.getElement<HTMLButtonElement>('#voltarPortalBtn');
    if (backButton) {
      backButton.addEventListener('click', this.handleBackToPortal.bind(this));
    }

    // Language switcher
    const languageSelect = Utils.getElement<HTMLSelectElement>('#languageSwitcher');
    if (languageSelect) {
      languageSelect.value = i18n.getCurrentLanguage();
    }

    // CPF formatting
    const cpfInput = Utils.getElement<HTMLInputElement>('#signerCpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', this.handleCpfInput.bind(this));
    }

    // High contrast toggle
    const contrastToggle = Utils.getElement<HTMLButtonElement>('#contrastToggle');
    if (contrastToggle) {
      contrastToggle.addEventListener('click', this.toggleHighContrast.bind(this));
    }

    // Elegant scroll header effect
    this.setupElegantScrollEffect();
  }

  private setupElegantScrollEffect(): void {
    let ticking = false;

    const updateHeader = () => {
      const header = Utils.getElement('.header');
      if (header) {
        const scrollY = window.scrollY;
        
        if (scrollY > 60) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  private setupAccessibility(): void {
    // Ensure proper ARIA labels and descriptions
    this.updateAriaLabels();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Announce page load to screen readers
    Utils.announceToScreenReader(i18n.getTranslation('page-title'));
  }

  private updateAriaLabels(): void {
    const elementsWithAria = Utils.getAllElements('[data-i18n-aria]');
    elementsWithAria.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      if (key) {
        element.setAttribute('aria-label', i18n.getTranslation(key));
      }
    });
  }

  private setupKeyboardNavigation(): void {
    // Escape key to cancel operations
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.handleEscapeKey();
      }
    });
  }

  private handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.add('drag-over');
  }

  private handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private async processFile(file: File): Promise<void> {
    try {
      // Validate file
      if (!Utils.isFileTypeAllowed(file.name)) {
        this.showError(i18n.getTranslation('error-file-type'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        this.showError(i18n.getTranslation('error-file-size'));
        return;
      }

      // Create document info
      this.currentDocument = {
        id: Utils.generateUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'pending'
      };

      // Update UI
      this.updateFileDisplay(file);
      this.showSuccess(`Arquivo selecionado: ${file.name} (${Utils.formatFileSize(file.size)})`);
      
    } catch (error) {
      console.error('Error processing file:', error);
      this.showError(i18n.getTranslation('status-error'));
    }
  }

  private updateFileDisplay(file: File): void {
    const fileDisplay = Utils.getElement('#fileDisplay');
    const fileInfo = Utils.getElement('#fileInfo');
    
    if (fileDisplay && fileInfo) {
      fileDisplay.style.display = 'block';
      fileInfo.innerHTML = `
        <div class="file-details">
          <div class="file-name">${Utils.sanitizeString(file.name)}</div>
          <div class="file-size">${Utils.formatFileSize(file.size)}</div>
          <div class="file-type">${file.type || 'Tipo desconhecido'}</div>
        </div>
      `;
    }
  }

  private handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    this.processSignature(formData);
  }

  private async processSignature(formData: FormData): Promise<void> {
    if (!this.currentDocument) {
      this.showError(i18n.getTranslation('error-file-required'));
      return;
    }

    try {
      this.showProgress(i18n.getTranslation('status-signing'));
      
      // Simulate signing process
      await this.simulateSigningProcess();
      
      const signatureData: SignatureData = {
        certificateId: formData.get('certificateSelect') as string,
        documentId: this.currentDocument.id,
        timestamp: new Date().toISOString(),
        signerName: formData.get('signerName') as string,
        signerCpf: formData.get('signerCpf') as string
      };

      // Update document status
      this.currentDocument.status = 'signed';
      
      this.showSigningSuccess(signatureData);
      
    } catch (error) {
      console.error('Error signing document:', error);
      this.showError(i18n.getTranslation('status-error'));
    }
  }

  private async simulateSigningProcess(): Promise<void> {
    // Simulate API calls and processing time
    const steps = [
      { message: 'Validando certificado...', duration: 1000 },
      { message: 'Processando documento...', duration: 1500 },
      { message: 'Aplicando assinatura...', duration: 2000 },
      { message: 'Finalizando...', duration: 500 }
    ];

    for (const step of steps) {
      this.updateProgress(step.message);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }

  private showSigningSuccess(signatureData: SignatureData): void {
    this.hideProgress();
    this.showSuccess(i18n.getTranslation('status-success'));
    
    // Show download button
    const downloadBtn = Utils.getElement<HTMLButtonElement>('#downloadBtn');
    if (downloadBtn) {
      downloadBtn.style.display = 'block';
      downloadBtn.addEventListener('click', () => this.downloadSignedDocument(signatureData));
    }
    
    Utils.announceToScreenReader(i18n.getTranslation('aria-success'));
  }

  private downloadSignedDocument(signatureData: SignatureData): void {
    // In a real application, this would download the actual signed document
    const documentData = {
      originalDocument: this.currentDocument,
      signature: signatureData,
      signedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(documentData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_${this.currentDocument?.name || 'document'}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  private handleCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    // Format CPF as user types
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      input.value = value;
    }
  }

  private handleBackToPortal(): void {
    // In production, this would navigate to the actual portal
    window.location.href = 'https://osvaldojeronymo.github.io/silic-portal-imoveis/';
  }

  private toggleHighContrast(): void {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    
    Utils.setLocalStorage('high-contrast', isHighContrast);
    Utils.announceToScreenReader(
      isHighContrast ? 'Alto contraste ativado' : 'Alto contraste desativado'
    );
  }

  private handleEscapeKey(): void {
    // Close any open modals or cancel current operation
    const modals = Utils.getAllElements('.modal.active');
    modals.forEach(modal => modal.classList.remove('active'));
    
    // Clear any error states
    this.clearMessages();
  }

  // UI Helper Methods
  private showProgress(message: string): void {
    this.uploadProgress = Utils.getElement('#uploadProgress');
    if (this.uploadProgress) {
      this.uploadProgress.style.display = 'block';
      this.updateProgress(message);
    }
  }

  private updateProgress(message: string): void {
    const progressText = Utils.getElement('#progressText');
    if (progressText) {
      progressText.textContent = message;
    }
  }

  private hideProgress(): void {
    if (this.uploadProgress) {
      this.uploadProgress.style.display = 'none';
    }
  }

  private showSuccess(message: string): void {
    this.showMessage(message, 'success');
  }

  private showError(message: string): void {
    this.showMessage(message, 'error');
    Utils.announceToScreenReader(`Erro: ${message}`);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.statusMessage = Utils.getElement('#statusMessage');
    if (this.statusMessage) {
      this.statusMessage.textContent = message;
      this.statusMessage.className = `status-message ${type}`;
      this.statusMessage.style.display = 'block';
      
      // Auto-hide after 5 seconds for success messages
      if (type === 'success') {
        setTimeout(() => this.hideMessage(), 5000);
      }
    }
  }

  private hideMessage(): void {
    if (this.statusMessage) {
      Utils.fadeOut(this.statusMessage, 300).finished.then(() => {
        if (this.statusMessage) {
          this.statusMessage.style.display = 'none';
        }
      });
    }
  }

  private clearMessages(): void {
    this.hideMessage();
    this.hideProgress();
  }

  private updateUI(): void {
    // Update any UI elements that depend on current state
    const highContrast = Utils.getLocalStorage('high-contrast', false);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    }
  }
}

// Initialize the application
console.log('🔄 Iniciando SILIC Digital Signer...');
new SilicDigitalSigner();
console.log('✨ SILIC Digital Signer iniciado!');