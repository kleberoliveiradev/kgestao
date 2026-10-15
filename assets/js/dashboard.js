/**
 * ===================================================================
 *  KGestão de Marcas - Lógica do Painel Administrativo (Dashboard)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const config = window.KGESTAO_CONFIG || {};
  const marca = config.marca || {
    nome: "KGestão de Marcas",
    diretor: "Kleber Oliveira",
    whatsapp: "5511999999999",
    email: "contato@kgestao.com.br"
  };

  let allBriefings = [];
  let currentFilteredList = [];
  let activeBriefing = null;
  let currentStatusFilter = "Todos";
  let currentSearchQuery = "";
  let currentTypeFilter = "Todos";

  // Elementos da Interface
  const briefingsListEl = document.getElementById("briefings-list");
  const drawerEl = document.getElementById("detail-drawer");
  const drawerBodyEl = document.getElementById("drawer-body");
  const drawerNameEl = document.getElementById("drawer-client-name");
  const drawerMetaEl = document.getElementById("drawer-meta");
  const drawerStatusSelect = document.getElementById("drawer-status-select");
  const drawerBtnWa = document.getElementById("drawer-btn-wa");
  const drawerBtnPdf = document.getElementById("drawer-btn-pdf");
  const drawerBtnCopy = document.getElementById("drawer-btn-copy");
  const drawerBtnDelete = document.getElementById("drawer-btn-delete");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const searchInput = document.getElementById("search-input");
  const typeFilterSelect = document.getElementById("type-filter");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // KPIs
  const kpiTotalEl = document.getElementById("kpi-total");
  const kpiNovosEl = document.getElementById("kpi-novos");
  const kpiAnaliseEl = document.getElementById("kpi-analise");
  const kpiAndamentoEl = document.getElementById("kpi-andamento");
  const kpiConcluidoEl = document.getElementById("kpi-concluido");

  // Banner do Sistema
  const systemBannerEl = document.getElementById("system-banner");
  if (systemBannerEl) {
    if (window.KGestaoDB.isDemoMode) {
      systemBannerEl.innerHTML = `
        <div class="system-banner-text">
          <strong>Modo Demonstração Ativo:</strong> Você está visualizando dados de teste no seu navegador. Quando quiser conectar seu banco Supabase real na nuvem, basta seguir o <strong>GUIA_PASSO_A_PASSO.md</strong>.
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-demo-create">
          + Criar Briefing Simulado
        </button>
      `;

      const btnDemoCreate = document.getElementById("btn-demo-create");
      if (btnDemoCreate) {
        btnDemoCreate.onclick = async () => {
          await window.KGestaoDB.createBriefing({
            nome: "Novo Cliente Exemplo",
            empresa: "Studio Design & Co",
            contato: "11999998888",
            site: "@studiodesign",
            tipo: ["Identidade visual", "Rebranding"],
            negocio: "Estúdio de arquitetura e interiores.",
            motivo: "Expansão de mercado para condomínios fechados.",
            publico: "Famílias de alto padrão.",
            dif: "Projetos 3D imersivos com óculos VR.",
            concorr: "Grandes escritórios paulistanos.",
            pers: ["Premium", "Minimalista"],
            cores: "Preto, areia e dourado.",
            ref: "Linhas retas e tipografia suíça.",
            prazo: "Até 30 dias",
            verba: "Acima de R$ 6.000",
            extra: "Precisamos de material impresso de apresentação.",
            status: "Novo",
            notas_internas: "Cliente acabou de enviar pelo site."
          });
          await loadBriefings();
        };
      }
    } else {
      systemBannerEl.innerHTML = `
        <div class="system-banner-text">
          <strong style="color: #10b981;">● Conectado ao Supabase:</strong> Banco de dados PostgreSQL na nuvem sincronizado em tempo real.
        </div>
        <button class="btn btn-outline btn-sm" onclick="location.reload()">
          Atualizar Dados
        </button>
      `;
    }
  }

  // Helper de Formatação de Data
  function formatDate(isoStr) {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const diffMs = now - d;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) {
        return "Há poucos minutos";
      } else if (diffHours < 24 && d.getDate() === now.getDate()) {
        return `Hoje às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
      } else if (diffHours < 48) {
        return `Ontem às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
      } else {
        return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
    } catch (e) {
      return isoStr;
    }
  }

  // Helper de Status Class
  function getStatusClass(status) {
    switch (status) {
      case "Novo": return "novo";
      case "Em análise": return "analise";
      case "Em andamento": return "andamento";
      case "Concluído": return "concluido";
      default: return "novo";
    }
  }

  // Carrega lista do banco
  async function loadBriefings() {
    try {
      allBriefings = await window.KGestaoDB.getBriefings();
      updateKPIs();
      populateTypeFilterOptions();
      applyFilters();
    } catch (err) {
      console.error("Erro ao carregar briefings:", err);
      if (briefingsListEl) {
        briefingsListEl.innerHTML = `
          <div class="empty-state">
            <h3>Erro ao conectar com o banco</h3>
            <p>Verifique as configurações do Supabase no arquivo <code>config.js</code> ou continue em modo demonstração.</p>
          </div>
        `;
      }
    }
  }

  // Atualiza indicadores KPI
  function updateKPIs() {
    const total = allBriefings.length;
    const novos = allBriefings.filter(b => b.status === "Novo").length;
    const analise = allBriefings.filter(b => b.status === "Em análise").length;
    const andamento = allBriefings.filter(b => b.status === "Em andamento").length;
    const concluido = allBriefings.filter(b => b.status === "Concluído").length;

    if (kpiTotalEl) kpiTotalEl.textContent = total;
    if (kpiNovosEl) kpiNovosEl.textContent = novos;
    if (kpiAnaliseEl) kpiAnaliseEl.textContent = analise;
    if (kpiAndamentoEl) kpiAndamentoEl.textContent = andamento;
    if (kpiConcluidoEl) kpiConcluidoEl.textContent = concluido;
  }

  // Popula opções de Tipo de Projeto
  function populateTypeFilterOptions() {
    if (!typeFilterSelect) return;
    const typesSet = new Set();
    allBriefings.forEach(b => {
      if (Array.isArray(b.tipo)) {
        b.tipo.forEach(t => typesSet.add(t));
      }
    });

    let html = `<option value="Todos">Todos os tipos de projeto</option>`;
    typesSet.forEach(t => {
      html += `<option value="${t}">${t}</option>`;
    });
    typeFilterSelect.innerHTML = html;
  }

  // Filtros combinados (Status, Busca e Tipo)
  function applyFilters() {
    currentFilteredList = allBriefings.filter(b => {
      // 1. Filtro por status
      if (currentStatusFilter !== "Todos" && b.status !== currentStatusFilter) {
        return false;
      }

      // 2. Filtro por tipo de projeto
      if (currentTypeFilter !== "Todos") {
        const types = Array.isArray(b.tipo) ? b.tipo : [];
        if (!types.includes(currentTypeFilter)) return false;
      }

      // 3. Filtro por texto de busca
      if (currentSearchQuery.trim()) {
        const q = currentSearchQuery.toLowerCase();
        const nomeMatch = (b.nome || "").toLowerCase().includes(q);
        const empresaMatch = (b.empresa || "").toLowerCase().includes(q);
        const contatoMatch = (b.contato || "").toLowerCase().includes(q);
        const siteMatch = (b.site || "").toLowerCase().includes(q);
        const negocioMatch = (b.negocio || "").toLowerCase().includes(q);
        return nomeMatch || empresaMatch || contatoMatch || siteMatch || negocioMatch;
      }

      return true;
    });

    renderBriefingsList();
  }

  // Renderiza a lista de briefings
  function renderBriefingsList() {
    if (!briefingsListEl) return;

    if (currentFilteredList.length === 0) {
      briefingsListEl.innerHTML = `
        <div class="empty-state">
          <h3>Nenhum briefing encontrado</h3>
          <p>Não há briefings cadastrados com os filtros atuais. Limpe a busca ou aguarde novas respostas dos seus clientes.</p>
        </div>
      `;
      return;
    }

    let html = "";
    currentFilteredList.forEach(b => {
      const types = Array.isArray(b.tipo) ? b.tipo : [];
      const tagsHtml = types.slice(0, 3).map(t => `<span class="tag-badge">${t}</span>`).join("");
      const extraTags = types.length > 3 ? `<span class="tag-badge">+${types.length - 3}</span>` : "";

      html += `
        <div class="briefing-card-item" data-id="${b.id}">
          <div class="b-date">${formatDate(b.created_at)}</div>
          <div>
            <div class="b-client-name">${escapeHtml(b.nome)}</div>
            <div class="b-company-name">${escapeHtml(b.empresa || 'Projeto sem nome de empresa')}</div>
          </div>
          <div class="b-tags">
            ${tagsHtml} ${extraTags}
          </div>
          <div style="font-size: 0.8rem; color: var(--tx-tertiary);">
            <div>${escapeHtml(b.prazo || 'Prazo a alinhar')}</div>
            <div style="font-weight: 500; color: var(--tx-secondary);">${escapeHtml(b.verba || '')}</div>
          </div>
          <div>
            <span class="status-badge ${getStatusClass(b.status)}">${escapeHtml(b.status || 'Novo')}</span>
          </div>
        </div>
      `;
    });

    briefingsListEl.innerHTML = html;

    // Eventos de clique nas linhas para abrir a gaveta
    briefingsListEl.querySelectorAll(".briefing-card-item").forEach(card => {
      card.onclick = () => {
        const id = card.dataset.id;
        openDrawer(id);
      };
    });
  }

  // Abre a gaveta de detalhes completos
  function openDrawer(id) {
    activeBriefing = allBriefings.find(b => b.id === id);
    if (!activeBriefing) return;

    drawerNameEl.textContent = activeBriefing.nome;
    drawerMetaEl.innerHTML = `
      <span>${activeBriefing.empresa || 'Pessoa Física'}</span>
      <span>•</span>
      <span>Recebido em ${new Date(activeBriefing.created_at).toLocaleDateString("pt-BR")}</span>
    `;

    // Atualiza status select
    if (drawerStatusSelect) {
      drawerStatusSelect.value = activeBriefing.status || "Novo";
    }

    // Configura botão WhatsApp
    if (drawerBtnWa) {
      let rawPhone = (activeBriefing.contato || "").replace(/\D/g, "");
      if (rawPhone && rawPhone.length <= 11 && !rawPhone.startsWith("55")) {
        rawPhone = "55" + rawPhone;
      }

      if (rawPhone && rawPhone.length >= 10) {
        drawerBtnWa.style.display = "inline-flex";
        const msg = config.whatsappMensagemPadrao
          ? config.whatsappMensagemPadrao(activeBriefing.nome, activeBriefing.empresa)
          : `Olá ${activeBriefing.nome}! Aqui é o Kleber da KGestão de Marcas. Recebi seu briefing e gostaria de agendar uma conversa.`;
        drawerBtnWa.href = `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`;
      } else {
        drawerBtnWa.style.display = "none";
      }
    }

    // Renderiza o corpo detalhado com todas as seções
    renderDrawerBody(activeBriefing);

    // Mostra gaveta
    drawerEl.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawerEl.classList.remove("active");
    document.body.style.overflow = "";
    activeBriefing = null;
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.onclick = closeDrawer;
  }

  // Fecha clicando no backdrop
  drawerEl.onclick = (e) => {
    if (e.target === drawerEl) {
      closeDrawer();
    }
  };

  // Renderiza corpo do dossiê do briefing
  function renderDrawerBody(b) {
    const tipos = Array.isArray(b.tipo) ? b.tipo.join(", ") : (b.tipo || "Não informado");
    const pers = Array.isArray(b.pers) ? b.pers.join(", ") : (b.pers || "Não informado");

    drawerBodyEl.innerHTML = `
      <!-- Cabeçalho de Impressão -->
      <div class="print-only-header">
        <h1 style="font-family: var(--font-display); font-size: 22pt; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px;">KGestão de Marcas</h1>
        <div style="font-size: 10pt; color: #666; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Dossiê Estratégico de Briefing</div>
        <div style="margin-top: 12px; font-size: 10pt; border-top: 1px solid #ddd; padding-top: 8px;">
          <strong>Cliente:</strong> ${escapeHtml(b.nome)} | <strong>Marca:</strong> ${escapeHtml(b.empresa || '-')} | <strong>Data:</strong> ${new Date(b.created_at).toLocaleDateString("pt-BR")}
        </div>
      </div>

      <!-- 1. Sobre o Cliente & Contato -->
      <div class="detail-block">
        <div class="detail-block-title">1. Informações de Contato</div>
        <div class="detail-row">
          <div class="detail-label">Nome do Cliente</div>
          <div class="detail-value">${escapeHtml(b.nome)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Nome da Marca / Empresa</div>
          <div class="detail-value">${escapeHtml(b.empresa || 'Não informado')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Contato (WhatsApp / E-mail)</div>
          <div class="detail-value"><strong>${escapeHtml(b.contato)}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Instagram ou Site</div>
          <div class="detail-value">${b.site ? `<a href="${b.site.startsWith('http') ? b.site : 'https://' + b.site}" target="_blank">${escapeHtml(b.site)}</a>` : 'Não informado'}</div>
        </div>
      </div>

      <!-- 2. O Projeto -->
      <div class="detail-block">
        <div class="detail-block-title">2. Escopo & Negócio</div>
        <div class="detail-row">
          <div class="detail-label">O que o cliente precisa</div>
          <div class="detail-value"><strong style="color: var(--tx);">${escapeHtml(tipos)}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">O que a marca faz e histórico</div>
          <div class="detail-value">${escapeHtml(b.negocio || 'Não preenchido')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Por que esse projeto e por que agora?</div>
          <div class="detail-value">${escapeHtml(b.motivo || 'Não preenchido')}</div>
        </div>
      </div>

      <!-- 3. Público e Posicionamento -->
      <div class="detail-block">
        <div class="detail-block-title">3. Público & Posicionamento</div>
        <div class="detail-row">
          <div class="detail-label">Cliente Ideal</div>
          <div class="detail-value">${escapeHtml(b.publico || 'Não preenchido')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Diferencial Competitivo</div>
          <div class="detail-value">${escapeHtml(b.dif || 'Não preenchido')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Concorrentes ou Marcas Admiradas</div>
          <div class="detail-value">${escapeHtml(b.concorr || 'Não preenchido')}</div>
        </div>
      </div>

      <!-- 4. Estilo & Personalidade -->
      <div class="detail-block">
        <div class="detail-block-title">4. Estilo & Personalidade Visual</div>
        <div class="detail-row">
          <div class="detail-label">Percepção Desejada</div>
          <div class="detail-value"><strong>${escapeHtml(pers)}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Cores amadas / cores a evitar</div>
          <div class="detail-value">${escapeHtml(b.cores || 'Não informado')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Links ou Referências Visuais</div>
          <div class="detail-value">${formatLinks(b.ref || 'Não informado')}</div>
        </div>
      </div>

      <!-- 5. Prazo & Investimento -->
      <div class="detail-block">
        <div class="detail-block-title">5. Prazo & Faixa de Investimento</div>
        <div class="detail-row">
          <div class="detail-label">Prazo Esperado</div>
          <div class="detail-value">${escapeHtml(b.prazo || 'A alinhar')}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Faixa de Investimento Prevista</div>
          <div class="detail-value"><strong style="color: var(--tx); font-size: 1.05rem;">${escapeHtml(b.verba || 'Não informado')}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Mais alguma observação</div>
          <div class="detail-value">${escapeHtml(b.extra || 'Nenhuma observação adicional')}</div>
        </div>
      </div>

      <!-- 6. Anotações Internas do Kleber -->
      <div class="detail-block" style="border-color: var(--card-border-glow);">
        <div class="detail-block-title" style="color: var(--tx); display: flex; justify-content: space-between; align-items: center;">
          <span>Anotações Internas (Privado)</span>
          <span id="notes-save-badge" style="font-size: 0.72rem; text-transform: none; color: var(--tx-tertiary);">Salvo automaticamente</span>
        </div>
        <div class="notes-container">
          <textarea class="notes-textarea" id="internal-notes-textarea" placeholder="Escreva aqui suas impressões da conversa, valores combinados, datas de reunião, links internos...">${escapeHtml(b.notas_internas || '')}</textarea>
        </div>
      </div>
    `;

    // Configura o salvamento automático das notas com debounce
    const notesEl = document.getElementById("internal-notes-textarea");
    const saveBadgeEl = document.getElementById("notes-save-badge");
    let notesTimeout = null;

    if (notesEl) {
      notesEl.oninput = () => {
        saveBadgeEl.textContent = "Salvando...";
        saveBadgeEl.style.color = "var(--tx-secondary)";
        clearTimeout(notesTimeout);
        notesTimeout = setTimeout(async () => {
          try {
            await window.KGestaoDB.updateNotas(b.id, notesEl.value);
            b.notas_internas = notesEl.value;
            saveBadgeEl.textContent = "✓ Salvo";
            saveBadgeEl.style.color = "#30d158";
            setTimeout(() => {
              saveBadgeEl.textContent = "Salvo automaticamente";
              saveBadgeEl.style.color = "var(--tx-tertiary)";
            }, 2500);
          } catch (e) {
            saveBadgeEl.textContent = "Erro ao salvar notas";
            saveBadgeEl.style.color = "#ef4444";
          }
        }, 600);
      };
    }
  }

  // Atualização de Status
  if (drawerStatusSelect) {
    drawerStatusSelect.onchange = async () => {
      if (!activeBriefing) return;
      const newStatus = drawerStatusSelect.value;
      try {
        await window.KGestaoDB.updateStatus(activeBriefing.id, newStatus);
        activeBriefing.status = newStatus;
        updateKPIs();
        renderBriefingsList();
      } catch (e) {
        alert("Erro ao atualizar status.");
      }
    };
  }

  // Botão PDF / Imprimir
  if (drawerBtnPdf) {
    drawerBtnPdf.onclick = () => {
      window.print();
    };
  }

  // Botão Copiar Texto
  if (drawerBtnCopy) {
    drawerBtnCopy.onclick = () => {
      if (!activeBriefing) return;
      const text = activeBriefing.resumo_formatado || buildBriefingText(activeBriefing);
      navigator.clipboard.writeText(text).then(() => {
        drawerBtnCopy.innerHTML = `<span style="color: #30d158;">✓ Copiado!</span>`;
        setTimeout(() => {
          drawerBtnCopy.textContent = "Copiar Texto";
        }, 2000);
      });
    };
  }

  // Botão Excluir
  if (drawerBtnDelete) {
    drawerBtnDelete.onclick = async () => {
      if (!activeBriefing) return;
      const confirmDelete = confirm(`Deseja realmente excluir o briefing de "${activeBriefing.nome}"? Esta ação não pode ser desfeita.`);
      if (confirmDelete) {
        try {
          await window.KGestaoDB.deleteBriefing(activeBriefing.id);
          allBriefings = allBriefings.filter(b => b.id !== activeBriefing.id);
          closeDrawer();
          updateKPIs();
          applyFilters();
        } catch (e) {
          alert("Erro ao excluir briefing.");
        }
      }
    };
  }

  // Filtros de Status (Botoes)
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStatusFilter = btn.dataset.status;
      applyFilters();
    };
  });

  // Busca instantânea com debounce
  let searchTimeout = null;
  if (searchInput) {
    searchInput.oninput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearchQuery = searchInput.value;
        applyFilters();
      }, 200);
    };
  }

  // Filtro por Tipo de Projeto
  if (typeFilterSelect) {
    typeFilterSelect.onchange = () => {
      currentTypeFilter = typeFilterSelect.value;
      applyFilters();
    };
  }

  // Helpers auxiliares
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatLinks(text) {
    if (!text) return "";
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return escapeHtml(text).replace(urlPattern, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function buildBriefingText(b) {
    return `BRIEFING - ${b.empresa || b.nome}\nData: ${new Date(b.created_at).toLocaleDateString("pt-BR")}\nCliente: ${b.nome}\nContato: ${b.contato}\nTipo: ${Array.isArray(b.tipo) ? b.tipo.join(", ") : b.tipo}\nPrazo: ${b.prazo}\nInvestimento: ${b.verba}\n\nResumo:\n${b.negocio || ''}\n${b.motivo || ''}\n${b.publico || ''}`;
  }

  // Inicialização
  await loadBriefings();
});
