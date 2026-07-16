import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await page.selectOption("#contratar", "contratar");
  await page.selectOption("#formalizar", "pessoa-juridica");
  await page.selectOption("#tipo-contratacao", "nova-unidade");
  await page.locator("#wizard-modal-content").evaluate((host) => {
    host.innerHTML = `
      <section aria-label="Confirmação">
        <button type="button" id="btnComprovante">Visualizar Comprovante</button>
        <button type="button" id="btnEncerrar">Encerrar</button>
      </section>
    `;
    const overlay = document.getElementById("wizard-modal-overlay");
    if (overlay) {
      overlay.style.display = "flex";
      overlay.style.visibility = "visible";
      overlay.style.opacity = "1";
      overlay.setAttribute("aria-hidden", "false");
    }
  });
});

test("Visualizar Comprovante exibe os dados da solicitação", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Visualizar Comprovante" }).click();

  const receipt = page.getByRole("dialog", {
    name: "Comprovante da solicitação",
  });
  await expect(receipt).toBeVisible();
  await expect(receipt).toContainText("SILIC");
  await expect(receipt).toContainText("Contratação");
  await expect(receipt).toContainText("Jurídica");
  await expect(receipt).toContainText("Nova unidade");

  await receipt.getByRole("button", { name: "Fechar comprovante" }).click();
  await expect(receipt).toHaveCount(0);
});

test("Encerrar fecha o fluxo e retorna à página inicial", async ({ page }) => {
  await page.getByRole("button", { name: "Encerrar" }).click();

  const overlay = page.locator("#wizard-modal-overlay");
  await expect(overlay).toBeHidden();
  await expect(overlay).toHaveAttribute("aria-hidden", "true");
});
