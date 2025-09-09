          // d) Documentação do(s) locador(es)
          const secaoD = checklist.sections.find(sec => sec.id === 'd');
          if (secaoD) {
            const sectionDivD = document.createElement('div');
            sectionDivD.className = 'checklist-section';
            sectionDivD.innerHTML = `<h4><b>d)</b> Documentação do(s) locador(es)</h4>`;
            const orientacaoD = document.createElement('p');
            orientacaoD.textContent = 'Por favor, insira a documentação do(s) locador(es).';
            orientacaoD.style.margin = '6px 0 10px 0';
            orientacaoD.style.fontStyle = 'italic';
            sectionDivD.appendChild(orientacaoD);
            const itemDivD = document.createElement('div');
            itemDivD.className = 'checklist-item';
            itemDivD.innerHTML = `
              <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
              <span class="file-info" style="font-size:0.9em;color:#666"></span>
              <hr>
            `;
            sectionDivD.appendChild(itemDivD);
            checklistDiv.appendChild(sectionDivD);
          }

          // e) Documentação para crédito do valor do aluguel
          const secaoE = checklist.sections.find(sec => sec.id === 'e');
          if (secaoE) {
            const sectionDivE = document.createElement('div');
            sectionDivE.className = 'checklist-section';
            sectionDivE.innerHTML = `<h4><b>e)</b> Documentação para crédito do valor do aluguel</h4>`;
            const orientacaoE = document.createElement('p');
            orientacaoE.textContent = 'Por favor, insira a documentação dos dados bancários.';
            orientacaoE.style.margin = '6px 0 10px 0';
            orientacaoE.style.fontStyle = 'italic';
            sectionDivE.appendChild(orientacaoE);
            const itemDivE = document.createElement('div');
            itemDivE.className = 'checklist-item';
            itemDivE.innerHTML = `
              <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
              <span class="file-info" style="font-size:0.9em;color:#666"></span>
              <hr>
            `;
            sectionDivE.appendChild(itemDivE);
            checklistDiv.appendChild(sectionDivE);
          }
