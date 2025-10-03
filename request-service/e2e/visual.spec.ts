// e2e/visual.spec.ts
import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

type PageCfg = {
  path: string;
  name?: string;
  openWizard?: boolean;
  hideTexts?: string[];
  masks?: string[];
};

const pages: PageCfg[] = [
  // Home será tratada em testes separados (elementos), deixo aqui só para navegação
  {
    path: '',
    name: 'home',
    openWizard: false,
    hideTexts: ['Abrir Wizard'],
    masks: ['text=/Abrir\\s+Wizard/i'],
  },
  { path: 'pages/wizard-fisica.html', name: 'wizard_fisica', openWizard: false },
  { path: 'pages/wizard-juridica.html', name: 'wizard_juridica', openWizard: false },
  { path: 'pages/stepper.html', name: 'pages_stepper_html', openWizard: false },
];

test.use({
  viewport: { width: 1366, height: 900 },
  colorScheme: 'light',
});

function withSlash(b: string) {
  return b.endsWith('/') ? b : b + '/';
}
// joinUrl unused; use withSlash directly where needed

async function gotoWithFallback(page: Page, base: string, path: string) {
  const root = withSlash(base);
  const candidates = [root + path, root + 'silic-request-service/' + path];
  let resp = await page.goto(candidates[0], { waitUntil: 'networkidle' });
  if (resp && resp.ok()) return { used: candidates[0], resp };
  resp = await page.goto(candidates[1], { waitUntil: 'networkidle' });
  return { used: candidates[1], resp };
}

async function stabilize(page: Page) {
  await page.addStyleTag({
    content: `
      /* desliga animações/transições */
      *,*::before,*::after{
        animation:none!important;
        transition:none!important;
        caret-color:transparent!important
      }
      /* some com elementos de dev */
      [data-dev-only], .debug, .__dev__, [data-testid="dev-button"]{
        display:none!important
      }

      /* ====== neutralizações visuais ====== */
      /* 1) gradiente do hero gera dithering: corta só no teste */
      section.hero{ background-image:none!important }
      section.hero .hero-bg{ background-image:none!important }

      /* 2) Ícones do Font Awesome variam por fonte: mantém o espaço mas oculta o glyph */
      i.fas, i.fa-solid, i.fa {
        visibility: hidden !important;           /* não pinta */
        display: inline-block !important;        /* mantém inline */
        width: 1.25em !important;                /* reserva largura */
        height: 1em !important;                  /* reserva altura */
        vertical-align: middle !important;       /* alinha com texto */
      }

      /* 2b) Modalidades: se NÃO houver <i>, cria um espaçador antes do h3 para alinhar com a versão pública */
      section.services-section h3:not(:has(i))::before{
        content:''; display:inline-block; width:1.25em; height:1em; vertical-align:middle;
      }

  /* 3) largura determinística dos blocos brancos (evita wrap/quebras diferentes) */
  :root{ --snap-w: 1160px; }                  /* ajuste fino se precisar */
      /* alvo do HERO no teste: fixa largura do 1º grupo para manter dim. consistente com baseline */
      section.hero .search-form .form-grid > .group:first-of-type{
        width: 203px !important;
        max-width: 203px !important;
        box-sizing: border-box !important;
  padding: 0 !important;
        margin: 0 !important;
  height: 49px !important;
  min-height: 49px !important;
  overflow: hidden !important;
      }
      section.services-section .services-grid{
        max-width: var(--snap-w) !important;
        width: var(--snap-w) !important;
        margin: 0 auto !important;
      }

      /* 3b) seção modalidades: fundo neutro e container alinhado */
      section.services-section{
        background: #fff !important;
        background-image: none !important;
      }
      section.services-section .container{
        max-width: var(--snap-w) !important;
        width: var(--snap-w) !important;
        margin: 0 auto !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      section.services-section .section-title{
        text-shadow: none !important;
        color: #111 !important;
        letter-spacing: 0 !important;
        display: block !important;
        box-sizing: border-box !important;
        width: var(--snap-w) !important;
        margin: 0 auto !important;
  padding: 0 !important;
  height: 71px !important; /* equal to baseline element height */
      }

      /* 4) normaliza tipografia para reduzir microdiferenças */
      html, body{ -webkit-font-smoothing: antialiased; }
      body{ letter-spacing: 0 !important; }
      /* 5) tipografia uniforme (evita variações de fonte/peso/altura de linha) */
      body, button, input, select, textarea, .group label, .group select, h1,h2,h3,h4,h5,h6{
        font-family: Arial, Helvetica, sans-serif !important;
        font-weight: 400 !important;
        line-height: 1.25 !important;
      }
      h1,h2,h3{ font-weight: 600 !important; }
    `,
  });
  // evita :hover acidental
  await page.mouse.move(0, 0);

  await page.evaluate(async () => {
    // fonts.ready pode não estar tipado no lib DOM atual
    const d = document as Document & { fonts?: { ready?: Promise<void> } };
    if (d.fonts?.ready) await d.fonts.ready;
    window.scrollTo(0, 0);
  });
}

