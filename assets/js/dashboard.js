/**
 * ===================================================================
 *  KGestão de Marcas - Lógica do Painel Administrativo (Dashboard)
 *  Direção Criativa: Kleber Oliveira
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const config = window.KGESTAO_CONFIG || {};
  const marca = config.marca || {
    nome: "KGestão de Marcas",
    diretor: "Kleber Oliveira",
    whatsapp: "5511983467706",
    email: "design.excelencia@gmail.com"
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

  // Elementos do Modal Supabase
  const modalSupabase = document.getElementById("modal-supabase");
  const inputSupabaseUrl = document.getElementById("supabase-input-url");
  const inputSupabaseKey = document.getElementById("supabase-input-key");
  const btnSaveSupabase = document.getElementById("btn-save-supabase");
  const btnCancelSupabase = document.getElementById("btn-cancel-supabase");
  const btnCloseSupabaseModal = document.getElementById("btn-close-supabase-modal");
  const btnDisconnectSupabase = document.getElementById("btn-disconnect-supabase");

  // KPIs
  const kpiTotalEl = document.getElementById("kpi-total");
  const kpiNovosEl = document.getElementById("kpi-novos");
  const kpiAnaliseEl = document.getElementById("kpi-analise");
  const kpiAndamentoEl = document.getElementById("kpi-andamento");
  const kpiConcluidoEl = document.getElementById("kpi-concluido");

  // Banner do Sistema
  function renderSystemBanner() {
    const systemBannerEl = document.getElementById("system-banner");
    if (!systemBannerEl) return;

    if (window.KGestaoDB.isDemoMode) {
      systemBannerEl.innerHTML = `
        <div class="system-banner-text" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: #fbbf24; font-size: 0.85rem;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; display: inline-block;"></span>
            Modo Demonstração (Local)
          </span>
          <span style="color: var(--tx-secondary); font-size: 0.83rem;">
            Você está visualizando dados salvos no seu navegador. Conecte o Supabase para sincronizar briefings reais na nuvem.
          </span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-open-supabase-modal" style="font-weight: 600;">
            ⚙ Conectar Supabase
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-demo-create">
            + Simular Briefing
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-clear-tests" title="Limpar briefings de teste" style="color: #ef4444;">
            🗑 Limpar Testes
          </button>
        </div>
      `;
    } else {
      systemBannerEl.innerHTML = `
        <div class="system-banner-text" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: #34d399; font-size: 0.85rem;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #34d399; display: inline-block; box-shadow: 0 0 8px #34d399;"></span>
            Conectado ao Supabase (Nuvem)
          </span>
          <span style="color: var(--tx-secondary); font-size: 0.83rem;">
            Banco de dados PostgreSQL na nuvem sincronizado em tempo real.
          </span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="btn-open-supabase-modal">
            ⚙ Configurações Supabase
          </button>
          <button class="btn btn-primary btn-sm" id="btn-refresh-dashboard">
            ↻ Atualizar Dados
          </button>
        </div>
      `;
    }

    // Handlers do Banner
    const btnOpenModal = document.getElementById("btn-open-supabase-modal");
    if (btnOpenModal) btnOpenModal.onclick = openSupabaseModal;

    const btnRefresh = document.getElementById("btn-refresh-dashboard");
    if (btnRefresh) btnRefresh.onclick = () => loadBriefings();

    const btnDemoCreate = document.getElementById("btn-demo-create");
    if (btnDemoCreate) {
      btnDemoCreate.onclick = async () => {
        await window.KGestaoDB.createBriefing({
          nome: "Mariana Siqueira",
          empresa: "Lumina Arquitetura",
          contato: "11988887777",
          site: "@lumina.arq",
          tipo: ["Identidade Visual Completa", "Landing Page / Website"],
          negocio: "Estúdio de arquitetura residencial e comercial de alto padrão focado em biofilia e iluminação natural.",
          motivo: "Estamos completando 5 anos e vamos expandir para o mercado corporativo com escritórios de advocacia e clínicas.",
          publico: "Clientes classe A e executivos que valorizam bem-estar, linhas puras e materiais sustentáveis.",
          dif: "Metodologia própria de neuroarquitetura e visualização hiper-realista em realidade virtual.",
          concorr: "Studio Arthur Casas, FGMF Arquitetos",
          pers: ["Minimalista & Limpa", "Luxuosa & Exclusiva", "Moderna & Tecnológica"],
          cores: "Tons minerais, areia travertino, carvalho natural e detalhes em preto acetinado.",
          ref: "Linhas nórdicas, publicações da Dezeen e estética editorial japonesa.",
          prazo: "Prazo Padrão (até 30 dias)",
          verba: "R$ 4.500 a R$ 8.000",
          extra: "Precisamos que o projeto contemple papelaria institucional completa e guia de tom de voz para redes.",
          status: "Novo",
          notas_internas: "Briefing recebido com excelente nível de maturidade."
        });
        await loadBriefings();
      };
    }

    const btnClearTests = document.getElementById("btn-clear-tests");
    if (btnClearTests) {
      btnClearTests.onclick = async () => {
        if (confirm("Deseja apagar todos os briefings de teste salvos neste navegador? Esta ação limpará a lista para você começar do zero.")) {
          window.KGestaoDB.clearAllBriefings();
          await loadBriefings();
        }
      };
    }
  }

  // Modal Supabase Handlers
  function openSupabaseModal() {
    if (!modalSupabase) return;
    const cfg = window.KGestaoDB.getSupabaseConfig ? window.KGestaoDB.getSupabaseConfig() : {};
    if (inputSupabaseUrl) inputSupabaseUrl.value = cfg.url || "";
    if (inputSupabaseKey) inputSupabaseKey.value = cfg.key || "";

    if (btnDisconnectSupabase) {
      btnDisconnectSupabase.style.display = cfg.isCustom ? "inline-block" : "none";
    }
    modalSupabase.style.display = "flex";
  }

  function closeSupabaseModal() {
    if (modalSupabase) modalSupabase.style.display = "none";
  }

  if (btnCloseSupabaseModal) btnCloseSupabaseModal.onclick = closeSupabaseModal;
  if (btnCancelSupabase) btnCancelSupabase.onclick = closeSupabaseModal;
  if (modalSupabase) {
    modalSupabase.onclick = (e) => {
      if (e.target === modalSupabase) closeSupabaseModal();
    };
  }

  if (btnSaveSupabase) {
    btnSaveSupabase.onclick = () => {
      const url = inputSupabaseUrl ? inputSupabaseUrl.value.trim() : "";
      const key = inputSupabaseKey ? inputSupabaseKey.value.trim() : "";
      if (!url || !key) {
        alert("Por favor, preencha a URL do Projeto e a Chave Pública (anon key).");
        return;
      }
      if (!url.startsWith("http")) {
        alert("A URL deve começar com https:// (ex: https://seuprojeto.supabase.co)");
        return;
      }
      window.KGestaoDB.setSupabaseKeys(url, key);
    };
  }

  if (btnDisconnectSupabase) {
    btnDisconnectSupabase.onclick = () => {
      if (confirm("Deseja desconectar o Supabase customizado e voltar ao Modo Demonstração?")) {
        window.KGestaoDB.disconnectSupabase();
      }
    };
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
    renderSystemBanner();
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
            <p>Verifique as credenciais do Supabase no botão de configuração acima ou retorne ao modo demonstração.</p>
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
      } else if (b.tipo) {
        typesSet.add(b.tipo);
      }
    });

    let html = `<option value="Todos">Todos os tipos de projeto</option>`;
    typesSet.forEach(t => {
      html += `<option value="${t}">${t}</option>`;
    });
    typeFilterSelect.innerHTML = html;
    typeFilterSelect.value = currentTypeFilter;
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
        const types = Array.isArray(b.tipo) ? b.tipo : [b.tipo];
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
      const isSearchOrFilterActive = currentStatusFilter !== "Todos" || currentTypeFilter !== "Todos" || currentSearchQuery.trim() !== "";

      if (isSearchOrFilterActive) {
        briefingsListEl.innerHTML = `
          <div class="empty-state" style="padding: 48px 24px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🔍</div>
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">Nenhum briefing encontrado</h3>
            <p style="color: var(--tx-secondary); max-width: 440px; margin: 0 auto 16px; font-size: 0.88rem;">
              Não encontramos nenhum briefing com os filtros selecionados (${currentStatusFilter !== "Todos" ? `Status: ${currentStatusFilter}` : ''} ${currentTypeFilter !== "Todos" ? `Tipo: ${currentTypeFilter}` : ''}).
            </p>
            <button class="btn btn-secondary btn-sm" id="btn-reset-filters">
              Limpar Filtros de Busca
            </button>
          </div>
        `;
        const btnReset = document.getElementById("btn-reset-filters");
        if (btnReset) {
          btnReset.onclick = () => {
            currentStatusFilter = "Todos";
            currentTypeFilter = "Todos";
            currentSearchQuery = "";
            if (searchInput) searchInput.value = "";
            if (typeFilterSelect) typeFilterSelect.value = "Todos";
            filterButtons.forEach(b => b.classList.toggle("active", b.dataset.status === "Todos"));
            applyFilters();
          };
        }
      } else {
        briefingsListEl.innerHTML = `
          <div class="empty-state" style="padding: 48px 24px; text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">📋</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 8px;">Nenhum briefing cadastrado no momento</h3>
            <p style="color: var(--tx-secondary); max-width: 480px; margin: 0 auto 20px; font-size: 0.9rem; line-height: 1.5;">
              Sua lista de briefings está limpa. Quando um cliente preencher o formulário no site, ele aparecerá aqui instantaneamente com todas as respostas estruturadas.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" id="btn-empty-restore">
                Restaurar Exemplos de Demonstração
              </button>
              <a href="briefing.html" target="_blank" class="btn btn-secondary btn-sm">
                Abrir Formulário do Cliente ↗
              </a>
            </div>
          </div>
        `;
        const btnRestore = document.getElementById("btn-empty-restore");
        if (btnRestore) {
          btnRestore.onclick = async () => {
            window.KGestaoDB.resetDemoBriefings();
            await loadBriefings();
          };
        }
      }
      return;
    }

    let html = "";
    currentFilteredList.forEach(b => {
      const types = Array.isArray(b.tipo) ? b.tipo : (b.tipo ? [b.tipo] : []);
      const tagsHtml = types.slice(0, 3).map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join("");
      const extraTags = types.length > 3 ? `<span class="tag-badge">+${types.length - 3}</span>` : "";

      html += `
        <div class="briefing-card-item" data-id="${b.id}">
          <div class="b-date">${formatDate(b.created_at)}</div>
          <div>
            <div class="b-client-name">${escapeHtml(b.nome)}</div>
            <div class="b-company-name">${escapeHtml(b.empresa || 'Pessoa Física / Projeto sem empresa')}</div>
          </div>
          <div class="b-tags">
            ${tagsHtml} ${extraTags}
          </div>
          <div style="font-size: 0.8rem; color: var(--tx-tertiary);">
            <div>${escapeHtml(b.prazo || 'Prazo a alinhar')}</div>
            <div style="font-weight: 600; color: var(--tx-secondary);">${escapeHtml(b.verba || '')}</div>
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
    activeBriefing = allBriefings.find(b => String(b.id) === String(id));
    if (!activeBriefing) return;

    drawerNameEl.textContent = activeBriefing.nome;
    drawerMetaEl.innerHTML = `
      <span>${escapeHtml(activeBriefing.empresa || 'Pessoa Física')}</span>
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

  const drawerPanel = drawerEl.querySelector(".drawer-panel");
  if (drawerPanel) {
    drawerPanel.onclick = (e) => e.stopPropagation();
  }

  // Fecha modal com a tecla ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (drawerEl && drawerEl.classList.contains("active")) {
        closeDrawer();
      }
      if (modalSupabase && modalSupabase.style.display === "flex") {
        closeSupabaseModal();
      }
    }
  });

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
          <div class="detail-label">Contato (WhatsApp)</div>
          <div class="detail-value">
            <strong>${escapeHtml(b.contato)}</strong>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Instagram ou Site</div>
          <div class="detail-value">${b.site ? `<a href="${b.site.startsWith('http') ? b.site : 'https://' + b.site}" target="_blank" rel="noopener">${escapeHtml(b.site)}</a>` : 'Não informado'}</div>
        </div>
      </div>

      <!-- 2. O Projeto -->
      <div class="detail-block">
        <div class="detail-block-title">2. Escopo & Negócio</div>
        <div class="detail-row">
          <div class="detail-label">O que o cliente precisa</div>
          <div class="detail-value"><strong style="color: var(--accent);">${escapeHtml(tipos)}</strong></div>
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

  // Função para exportar Dossiê Executivo em PDF Completo
  async function generateExecutivePdf(b) {
    if (!b) return;

    const btnPdf = document.getElementById("drawer-btn-pdf");
    const originalBtnHtml = btnPdf ? btnPdf.innerHTML : "Exportar PDF";
    if (btnPdf) {
      btnPdf.disabled = true;
      btnPdf.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spinPdf 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Gerando PDF...</span>
      `;
    }

    // 1. Overlay visual com feedback Apple para o Diretor
    const overlay = document.createElement("div");
    overlay.id = "pdf-export-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.78)";
    overlay.style.backdropFilter = "blur(14px)";
    overlay.style.webkitBackdropFilter = "blur(14px)";
    overlay.style.zIndex = "9999999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "#ffffff";
    overlay.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    overlay.innerHTML = `
      <div style="width: 46px; height: 46px; border: 3px solid rgba(254, 1, 110, 0.2); border-top-color: #fe016e; border-radius: 50%; animation: spinPdf 0.8s linear infinite; margin-bottom: 16px;"></div>
      <div style="font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em;">Gerando Dossiê em PDF...</div>
      <div style="font-size: 0.84rem; color: #aaaaaa; margin-top: 6px;">Formatando todas as respostas do briefing de ${escapeHtml(b.nome)}</div>
      <style>@keyframes spinPdf { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(overlay);

    // 2. Elemento para renderização com posicionamento visível no viewport (evita PDF em branco do html2canvas)
    const element = document.createElement("div");
    element.id = "pdf-render-element";
    element.style.position = "fixed";
    element.style.left = "0";
    element.style.top = "0";
    element.style.width = "794px"; // Largura A4 a 96DPI
    element.style.padding = "36px 40px";
    element.style.background = "#ffffff";
    element.style.color = "#111111";
    element.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    element.style.lineHeight = "1.5";
    element.style.boxSizing = "border-box";
    element.style.zIndex = "9999998"; // Posicionado imediatamente atrás do overlay

    const tipos = Array.isArray(b.tipo) ? b.tipo.join(", ") : (b.tipo || "Não informado");
    const pers = Array.isArray(b.pers) ? b.pers.join(", ") : (b.pers || "Não informado");

    element.innerHTML = `
      <!-- Topo Oficial -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111111; padding-bottom: 18px; margin-bottom: 22px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="22" height="22" viewBox="595 415 250 245" style="display: inline-block; vertical-align: middle;">
              <polygon fill="#111111" points="600.16,485.66 600.16,570.57 665.38,485.66"/>
              <polygon fill="#111111" points="600.16,655.47 665.38,570.57 600.16,570.57"/>
              <polygon fill="#fe016e" points="774.25,422.05 665.38,570.57 708.85,570.57 774.09,655.47 839.31,655.47 773.99,570.57 730.61,570.57 839.31,422.05"/>
            </svg>
            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #111111;">KGESTÃO DE MARCAS</span>
          </div>
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #fe016e; margin-top: 5px;">Dossiê Estratégico de Briefing & Identidade Visual</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #555555; line-height: 1.45;">
          <div>Data: <strong style="color: #111111;">${new Date(b.created_at).toLocaleDateString('pt-BR')} às ${new Date(b.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong></div>
          <div>Status: <strong style="color: #111111;">${escapeHtml(b.status || 'Novo')}</strong></div>
          <div>Direção Criativa: <strong style="color: #111111;">Kleber Oliveira</strong></div>
        </div>
      </div>

      <!-- Resumo Principal em Destaque -->
      <div style="background: #111111; color: #ffffff; border-radius: 10px; padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #999999; font-weight: 600;">Cliente</div>
          <div style="font-size: 15px; font-weight: 700; color: #ffffff;">${escapeHtml(b.nome || 'Cliente')}</div>
        </div>
        <div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #999999; font-weight: 600;">Marca / Empresa</div>
          <div style="font-size: 15px; font-weight: 700; color: #ffffff;">${escapeHtml(b.empresa || 'Não informado')}</div>
        </div>
        <div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #999999; font-weight: 600;">WhatsApp</div>
          <div style="font-size: 15px; font-weight: 700; color: #fe016e;">${escapeHtml(b.contato || 'Não informado')}</div>
        </div>
        ${b.site ? `
        <div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #999999; font-weight: 600;">Instagram / Site</div>
          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${escapeHtml(b.site)}</div>
        </div>
        ` : ''}
      </div>

      <!-- 1. Informações de Contato -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #fe016e; padding-left: 10px; margin-bottom: 10px;">
          1. Informações de Contato
        </div>
        <div style="background: #fafafc; border: 1px solid #e5e5ea; border-radius: 8px; padding: 14px 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Nome Completo:</div>
              <div style="font-size: 13px; font-weight: 600; color: #111111;">${escapeHtml(b.nome)}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Nome da Marca / Empresa:</div>
              <div style="font-size: 13px; font-weight: 600; color: #111111;">${escapeHtml(b.empresa || 'Não informado')}</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Contato (WhatsApp):</div>
              <div style="font-size: 13px; font-weight: 700; color: #111111;">${escapeHtml(b.contato)}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Instagram ou Site:</div>
              <div style="font-size: 13px; font-weight: 500; color: #111111;">${escapeHtml(b.site || 'Não informado')}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Escopo & Negócio -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #fe016e; padding-left: 10px; margin-bottom: 10px;">
          2. Escopo & Negócio
        </div>
        <div style="background: #fafafc; border: 1px solid #e5e5ea; border-radius: 8px; padding: 14px 16px;">
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">O que o cliente precisa (Entregáveis):</div>
            <div style="font-size: 13px; font-weight: 700; color: #fe016e; margin-top: 2px;">${escapeHtml(tipos)}</div>
          </div>
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">O que a marca faz e seu histórico:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.negocio || 'Não preenchido')}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Por que esse projeto e por que agora? (Ponto de virada):</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.motivo || 'Não preenchido')}</div>
          </div>
        </div>
      </div>

      <!-- 3. Mercado & Posicionamento -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #fe016e; padding-left: 10px; margin-bottom: 10px;">
          3. Público & Posicionamento
        </div>
        <div style="background: #fafafc; border: 1px solid #e5e5ea; border-radius: 8px; padding: 14px 16px;">
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Quem é o cliente ideal (Perfil e hábitos):</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.publico || 'Não preenchido')}</div>
          </div>
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Principal diferencial competitivo da marca:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.dif || 'Não preenchido')}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Concorrentes diretos ou marcas que admira:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.concorr || 'Não preenchido')}</div>
          </div>
        </div>
      </div>

      <!-- 4. Identidade Visual & Atmosfera -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #fe016e; padding-left: 10px; margin-bottom: 10px;">
          4. Identidade & Atmosfera Visual
        </div>
        <div style="background: #fafafc; border: 1px solid #e5e5ea; border-radius: 8px; padding: 14px 16px;">
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Personalidade desejada:</div>
            <div style="font-size: 13px; font-weight: 700; color: #111111; margin-top: 2px;">${escapeHtml(pers)}</div>
          </div>
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Cores preferidas ou a evitar:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; margin-top: 2px;">${escapeHtml(b.cores || 'Não informado')}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Links ou referências visuais:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; margin-top: 2px; word-break: break-all;">${escapeHtml(b.ref || 'Não informado')}</div>
          </div>
        </div>
      </div>

      <!-- 5. Cronograma & Investimento -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #fe016e; padding-left: 10px; margin-bottom: 10px;">
          5. Cronograma & Faixa de Investimento
        </div>
        <div style="background: #fafafc; border: 1px solid #e5e5ea; border-radius: 8px; padding: 14px 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Janela de Prazo:</div>
              <div style="font-size: 13px; font-weight: 600; color: #111111; margin-top: 2px;">${escapeHtml(b.prazo || 'A alinhar')}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Faixa de Investimento Prevista:</div>
              <div style="font-size: 13px; font-weight: 700; color: #fe016e; margin-top: 2px;">${escapeHtml(b.verba || 'Não informado')}</div>
            </div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #777777; text-transform: uppercase;">Observações Adicionais / Requisitos Extras:</div>
            <div style="font-size: 12.5px; font-weight: 500; color: #111111; white-space: pre-wrap; margin-top: 2px;">${escapeHtml(b.extra || 'Nenhuma observação')}</div>
          </div>
        </div>
      </div>

      ${b.notas_internas ? `
      <!-- 6. Anotações Internas -->
      <div style="margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; border-left: 3px solid #111111; padding-left: 10px; margin-bottom: 10px;">
          Anotações Internas do Diretor
        </div>
        <div style="background: #fff8e6; border: 1px solid #e8dbb0; border-radius: 8px; padding: 14px 16px; font-size: 12px; color: #5a4200; white-space: pre-wrap;">
          ${escapeHtml(b.notas_internas)}
        </div>
      </div>
      ` : ''}

      <!-- Rodapé Oficial do Dossiê -->
      <div style="margin-top: 26px; padding-top: 14px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #777777; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>KGESTÃO DE MARCAS</strong> • Identidade Visual & Design Estratégico</div>
        <div>Diretor Criativo: Kleber Oliveira • ${escapeHtml(marca.whatsapp || '11 98346-7706')}</div>
      </div>
    `;

    document.body.appendChild(element);

    function cleanup() {
      if (element.parentNode) document.body.removeChild(element);
      if (overlay.parentNode) document.body.removeChild(overlay);
      if (btnPdf) {
        btnPdf.disabled = false;
        btnPdf.innerHTML = originalBtnHtml;
      }
    }

    const safeName = (b.empresa || b.nome || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Dossie-Briefing-${safeName}.pdf`;

    // 1. Tenta gerar e baixar diretamente o PDF via html2pdf
    if (typeof html2pdf !== "undefined") {
      try {
        const opt = {
          margin: [10, 8, 10, 8],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        await html2pdf().set(opt).from(element).save();
        cleanup();
        return;
      } catch (err) {
        console.warn("Falha no html2pdf, acionando fallback de impressão:", err);
      }
    }

    // 2. Fallback de alta precisão via janela de impressão nativa (Permite 'Salvar como PDF')
    cleanup();
    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { margin: 0; padding: 0; background: #ffffff; color: #111111; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          <div style="max-width: 794px; margin: 0 auto;">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    } else {
      window.print();
    }
  }

  // Botão PDF / Exportar Dossiê
  if (drawerBtnPdf) {
    drawerBtnPdf.onclick = () => {
      if (!activeBriefing) return;
      generateExecutivePdf(activeBriefing);
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
          drawerBtnCopy.textContent = "Copiar";
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
          allBriefings = allBriefings.filter(b => String(b.id) !== String(activeBriefing.id));
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

  // Botão de Logout do Diretor
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.onclick = () => {
      if (confirm("Deseja realmente sair do painel administrativo?")) {
        if (window.KGestaoDB && window.KGestaoDB.logout) {
          window.KGestaoDB.logout();
        } else {
          sessionStorage.removeItem("kgestao_director_session");
          localStorage.removeItem("kgestao_director_session");
          window.location.replace("login.html");
        }
      }
    };
  }

  // Inicialização
  await loadBriefings();
});
