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
          <div>
            <label for="tipoContratacaoDoc" style="font-weight:600;">Tipo de Contratação</label><br>
            <select id="tipoContratacaoDoc" name="tipoContratacaoDoc" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="Locação">Locação</option>
              <option value="Cessão">Cessão</option>
              <option value="Comodato">Comodato</option>
            </select>
          </div>
          <div>
            <label for="tipoLocadorDoc" style="font-weight:600;">Tipo de Locador</label><br>
            <select id="tipoLocadorDoc" name="tipoLocadorDoc" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="Pessoa Física">Pessoa Física</option>
              <option value="Pessoa Jurídica">Pessoa Jurídica</option>
              <option value="Órgão Público">Órgão Público</option>
            </select>
          </div>
          <div>
            <label for="terceirosDoc" style="font-weight:600;">Terceiros Beneficiários?</label><br>
            <select id="terceirosDoc" name="terceirosDoc" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div id="documentosChecklist" style="margin-top:18px;"></div>
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
            <label for="complianceCheck" style="font-weight:600;">Checklist de Compliance</label><br>
            <ul style="margin:12px 0 0 18px;">
              <li><input type="checkbox" id="comp1"> <label for="comp1">Documentação regular</label></li>
              <li><input type="checkbox" id="comp2"> <label for="comp2">Sem pendências legais</label></li>
              <li><input type="checkbox" id="comp3"> <label for="comp3">Aprovação do setor responsável</label></li>
            </ul>
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
          <div id="dadosBancariosJuridica" style="display:none;">
            <div>
              <label for="cnpjTitularConta" style="font-weight:600;">CNPJ do Titular da Conta</label><br>
              <input type="text" id="cnpjTitularConta" name="cnpjTitularConta" placeholder="Ex: 12.345.678/0001-90" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
            <div>
              <label for="valorAdjudicado" style="font-weight:600;">Valor Adjudicado</label><br>
              <input type="text" id="valorAdjudicado" name="valorAdjudicado" placeholder="Ex: R$ 100.000,00" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;">
            </div>
            <div>
              <button type="button" id="adicionarLocadorJuridica" style="background:#F39200;color:#003366;font-weight:600;padding:8px 18px;border:none;border-radius:8px;font-size:1.05rem;cursor:pointer;margin-top:10px;">Adicionar Locador</button>
            </div>
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

      // Checklist dinâmico
      fetch('../assets/js/documentacao.json')
        .then(res => res.json())
        .then(data => {
          const contexto = {
            modalidade: document.getElementById('tipoContratacaoDoc').value,
            tipoPessoa: document.getElementById('tipoLocadorDoc').value,
            terceiros: document.getElementById('terceirosDoc').value
          };
          const checklistDiv = document.getElementById('documentosChecklist');
          checklistDiv.innerHTML = '';
          data.documentacao.forEach(cat => {
            // Filtra documentos por contexto
            const docsFiltrados = (cat.documentos || []).filter(doc => {
              let aplica = doc.aplica || cat.aplicabilidade || [];
              if (aplica.includes('Todas')) return true;
              if (aplica.includes(contexto.modalidade)) return true;
              if (aplica.includes(contexto.tipoPessoa)) return true;
              if (aplica.includes('Quando houver terceiros beneficiários') && contexto.terceiros === 'Sim') return true;
              return false;
            });
            if (docsFiltrados.length) {
              // Renderiza acordeon
              const acc = document.createElement('div');
              acc.className = 'br-accordion';
              acc.innerHTML = `<button class="br-accordion-btn" type="button">${cat.categoria}</button><div class="br-accordion-content">${docsFiltrados.map(doc => `
                <div class="checklist-item">
                  <div class="checklist-title">${doc.titulo}</div>
                  <div class="checklist-desc">${doc.descricao}</div>
                  <div class="checklist-toggle">
                    <span class="${doc.obrigatorio ? 'obrigatorio' : 'opcional'}">
                      <i class="fas fa-${doc.obrigatorio ? 'exclamation-circle' : 'check-circle'}"></i> ${doc.obrigatorio ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                </div>`).join('')}</div>`;
              checklistDiv.appendChild(acc);
            }
          });
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