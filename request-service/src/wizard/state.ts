export type WizardOptions = {
  total: number;
};

export type Wizard = {
  step: () => number;
  next: () => void;
  cancel: () => void;
  isOpen: () => boolean;
};

export function createWizard(opts: WizardOptions): Wizard {
  const total = Math.max(1, Math.floor(opts.total || 1));
  let current = 1;
  let open = true;

  return {
    step: () => current,
    next: () => {
      if (current < total) current += 1;
    },
    cancel: () => {
      current = 1;
      open = false;
    },
    isOpen: () => open,
  };
}
