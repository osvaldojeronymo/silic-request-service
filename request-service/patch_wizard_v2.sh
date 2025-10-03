#!/usr/bin/env bash
set -euo pipefail
echo "==> Patch SILIC request-service (wizard) v2 iniciado"

ROOT="$(pwd)"
readarray -d '' CSS_PATHS   < <(find "$ROOT" -type f -name "style.css" -path "*/assets/css/*" -print0 2>/dev/null || true)
readarray -d '' INDEX_HTMLS < <(find "$ROOT" -maxdepth 2 -type f -name "index.html" -print0 2>/dev/null || true)
readarray -d '' INDEX_JS    < <(find "$ROOT/assets/js" -type f -name "index.js" -print0 2>/dev/null || true)
readarray -d '' ALL_HTML    < <(find "$ROOT" -type f -name "*.html" -print0 2>/dev/null || true)

WIZ_HTMLS=()
for f in "${ALL_HTML[@]}"; do
  if grep -qiE "(wizard|stepper)" "$f"; then WIZ_HTMLS+=("$f"); fi
done

changed=()
CSS_APPEND='
/* --- PATCH: wizard layout improvements --- */
.wizard-header { position: sticky; top: 0; z-index: 3; background: #fff; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.wizard-steps  { position: sticky; top: 64px; z-index: 2; background: #fff; }
#wizard-modal-content { overflow: hidden; }
#wizard-modal-inner { display: flex; gap: 16px; }
.wizard-sidebar { max-width: 280px; min-width: 220px; padding: 12px; border-right: 1px solid #eee; }
.wizard-main   { flex: 1; padding: 16px; }
.wizard-footer { position: sticky; bottom: 0; background: #fff; padding: 12px 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; justify-content: flex-end; }
.wizard-close-btn { position: absolute; right: 8px; top: 8px; }
'

# 1) CSS
for css in "${CSS_PATHS[@]}"; do
  [ -e "$css.bak" ] || cp "$css" "$css.bak"
  if grep -qiE "@import\s+url\(['\"]https?://" "$css"; then
    sed -i -E "/@import\s+url\(['\"]https?:\/\/.*['\"]\)\s*;?/Id" "$css"
    changed+=("Removed remote @import -> $css")
  fi
  if ! grep -q "PATCH: wizard layout improvements" "$css"; then
    printf "\n%s\n" "$CSS_APPEND" >> "$css"
    changed+=("Appended wizard layout styles -> $css")
  fi
done

# 2) index.html: remover include direto
for ih in "${INDEX_HTMLS[@]}"; do
  [ -e "$ih.bak" ] || cp "$ih" "$ih.bak"
  before="$(wc -l < "$ih")"
  sed -i -E '/<script[^>]*src=["\x27][^"\x27]*wizard[^"\x27]*juridica[^"\x27]*\.js["\x27][^>]*><\/script>/Id' "$ih"
  after="$(wc -l < "$ih")"
  [ "$after" != "$before" ] && changed+=("Removed direct wizard-juridica.js include -> $ih")
done

# 3) wizard HTMLs: data-wizard-action
for wh in "${WIZ_HTMLS[@]}"; do
  [ -e "$wh.bak" ] || cp "$wh" "$wh.bak"
  content="$(cat "$wh")"; orig="$content"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnNext[^>]*)(>)/\1 data-wizard-action="next"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnNextStep[^>]*)(>)/\1 data-wizard-action="next"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnPrev[^>]*)(>)/\1 data-wizard-action="prev"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnBack[^>]*)(>)/\1 data-wizard-action="prev"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnCancel[^>]*)(>)/\1 data-wizard-action="cancel"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*id=["\x27]btnClose[^>]*)(>)/\1 data-wizard-action="close"\2/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*)(>)([[:space:]]*Avan[cç]ar[[:space:]]*<\/button>)/\1 data-wizard-action="next"\2\3/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*)(>)([[:space:]]*Voltar[[:space:]]*<\/button>)/\1 data-wizard-action="prev"\2\3/I')"
  content="$(echo "$content" | sed -E 's/(<button[^>]*)(>)([[:space:]]*Cancelar[[:space:]]*<\/button>)/\1 data-wizard-action="cancel"\2\3/I')"
  if [ "$content" != "$orig" ]; then printf "%s" "$content" > "$wh"; changed+=("Added data-wizard-action -> $wh"); fi
done

# 4) index.js: snippet licitação + lazy-load wizard
PATCH_SNIPPET='
// --- PATCH: sync licitacao switch and lazy-load wizard ---
(function(){
  try {
    const licSwitch = document.querySelector("#switch-licitacao, [data-switch-licitacao]");
    if (licSwitch){
      window._licitacaoSim = !!(licSwitch.checked || licSwitch.getAttribute("aria-checked") === "true");
      licSwitch.addEventListener("change", () => { window._licitacaoSim = !!licSwitch.checked; });
    }
    const openBtns = document.querySelectorAll("[data-open-wizard]");
    let wizardLoaded = false;
    async function ensureWizardJs(){
      if (wizardLoaded) return; wizardLoaded = true;
      const s = document.createElement("script"); s.src = "assets/js/wizard-juridica.js"; document.head.appendChild(s);
    }
    openBtns.forEach(btn=>{ btn.addEventListener("click", async ()=>{ await ensureWizardJs(); setTimeout(()=>{},0); }); });
  } catch(e){ console.warn("PATCH licitacao/wizard loader error", e); }
})();
'
for ij in "${INDEX_JS[@]}"; do
  [ -e "$ij.bak" ] || cp "$ij" "$ij.bak"
  if ! grep -q "PATCH: sync licitacao switch and lazy-load wizard" "$ij"; then
    printf "\n%s\n" "$PATCH_SNIPPET" >> "$ij"
    changed+=("Appended licitacao sync + wizard lazy-loader -> $ij")
  fi
done

echo "==> Arquivos alterados:"; for c in "${changed[@]}"; do echo " - $c"; done
echo "==> Patch v2 concluído. Backups .bak criados ao lado dos arquivos."
