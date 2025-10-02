/**
 * Utility functions for SILIC Digital Signer
 * TypeScript implementation with enhanced type safety
 */

export class Utils {
  // File utilities
  static isFileTypeAllowed(filename: string, allowedTypes: string[] = ['.pdf', '.docx', '.txt']): boolean {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(extension);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // String utilities
  static sanitizeString(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static formatCPF(cpf: string): string {
    const cleanCpf = cpf.replace(/\\D/g, '');
    return cleanCpf.replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, '$1.$2.$3-$4');
  }

  static validateCPF(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\\D/g, '');
    
    if (cleanCpf.length !== 11 || /^(\\d)\\1{10}$/.test(cleanCpf)) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    // Validate first digit
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

    return true;
  }

  // Date utilities
  static formatDate(date: Date, locale: string = 'pt-BR'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // DOM utilities
  static createElement<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    attributes: Partial<HTMLElementTagNameMap[T]> = {},
    children: (Node | string)[] = []
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tag);
    
    Object.assign(element, attributes);
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  }

  static getElement<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector(selector) as T | null;
  }

  static getAllElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
    return document.querySelectorAll(selector) as NodeListOf<T>;
  }

  // Event utilities
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Storage utilities
  static setLocalStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  static removeLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  // URL utilities
  static getQueryParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  static setQueryParam(key: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url.toString());
  }

  static removeQueryParam(key: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url.toString());
  }

  // Performance utilities
  static measurePerformance(name: string, fn: () => void | Promise<void>): void {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
    }
  }

  // Accessibility utilities
  static announceToScreenReader(message: string): void {
    const announcement = this.createElement('div', {
      className: 'sr-only'
    }, [message]);
    
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');

    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  static focusElement(selector: string | HTMLElement): void {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) as HTMLElement
      : selector;
      
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Security utilities
  static generateRandomId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Animation utilities
  static animate(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions = {}
  ): Animation {
    return element.animate(keyframes, {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards',
      ...options
    });
  }

  static fadeIn(element: HTMLElement, duration: number = 300): Animation {
    return this.animate(element, [
      { opacity: 0 },
      { opacity: 1 }
    ], { duration });
  }

  static fadeOut(element: HTMLElement, duration: number = 300): Animation {
    return this.animate(element, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration });
  }

  static slideDown(element: HTMLElement, duration: number = 300): Animation {
    const height = element.scrollHeight;
    return this.animate(element, [
      { height: '0px', overflow: 'hidden' },
      { height: `${height}px`, overflow: 'hidden' }
    ], { duration });
  }

  static slideUp(element: HTMLElement, duration: number = 300): Animation {
    return this.animate(element, [
      { height: `${element.scrollHeight}px`, overflow: 'hidden' },
      { height: '0px', overflow: 'hidden' }
    ], { duration });
  }
}