// Types for SILIC Digital Signer

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'signed' | 'error';
}

export interface SignatureData {
  certificateId: string;
  documentId: string;
  timestamp: string;
  signerName: string;
  signerCpf: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface I18nStrings {
  [key: string]: string;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}