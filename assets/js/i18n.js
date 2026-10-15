/**
 * ===================================================================
 *  KGestão de Marcas - Internacionalização (Português / Inglês)
 *  Tradução dinâmica com bandeiras 🇧🇷 e 🇺🇸 e persistência local
 * ===================================================================
 */

(function () {
  "use strict";

  const TRANSLATIONS = {
    pt: {
      status_available: "Disponível para novos projetos",
      hero_title: "Kleber Oliveira",
      hero_role: "Designer",
      hero_bio: "Designer gráfico e diretor criativo há 8 anos, especialista em identidade visual, rebranding e posicionamento estratégico de alto valor. Fundador da KGestão de Marcas.",
      cta_title: "Solicitar Orçamento",
      cta_subtitle: "Sites, Páginas de vendas, Logotipos, Identidades Visuais e criativos.",
      card1_title: "Site K-Gestão de Marcas",
      card1_desc: "Conheça nossas soluções completas de branding e posicionamento.",
      card2_title: "Portfólio Completo",
      card2_desc: "Últimos projetos publicados no Behance, identidades e 3D.",
      card3_title: "Formulário de IDV/Logo",
      card3_desc: "Preencha em 5 etapas rápidas e receba proposta personalizada.",
      portfolio_title: "Portfólio",
      portfolio_subtitle: "Projetos selecionados de branding, interfaces e posicionamento estratégico.",
      portfolio_view_project: "Ver projeto",
      portfolio_view_all: "Ver portfólio completo",
      portfolio_sync_live: "Sincronizado com Behance",
      portfolio_sync_featured: "Portfólio em Destaque",
      portfolio_start_proj: "Iniciar Projeto",
      portfolio_view_behance: "Behance",
      footer_tagline: "Estúdio de branding, design e posicionamento estratégico para marcas que desejam cobrar mais e dominar seu mercado.",
      footer_btn_wa: "Chamar no WhatsApp",
      footer_btn_email: "Enviar E-mail",
      footer_copy: "© 2026 Kleber Oliveira • KGestão de Marcas",
      back_to_home: "Voltar ao Início",
      briefing_welcome_title: "Formulário de Identidade Visual & Logo",
      briefing_welcome_desc: "Para desenvolvermos uma identidade com posicionamento de alto valor, precisamos compreender a fundo a essência do seu negócio, seus diferenciais competitivos e a ambição da sua marca.",
      briefing_duration: "Duração: <strong>~5 minutos</strong>",
      briefing_saving: "Salvamento: <strong>Automático no celular</strong>",
      briefing_analysis: "Análise Direta: <strong>Kleber Oliveira</strong>",
      briefing_btn_start: "Responder Briefing",
      briefing_page_title: "Formulário de IDV & Logo",
      briefing_pill_time: "~5 minutos",
      briefing_pill_save: "Salvo automaticamente",
      briefing_pill_director: "Direção: Kleber Oliveira",
      briefing_btn_back_home: "Voltar ao Início",
      briefing_btn_back: "Voltar",
      briefing_btn_next: "Continuar",
      briefing_btn_review: "Revisar Respostas",
      briefing_autosave_text: "Salvo no navegador"
    },
    en: {
      status_available: "Available for new projects",
      hero_title: "Kleber Oliveira",
      hero_role: "Designer",
      hero_bio: "Graphic designer & creative director for 8 years, specialist in brand identity, rebranding, and high-value strategic positioning. Founder of KGestão de Marcas.",
      cta_title: "Request a Quote",
      cta_subtitle: "Websites, Sales Pages, Logos, Brand Identities & Creative Assets.",
      card1_title: "K-Gestão de Marcas Website",
      card1_desc: "Explore our complete branding and strategic positioning solutions.",
      card2_title: "Full Portfolio",
      card2_desc: "Latest projects published on Behance, brand identities & 3D.",
      card3_title: "Brand Identity / Logo Form",
      card3_desc: "Fill in 5 quick steps and receive a customized proposal.",
      portfolio_title: "Portfolio",
      portfolio_subtitle: "Selected brand identity, interface, and strategic positioning projects.",
      portfolio_view_project: "View project",
      portfolio_view_all: "View full portfolio",
      portfolio_sync_live: "Synced with Behance",
      portfolio_sync_featured: "Featured Portfolio",
      portfolio_start_proj: "Start Project",
      portfolio_view_behance: "Behance",
      footer_tagline: "Branding, design, and strategic positioning studio for brands looking to charge premium and dominate their market.",
      footer_btn_wa: "Chat on WhatsApp",
      footer_btn_email: "Send Email",
      footer_copy: "© 2026 Kleber Oliveira • KGestão de Marcas",
      back_to_home: "Back to Home",
      briefing_welcome_title: "Brand Identity & Logo Form",
      briefing_welcome_desc: "To develop an identity with high-value positioning, we need to deeply understand the essence of your business, competitive advantages, and brand ambition.",
      briefing_duration: "Duration: <strong>~5 minutes</strong>",
      briefing_saving: "Saving: <strong>Automatic on phone</strong>",
      briefing_analysis: "Direct Review: <strong>Kleber Oliveira</strong>",
      briefing_btn_start: "Start Briefing",
      briefing_page_title: "Brand Identity & Logo Form",
      briefing_pill_time: "~5 minutes",
      briefing_pill_save: "Auto-saved",
      briefing_pill_director: "Direction: Kleber Oliveira",
      briefing_btn_back_home: "Back to Home",
      briefing_btn_back: "Back",
      briefing_btn_next: "Continue",
      briefing_btn_review: "Review Answers",
      briefing_autosave_text: "Saved in browser"
    }
  };

  window.KGESTAO_I18N = TRANSLATIONS;

  function getCurrentLang() {
    return localStorage.getItem("kgestao_lang") || "pt";
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = "pt";
    localStorage.setItem("kgestao_lang", lang);
    document.documentElement.setAttribute("lang", lang === "en" ? "en-US" : "pt-BR");

    const dict = TRANSLATIONS[lang];

    // Atualiza todos os elementos que possuem data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Atualiza botões de seleção de idioma na UI
    const btnPt = document.getElementById("lang-pt");
    const btnEn = document.getElementById("lang-en");

    if (btnPt && btnEn) {
      if (lang === "pt") {
        btnPt.classList.add("active");
        btnEn.classList.remove("active");
      } else {
        btnEn.classList.add("active");
        btnPt.classList.remove("active");
      }
    }
  }

  window.setLanguage = setLanguage;
  window.getCurrentLang = getCurrentLang;

  document.addEventListener("DOMContentLoaded", () => {
    const initialLang = getCurrentLang();
    setLanguage(initialLang);

    const btnPt = document.getElementById("lang-pt");
    const btnEn = document.getElementById("lang-en");

    if (btnPt) {
      btnPt.onclick = () => setLanguage("pt");
    }
    if (btnEn) {
      btnEn.onclick = () => setLanguage("en");
    }
  });
})();
