// Renderização dinâmica do checklist de documentação (sem obrigatoriedade)
async function renderChecklist(containerId, checklistUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '<div>Carregando checklist...</div>';

  // 1. Carrega o JSON
  const resp = await fetch(window.withBase ? window.withBase(checklistUrl) : checklistUrl);
  const [checklist] = await resp.json();

  // 2. Renderiza cada seção e item
  container.innerHTML = '';
  const respostas = {}; // {itemId: {resposta, arquivo}}

  checklist.sections.forEach((section) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'checklist-section';
    sectionDiv.innerHTML = `<h4><b>${section.id})</b> ${section.title}</h4>`;

    // Orientação personalizada para a seção 'a'
    if (section.id === 'a') {
      const orientacao = document.createElement('p');
      orientacao.textContent = 'Inserir documentação.';
      orientacao.style.margin = '6px 0 10px 0';
      orientacao.style.fontStyle = 'italic';
      sectionDiv.appendChild(orientacao);
    }

    section.items.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'checklist-item';
      itemDiv.innerHTML = `
        <label>${item.label}</label><br>
        <textarea placeholder="Justifique ou responda..." rows="2" style="width:98%;margin-bottom:4px;"></textarea><br>
        <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"/><br>
        <span class="file-info" style="font-size:0.9em;color:#666"></span>
        <hr>
      `;
      const textarea = itemDiv.querySelector('textarea');
      const fileInput = itemDiv.querySelector('input[type=file]');
      const fileInfo = itemDiv.querySelector('.file-info');
      respostas[item.id] = { resposta: '', arquivo: null };

      textarea.addEventListener('input', (e) => {
        respostas[item.id].resposta = e.target.value;
      });
      fileInput.addEventListener('change', (e) => {
        respostas[item.id].arquivo = e.target.files[0] || null;
        fileInfo.textContent = respostas[item.id].arquivo
          ? `Arquivo: ${respostas[item.id].arquivo.name}`
          : '';
      });

      sectionDiv.appendChild(itemDiv);
    });

    container.appendChild(sectionDiv);
  });

  // 3. Botão para avançar (sem validação obrigatória)
  const btn = document.createElement('button');
  btn.textContent = 'Avançar';
  btn.onclick = function () {
    // Apenas exibe as respostas no console para teste
    console.log(respostas);
    alert('Checklist preenchido (teste)!');
  };
  container.appendChild(btn);
}

// Chamada automática ao carregar o passo (ajuste o id e caminho se necessário)
document.addEventListener('DOMContentLoaded', function () {
  renderChecklist(
    'root',
    window.withBase
      ? window.withBase('assets/data/checklists/documentacao-pj_nova_unidade.json')
      : 'assets/data/checklists/documentacao-pj_nova_unidade.json'
  );
});
// step-documentacao.js
// Renderer desacoplado para checklist de documentação
window.SILIC = window.SILIC || { draft: {} };

async function loadChecklistDoc(url) {
  const res = await fetch(window.withBase ? window.withBase(url) : url);
  return res.json();
}
function radio(name, value, id, label) {
  return `
    <label><input type="radio" name="${name}" value="${value}" id="${id}-${value}"> ${label}</label>
  `;
}
function itemRow(sectionId, item) {
  const name = `doc.${sectionId}.${item.id}.ans`;
  const fileId = `file-${sectionId}-${item.id}`;
  const urlId = `url-${sectionId}-${item.id}`;
  return `
    <div class="doc-item">
      <div class="doc-item-header"><strong>${item.label}</strong>${item.descricao ? `<div class='doc-item-desc'>${item.descricao}</div>` : ''}</div>
      <fieldset class="doc-item-body" role="radiogroup" aria-label="${item.label}">
        <legend class="sr-only">${item.label}</legend>
        ${radio(name, 'sim', item.id, 'Sim')}
        ${radio(name, 'nao', item.id, 'Não')}
        ${radio(name, 'na', item.id, 'N/A')}
      </fieldset>
      ${
        item.proof
          ? `
        <div class="doc-proof is-hidden" data-proof-for="${name}">
          <div class="wizard-link-input">
            <i class="fa-solid fa-link"></i>
            <span class="wizard-link-ou">URL</span>
            <input id="${urlId}" type="url" class="wizard-link-url" placeholder="Cole o link do documento"/>
          </div>
          <div style="margin-top:8px">
            <input id="${fileId}" type="file" accept=".pdf,.doc,.docx"/>
          </div>
        </div>`
          : ``
      }
      ${item.children ? item.children.map((child) => itemRow(sectionId, child)).join('') : ''}
    </div>`;
}
function sectionBlock(section) {
  return `
    <div class="item" active>
      <button class="header" tabindex="0"><i class="icon fa-regular fa-folder-open"></i>${section.title}</button>
      <div class="content">
        ${section.items.map((i) => itemRow(section.id, i)).join('')}
      </div>
    </div>`;
}
export async function renderStepDocumentacao(container) {
  const data = (
    await loadChecklistDoc(
      window.withBase
        ? window.withBase('assets/data/checklists/documentacao-pj_nova_unidade.json')
        : '/assets/data/checklists/documentacao-pj_nova_unidade.json'
    )
  )[0];
  container.innerHTML = '';
  // Pergunta condicional para crédito em favor de terceiro
  const perguntaDiv = document.createElement('div');
  perguntaDiv.style =
    'margin-bottom:18px;padding:12px 18px;background:#f5f7fa;border-radius:8px;font-size:1.08rem;color:#003366;';
  perguntaDiv.innerHTML = `
    <label style="font-weight:600;">Há crédito do aluguel em favor de terceiro? <span style='color:#d00'>*</span></label><br>
    <select id="creditoTerceiroPergunta" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #e7e7e7;font-size:1rem;max-width:340px;">
      <option value="">Selecione</option>
      <option value="sim">Sim</option>
      <option value="nao">Não</option>
    </select>
  `;
  container.appendChild(perguntaDiv);
  // Renderiza as seções do checklist
  data.sections.forEach((section) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.innerHTML = sectionBlock(section);
    container.appendChild(sectionDiv);
  });
}
