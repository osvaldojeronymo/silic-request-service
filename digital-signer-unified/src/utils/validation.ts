/**
 * Form Validation Module for SILIC Digital Signer
 * TypeScript implementation with enhanced type safety and accessibility
 */

import type { ValidationResult, FormData } from '../types';
import { i18n } from './i18n';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  fileSize?: number;
  fileTypes?: string[];
  custom?: (value: any, formData?: FormData) => string | null;
}

export interface FieldValidation extends ValidationRule {
  validate: (value: any, file?: File) => string | null;
}

export class FormValidator {
  private form: HTMLFormElement;
  private rules: Map<string, FieldValidation> = new Map();
  private errors: Map<string, string> = new Map();
  private isValid: boolean = false;
  private onValidationChange?: (isValid: boolean, errors: Map<string, string>) => void;

  constructor(formElement: HTMLFormElement) {
    this.form = formElement;
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.defineValidationRules();
  }

  private setupEventListeners(): void {
    // Real-time validation on input
    this.form.addEventListener('input', this.handleInput.bind(this));
    this.form.addEventListener('blur', this.handleBlur.bind(this), true);
    this.form.addEventListener('change', this.handleChange.bind(this));
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private defineValidationRules(): void {
    // Document upload validation
    this.addRule('docUpload', {
      required: true,
      fileSize: 10 * 1024 * 1024, // 10MB
      fileTypes: ['.pdf', '.docx', '.txt'],
      validate: (_value: any, file?: File) => {
        if (!file) {
          return i18n.getTranslation('error-file-required');
        }

        if (!this.isFileTypeAllowed(file.name)) {
          return i18n.getTranslation('error-file-type');
        }

        if (file.size > (this.rules.get('docUpload')?.fileSize || 0)) {
          return i18n.getTranslation('error-file-size');
        }

        return null; // Valid
      }
    });

    // Signer name validation
    this.addRule('signerName', {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return i18n.getTranslation('error-name-required');
        }

        if (value.trim().length < 2) {
          return i18n.getTranslation('error-name-min');
        }

        if (value.length > 100) {
          return i18n.getTranslation('error-name-max');
        }

        const pattern = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!pattern.test(value)) {
          return i18n.getTranslation('error-name-invalid');
        }

        return null;
      }
    });

    // CPF validation
    this.addRule('signerCpf', {
      required: true,
      pattern: /^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$/,
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return i18n.getTranslation('error-cpf-required');
        }

        // Remove formatting
        const cleanCpf = value.replace(/\\D/g, '');
        
        if (!this.isValidCPF(cleanCpf)) {
          return i18n.getTranslation('error-cpf-invalid');
        }

        return null;
      }
    });

    // Certificate selection validation
    this.addRule('certificateSelect', {
      required: true,
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return i18n.getTranslation('error-certificate-required');
        }

        return null;
      }
    });
  }

  public addRule(fieldName: string, rule: FieldValidation): void {
    this.rules.set(fieldName, rule);
  }

  public validateField(fieldName: string, value: any, file?: File): ValidationResult {
    const rule = this.rules.get(fieldName);
    if (!rule) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const error = rule.validate(value, file);
    const isValid = error === null;

    if (isValid) {
      this.errors.delete(fieldName);
    } else {
      this.errors.set(fieldName, error);
    }

    this.updateFieldDisplay(fieldName, error);
    this.updateFormValidation();

    return {
      isValid,
      errors: error ? [error] : [],
      warnings: []
    };
  }

  public validateForm(): ValidationResult {
    const formData = new FormData(this.form);
    let hasErrors = false;
    const allErrors: string[] = [];

    this.rules.forEach((_, fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      let value: any = formData.get(fieldName);
      let file: File | undefined;

      if (field?.type === 'file') {
        file = field.files?.[0];
        value = file?.name || '';
      }

      const result = this.validateField(fieldName, value, file);
      if (!result.isValid) {
        hasErrors = true;
        allErrors.push(...result.errors);
      }
    });

    this.isValid = !hasErrors;
    
    if (this.onValidationChange) {
      this.onValidationChange(this.isValid, this.errors);
    }

    return {
      isValid: this.isValid,
      errors: allErrors,
      warnings: []
    };
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.name && this.rules.has(target.name)) {
      // Debounce validation for better performance
      clearTimeout((target as any).validationTimeout);
      (target as any).validationTimeout = setTimeout(() => {
        this.validateField(target.name, target.value);
      }, 300);
    }
  }

  private handleBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.name && this.rules.has(target.name)) {
      let file: File | undefined;
      if (target.type === 'file') {
        file = target.files?.[0];
      }
      this.validateField(target.name, target.value, file);
    }
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.name && this.rules.has(target.name)) {
      let file: File | undefined;
      if (target.type === 'file') {
        file = target.files?.[0];
      }
      this.validateField(target.name, target.value, file);
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const result = this.validateForm();
    
    if (result.isValid) {
      // Form is valid, proceed with submission
      this.form.dispatchEvent(new CustomEvent('validSubmit', {
        detail: { formData: new FormData(this.form) }
      }));
    } else {
      // Focus on first invalid field
      this.focusFirstInvalidField();
    }
  }

  private updateFieldDisplay(fieldName: string, error: string | null): void {
    const field = this.form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    const errorElement = this.form.querySelector(`#${fieldName}-error`) as HTMLElement;
    const fieldContainer = field?.closest('.form-group, .field-group') as HTMLElement;

    if (!field) return;

    // Update ARIA attributes
    if (error) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${fieldName}-error`);
      fieldContainer?.classList.add('has-error');
    } else {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
      fieldContainer?.classList.remove('has-error');
    }

    // Update error message
    if (errorElement) {
      errorElement.textContent = error || '';
      errorElement.style.display = error ? 'block' : 'none';
    }
  }

  private updateFormValidation(): void {
    const submitButton = this.form.querySelector('[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !this.isValid || this.errors.size > 0;
    }
  }

  private focusFirstInvalidField(): void {
    const firstErrorField = this.form.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Utility methods
  private isFileTypeAllowed(filename: string): boolean {
    const allowedTypes = this.rules.get('docUpload')?.fileTypes || [];
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(extension);
  }

  private isValidCPF(cpf: string): boolean {
    // Basic CPF validation algorithm
    if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    // Validate first digit
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Public API
  public getErrors(): Map<string, string> {
    return new Map(this.errors);
  }

  public isFormValid(): boolean {
    return this.isValid && this.errors.size === 0;
  }

  public clearErrors(): void {
    this.errors.clear();
    this.rules.forEach((_, fieldName) => {
      this.updateFieldDisplay(fieldName, null);
    });
    this.updateFormValidation();
  }

  public onValidationStateChange(callback: (isValid: boolean, errors: Map<string, string>) => void): void {
    this.onValidationChange = callback;
  }
}