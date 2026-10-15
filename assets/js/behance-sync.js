/**
 * ===================================================================
 *  KGestão de Marcas - Sincronização Automática com o Behance
 *  Busca e renderiza os 3 últimos projetos publicados no Behance
 * ===================================================================
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initBehanceSync();
    setupPortfolioCarousel();
  });

  function initBehanceSync() {
    const config = window.KGESTAO_CONFIG || {};
    const behanceConf = config.behance || {};
    const username = (behanceConf.username || "kleberoliveirapsd").trim();
    const limit = behanceConf.limiteProjetos || 3;
    const syncAutomatico = behanceConf.syncAutomatico === true;
    const fallbackProjects = behanceConf.projetosFallback || [
      {
        titulo: "SophChat • AI",
        subtitulo: "Design de produto, inteligência artificial e interface conversacional",
        imagem: "assets/img/project-sophchat.png?v=3",
        url: "https://www.behance.net/gallery/253025285/SophChat-AI"
      },
      {
        titulo: "Branding • LTX Academy",
        subtitulo: "Identidade visual corporativa, tipografia suíça e ecossistema financeiro",
        imagem: "assets/img/project-ltx.png?v=3",
        url: "https://www.behance.net/gallery/217478407/Branding-LTX-Academy"
      },
      {
        titulo: "CRMax • Brand & Posicionamento",
        subtitulo: "Posicionamento de alto valor, design minimalista e identidade de marca",
        imagem: "assets/img/project-crmax.png?v=3",
        url: "https://www.behance.net/gallery/240446989/CRMax-Brand"
      }
    ];

    const container = document.querySelector(".showcase-cards-list");
    if (!container) return;

    // Atualiza links de "Ver portfólio completo"
    const viewAllLink = document.getElementById("behance-view-all");
    const fullPortfolioBtn = document.getElementById("btn-full-portfolio");
    const profileUrl = behanceConf.perfilUrl || `https://www.behance.net/${username}`;
    if (viewAllLink) viewAllLink.href = profileUrl;
    if (fullPortfolioBtn) fullPortfolioBtn.href = profileUrl;

    // Se a curadoria manual estiver ativa (syncAutomatico = false), renderiza os 3 projetos escolhidos
    if (!syncAutomatico) {
      renderProjects(fallbackProjects, container, profileUrl, false);
      updateLiveBadge(false);
      return;
    }

    // 1. Tentar carregar do cache local primeiro (Instantâneo para mobile!)
    const cacheKey = `kgestao_behance_cache_${username}_v3`;
    let loadedFromCache = false;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache válido por 30 minutos
        if (Array.isArray(data) && data.length > 0 && Date.now() - timestamp < 30 * 60 * 1000) {
          renderProjects(data, container, profileUrl, true);
          loadedFromCache = true;
        }
      }
    } catch (e) {
      console.warn("Erro ao ler cache do Behance:", e);
    }

    // Se não tinha cache, renderiza os projetos curados de fallback imediatamente
    // para que o visitante NUNCA veja a tela vazia
    if (!loadedFromCache) {
      renderProjects(fallbackProjects, container, profileUrl, false);
    }

    // 2. Busca os dados frescos do Behance em segundo plano
    fetchBehanceProjects(username, limit)
      .then((freshProjects) => {
        if (freshProjects && freshProjects.length > 0) {
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data: freshProjects, timestamp: Date.now() })
            );
          } catch (err) {}
          renderProjects(freshProjects, container, profileUrl, true);
          updateLiveBadge(true);
        }
      })
      .catch((err) => {
        console.info("Usando projetos locais do estúdio (Behance offline ou em rate-limit):", err.message);
        updateLiveBadge(false);
      });
  }

  /**
   * Tenta buscar projetos do Behance através de múltiplos endpoints/proxies resilientes
   */
  async function fetchBehanceProjects(username, limit) {
    if (!username) throw new Error("Usuário Behance não configurado.");

    const rssUrl = `https://www.behance.net/feeds/user?username=${username}`;

    // Lista de estratégias de busca em cascata
    const strategies = [
      // Estratégia 1: allorigins (retorna JSON com conteúdo XML)
      async () => {
        const res = await fetchWithTimeout(
          `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
          6000
        );
        if (!res.ok) throw new Error("Allorigins status " + res.status);
        const json = await res.json();
        if (!json.contents) throw new Error("Sem conteúdo no Allorigins");
        return parseRssXml(json.contents, limit);
      },

      // Estratégia 2: rss2json
      async () => {
        const res = await fetchWithTimeout(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
          6000
        );
        if (!res.ok) throw new Error("rss2json status " + res.status);
        const json = await res.json();
        if (json.status !== "ok" || !json.items || json.items.length === 0) {
          throw new Error("rss2json sem itens");
        }
        return parseRss2JsonItems(json.items, limit);
      },

      // Estratégia 3: corsproxy.io
      async () => {
        const res = await fetchWithTimeout(
          `https://corsproxy.io/?url=${encodeURIComponent(rssUrl)}`,
          6000
        );
        if (!res.ok) throw new Error("corsproxy status " + res.status);
        const xml = await res.text();
        return parseRssXml(xml, limit);
      }
    ];

    let lastError = null;
    for (const strategy of strategies) {
      try {
        const items = await strategy();
        if (items && items.length > 0) {
          return items.slice(0, limit);
        }
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError || new Error("Não foi possível carregar o feed do Behance");
  }

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
  }

  /**
   * Faz o parse do XML padrão do RSS do Behance
   */
  function parseRssXml(xmlString, limit) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    if (!items || items.length === 0) {
      throw new Error("Nenhum item <item> encontrado no XML do Behance.");
    }

    const projects = [];
    const max = Math.min(items.length, limit);

    for (let i = 0; i < max; i++) {
      const item = items[i];
      const title = item.querySelector("title")?.textContent?.trim() || "Projeto Behance";
      const link = item.querySelector("link")?.textContent?.trim() || "https://www.behance.net";
      const descHtml = item.querySelector("description")?.textContent || "";

      // Extrai imagem de capa do HTML dentro da descrição
      const imgMatch = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
      let imagem = imgMatch ? imgMatch[1] : "";

      // Se a imagem for baixa resolução, tenta substituir por versão de maior definição
      if (imagem.includes("/projects/404/")) {
        imagem = imagem.replace("/projects/404/", "/projects/max_808/");
      } else if (imagem.includes("/projects/202/")) {
        imagem = imagem.replace("/projects/202/", "/projects/max_808/");
      }

      // Extrai texto limpo de subtítulo
      let subtitulo = descHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (!subtitulo || subtitulo.length < 5) {
        subtitulo = "Identidade visual corporativa, branding e direção de arte";
      } else if (subtitulo.length > 85) {
        subtitulo = subtitulo.substring(0, 82) + "...";
      }

      projects.push({
        titulo: title,
        subtitulo: subtitulo,
        imagem: imagem || "logo/identidade-visual/04.jpg",
        url: link
      });
    }

    return projects;
  }

  /**
   * Faz o parse do formato rss2json
   */
  function parseRss2JsonItems(items, limit) {
    const projects = [];
    const max = Math.min(items.length, limit);

    for (let i = 0; i < max; i++) {
      const item = items[i];
      const title = item.title || "Projeto Behance";
      const link = item.link || "https://www.behance.net";

      let imagem = item.thumbnail || "";
      if (!imagem && item.description) {
        const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) imagem = imgMatch[1];
      }

      if (imagem.includes("/projects/404/")) {
        imagem = imagem.replace("/projects/404/", "/projects/max_808/");
      }

      let subtitulo = "";
      if (item.description) {
        subtitulo = item.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
      if (!subtitulo || subtitulo.length < 5) {
        subtitulo = "Identidade visual corporativa, branding e direção de arte";
      } else if (subtitulo.length > 85) {
        subtitulo = subtitulo.substring(0, 82) + "...";
      }

      projects.push({
        titulo: title,
        subtitulo: subtitulo,
        imagem: imagem || "logo/identidade-visual/04.jpg",
        url: link
      });
    }

    return projects;
  }

  /**
   * Renderiza os 3 cards de projeto no container da página
   */
  function renderProjects(projects, container, profileUrl, isLiveBehance) {
    if (!projects || projects.length === 0) return;

    let html = "";
    projects.forEach((proj, idx) => {
      const numFormatted = String(idx + 1).padStart(2, "0");
      const safeTitle = escapeHtml(proj.titulo);
      const safeDesc = escapeHtml(proj.subtitulo);
      const safeImg = escapeHtml(proj.imagem);
      const safeUrl = escapeHtml(proj.url || profileUrl);

      html += `
        <article class="showcase-item-card" data-behance-item="${idx}">
          <a href="${safeUrl}" target="_blank" rel="noopener" class="showcase-img-wrap" title="Ver ${safeTitle}">
            <img 
              src="${safeImg}" 
              alt="${safeTitle}" 
              class="showcase-img" 
              loading="lazy" 
              onerror="this.src='logo/identidade-visual/0${(idx % 3) + 1}.jpg'"
            >
          </a>
          <div class="showcase-info-bar">
            <div class="showcase-title-box">
              <span class="showcase-proj-name">${safeTitle}</span>
              <span class="showcase-proj-desc">${safeDesc}</span>
            </div>
            <a href="${safeUrl}" target="_blank" rel="noopener" class="showcase-action-btn-pink" title="Ver projeto">
              <span data-i18n="portfolio_view_project">Ver projeto</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    setupPortfolioCarousel();

    if (window.setLanguage && window.getCurrentLang) {
      window.setLanguage(window.getCurrentLang());
    }
  }

  /**
   * Configuração do Carrossel Arrastável do Portfólio (Drag, Swipe, Arrows, Dots & Contador)
   */
  function setupPortfolioCarousel() {
    const carousel = document.getElementById("portfolio-carousel") || document.querySelector(".showcase-cards-list");
    if (!carousel) return;

    const cards = carousel.querySelectorAll(".showcase-item-card");
    const total = cards.length;
    if (total === 0) return;

    const counterEl = document.getElementById("carousel-counter");
    const dotsWrap = document.getElementById("carousel-dots");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    function getCurrentIndex() {
      const currentCards = carousel.querySelectorAll(".showcase-item-card");
      if (currentCards.length === 0) return 0;
      const scrollPos = carousel.scrollLeft;
      let closestIdx = 0;
      let minDiff = Infinity;
      currentCards.forEach((c, i) => {
        const diff = Math.abs(c.offsetLeft - carousel.offsetLeft - scrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });
      return closestIdx;
    }

    function updateActiveState(idx) {
      const currentCards = carousel.querySelectorAll(".showcase-item-card");
      const currentTotal = currentCards.length || 1;
      const clampedIdx = Math.max(0, Math.min(currentTotal - 1, idx));

      if (counterEl) {
        const currNum = String(clampedIdx + 1).padStart(2, "0");
        const totNum = String(currentTotal).padStart(2, "0");
        counterEl.innerHTML = `<span class="counter-curr">${currNum}</span> <span class="counter-div">/</span> <span class="counter-tot">${totNum}</span>`;
      }

      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll(".carousel-dot");
        dots.forEach((dot, dIdx) => {
          if (dIdx === clampedIdx) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });
      }

      if (prevBtn) {
        prevBtn.style.opacity = clampedIdx === 0 ? "0.35" : "1";
        prevBtn.style.pointerEvents = clampedIdx === 0 ? "none" : "auto";
      }
      if (nextBtn) {
        nextBtn.style.opacity = clampedIdx === currentTotal - 1 ? "0.35" : "1";
        nextBtn.style.pointerEvents = clampedIdx === currentTotal - 1 ? "none" : "auto";
      }
    }

    function scrollToCard(idx) {
      const currentCards = carousel.querySelectorAll(".showcase-item-card");
      if (currentCards[idx]) {
        carousel.scrollTo({
          left: currentCards[idx].offsetLeft - carousel.offsetLeft,
          behavior: "smooth"
        });
        updateActiveState(idx);
      }
    }

    // Cria/atualiza os dots interativos
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
        dot.setAttribute("data-index", i);
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => {
          scrollToCard(i);
        });
        dotsWrap.appendChild(dot);
      }
    }

    updateActiveState(getCurrentIndex());

    // Se os listeners de scroll e interação já foram registrados, não duplica
    if (carousel._carouselInitialized) {
      return;
    }
    carousel._carouselInitialized = true;

    // Listener de rolagem para sincronizar dots e contador
    let scrollRaf = null;
    carousel.addEventListener("scroll", () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        updateActiveState(getCurrentIndex());
      });
    }, { passive: true });

    // Botões Anterior / Próximo
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const curr = getCurrentIndex();
        if (curr > 0) {
          scrollToCard(curr - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const currentCards = carousel.querySelectorAll(".showcase-item-card");
        const curr = getCurrentIndex();
        if (curr < currentCards.length - 1) {
          scrollToCard(curr + 1);
        }
      });
    }

    // Suporte a Arrastar com o Mouse (Desktop Click-and-Drag)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    carousel.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      carousel.classList.add("is-dragging");
      startX = e.pageX - carousel.offsetLeft;
      scrollStart = carousel.scrollLeft;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.35;
      if (Math.abs(walk) > 6) {
        hasDragged = true;
      }
      carousel.scrollLeft = scrollStart - walk;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove("is-dragging");

      if (hasDragged) {
        const targetIdx = getCurrentIndex();
        scrollToCard(targetIdx);
        setTimeout(() => {
          hasDragged = false;
        }, 80);
      }
    });

    // Impede clique indesejado em links dos cards caso o usuário tenha apenas arrastado
    carousel.addEventListener(
      "click",
      (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true // capture phase
    );
  }

  function updateLiveBadge(isLive) {
    const badgeEl = document.getElementById("behance-sync-badge");
    if (!badgeEl) return;
    if (isLive) {
      badgeEl.innerHTML = `
        <span class="behance-badge-dot pulse-green"></span>
        <span>Sincronizado com Behance</span>
      `;
      badgeEl.style.display = "inline-flex";
    } else {
      badgeEl.innerHTML = `
        <span class="behance-badge-dot dot-neutral"></span>
        <span>Portfólio em Destaque</span>
      `;
      badgeEl.style.display = "inline-flex";
    }
  }

  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