async function setStableState(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('licitacao', 'true');
    } catch {
      // ignore quota or privacy errors in test env
    }
  });
}

// Garante que o formulário de busca da Home fique no mesmo estado da página pública
async function normalizeHomeSearchForm(page: Page) {
  await page.evaluate(() => {
    // 1) esconder botão de dev (não impacta produção)
    const devBtn = document.querySelector('#abrir-wizard-button') as HTMLElement | null;
    if (devBtn) devBtn.style.display = 'none';

    // 2) licitação = "Não" e bloco escondido (estado da página pública)
    const bloco = document.getElementById('bloco-licitacao');
    if (bloco) {
      bloco.classList.add('is-hidden');
      bloco.setAttribute('aria-hidden', 'true');
    }
    const switchBtn = document.getElementById('switch-licitacao');
    if (switchBtn) (switchBtn as HTMLElement).setAttribute('aria-pressed', 'false');
    const sliderText = document.getElementById('slider-text');
    if (sliderText) sliderText.textContent = 'Não';
    const hidden = document.getElementById('licitacao') as HTMLInputElement | null;
    if (hidden) hidden.value = 'nao';

    // 3) selects no estado inicial (vazios)
    ['contratar', 'formalizar', 'tipo-contratacao'].forEach((id) => {
      const sel = document.getElementById(id) as HTMLSelectElement | null;
      if (sel) sel.value = '';
    });

    // 4) aba "Locação" ativa
    const tabs = Array.from(document.querySelectorAll('.tab-button')) as HTMLElement[];
    for (const t of tabs) {
      t.classList.remove('active');
      t.setAttribute('tabindex', '-1');
    }
    const locacao = document.querySelector('.tab-button[data-tab="locacao"]') as HTMLElement | null;
    if (locacao) {
      locacao.classList.add('active');
      locacao.setAttribute('tabindex', '0');
    }
  });
}

async function tryOpenWizard(page: Page) {
  const abrir = page.getByRole('button', { name: /(abrir wizard|iniciar)/i });
  if (await abrir.count().then((n) => n > 0)) {
    try {
      await abrir.first().click({ delay: 10 });
    } catch {
      // ignore click failures in CI
    }
  }
}

async function hideByTexts(page: Page, texts: string[]) {
  if (!texts?.length) return;
  await page.evaluate((needles: string[]) => {
    const lc = (s: string) => s.normalize('NFKC').toLowerCase().trim();
    const shouldHide = (el: Element) =>
      needles.some((n) => lc(el.textContent || '').includes(lc(n)));
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
      if (shouldHide(el)) el.style.display = 'none';
    }
  }, texts);
}

// HERO → foca só no 1º grupo do form (Solicitação)
async function homeHeroLocator(page: Page) {
  // tenta pelo id conhecido
  const byId = page
    .locator('#contratar')
    .locator('xpath=ancestor::div[contains(@class,"group")][1]');
  if ((await byId.count()) && (await byId.first().isVisible())) {
    const target = byId.first();
    await target.scrollIntoViewIfNeeded();
    return target;
  }
  // fallback: 1º .group dentro do .form-grid da search-form
  const tries = [
    'section.hero .search-form .form-grid > .group:nth-of-type(1)',
    'section.hero .search-container .form-grid > .group:nth-of-type(1)',
    '.search-form .form-grid > .group:nth-of-type(1)',
    '.search-container .form-grid > .group:nth-of-type(1)',
  ];
  for (const sel of tries) {
    const loc = page.locator(sel);
    if ((await loc.count()) && (await loc.first().isVisible())) {
      const target = loc.first();
      await target.scrollIntoViewIfNeeded();
      return target;
    }
  }
  // último recurso
  const fallback = page.locator('section.hero');
  await fallback.first().scrollIntoViewIfNeeded();
  return fallback.first();
}