function initWizardJuridica() {
  const steps = [];
  if (window._licitacaoSim) {
    steps.push({
      label: 'Licitação',
      icon: '<i class="fas fa-gavel"></i>',
      content: `
        <form id="licitForm" style="display:flex;flex-direction:column;gap:18px;">
          <div>
            <label for="parteRelacionadaDoc" style="font-weight:600;">Existe Parte Relacionada?</label><br>
            <select id="parteRelacionadaDoc" name="parteRelacionadaDoc" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label for="tipoUnidade" style="font-weight:600;">Tipo de Unidade</label><br>
            <select id="tipoUnidade" name="tipoUnidade" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="Rede Varejo">Rede Varejo</option>
              <option value="Demais unidades">Demais unidades</option>
            </select>
          </div>
          <div class="wizard-form-row">
            <div>
              <label for="editalId" style="font-weight:600;">Identificação do Edital</label><br>
              <input type="text" id="editalId" name="editalId" placeholder="Ex: 123/2025" style="padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
            <div>
              <label for="repCaixa" style="font-weight:600;">Representante CAIXA</label><br>
              <input type="text" id="repCaixa" name="repCaixa" placeholder="Ex: 123456 - João Silva" style="padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
          </div>
          <div class="wizard-form-row">
            <div>
              <label for="valorMin" style="font-weight:600;">Valor Mínimo Ofertado</label><br>
              <input type="text" id="valorMin" name="valorMin" placeholder="Ex: R$ 100.000,00" style="padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
            <div>
              <label for="valorMax" style="font-weight:600;">Valor Máximo Ofertado</label><br>
              <input type="text" id="valorMax" name="valorMax" placeholder="Ex: R$ 200.000,00" style="padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="font-weight:600;"><i class="fas fa-upload" style="margin-right:6px;"></i> Edital/Minuta do Contrato/Termo de Cessão</label><br>
              <input type="file" id="uploadEdital" name="uploadEdital" style="margin-top:6px;">
              <div style="font-size:0.97rem;color:#b3b3b3;margin-top:2px;">Selecione um arquivo PDF ou DOCX</div>
            </div>
            <div>
              <label style="font-weight:600;"><i class="fas fa-upload" style="margin-right:6px;"></i> Análise do Edital/Minuta/Termo</label><br>
              <input type="file" id="uploadAnalise" name="uploadAnalise" style="margin-top:6px;">
              <div style="font-size:0.97rem;color:#b3b3b3;margin-top:2px;">Selecione um arquivo PDF ou DOCX</div>
            </div>
            <div>
              <label style="font-weight:600;"><i class="fas fa-upload" style="margin-right:6px;"></i> Comprovação de Status de Vencedora</label><br>
              <input type="file" id="uploadStatus" name="uploadStatus" style="margin-top:6px;">
              <div style="font-size:0.97rem;color:#b3b3b3;margin-top:2px;">Selecione um arquivo PDF ou DOCX</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;">
            <button type="button" id="btnCancelWizard" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Cancelar</button>
            <button type="button" id="btnNextStep" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Avançar</button>
          </div>
        </form>
      `
    });
  }
  steps.push(
    {
      label: 'Documentação',
      icon: '<i class="fas fa-file-alt"></i>',
      content: `
        <form id="docForm" style="display:flex;flex-direction:column;gap:18px;">
          <div id="documentosChecklist" style="margin-top:0;"></div>
          <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;">
            <button type="button" id="btnPrevStepDoc" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Voltar</button>
            <button type="button" id="btnNextStepDoc" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Avançar</button>
          </div>
        </form>
      `
    },
    {
      label: 'Compliance',
      icon: '<i class="fas fa-shield-alt"></i>',
      content: `
        <form id="complianceForm" style="display:flex;flex-direction:column;gap:18px;">
          <div>
            <label for="compliance1" style="font-weight:600;">Documentação regular</label><br>
            <textarea id="compliance1" name="compliance1" rows="2" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;"></textarea>
          </div>
          <div>
            <label for="compliance2" style="font-weight:600;">Pendências legais</label><br>
            <textarea id="compliance2" name="compliance2" rows="2" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;"></textarea>
          </div>
          <div>
            <label for="compliance3" style="font-weight:600;">Aprovação do setor responsável</label><br>
            <textarea id="compliance3" name="compliance3" rows="2" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;"></textarea>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;">
            <button type="button" id="btnPrevStepCompliance" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Voltar</button>
            <button type="button" id="btnNextStepCompliance" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Avançar</button>
          </div>
        </form>
      `
    },
    {
      label: 'Jurídico',
      icon: '<i class="fas fa-balance-scale"></i>',
      content: `
        <form id="juridicoForm" style="display:flex;flex-direction:column;gap:18px;">
          <div>
            <label for="analiseJuridica" style="font-weight:600;">Análise Jurídica</label><br>
            <textarea id="analiseJuridica" name="analiseJuridica" rows="4" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;"></textarea>
          </div>
          <div>
            <label for="riscosJuridicos" style="font-weight:600;">Riscos Identificados</label><br>
            <textarea id="riscosJuridicos" name="riscosJuridicos" rows="3" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;"></textarea>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;">
            <button type="button" id="btnPrevStepJuridico" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Voltar</button>
            <button type="button" id="btnNextStepJuridico" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Avançar</button>
          </div>
        </form>
      `
    },
    {
      label: 'Financeiro',
      icon: '<i class="fas fa-dollar-sign"></i>',
      content: `
        <form id="financeiroForm" style="display:flex;flex-direction:column;gap:18px;">
          <div>
            <label for="formaPagamentoJuridica" style="font-weight:600;">Forma de Pagamento</label><br>
            <select id="formaPagamentoJuridica" name="formaPagamentoJuridica" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="boleto">Boleto</option>
              <option value="transferencia">Transferência</option>
              <option value="pix">PIX</option>
            </select>
          </div>
          <div>
            <label for="valorAluguel" style="font-weight:600;">Valor do Aluguel</label><br>
            <input type="text" id="valorAluguel" name="valorAluguel" placeholder="Ex: R$ 2.500,00" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="dataVencimento" style="font-weight:600;">Data de Vencimento</label><br>
            <input type="date" id="dataVencimento" name="dataVencimento" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="banco" style="font-weight:600;">Banco</label><br>
            <input type="text" id="banco" name="banco" placeholder="Ex: Banco do Brasil" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="agencia" style="font-weight:600;">Agência</label><br>
            <input type="text" id="agencia" name="agencia" placeholder="Ex: 1234-5" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="conta" style="font-weight:600;">Conta</label><br>
            <input type="text" id="conta" name="conta" placeholder="Ex: 98765-4" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="beneficiario" style="font-weight:600;">Nome do Beneficiário</label><br>
            <input type="text" id="beneficiario" name="beneficiario" placeholder="Ex: João da Silva" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div>
            <label for="cpfCnpj" style="font-weight:600;">CPF/CNPJ do Beneficiário</label><br>
            <input type="text" id="cpfCnpj" name="cpfCnpj" placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;">
            <button type="button" id="btnPrevStepFinanceiro" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Voltar</button>
            <button type="button" id="btnNextStepFinanceiro" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Avançar</button>
          </div>
        </form>
      `
    },
    {
      label: 'Confirmação',
      icon: '<i class="fas fa-check"></i>',
      content: `
        <div style="text-align:center;padding:32px 0;">
          <div style="font-size:1.25rem;font-weight:700;color:#003366;margin-bottom:18px;">Solicitação concluída!</div>
          <div style="font-size:1.05rem;color:#444;margin-bottom:18px;">Sua solicitação foi registrada com sucesso.<br>Em breve você receberá um retorno do responsável.</div>
          <button id="btnComprovante" style="background:#F39200;color:#003366;font-weight:700;padding:10px 28px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Visualizar Comprovante</button>
          <div style="margin-top:24px;">
            <button id="btnNovaSolicitacao" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;margin-right:12px;">Nova Solicitação</button>
            <button id="btnEncerrar" style="background:#eee;color:#003366;font-weight:600;padding:10px 24px;border:none;border-radius:8px;font-size:1.08rem;cursor:pointer;">Encerrar</button>
          </div>
        </div>
      `
    }
  );
  let currentStep = 0;
  function renderWizard() {
    // Steps
    const stepsDiv = document.getElementById('wizardSteps');
    stepsDiv.innerHTML = '';
    steps.forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'wizard-step' + (idx === currentStep ? ' active' : idx < currentStep ? ' completed' : '');
      stepDiv.innerHTML = `<div class="wizard-icon">${step.icon}</div><div class="wizard-label">${step.label}</div>`;
      stepsDiv.appendChild(stepDiv);
    });
    // Content
    document.getElementById('wizardContent').innerHTML = steps[currentStep].content;

    // Handlers e funcionalidades dos botões e campos
    if (currentStep === 0) {
      // Passo 1 - Licitação
      document.getElementById('btnNextStep').onclick = function() {
        // Validações e lógica do passo 1
        // Se tudo certo, avança para o próximo passo
        currentStep++;
        renderWizard();
      };
      document.getElementById('btnCancelWizard').onclick = function() {
        // Lógica para cancelar o wizard
      };
    } else if (currentStep === 1) {
      // Passo 2 - Documentação
      document.getElementById('btnPrevStepDoc').onclick = function() {
        currentStep--;
        renderWizard();
      };
      document.getElementById('btnNextStepDoc').onclick = function() {
        // Validações e lógica do passo 2
        currentStep++;
        renderWizard();
      };

      // Preencher selects automaticamente com valores do sessionStorage
      const tipoContratacaoSalvo = sessionStorage.getItem('tipoContratacao') || '';
      const tipoLocadorSalvo = sessionStorage.getItem('tipoLocador') || '';
      const selectTipoContratacao = document.getElementById('tipoContratacaoDoc');
      const selectTipoLocador = document.getElementById('tipoLocadorDoc');
      if (selectTipoContratacao) selectTipoContratacao.value = tipoContratacaoSalvo;
      if (selectTipoLocador) selectTipoLocador.value = tipoLocadorSalvo;

      // Checklist dinâmico: exibe apenas a seção 'a' do checklist oficial
      fetch('assets/data/checklists/documentacao-pj_nova_unidade.json')
        .then(res => res.json())
        .then(data => {
          const checklist = data[0];
          const checklistDiv = document.getElementById('documentosChecklist');
          checklistDiv.innerHTML = '';

          // a) Justificativas
          const secaoA = checklist.sections.find(sec => sec.id === 'a');
          if (secaoA) {
            const sectionDivA = document.createElement('div');
            sectionDivA.className = 'checklist-section';
            sectionDivA.innerHTML = `<h4><b>a)</b> Justificativas</h4>`;
            const orientacaoA = document.createElement('p');
            orientacaoA.textContent = 'Por favor, insira a documentação que justifica a sua solicitação.';
            orientacaoA.style.margin = '6px 0 10px 0';
            orientacaoA.style.fontStyle = 'italic';
            sectionDivA.appendChild(orientacaoA);
            const itemDivA = document.createElement('div');
            itemDivA.className = 'checklist-item';
            itemDivA.innerHTML = `
              <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
              <span class="file-info" style="font-size:0.9em;color:#666"></span>
              <hr>
            `;
            sectionDivA.appendChild(itemDivA);
            checklistDiv.appendChild(sectionDivA);
          }

          // b) Laudo de Avaliação do imóvel
          const secaoB = checklist.sections.find(sec => sec.id === 'b');
          if (secaoB) {
            const sectionDivB = document.createElement('div');
            sectionDivB.className = 'checklist-section';
            sectionDivB.innerHTML = `<h4><b>b)</b> Laudo de Avaliação do imóvel</h4>`;
            const orientacaoB = document.createElement('p');
            orientacaoB.textContent = 'Por favor, insira a documentação pertinente à avaliação do imóvel.';
            orientacaoB.style.margin = '6px 0 10px 0';
            orientacaoB.style.fontStyle = 'italic';
            sectionDivB.appendChild(orientacaoB);
            const itemDivB = document.createElement('div');
            itemDivB.className = 'checklist-item';
            itemDivB.innerHTML = `
              <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
              <span class="file-info" style="font-size:0.9em;color:#666"></span>
              <hr>
            `;
            sectionDivB.appendChild(itemDivB);
            checklistDiv.appendChild(sectionDivB);
          }

          // c) Documentação do imóvel
          const secaoC = checklist.sections.find(sec => sec.id === 'c');
          if (secaoC) {
            const sectionDivC = document.createElement('div');
            sectionDivC.className = 'checklist-section';
            sectionDivC.innerHTML = `<h4><b>c)</b> Documentação do imóvel</h4>`;
            const orientacaoC = document.createElement('p');
            orientacaoC.textContent = 'Por favor, insira a documentação do imóvel.';
            orientacaoC.style.margin = '6px 0 10px 0';
            orientacaoC.style.fontStyle = 'italic';
            sectionDivC.appendChild(orientacaoC);
            const itemDivC = document.createElement('div');
            itemDivC.className = 'checklist-item';
            itemDivC.innerHTML = `
              <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
              <span class="file-info" style="font-size:0.9em;color:#666"></span>
              <hr>
            `;
            sectionDivC.appendChild(itemDivC);
            checklistDiv.appendChild(sectionDivC);
          }
        });
    } else if (currentStep === 2) {
      // Passo 3 - Compliance
      document.getElementById('btnPrevStepCompliance').onclick = function() {
        currentStep--;
        renderWizard();
      };
      document.getElementById('btnNextStepCompliance').onclick = function() {
        // Validações e lógica do passo 3
        currentStep++;
        renderWizard();
      };
    } else if (currentStep === 3) {
      // Passo 4 - Jurídico
      document.getElementById('btnPrevStepJuridico').onclick = function() {
        currentStep--;
        renderWizard();
      };
      document.getElementById('btnNextStepJuridico').onclick = function() {
        // Validações e lógica do passo 4
        currentStep++;
        renderWizard();
      };
    } else if (currentStep === 4) {
      // Passo 5 - Financeiro
      document.getElementById('btnPrevStepFinanceiro').onclick = function() {
        currentStep--;
        renderWizard();
      };
      document.getElementById('btnNextStepFinanceiro').onclick = function() {
        // Validações e lógica do passo 5
        currentStep++;
        renderWizard();
      };
    } else if (currentStep === 5) {
      // Passo 6 - Confirmação
      document.getElementById('btnNovaSolicitacao').onclick = function() {
        currentStep = 0;
        renderWizard();
      };
      document.getElementById('btnEncerrar').onclick = function() {
        // Lógica para encerrar
      };
    }
  }
  renderWizard();
}
// Chame initWizardJuridica() ao abrir o wizard