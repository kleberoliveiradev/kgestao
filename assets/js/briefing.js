/**
 * ===================================================================
 *  KGestão de Marcas - Experiência de Briefing de Estúdio Profissional
 *  Direção Criativa: Kleber Oliveira
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.KGESTAO_CONFIG || {};
  const marca = config.marca || {
    nome: "KGestão de Marcas",
    diretor: "Kleber Oliveira",
    whatsapp: "5511999999999",
    email: "contato@kgestao.com.br"
  };

  // Etapas do Briefing Profissional
  const STEPS = [
    {
      number: "01",
      section: "Sobre Você & A Empresa",
      title: "Quem está à frente da marca?",
      desc: "Informações essenciais de contato para envio de proposta e alinhamento criativo direto.",
      fields: [
        { id: "nome", label: "Seu nome completo", type: "text", required: true, placeholder: "Como devemos te chamar?" },
        { id: "empresa", label: "Nome da marca ou empresa", type: "text", required: false, placeholder: "Ex: Aura Joias, Café Origem..." },
        { id: "contato", label: "WhatsApp ou e-mail principal", type: "text", required: true, placeholder: "(11) 99999-9999 ou seu@email.com", helper: "Usaremos este contato para envio da proposta e contato direto." },
        { id: "site", label: "Instagram ou site atual (se houver)", type: "text", required: false, placeholder: "@suamarca ou www.seusite.com.br" }
      ]
    },
    {
      number: "02",
      section: "Escopo & Momento",
      title: "O que precisamos construir juntos?",
      desc: "Selecione as frentes de trabalho prioritárias e conte sobre a fase atual da sua empresa.",
      fields: [
        {
          id: "tipo",
          label: "Quais entregáveis você precisa neste momento?",
          type: "tiles-multi",
          options: [
            "Identidade Visual Completa",
            "Rebranding / Reposicionamento",
            "Logotipo & Guia de Estilo",
            "Design de Embalagens",
            "Landing Page / Website",
            "Direção de Arte para Redes",
            "Outro Escopo"
          ],
          helper: "Selecione uma ou mais frentes de trabalho."
        },
        {
          id: "negocio",
          label: "O que a sua empresa faz hoje e há quanto tempo está no mercado?",
          type: "area",
          placeholder: "Fale brevemente sobre o seu produto, serviço e modelo de atuação..."
        },
        {
          id: "motivo",
          label: "Por que realizar este projeto agora? Qual foi o ponto de virada?",
          type: "area",
          placeholder: "Ex: lançamento de novo produto, necessidade de cobrar ticket mais alto, reposicionamento..."
        }
      ]
    },
    {
      number: "03",
      section: "Mercado & Posicionamento",
      title: "Público-alvo e concorrência.",
      desc: "Quanto mais preciso for o público, mais estratégica e duradoura será a identidade da marca.",
      fields: [
        {
          id: "publico",
          label: "Quem é o seu cliente ideal?",
          type: "area",
          placeholder: "Perfil, hábitos, faixa de poder aquisitivo e o que eles valorizam na decisão de compra..."
        },
        {
          id: "dif",
          label: "Qual é o seu principal diferencial competitivo?",
          type: "area",
          placeholder: "O que só a sua marca entrega com maestria que os concorrentes não conseguem replicar?"
        },
        {
          id: "concorr",
          label: "Cite 2 ou 3 concorrentes diretos ou marcas que você admira",
          type: "area",
          placeholder: "Marcas que você considera referência em maturidade visual, conceito ou atuação..."
        }
      ]
    },
    {
      number: "04",
      section: "Identidade & Atmosfera",
      title: "Qual a sensação que a marca deve transmitir?",
      desc: "Definimos aqui o tom de voz visual, a percepção de valor e o DNA estético do projeto.",
      fields: [
        {
          id: "pers",
          label: "Selecione os atributos que melhor definem a personalidade desejada:",
          type: "tiles-multi",
          options: [
            "Minimalista & Limpa",
            "Luxuosa & Exclusiva",
            "Moderna & Tecnológica",
            "Acolhedora & Humana",
            "Ousada & Disruptiva",
            "Séria & Institucional",
            "Orgânica & Natural",
            "Técnica & Precisa"
          ],
          helper: "Selecione de 2 a 4 atributos que refletem o tom da marca."
        },
        {
          id: "cores",
          label: "Cores de preferência ou cores a evitar a todo custo",
          type: "text",
          placeholder: "Ex: Preferência por preto fosco, titânio e off-white. Evitar tons neon..."
        },
        {
          id: "ref",
          label: "Links de referências ou inspirações visuais que te agradam",
          type: "area",
          placeholder: "Cole links de painéis do Pinterest, perfis de Instagram, Behance ou referências do nicho..."
        }
      ]
    },
    {
      number: "05",
      section: "Cronograma & Investimento",
      title: "Alinhamento de expectativas e prazos.",
      desc: "Para dimensionarmos o escopo correto e um cronograma realista para ambas as partes.",
      fields: [
        {
          id: "prazo",
          label: "Qual é a sua janela de prazo ideal?",
          type: "tiles-single",
          options: [
            "Urgente (até 15 dias)",
            "Prazo Padrão (até 30 dias)",
            "Médio Prazo (1 a 3 meses)",
            "Sem Pressa (planejando com calma)"
          ]
        },
        {
          id: "verba",
          label: "Faixa de investimento estimada para este projeto:",
          type: "tiles-single",
          options: [
            "Ainda não sei (aguardar proposta)",
            "Até R$ 2.000",
            "R$ 2.000 a R$ 4.500",
            "R$ 4.500 a R$ 8.000",
            "Acima de R$ 8.000"
          ]
        },
        {
          id: "extra",
          label: "Mais alguma informação que o estúdio deve saber antes de iniciar?",
          type: "area",
          placeholder: "Algum detalhe relevante, restrições contratuais ou ideias pontuais..."
        }
      ]
    }
  ];

  let currentStep = 0; // Inicia direto na Etapa 01 do Formulário (0 a 4: Etapas, 5: Revisão, 6: Sucesso)
  let formData = {};

  try {
    const draft = localStorage.getItem("kgestao_briefing_draft");
    if (draft) formData = JSON.parse(draft);
  } catch (e) {
    console.warn("Rascunho não carregado:", e);
  }

  const appEl = document.getElementById("briefing-app");
  if (!appEl) return;

  function saveDraft() {
    try {
      localStorage.setItem("kgestao_briefing_draft", JSON.stringify(formData));
      updateAutosaveIndicator();
    } catch (e) {
      console.warn("Erro ao salvar rascunho:", e);
    }
  }

  function updateAutosaveIndicator() {
    const el = document.getElementById("autosave-indicator");
    if (el) {
      el.innerHTML = '<span class="dot"></span> Salvo no navegador';
    }
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function render() {
    if (currentStep === -1) {
      renderWelcome();
    } else if (currentStep >= 0 && currentStep < STEPS.length) {
      renderStep(currentStep);
    } else if (currentStep === STEPS.length) {
      renderReview();
    } else {
      renderSuccess();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 1. Tela de Boas-Vindas
  function renderWelcome() {
    appEl.innerHTML = `
      <div class="welcome-container">
        <div class="welcome-label">KGestão de Marcas • Direção Criativa</div>
        <h1 style="margin-bottom: 8px; font-size: clamp(1.6rem, 4vw, 2.2rem);" data-i18n="briefing_welcome_title">Responder Briefing de Identidade Visual</h1>
        <p class="welcome-lead" data-i18n="briefing_welcome_desc">
          Para desenvolvermos uma identidade com posicionamento de alto valor, precisamos compreender a fundo a essência do seu negócio, seus diferenciais competitivos e a ambição da sua marca.
        </p>

        <div class="welcome-specs">
          <div class="welcome-specs-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span data-i18n="briefing_duration">Duração: <strong>~5 minutos</strong></span>
          </div>
          <div class="welcome-specs-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
            <span data-i18n="briefing_saving">Salvamento: <strong>Automático no celular</strong></span>
          </div>
          <div class="welcome-specs-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span data-i18n="briefing_analysis">Análise Direta: <strong>Kleber Oliveira</strong></span>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <button class="btn btn-primary" id="btn-start" style="padding: 16px 36px; font-size: 0.95rem; width: 100%; max-width: 340px; justify-content: center;">
            <span data-i18n="briefing_btn_start">Responder Briefing</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    if (window.setLanguage && window.getCurrentLang) {
      window.setLanguage(window.getCurrentLang());
    }

    document.getElementById("btn-start").onclick = () => {
      currentStep = 0;
      render();
    };
  }

  // 2. Renderizador da Etapa
  function renderStep(idx) {
    const step = STEPS[idx];
    const progressPercent = Math.round(((idx + 1) / (STEPS.length + 1)) * 100);

    let fieldsHtml = "";
    step.fields.forEach(field => {
      const val = formData[field.id] || "";
      fieldsHtml += `
        <div class="field-group">
          <label class="field-label" for="fld-${field.id}">
            ${field.label} ${field.required ? '<span class="req">*</span>' : ''}
          </label>
      `;

      if (field.type === "text") {
        fieldsHtml += `
          <input type="text" class="field-input" id="fld-${field.id}" placeholder="${field.placeholder || ''}" value="${escapeHtml(val)}">
        `;
      } else if (field.type === "area") {
        fieldsHtml += `
          <textarea class="field-textarea" id="fld-${field.id}" placeholder="${field.placeholder || ''}">${escapeHtml(val)}</textarea>
        `;
      } else if (field.type === "tiles-multi") {
        const selectedArr = Array.isArray(val) ? val : [];
        fieldsHtml += `
          <div class="options-grid" data-field="${field.id}" data-mode="multi">
            ${field.options.map(opt => {
              const isSelected = selectedArr.includes(opt);
              return `
                <div class="option-card ${isSelected ? 'selected' : ''}" data-val="${escapeHtml(opt)}">
                  <span>${escapeHtml(opt)}</span>
                  <span class="check-icon">✓</span>
                </div>
              `;
            }).join("")}
          </div>
        `;
      } else if (field.type === "tiles-single") {
        fieldsHtml += `
          <div class="options-grid" data-field="${field.id}" data-mode="single">
            ${field.options.map(opt => {
              const isSelected = (val === opt);
              return `
                <div class="option-card ${isSelected ? 'selected' : ''}" data-val="${escapeHtml(opt)}">
                  <span>${escapeHtml(opt)}</span>
                  <span class="check-icon">✓</span>
                </div>
              `;
            }).join("")}
          </div>
        `;
      }

      if (field.helper) {
        fieldsHtml += `<div class="field-helper">${field.helper}</div>`;
      }
      fieldsHtml += `<div class="field-error" id="err-${field.id}">Por favor, preencha este campo para continuar.</div></div>`;
    });

    appEl.innerHTML = `
      <div class="briefing-info-pills">
        <div class="info-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span data-i18n="briefing_pill_time">~5 minutos</span>
        </div>
        <div class="info-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
          <span data-i18n="briefing_pill_save">Salvo automaticamente</span>
        </div>
        <div class="info-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span data-i18n="briefing_pill_director">Direção: Kleber Oliveira</span>
        </div>
      </div>

      <div class="stage-progress-bar">
        <div class="stage-meta">
          <span class="stage-meta-step">${step.number} — ${step.section}</span>
          <span class="stage-meta-count">Etapa ${idx + 1} de ${STEPS.length}</span>
        </div>
        <div class="stage-pill-track">
          <div class="stage-pill-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <div class="stage-content">
        <div class="stage-header">
          <div class="stage-number">${step.number} / 05 • KGESTÃO DE MARCAS</div>
          <h1 class="stage-title">${step.title}</h1>
          <p class="stage-subtitle">${step.desc}</p>
        </div>

        <form id="step-form" onsubmit="return false;">
          ${fieldsHtml}

          <div class="stage-actions">
            <button type="button" class="btn btn-secondary" id="btn-prev">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              <span>${idx === 0 ? 'Voltar ao Início' : 'Voltar'}</span>
            </button>

            <div class="autosave-status" id="autosave-indicator">
              <span class="dot"></span> <span>Salvo no navegador</span>
            </div>

            <button type="button" class="btn btn-primary" id="btn-next">
              <span>${idx === STEPS.length - 1 ? 'Revisar Respostas' : 'Continuar'}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </form>
      </div>
    `;

    // Eventos dos Cards de Opção Interativa (Multi e Single select)
    appEl.querySelectorAll(".options-grid").forEach(grid => {
      const fieldId = grid.dataset.field;
      const isMulti = grid.dataset.mode === "multi";

      grid.querySelectorAll(".option-card").forEach(card => {
        card.onclick = () => {
          const val = card.dataset.val;

          if (isMulti) {
            let list = Array.isArray(formData[fieldId]) ? [...formData[fieldId]] : [];
            const index = list.indexOf(val);
            if (index > -1) {
              list.splice(index, 1);
              card.classList.remove("selected");
            } else {
              list.push(val);
              card.classList.add("selected");
            }
            formData[fieldId] = list;
          } else {
            grid.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            formData[fieldId] = val;
          }

          saveDraft();
        };
      });
    });

    // Eventos dos inputs
    step.fields.forEach(f => {
      if (!f.type.startsWith("tiles")) {
        const inputEl = document.getElementById(`fld-${f.id}`);
        if (inputEl) {
          inputEl.addEventListener("input", () => {
            formData[f.id] = inputEl.value;
            saveDraft();
            const errEl = document.getElementById(`err-${f.id}`);
            if (errEl && inputEl.value.trim()) {
              errEl.classList.remove("active");
            }
          });
        }
      }
    });

    document.getElementById("btn-prev").onclick = () => {
      collectStepData(idx);
      if (idx === 0) {
        window.location.href = "index.html";
        return;
      }
      currentStep--;
      render();
    };

    document.getElementById("btn-next").onclick = () => {
      collectStepData(idx);
      if (validateStep(idx)) {
        currentStep++;
        render();
      }
    };

    if (window.setLanguage && window.getCurrentLang) {
      window.setLanguage(window.getCurrentLang());
    }
  }

  function collectStepData(idx) {
    const step = STEPS[idx];
    step.fields.forEach(f => {
      if (!f.type.startsWith("tiles")) {
        const inputEl = document.getElementById(`fld-${f.id}`);
        if (inputEl) {
          formData[f.id] = inputEl.value.trim();
        }
      }
    });
    saveDraft();
  }

  function validateStep(idx) {
    let isValid = true;
    const step = STEPS[idx];
    step.fields.forEach(f => {
      if (f.required) {
        const val = formData[f.id];
        const isEmpty = !val || (typeof val === "string" && !val.trim());
        const errEl = document.getElementById(`err-${f.id}`);
        if (isEmpty) {
          isValid = false;
          if (errEl) errEl.classList.add("active");
        } else {
          if (errEl) errEl.classList.remove("active");
        }
      }
    });
    return isValid;
  }

  function buildFormattedSummary() {
    let text = `BRIEFING ESTRATÉGICO - ${formData.empresa || formData.nome || 'KGESTAO'}\n`;
    text += `Data: ${new Date().toLocaleDateString("pt-BR")}\n`;
    text += `==================================================\n\n`;

    STEPS.forEach(step => {
      text += `[ ${step.number} - ${step.section.toUpperCase()} ]\n`;
      step.fields.forEach(f => {
        let val = formData[f.id];
        if (Array.isArray(val)) val = val.join(", ");
        if (val) {
          text += `• ${f.label}:\n  ${val}\n\n`;
        }
      });
      text += `\n`;
    });

    return text.trim();
  }

  // 3. Tela de Revisão (Dossiê Executivo)
  function renderReview() {
    let summaryHtml = "";

    STEPS.forEach(step => {
      let stepEntriesHtml = "";
      step.fields.forEach(f => {
        let val = formData[f.id];
        if (Array.isArray(val)) val = val.join(", ");
        if (val) {
          stepEntriesHtml += `
            <div class="dossier-entry">
              <div class="dossier-label">${escapeHtml(f.label)}</div>
              <div class="dossier-value">${escapeHtml(val)}</div>
            </div>
          `;
        }
      });

      if (stepEntriesHtml) {
        summaryHtml += `
          <div class="dossier-card">
            <div class="dossier-section-title">${step.number} — ${escapeHtml(step.section)}</div>
            ${stepEntriesHtml}
          </div>
        `;
      }
    });

    appEl.innerHTML = `
      <div class="stage-progress-bar">
        <div class="stage-meta">
          <span>Dossiê Final</span>
          <span>100% preenchido</span>
        </div>
        <div class="stage-pill-track">
          <div class="stage-pill-fill" style="width: 100%;"></div>
        </div>
      </div>

      <div class="stage-content">
        <div class="stage-header">
          <div class="stage-number">Revisão</div>
          <h2 class="stage-title">Dossiê de Respostas</h2>
          <p class="stage-subtitle">Confira suas respostas abaixo antes de enviar para a equipe de direção criativa.</p>
        </div>

        <div style="margin-bottom: 32px;">
          ${summaryHtml}
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button type="button" class="btn btn-primary" id="btn-submit" style="padding: 18px; font-size: 1rem; width: 100%;">
            Enviar Briefing para Kleber Oliveira
          </button>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" id="btn-edit" style="flex: 1;">
              Editar Respostas
            </button>
            <button type="button" class="btn btn-secondary" id="btn-copy" style="flex: 1;">
              Copiar Resumo em Texto
            </button>
          </div>

          <div id="copy-msg" style="text-align: center; font-size: 0.8rem; color: #10b981; min-height: 20px;"></div>
        </div>
      </div>
    `;

    document.getElementById("btn-edit").onclick = () => {
      currentStep = 0;
      render();
    };

    document.getElementById("btn-copy").onclick = () => {
      const text = buildFormattedSummary();
      navigator.clipboard.writeText(text).then(() => {
        document.getElementById("copy-msg").textContent = "✓ Resumo copiado para a área de transferência.";
        setTimeout(() => {
          const msg = document.getElementById("copy-msg");
          if (msg) msg.textContent = "";
        }, 3000);
      });
    };

    document.getElementById("btn-submit").onclick = async () => {
      const submitBtn = document.getElementById("btn-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Gravando respostas com segurança...";

      try {
        const payload = {
          nome: formData.nome || "",
          empresa: formData.empresa || "",
          contato: formData.contato || "",
          site: formData.site || "",
          tipo: formData.tipo || [],
          negocio: formData.negocio || "",
          motivo: formData.motivo || "",
          publico: formData.publico || "",
          dif: formData.dif || "",
          concorr: formData.concorr || "",
          pers: formData.pers || [],
          cores: formData.cores || "",
          ref: formData.ref || "",
          prazo: formData.prazo || "",
          verba: formData.verba || "",
          extra: formData.extra || "",
          resumo_formatado: buildFormattedSummary()
        };

        const result = await window.KGestaoDB.createBriefing(payload);
        formData.lastProtocol = result.id || ("KG-" + Math.floor(100000 + Math.random() * 900000));
        localStorage.removeItem("kgestao_briefing_draft");

        currentStep = STEPS.length + 1;
        render();
      } catch (err) {
        alert("Ocorreu uma instabilidade na gravação em nuvem. Suas respostas não foram perdidas: copie o texto ou envie pelo WhatsApp.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Tentar Enviar Novamente";
      }
    };
  }

  // 4. Tela de Confirmação e Sucesso
  function renderSuccess() {
    const formattedText = buildFormattedSummary();
    const whatsMsg = config.whatsappMensagemCliente 
      ? config.whatsappMensagemCliente(formData.nome, formData.empresa)
      : `Olá Kleber! Sou ${formData.nome}. Acabei de preencher o briefing no seu site!`;

    const whatsUrl = `https://wa.me/${marca.whatsapp}?text=${encodeURIComponent(whatsMsg + "\n\nResumo:\n" + formattedText)}`;

    appEl.innerHTML = `
      <div class="success-container">
        <div class="success-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
        </div>

        <h1 style="margin-bottom: 10px;">Briefing Recebido com Sucesso</h1>
        <p style="font-size: 1.05rem; line-height: 1.6; max-width: 580px;">
          Obrigado, <strong>${escapeHtml(formData.nome)}</strong>. As informações do seu projeto já foram registradas no sistema do estúdio e serão analisadas pessoalmente por <strong>Kleber Oliveira</strong> para a elaboração do direcionamento e da proposta.
        </p>

        <div class="success-ref-box">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--tx-muted); margin-bottom: 4px;">Código de Referência</div>
          <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;">${escapeHtml(formData.lastProtocol || 'KG-CONFIRMADO')}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; max-width: 420px;">
          <a href="${whatsUrl}" target="_blank" rel="noopener" class="btn btn-wa" style="padding: 16px 24px; font-size: 0.95rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            Avisar Kleber no WhatsApp
          </a>

          <button type="button" class="btn btn-secondary" id="btn-print-copy">
            Salvar / Imprimir Cópia em PDF
          </button>

          <a href="index.html" class="btn btn-ghost btn-sm" style="margin-top: 8px; text-align: center;">
            Voltar ao Início
          </a>
        </div>
      </div>
    `;

    document.getElementById("btn-print-copy").onclick = () => {
      window.print();
    };
  }

  render();
});
