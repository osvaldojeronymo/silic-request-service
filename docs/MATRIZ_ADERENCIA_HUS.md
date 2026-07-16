# Matriz de aderência — HUs de locação

Esta matriz relaciona os requisitos do pacote `SILIC_Locacao_Nova_Unidade_v1.0` à implementação do protótipo. “Implementado no piloto” significa comportamento executável no navegador, com persistência local. Integrações corporativas permanecem simuladas.

| ID | Requisito | Etapa | Implementação | Teste/aceite |
|---|---|---|---|---|
| RF-001 | Número SAP opcional | Visão geral | Implementado | Campo aceita vazio |
| RF-002 | Nome da unidade obrigatório | Visão geral | Implementado | Impede avanço vazio |
| RF-003 | Endereço obrigatório | Visão geral | Implementado | Impede avanço vazio |
| RF-004 | Valor global obrigatório | Visão geral | Implementado | Impede avanço vazio |
| RF-005 | Exibição condicional da licitação | Jornada | Implementado | Com switch exibe Licitação |
| RF-006 | Exibição condicional das propostas | Jornada | Implementado | Sem licitação exibe Propostas |
| RF-007 | Dados do edital e representante | Licitação | Implementado | Campos obrigatórios |
| RF-008 | Valores mínimo e máximo | Licitação | Implementado | Campos numéricos obrigatórios |
| RF-009 | Evidências do certame | Licitação | Implementado | Três tipos de anexo obrigatórios |
| RF-010 | Matrícula, IPTU e permissão bancária | Documentação do imóvel | Implementado | Tipos obrigatórios |
| RF-011 | Observações do imóvel | Documentação do imóvel | Implementado | Campo textual |
| RF-012 | Locador PF ou PJ | Documentação do locador | Implementado | Inclusão, edição e exclusão |
| RF-013 | Parte relacionada | Documentação do locador | Implementado | Campo por locador |
| RF-014 | Múltiplos locadores e percentuais | Documentação do locador | Implementado | Tabela CRUD |
| RF-015 | Representante legal | Documentação do locador | Implementado | Campos condicionais |
| RF-016 | Recebedor divergente | Documentação do locador | Implementado | Campos condicionais PF/PJ |
| RF-017 | Pré-comprometimento e vencimento | Documentação do locador | Implementado | Campos obrigatórios |
| RF-018 | Forma de pagamento e dados bancários | Documentação do locador | Implementado | Banco/agência/conta condicionais |
| RF-019 | Busca por consulta pública | Propostas | Simulado | Retorno local determinístico |
| RF-020 | Cadastro manual de proposta | Propostas | Implementado | Inclusão pelo usuário |
| RF-021 | Escolha/recusa e justificativa | Propostas | Implementado | Status e justificativa obrigatórios |
| RF-022 | Detalhamento de proposta | Propostas | Implementado | Ação Detalhar |
| RF-023 | Justificativa, custo-benefício e estratégia | Autorizações e laudo | Implementado | Campos obrigatórios |
| RF-024 | Busca de Plano de Aquisições | Autorizações e laudo | Simulado | Retorno local |
| RF-025 | RTA e regra de área superior a 550 m² | Autorizações e laudo | Implementado | Campos condicionais |
| RF-026 | Metadados e valores do laudo | Autorizações e laudo | Implementado | Campos obrigatórios |
| RF-027 | Negociação contratual | Autorizações e laudo | Implementado | Vigência, carência, reajuste e modalidade |
| RF-028 | Segurança, dados pessoais e riscos | Autorizações e laudo | Implementado | Descrições condicionais |
| RF-029 | Consulta/análise jurídica | Jurídico | Implementado | Texto e anexo obrigatórios |
| RF-030 | Gestão de anexos | Todas as etapas | Implementado | Adicionar, substituir, baixar e excluir |
| RF-031 | Limite de 2 MB | Anexos/ZIP | Implementado | Bloqueia arquivo, conjunto ou ZIP excedente |
| RF-032 | Salvar e retomar rascunho | Jornada | Implementado | `localStorage` |
| RF-033 | Validação antes da aprovação | Aprovação | Implementado | Destaca aba e foca primeira pendência |
| RF-034 | Analista solicita aprovação | Aprovação | Implementado | Muda para Aguardando aprovação |
| RF-035 | Gestor solicita ajuste | Aprovação | Implementado | Justificativa, notificação e Pendente Ajuste |
| RF-036 | Analista confirma ajuste | Aprovação | Implementado | Muda para Aguardando envio |
| RF-037 | Gestor envia à contratação | Aprovação | Implementado | Confirmação e Enviada pelo gestor |
| RF-038 | Contratos inicia análise | Aprovação | Implementado | Muda para Em análise |
| RF-039 | Histórico auditável | Aprovação | Implementado | Registra data, perfil, ação e detalhe |
| RF-040 | Dossiê ZIP para o GID | Aprovação | Implementado | Markdown, JSON e anexos |

## Limites conscientes do piloto

- A autenticação e os perfis são simulados por um seletor.
- Os dados e anexos ficam no navegador do usuário; não existe API ou banco corporativo.
- As buscas SICVE/SILIC 2.0 e Plano de Aquisições retornam dados simulados.
- O ZIP usa armazenamento sem compressão para manter a geração totalmente local e previsível.
- A transformação em aplicação corporativa exige autenticação CAIXA, API, banco, repositório de documentos, trilha de auditoria de servidor e integrações autorizadas.

## Definição de pronto do piloto

Um requisito só é considerado atendido quando possui elemento de interface, regra executável e teste verificável. O build e os testes automatizados devem estar verdes antes da publicação.
