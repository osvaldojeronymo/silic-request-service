(function () {
  "use strict";

  if (window.__SILIC_CONFIRMATION_ACTIONS_INIT__) return;
  window.__SILIC_CONFIRMATION_ACTIONS_INIT__ = true;

  let protocol;

  function selectedLabel(id, fallback) {
    const field = document.getElementById(id);
    const option = field && field.options && field.options[field.selectedIndex];
    return option && option.text ? option.text.trim() : fallback;
  }

  function buildProtocol() {
    if (protocol) return protocol;
    const now = new Date();
    const digits = (value) => String(value).padStart(2, "0");
    protocol = [
      "SILIC",
      now.getFullYear(),
      digits(now.getMonth() + 1),
      digits(now.getDate()),
      digits(now.getHours()),
      digits(now.getMinutes()),
      digits(now.getSeconds()),
    ].join("");
    return protocol;
  }

  function receiptData() {
    const activeTab = document.querySelector(".tab-button.active");
    const licitacao = document.getElementById("switch-licitacao");
    return {
      protocol: buildProtocol(),
      date: new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()),
      modality: activeTab ? activeTab.textContent.trim() : "Locação",
      request: selectedLabel("contratar", "Contratação"),
      person: selectedLabel("formalizar", "Jurídica"),
      purpose: selectedLabel("tipo-contratacao", "Nova unidade"),
      bidding:
        licitacao &&
        (licitacao.getAttribute("aria-checked") === "true" || licitacao.checked)
          ? "Sim"
          : "Não",
    };
  }

  function closeReceipt() {
    const receipt = document.getElementById("comprovante-solicitacao");
    if (receipt) receipt.remove();
  }

  function openReceipt() {
    closeReceipt();
    const data = receiptData();
    const receipt = document.createElement("div");
    receipt.id = "comprovante-solicitacao";
    receipt.setAttribute("role", "dialog");
    receipt.setAttribute("aria-modal", "true");
    receipt.setAttribute("aria-labelledby", "comprovante-titulo");
    receipt.setAttribute("tabindex", "-1");
    receipt.style.cssText =
      "position:fixed;inset:0;z-index:12000;background:rgba(0,0,0,.58);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box";
    receipt.innerHTML = `
      <section style="width:min(620px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;padding:32px;box-sizing:border-box;box-shadow:0 12px 40px rgba(0,0,0,.3);color:#1f2937">
        <h2 id="comprovante-titulo" style="margin:0 0 8px;color:#003f7d">Comprovante da solicitação</h2>
        <p style="margin:0 0 24px">Solicitação registrada com sucesso no protótipo SILIC 2.0.</p>
        <dl style="display:grid;grid-template-columns:minmax(150px,auto) 1fr;gap:10px 18px;margin:0">
          <dt style="font-weight:700">Protocolo</dt><dd data-receipt="protocol" style="margin:0"></dd>
          <dt style="font-weight:700">Data e hora</dt><dd data-receipt="date" style="margin:0"></dd>
          <dt style="font-weight:700">Modalidade</dt><dd data-receipt="modality" style="margin:0"></dd>
          <dt style="font-weight:700">Solicitação</dt><dd data-receipt="request" style="margin:0"></dd>
          <dt style="font-weight:700">Pessoa</dt><dd data-receipt="person" style="margin:0"></dd>
          <dt style="font-weight:700">Finalidade</dt><dd data-receipt="purpose" style="margin:0"></dd>
          <dt style="font-weight:700">Precedida de licitação</dt><dd data-receipt="bidding" style="margin:0"></dd>
        </dl>
        <div style="display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap;margin-top:28px">
          <button type="button" id="btnImprimirComprovante" style="border:1px solid #005ca9;background:#fff;color:#003f7d;border-radius:8px;padding:10px 18px;font-weight:700;cursor:pointer">Imprimir</button>
          <button type="button" id="btnFecharComprovante" style="border:0;background:#f39200;color:#003f7d;border-radius:8px;padding:10px 18px;font-weight:700;cursor:pointer">Fechar comprovante</button>
        </div>
      </section>
    `;

    Object.entries(data).forEach(([key, value]) => {
      const target = receipt.querySelector(`[data-receipt="${key}"]`);
      if (target) target.textContent = value;
    });
    receipt
      .querySelector("#btnFecharComprovante")
      .addEventListener("click", closeReceipt);
    receipt
      .querySelector("#btnImprimirComprovante")
      .addEventListener("click", () => window.print());
    receipt.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeReceipt();
    });

    document.body.appendChild(receipt);
    receipt.focus();
  }

  function closeWizardFlow() {
    closeReceipt();
    const overlay = document.getElementById("wizard-modal-overlay");
    if (typeof window.fecharWizard === "function") {
      window.fecharWizard();
    } else if (overlay) {
      overlay.style.display = "none";
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
      overlay.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== "function") return;
    if (target.closest("#btnComprovante")) {
      event.preventDefault();
      openReceipt();
    } else if (target.closest("#btnEncerrar")) {
      event.preventDefault();
      closeWizardFlow();
    }
  });

  window.SILICConfirmationActions = {
    openReceipt,
    closeReceipt,
    closeWizardFlow,
  };
})();
