/**
 * Internationalization (i18n) Manager for SILIC Digital Signer
 * Simplified Portuguese-only implementation
 */

import type { I18nStrings } from '../types';

export class I18nManager {
  private translations: I18nStrings = {
    // Header
    'app-title': 'SILIC 2.0 - Assinador Digital',
    'app-subtitle': 'Protótipo - Assinador Digital',
    'btn-back-portal': 'Voltar ao Portal de Imóveis',
    'skip-to-content': 'Pular para o conteúdo principal',
    
    // Main content
    'page-title': 'Portal de Assinatura Digital',
    'page-description': 'Assine seus documentos de forma segura e digital com certificação válida.',
    
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
    'footer-version': 'Versão 2.0 - Protótipo',
    'all-rights-reserved': 'Todos os direitos reservados'
  };

  async init(): Promise<void> {
    this.applyTranslations();
  }

  public getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  public getCurrentLanguage(): string {
    return 'pt-BR';
  }

  public applyTranslations(): void {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = this.getTranslation(key);
      }
    });

    // Update document title
    const title = document.querySelector('title');
    if (title) {
      title.textContent = this.getTranslation('app-title');
    }
  }

  public formatNumber(number: number): string {
    return new Intl.NumberFormat('pt-BR').format(number);
  }

  public formatFileSize(bytes: number): string {
    const units = ['bytes', 'KB', 'MB', 'GB'];

    if (bytes === 0) return '0 ' + units[0];

    const k = 1024;
    const dm = 2;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i];
  }
}

// Global instance
export const i18n = new I18nManager();