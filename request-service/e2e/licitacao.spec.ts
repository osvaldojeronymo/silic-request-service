import { test, expect, Page } from '@playwright/test';

async function gotoHome(page: Page) {
  // Serve sempre a partir do webServer configurado (python http.server por padrão)
  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function selectLocacaoContratacaoPJNova(page: Page) {
  // Garante Locação ativa
  const locTab = page.locator('.tab-button[data-tab="locacao"]');
  if (await locTab.count()) await locTab.first().click({ trial: true }).catch(() => {});

  await page.selectOption('#contratar', { value: 'contratar' });
  await page.selectOption('#formalizar', { value: 'pessoa-juridica' });
  await page.selectOption('#tipo-contratacao', { value: 'nova-unidade' });

  // Aguarda bloco de licitação aparecer
  const bloco = page.locator('#bloco-licitacao');
  await expect(bloco).toBeVisible({ timeout: 5000 });
}

async function openWizard(page: Page) {
  // Clicar em "Iniciar"
  await page.getByRole('button', { name: /iniciar/i }).click();
  // Overlay deve aparecer
  const overlay = page.locator('#wizard-modal-overlay');
  await expect(overlay).toBeVisible();
  // Conteúdo do wizard deve existir
  const steps = overlay.locator('#wizardSteps .wizard-step');
  await expect(steps.first()).toBeVisible({ timeout: 8000 });
  return { overlay, steps };
}

test.describe('Fluxos com/sem licitação (Locação > Contratação > Jurídica > Nova unidade)', () => {
  test('Sem licitação: abre wizard sem etapa "Licitação"', async ({ page }) => {
    await gotoHome(page);
    await selectLocacaoContratacaoPJNova(page);

    // Garante switch desligado
    const switchBtn = page.locator('#switch-licitacao[role="switch"]');
    await expect(switchBtn).toHaveAttribute('aria-checked', /^(false|0)$/);

    const { overlay } = await openWizard(page);
    // Não deve existir etapa com label "Licitação"
    await expect(overlay.locator('#wizardSteps .wizard-label', { hasText: 'Licitação' })).toHaveCount(0);

    // Deve ter 5 etapas (Documentação, Compliance, Jurídico, Financeiro, Confirmação)
    await expect(overlay.locator('#wizardSteps .wizard-step')).toHaveCount(5);
  });

  test('Com licitação: abre wizard com etapa "Licitação"', async ({ page }) => {
    await gotoHome(page);
    await selectLocacaoContratacaoPJNova(page);

    // Liga switch
    const switchBtn = page.locator('#switch-licitacao[role="switch"]');
    await switchBtn.click();
    await expect(switchBtn).toHaveAttribute('aria-checked', 'true');

    const { overlay } = await openWizard(page);
    // Deve existir etapa com label "Licitação"
    await expect(overlay.locator('#wizardSteps .wizard-label', { hasText: 'Licitação' })).toHaveCount(1);

    // Deve ter 6 etapas (inclui Licitação)
    await expect(overlay.locator('#wizardSteps .wizard-step')).toHaveCount(6);
  });
});