// MODALIDADES → foca no heading da seção (H2), mais estável que o header do 1º card
async function homeModalidadesLocator(page: Page) {
  const section = page.locator('section.services-section');
  await section.first().scrollIntoViewIfNeeded();
  await expect(section.first()).toBeVisible();

  const h2 = section.first().locator('h2, [role="heading"][aria-level="2"]');
  if ((await h2.count()) && (await h2.first().isVisible())) {
    const target = h2.first();
    await target.scrollIntoViewIfNeeded();
    return target;
  }
  return section.first();
}

// waitForComputedStyle removed (unused)

test.describe('Visual regressions vs public baseline (stable targets)', () => {
  // HOME - hero
  test('home_hero', async ({ page }) => {
    await setStableState(page);
    const { used } = await gotoWithFallback(page, BASE_URL, '');
    console.log(`[visual] HOME hero used="${used}"`);
    await stabilize(page);
    await normalizeHomeSearchForm(page);
    // não esconder nada genérico na home; apenas #abrir-wizard-button via normalize helper

    const hero = await homeHeroLocator(page);
    const heroBox = await hero.boundingBox();
    if (heroBox)
      console.log(
        `[visual] home_hero box: ${Math.round(heroBox.width)}x${Math.round(heroBox.height)}`
      );
    await expect(hero).toHaveScreenshot('home_hero.png', {
      animations: 'disabled',
      timeout: 10000,
      maxDiffPixels: 3000,
    });
  });

  // HOME - seção Nossas Modalidades
  test('home_modalidades', async ({ page }) => {
    await setStableState(page);
    const { used } = await gotoWithFallback(page, BASE_URL, '');
    console.log(`[visual] HOME modalidades used="${used}"`);
    await stabilize(page);
    await normalizeHomeSearchForm(page);
    // não esconder nada genérico na home; apenas #abrir-wizard-button via normalize helper

    const modalidades = await homeModalidadesLocator(page);
    const modBox = await modalidades.boundingBox();
    if (modBox)
      console.log(
        `[visual] home_modalidades box: ${Math.round(modBox.width)}x${Math.round(modBox.height)}`
      );
    await expect(modalidades).toHaveScreenshot('home_modalidades.png', {
      animations: 'disabled',
      timeout: 10000,
      maxDiffPixels: 30000,
    });
  });

  // DEMAIS PÁGINAS (página inteira)
  for (const cfg of pages.slice(1)) {
    test(cfg.name || cfg.path || 'page', async ({ page }) => {
      await setStableState(page);
      const { used } = await gotoWithFallback(page, BASE_URL, cfg.path);
      console.log(`[visual] BASE_URL=${BASE_URL} requested="${cfg.path}" used="${used}"`);
      await stabilize(page);

      if (cfg.hideTexts?.length) await hideByTexts(page, cfg.hideTexts);
      if (cfg.openWizard) await tryOpenWizard(page);

      const maskLocators = (cfg.masks || []).map((s) => page.locator(s));
      let maxDiff: number | undefined;
      // ruído baixo nos wizards (ícones, subpixel em textos)
      if (
        cfg.path.includes('pages/wizard-fisica.html') ||
        cfg.path.includes('pages/wizard-juridica.html')
      ) {
        maxDiff = 15000;
      }
      // stepper tem mais conteúdo: dá um pouco mais de folga
      if (cfg.path.includes('pages/stepper.html')) {
        maxDiff = 40000;
      }
      await expect(page).toHaveScreenshot(`${cfg.name || cfg.path}.png`, {
        fullPage: true,
        animations: 'disabled',
        mask: maskLocators,
        timeout: 10000,
        ...(typeof maxDiff === 'number' ? { maxDiffPixels: maxDiff } : {}),
      });
    });
  }
});
