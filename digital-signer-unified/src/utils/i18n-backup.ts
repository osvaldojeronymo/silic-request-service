/**
 * Internationalization (i18n) Manager for SILIC Digital Signer
 * TypeScript implementation with enhanced type safety
 */

import type { I18nStrings } from '../types';

export type SupportedLanguage = 'pt-BR';

interface TranslationData {
  [key: string]: I18nStrings;
}

export class I18nManager {
  private currentLanguage: SupportedLanguage = 'pt-BR';
  private translations: TranslationData = {};
  private readonly supportedLanguages: SupportedLanguage[] = ['pt-BR'];
  private readonly storageKey = 'silic-preferred-language';

  constructor() {
    // Don't call init here as it's async
  }

  async init(): Promise<void> {
    this.detectLanguage();
    await this.loadTranslations();
    this.applyTranslations();
    this.setupLanguageSwitcher();
  }

  private detectLanguage(): void {
    // Always use Portuguese for SILIC
    this.currentLanguage = 'pt-BR';
  }

  private async loadTranslations(): Promise<void> {
    // For development, inline translations
    // In production, these would be loaded from separate JSON files
    this.translations = {
      'pt-BR': {
        // Header
        'app-title': 'SILIC 2.0 - Assinador Digital',
        'app-subtitle': 'Protótipo - Assinador Digital',
        'btn-back-portal': 'Voltar ao Portal',
        'skip-to-content': 'Pular para o conteúdo principal',
        
        // Main content
        'page-title': 'Assinatura Digital de Documentos',
        'page-description': 'Faça a assinatura digital segura dos seus documentos',
        
        // Document upload
        'upload-title': 'Selecionar Documento',
        'upload-description': 'Selecione o documento que deseja assinar digitalmente',
        'upload-button': 'Escolher Arquivo',
        'upload-formats': 'Formatos aceitos: PDF, DOCX, TXT (máx. 10MB)',
        
        // Signer information
        'signer-title': 'Dados do Assinante',
        'signer-name': 'Nome Completo',
        'signer-name-placeholder': 'Digite seu nome completo',
        'signer-cpf': 'CPF',
        'signer-cpf-placeholder': '000.000.000-00',
        
        // Certificate selection
        'certificate-title': 'Certificado Digital',
        'certificate-description': 'Selecione o certificado para assinatura',
        'certificate-select': 'Selecionar Certificado',
        'certificate-test': 'Certificado de Teste - João Silva',
        
        // Action buttons
        'btn-sign': 'Assinar Documento',
        'btn-cancel': 'Cancelar',
        'btn-download': 'Baixar Documento Assinado',
        
        // Status messages
        'status-uploading': 'Enviando documento...',
        'status-signing': 'Assinando documento...',
        'status-success': 'Documento assinado com sucesso!',
        'status-error': 'Erro ao processar documento',
        
        // Validation errors
        'error-file-required': 'Por favor, selecione um documento',
        'error-file-type': 'Formato de arquivo não suportado',
        'error-file-size': 'O arquivo deve ter no máximo 10MB',
        'error-name-required': 'Nome é obrigatório',
        'error-name-min': 'Nome deve ter pelo menos 2 caracteres',
        'error-cpf-required': 'CPF é obrigatório',
        'error-cpf-invalid': 'CPF inválido',
        'error-certificate-required': 'Selecione um certificado',
        
        // Accessibility
        'aria-upload-zone': 'Área para upload de documentos',
        'aria-progress': 'Progresso da assinatura',
        'aria-success': 'Assinatura concluída com sucesso',
        'aria-error': 'Erro durante a assinatura',
        
        // Footer
        'footer-text': '© 2025 CAIXA - Sistema Integrado de Logística Imobiliária da Caixa',
        'footer-version': 'Versão 2.0 - Protótipo'
      },
      
      'en-US': {
        // Header
        'app-title': 'SILIC 2.0 - Digital Signer',
        'app-subtitle': 'Prototype - Digital Signer',
        'btn-back-portal': 'Back to Portal',
        'skip-to-content': 'Skip to main content',
        
        // Main content
        'page-title': 'Digital Document Signing',
        'page-description': 'Securely sign your documents digitally',
        
        // Document upload
        'upload-title': 'Select Document',
        'upload-description': 'Choose the document you want to sign digitally',
        'upload-button': 'Choose File',
        'upload-formats': 'Accepted formats: PDF, DOCX, TXT (max. 10MB)',
        
        // Signer information
        'signer-title': 'Signer Information',
        'signer-name': 'Full Name',
        'signer-name-placeholder': 'Enter your full name',
        'signer-cpf': 'Tax ID (CPF)',
        'signer-cpf-placeholder': '000.000.000-00',
        
        // Certificate selection
        'certificate-title': 'Digital Certificate',
        'certificate-description': 'Select the certificate for signing',
        'certificate-select': 'Select Certificate',
        'certificate-test': 'Test Certificate - John Silva',
        
        // Action buttons
        'btn-sign': 'Sign Document',
        'btn-cancel': 'Cancel',
        'btn-download': 'Download Signed Document',
        
        // Status messages
        'status-uploading': 'Uploading document...',
        'status-signing': 'Signing document...',
        'status-success': 'Document signed successfully!',
        'status-error': 'Error processing document',
        
        // Validation errors
        'error-file-required': 'Please select a document',
        'error-file-type': 'Unsupported file format',
        'error-file-size': 'File must be at most 10MB',
        'error-name-required': 'Name is required',
        'error-name-min': 'Name must be at least 2 characters',
        'error-cpf-required': 'Tax ID is required',
        'error-cpf-invalid': 'Invalid Tax ID',
        'error-certificate-required': 'Select a certificate',
        
        // Accessibility
        'aria-upload-zone': 'Document upload area',
        'aria-progress': 'Signing progress',
        'aria-success': 'Signing completed successfully',
        'aria-error': 'Error during signing',
        
        // Footer
        'footer-text': '© 2025 CAIXA - Integrated Real Estate Logistics System',
        'footer-version': 'Version 2.0 - Prototype'
      },
      
      'es-ES': {
        // Header
        'app-title': 'SILIC 2.0 - Firmador Digital',
        'app-subtitle': 'Prototipo - Firmador Digital',
        'btn-back-portal': 'Volver al Portal',
        'skip-to-content': 'Saltar al contenido principal',
        
        // Main content
        'page-title': 'Firma Digital de Documentos',
        'page-description': 'Firme sus documentos de forma digital y segura',
        
        // Document upload
        'upload-title': 'Seleccionar Documento',
        'upload-description': 'Elija el documento que desea firmar digitalmente',
        'upload-button': 'Elegir Archivo',
        'upload-formats': 'Formatos aceptados: PDF, DOCX, TXT (máx. 10MB)',
        
        // Signer information
        'signer-title': 'Datos del Firmante',
        'signer-name': 'Nombre Completo',
        'signer-name-placeholder': 'Ingrese su nombre completo',
        'signer-cpf': 'CPF',
        'signer-cpf-placeholder': '000.000.000-00',
        
        // Certificate selection
        'certificate-title': 'Certificado Digital',
        'certificate-description': 'Seleccione el certificado para firmar',
        'certificate-select': 'Seleccionar Certificado',
        'certificate-test': 'Certificado de Prueba - João Silva',
        
        // Action buttons
        'btn-sign': 'Firmar Documento',
        'btn-cancel': 'Cancelar',
        'btn-download': 'Descargar Documento Firmado',
        
        // Status messages
        'status-uploading': 'Subiendo documento...',
        'status-signing': 'Firmando documento...',
        'status-success': '¡Documento firmado con éxito!',
        'status-error': 'Error al procesar documento',
        
        // Validation errors
        'error-file-required': 'Por favor, seleccione un documento',
        'error-file-type': 'Formato de archivo no soportado',
        'error-file-size': 'El archivo debe tener como máximo 10MB',
        'error-name-required': 'El nombre es obligatorio',
        'error-name-min': 'El nombre debe tener al menos 2 caracteres',
        'error-cpf-required': 'CPF es obligatorio',
        'error-cpf-invalid': 'CPF inválido',
        'error-certificate-required': 'Seleccione un certificado',
        
        // Accessibility
        'aria-upload-zone': 'Área de subida de documentos',
        'aria-progress': 'Progreso de la firma',
        'aria-success': 'Firma completada con éxito',
        'aria-error': 'Error durante la firma',
        
        // Footer
        'footer-text': '© 2025 CAIXA - Sistema Integrado de Logística Inmobiliaria',
        'footer-version': 'Versión 2.0 - Prototipo'
      }
    };
  }

