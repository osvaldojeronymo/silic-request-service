const __switchKitInit = (function (global) {
  const registry = new Map();

  function createSwitch({ id, text, mount, initial = false, pulse = true, onChange }) {
    // wrapper + label + "botão" (role="switch")
    const wrap = document.createElement('div');
    wrap.className = 'switch-wrap';

    const labelEl = document.createElement('label');
    labelEl.className = 'switch-text';
    labelEl.textContent = text;
    labelEl.htmlFor = id;

    // Label de estado visual
    const stateLabel = document.createElement('span');
    stateLabel.className = 'switch-state-label';
    stateLabel.style.cssText = 'margin-left:8px;font-weight:700;color:#1a237e;user-select:none;';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'switch';
    btn.id = id;
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-checked', initial ? 'true' : 'false');

    function get() {
      return btn.getAttribute('aria-checked') === 'true';
    }
    function set(v, { silent = false } = {}) {
      btn.setAttribute('aria-checked', v ? 'true' : 'false');
      stateLabel.textContent = v ? 'Sim' : 'Não';
      if (pulse && v) {
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 460);
      }
      if (!silent) {
        const detail = { id, value: v };
        btn.dispatchEvent(new CustomEvent('switch-change', { bubbles: true, detail }));
        if (typeof onChange === 'function') {
          onChange(v, detail);
        }
      }
    }

    btn.addEventListener('click', () => set(!get()));

    // monta na página
    set(initial, { silent: true });
    wrap.append(labelEl, btn, stateLabel);
    (mount || document.body).appendChild(wrap);

    const api = { id, el: btn, wrap, label: labelEl, get, set };
    registry.set(id, api);
    return api;
  }

  // Recupera API de um switch já criado
  function use(id) {
    return registry.get(id);
  }

  // Mostra/esconde um container conforme predicate()
  function showWhen(target, deps, predicate, display = 'flex') {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    const handler = () => {
      el.style.display = predicate() ? display : 'none';
    };
    deps.forEach((d) => d && d.addEventListener('change', handler));
    handler(); // estado inicial
    return () => deps.forEach((d) => d && d.removeEventListener('change', handler));
  }

  global.SwitchKit = { createSwitch, use, showWhen };
  return global.SwitchKit;
})(window);
// expõe a referência para evitar expressão solta e manter side effects
window.__switchKitInit = __switchKitInit;
