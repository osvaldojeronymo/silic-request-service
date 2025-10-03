import { describe, it, expect } from 'vitest';
import { createWizard } from '../src/wizard/state'; // adapte o caminho

describe('wizard state', () => {
  it('avançar vai para próxima etapa', () => {
    const w = createWizard({ total: 6 });
    expect(w.step()).toBe(1);
    w.next();
    expect(w.step()).toBe(2);
  });

  it('cancelar reseta o estado e fecha', () => {
    const w = createWizard({ total: 6 });
    w.next();
    w.cancel();
    expect(w.step()).toBe(1);
    expect(w.isOpen()).toBe(false);
  });
});
