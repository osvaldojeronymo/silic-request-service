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
  const workflow = overlay.getByTestId('hu-workflow');
  await expect(workflow).toBeVisible({ timeout: 8000 });
  const steps = workflow.locator('.hu-step-button');
  await expect(steps.first()).toBeVisible();
  return { overlay, workflow, steps };
}

test.describe('Fluxos com/sem licitação (Locação > Contratação > Jurídica > Nova unidade)', () => {
  test('Sem licitação: abre wizard sem etapa "Licitação"', async ({ page }) => {
    await gotoHome(page);
    await selectLocacaoContratacaoPJNova(page);

    // Garante switch desligado
    const switchBtn = page.locator('#switch-licitacao[role="switch"]');
    await expect(switchBtn).toHaveAttribute('aria-checked', /^(false|0)$/);

    const { workflow, steps } = await openWizard(page);
    // Não deve existir etapa com label "Licitação"
    await expect(workflow.getByRole('button', { name: /licitação/i })).toHaveCount(0);

    await expect(steps).toHaveCount(7);
    await expect(workflow.getByRole('button', { name: /propostas e consulta pública/i })).toHaveCount(1);
    await expect(workflow.getByRole('button', { name: /documentação do imóvel/i })).toHaveCount(1);
    await expect(workflow.getByRole('button', { name: /documentação do locador/i })).toHaveCount(1);
    await expect(workflow.getByRole('button', { name: /autorizações e laudo/i })).toHaveCount(1);
    await expect(workflow.getByRole('button', { name: /jurídico/i })).toHaveCount(1);
    await expect(workflow.getByRole('button', { name: /solicitar aprovação/i })).toHaveCount(1);
  });

  test('Com licitação: abre wizard com etapa "Licitação"', async ({ page }) => {
    await gotoHome(page);
    await selectLocacaoContratacaoPJNova(page);

    // Liga switch
    const switchBtn = page.locator('#switch-licitacao[role="switch"]');
    await switchBtn.click();
    await expect(switchBtn).toHaveAttribute('aria-checked', 'true');

    const { workflow, steps } = await openWizard(page);
    // Deve existir etapa com label "Licitação"
    await expect(workflow.getByRole('button', { name: /licitação/i })).toHaveCount(1);

    await expect(steps).toHaveCount(7);
    await expect(workflow.getByRole('button', { name: /propostas e consulta pública/i })).toHaveCount(0);
  });

  test('Qualificação obrigatória e rascunho persistente', async ({ page }) => {
    await gotoHome(page);
    await selectLocacaoContratacaoPJNova(page);
    const { workflow } = await openWizard(page);

    await workflow.getByRole('button', { name: /próximo/i }).click();
    await expect(workflow.getByRole('alert')).toContainText('Favor preencher');

    await workflow.locator('[data-field="unidade"]').fill('Agência Piloto');
    await workflow.locator('[data-field="endereco"]').fill('SBS, Brasília/DF');
    await workflow.locator('[data-field="valorGlobal"]').fill('250000');
    await workflow.locator('[data-field="responsavel"]').fill('Analista Piloto');
    await workflow.getByRole('button', { name: /salvar rascunho/i }).click();
    await workflow.getByRole('button', { name: /fechar/i }).click();

    await page.getByRole('button', { name: /iniciar/i }).click();
    await expect(page.getByTestId('hu-workflow').locator('[data-field="unidade"]')).toHaveValue('Agência Piloto');
  });
});
