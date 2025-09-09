
/* wizard-modal.js - vanilla JS, event-delegated wizard controller
 * Works with dynamically injected HTML (innerHTML/fetch).
 * Author: ChatGPT (for Osvaldo)
 */
(function () {
  'use strict';

  // Utilities
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // State container
  const Wizard = {
    current: 0,
    steps: [],
    initialized: false
  };

  // Open modal and (optionally) load HTML into it
  async function abrirWizardHtml(url) {
    const overlay = $('#wizard-modal-overlay');
    const inner   = $('#wizard-modal-inner');
    const content = $('#wizard-modal-content');

    if (!overlay || !inner || !content) {
      console.warn('[wizard] Elementos do modal não encontrados.');
      return;
    }

    // Open the modal visually
    overlay.style.display   = 'flex';
    overlay.style.visibility = 'visible';
    overlay.style.opacity    = '1';
    overlay.removeAttribute('aria-hidden');

    // Optional: load external HTML into content
    if (url) {
      try {
        content.innerHTML = '<div style="padding:16px">Carregando...</div>';
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        content.innerHTML = html;
      } catch (err) {
        console.error('[wizard] Falha ao carregar HTML:', err);
        content.innerHTML = `<div style="padding:16px;color:#b00020">Erro ao carregar conteúdo: ${String(err)}</div>`;
      }
    }

    // Ensure events & steps are wired
    initWizard();
  }

  // Close modal helper
  function fecharWizard() {
    const overlay = $('#wizard-modal-overlay');
    const content = $('#wizard-modal-content');
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    // Optional: clear content if you want a clean slate next open
    if (content) {
      // content.innerHTML = ''; // keep or clear depending on your flow
    }
  }

  // Initialize event delegation once
  function initWizard() {
    const content = $('#wizard-modal-content');
    if (!content) return;

    // Build steps list (panels marked with .wizard-step and data-step-index)
    Wizard.steps = $$('.wizard-step', content)
      .sort((a,b) => (Number(a.dataset.stepIndex)||0) - (Number(b.dataset.stepIndex)||0));

    // If no explicit panels, try ARIA role="tabpanel"
    if (Wizard.steps.length === 0) {
      Wizard.steps = $$('[role="tabpanel"]', content);
      Wizard.steps.forEach((el, i) => el.dataset.stepIndex ??= String(i));
    }

    // Default to first step active
    Wizard.current = Math.max(0, Math.min(Wizard.current, Math.max(0, Wizard.steps.length - 1)));
    updateStep();

    // Wire delegated clicks just once
    if (!Wizard.initialized) {
      document.addEventListener('click', onDelegatedClick, true);
      document.addEventListener('keydown', onKeydown);
      Wizard.initialized = true;
    }
  }

  // Event delegation for any button/link with [data-wizard-action]
  function onDelegatedClick(evt) {
    const trigger = evt.target.closest('[data-wizard-action]');
    if (!trigger) return;

    const action = trigger.getAttribute('data-wizard-action');
    if (!action) return;

    // Prevent default for <button type="submit"> or <a href="#">
    evt.preventDefault();

    switch (action) {
      case 'next':
        goToStep(Wizard.current + 1);
        break;
      case 'prev':
        goToStep(Wizard.current - 1);
        break;
      case 'goto': {
        const idx = Number(trigger.getAttribute('data-step-index'));
        if (!Number.isNaN(idx)) goToStep(idx);
        break;
      }
      case 'cancel':
      case 'close':
        fecharWizard();
        break;
      default:
        console.warn('[wizard] Ação desconhecida:', action);
    }
  }

  // Keyboard UX: Esc closes, Ctrl+ArrowRight/Left navigate
  function onKeydown(evt) {
    if (evt.key === 'Escape') {
      fecharWizard();
      return;
    }
    if (evt.ctrlKey && (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft')) {
      evt.preventDefault();
      goToStep(Wizard.current + (evt.key === 'ArrowRight' ? 1 : -1));
    }
  }

  // Step switcher
  function goToStep(nextIndex) {
    if (Wizard.steps.length === 0) return;
    const clamped = Math.max(0, Math.min(nextIndex, Wizard.steps.length - 1));
    if (clamped === Wizard.current) return;
    Wizard.current = clamped;
    updateStep();
  }

  // UI update for active panel + header bullets (if present)
  function updateStep() {
    const content = $('#wizard-modal-content');
    if (!content) return;

    Wizard.steps.forEach((panel, i) => {
      const active = i === Wizard.current;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    // Optional: reflect state on header items with [data-step-index]
    const headers = $$('[data-step-index]', content);
    headers.forEach((el) => {
      const i = Number(el.getAttribute('data-step-index'));
      el.classList.toggle('is-active', i === Wizard.current);
      el.setAttribute('aria-selected', i === Wizard.current ? 'true' : 'false');
      el.setAttribute('tabindex', i === Wizard.current ? '0' : '-1');
    });

    // Enable/disable buttons if they have data-bound attributes
    const btnPrev = $('[data-wizard-action="prev"]', content);
    const btnNext = $('[data-wizard-action="next"]', content);
    if (btnPrev) btnPrev.disabled = (Wizard.current === 0);
    if (btnNext) btnNext.disabled = (Wizard.current === Wizard.steps.length - 1);
  }

  // Public API on window for existing code compatibility
  window.abrirWizardHtml = abrirWizardHtml;
  window.fecharWizard    = fecharWizard;
  window.goToStep        = goToStep;
  window.initWizard      = initWizard;

  // Auto-bind if modal is already on screen (e.g., HTML embedded on page)
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = $('#wizard-modal-overlay');
    if (overlay) {
      initWizard();
    }
  });
})();