  public getTranslation(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || key;
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public async setLanguage(language: SupportedLanguage): Promise<void> {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    this.currentLanguage = language;
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    
    this.applyTranslations();
    this.updateLanguageSwitcher();
  }

  private applyTranslations(): void {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = this.getTranslation(key);
        
        // Handle different element types
        if (element instanceof HTMLInputElement && element.placeholder !== undefined) {
          element.placeholder = translation;
        } else if (element instanceof HTMLElement) {
          element.textContent = translation;
        }
      }
    });

    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach((element) => {
      const key = element.getAttribute('data-i18n-aria');
      if (key) {
        element.setAttribute('aria-label', this.getTranslation(key));
      }
    });

    // Update document title
    document.title = this.getTranslation('app-title');
  }

  private setupLanguageSwitcher(): void {
    const switcher = document.getElementById('languageSwitcher');
    if (switcher) {
      switcher.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        this.setLanguage(target.value as SupportedLanguage);
      });
    }
  }

  private updateLanguageSwitcher(): void {
    const switcher = document.getElementById('languageSwitcher') as HTMLSelectElement;
    if (switcher) {
      switcher.value = this.currentLanguage;
    }
  }

  // Format locale-specific content
  public formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage).format(date);
  }

  public formatNumber(number: number): string {
    return new Intl.NumberFormat(this.currentLanguage).format(number);
  }

  public formatFileSize(bytes: number): string {
    const units = {
      'pt-BR': ['bytes', 'KB', 'MB', 'GB'],
      'en-US': ['bytes', 'KB', 'MB', 'GB'],
      'es-ES': ['bytes', 'KB', 'MB', 'GB']
    };

    if (bytes === 0) return '0 ' + units[this.currentLanguage][0];

    const k = 1024;
    const dm = 2;
    const sizes = units[this.currentLanguage];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

// Global instance
export const i18n = new I18nManager();