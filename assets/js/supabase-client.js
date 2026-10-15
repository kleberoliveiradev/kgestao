/**
 * ===================================================================
 *  KGestão de Marcas - Camada de Conexão com Supabase & Mock Mode
 * ===================================================================
 * 
 *  Este arquivo conecta o sistema com o Supabase.
 *  Se as chaves ainda não estiverem configuradas no config.js,
 *  ele ativa automaticamente o MODO DEMONSTRAÇÃO com dados reais de teste,
 *  permitindo que o Kleber teste tudo imediatamente sem travar.
 */

(function() {
  const config = window.KGESTAO_CONFIG || {};
  const supabaseConfig = config.supabase || {};
  const storedUrl = localStorage.getItem("kgestao_supabase_url");
  const storedKey = localStorage.getItem("kgestao_supabase_key");
  const activeUrl = storedUrl || supabaseConfig.url;
  const activeKey = storedKey || supabaseConfig.anonKey;

  // Verifica se as chaves são válidas
  const hasValidSupabaseKeys = Boolean(
    activeUrl && 
    activeKey && 
    activeUrl.startsWith("http") && 
    !activeUrl.includes("xyzcompany")
  );

  let supabaseClient = null;
  if (hasValidSupabaseKeys && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(activeUrl, activeKey);
    } catch (e) {
      console.warn("Erro ao inicializar Supabase, usando Modo Demo:", e);
    }
  }

  // Dados iniciais de demonstração ricos e realistas
  const INITIAL_DEMO_DATA = [
    {
      id: "demo-1",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 horas atrás
      nome: "Carolina Mendez",
      empresa: "Aura Joias Contemporâneas",
      contato: "11987654321",
      site: "@aurajoias",
      tipo: ["Identidade visual", "Embalagens"],
      negocio: "Joalheria artesanal com prata reciclada e gemas brasileiras. Operamos há 2 anos no Instagram e queremos abrir nosso primeiro espaço físico em Moema.",
      motivo: "Nossa marca atual foi feita no Canva quando começamos. Agora vendemos peças de ticket médio R$ 800+ e precisamos de uma identidade visual que passe autoridade, luxo discreto e confiança.",
      publico: "Mulheres entre 28 e 50 anos, profissionais liberais, que apreciam elegância contemporânea e sustentabilidade.",
      dif: "Design autoral exclusivo, prata 950 com garantia vitalícia e embalagens de veludo reaproveitáveis.",
      concorr: "Vivara, Monte Carlo, Dryzun e marcas autorais de pinheiros.",
      pers: ["Premium", "Minimalista", "Acolhedora"],
      cores: "Verde oliva profundo, dourado suave champagne e off-white. Evitar tons saturados ou infantilizados.",
      ref: "https://pinterest.com/aura-refs - Adoro o minimalismo da Céline antiga e a tipografia das marcas de nicho italianas.",
      prazo: "Até 30 dias",
      verba: "R$ 3.000 a R$ 6.000",
      extra: "Gostaria de já prever o projeto das caixas rígidas e sacolas na entrega.",
      status: "Novo",
      notas_internas: "Cliente com excelente fit. Contatar nesta quinta-feira para agendar alinhamento por vídeo."
    },
    {
      id: "demo-2",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Ontem
      nome: "Lucas Albuquerque",
      empresa: "Origem Café & Torra",
      contato: "lucas@origemcafe.com.br",
      site: "https://origemcafe.com.br",
      tipo: ["Rebranding", "Embalagens"],
      negocio: "Microtorrefação de cafés especiais de pequenos produtores de Minas e Espírito Santo. Já temos 4 anos de mercado.",
      motivo: "Nosso café é premiado, mas a embalagem nos supermercados gourmet não se destaca da concorrência tradicional.",
      publico: "Amantes de cafés especiais, baristas e consumidores gourmet de 25 a 45 anos.",
      dif: "Rastreabilidade de cada lote com QR Code do produtor e perfil sensorial detalhado.",
      concorr: "Coffee Lab, Isso É Café, Orfeu",
      pers: ["Moderna", "Natural", "Ousada"],
      cores: "Tons terrosos, terracota, preto fosco e detalhes em cobre.",
      ref: "Cafés de Melbourne e cafeterias do Brooklyn em NY.",
      prazo: "1 a 3 meses",
      verba: "Acima de R$ 6.000",
      extra: "Temos urgência especial na linha de pacotes de 250g.",
      status: "Em análise",
      notas_internas: "Orçamento preliminar enviado. Lucas pediu para aguardar retorno da sócia até segunda-feira."
    },
    {
      id: "demo-3",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 dias atrás
      nome: "Dra. Renata Vianna",
      empresa: "Clínica Vianna Dermatologia",
      contato: "11971234567",
      site: "@dravianna.dermato",
      tipo: ["Identidade visual", "Site / Landing page"],
      negocio: "Dermatologia estética e saúde da pele em clínica premium no Jardim Paulista.",
      motivo: "Vou inaugurar nova sede com 3 consultórios e quero unificar a comunicação visual de toda a clínica.",
      publico: "Pacientes A/A+ que buscam rejuvenescimento natural e protocolos de alta tecnologia.",
      dif: "Abordagem integrativa, atendimento super personalizado e equipamentos de última geração.",
      concorr: "Clínicas do Itaim Bibi",
      pers: ["Premium", "Moderna", "Séria"],
      cores: "Fundo areia claro, cinza chumbo e dourado fosco.",
      ref: "Estética limpa, editorial, tipografia serifada sofisticada.",
      prazo: "Urgente (até 15 dias)",
      verba: "Acima de R$ 6.000",
      extra: "Preciso também de papelaria timbrada e receituários.",
      status: "Em andamento",
      notas_internas: "Contrato assinado. Apresentação do conceito visual agendada para o dia 20."
    }
  ];

  // Helper para persistência local do modo demo
  function getLocalMockBriefings() {
    try {
      const stored = localStorage.getItem("kgestao_mock_briefings");
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Erro ao ler localStorage:", e);
    }
    // Salva o inicial se ainda não tiver
    localStorage.setItem("kgestao_mock_briefings", JSON.stringify(INITIAL_DEMO_DATA));
    return INITIAL_DEMO_DATA;
  }

  function saveLocalMockBriefings(list) {
    try {
      localStorage.setItem("kgestao_mock_briefings", JSON.stringify(list));
    } catch (e) {
      console.warn("Erro ao salvar localStorage:", e);
    }
  }

  // API Unificada que abstrai se está no Supabase ou no Demo Mode
  window.KGestaoDB = {
    isDemoMode: !supabaseClient,

    // 1. Salvar novo briefing (usado pelo cliente no index.html)
    async createBriefing(dados) {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from("briefings")
          .insert([dados])
          .select();

        if (error) {
          console.error("Erro no Supabase ao salvar briefing:", error);
          throw error;
        }
        return data[0];
      } else {
        // Fallback Demo Mode
        const list = getLocalMockBriefings();
        const novo = {
          id: "local-" + Date.now(),
          created_at: new Date().toISOString(),
          status: "Novo",
          notas_internas: "",
          ...dados
        };
        list.unshift(novo);
        saveLocalMockBriefings(list);
        return novo;
      }
    },

    // 2. Buscar todos os briefings (usado no dashboard.html)
    async getBriefings() {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from("briefings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro no Supabase ao buscar briefings:", error);
          throw error;
        }
        return data || [];
      } else {
        // Fallback Demo Mode
        return getLocalMockBriefings();
      }
    },

    // 3. Atualizar Status do Briefing
    async updateStatus(id, novoStatus) {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from("briefings")
          .update({ status: novoStatus })
          .eq("id", id)
          .select();

        if (error) throw error;
        return data[0];
      } else {
        const list = getLocalMockBriefings();
        const item = list.find(b => b.id === id);
        if (item) {
          item.status = novoStatus;
          saveLocalMockBriefings(list);
        }
        return item;
      }
    },

    // 4. Salvar Notas Internas do Kleber
    async updateNotas(id, notas) {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from("briefings")
          .update({ notas_internas: notas })
          .eq("id", id)
          .select();

        if (error) throw error;
        return data[0];
      } else {
        const list = getLocalMockBriefings();
        const item = list.find(b => b.id === id);
        if (item) {
          item.notas_internas = notas;
          saveLocalMockBriefings(list);
        }
        return item;
      }
    },

    // 5. Excluir Briefing (se necessário)
    async deleteBriefing(id) {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from("briefings")
          .delete()
          .eq("id", id);

        if (error) throw error;
        return true;
      } else {
        let list = getLocalMockBriefings();
        list = list.filter(b => b.id !== id);
        saveLocalMockBriefings(list);
        return true;
      }
    },

    // 6. Autenticação Exclusiva do Diretor para o Dashboard (Fixo e Eterno)
    async login(username, password, remember = false) {
      const cfg = window.KGESTAO_CONFIG || {};
      const adminCfg = cfg.admin || { usuario: "kleberoliveira", senha: "89545720!" };
      const userClean = (username || "").trim().toLowerCase();
      const passClean = (password || "").trim();

      const validUsers = [
        "kleberoliveira",
        "kleber",
        "design",
        "design.excelencia@gmail.com",
        "contato@kgestao.com.br",
        (adminCfg.usuario || "").toLowerCase(),
        (cfg.marca?.email || "").toLowerCase()
      ].filter(Boolean);

      // Validação da senha fixa e eterna
      const isMasterUser = validUsers.includes(userClean);
      const isMasterPass = (passClean === "89545720!") || (passClean === adminCfg.senha);

      if (isMasterUser && isMasterPass) {
        const sessionData = {
          user: cfg.marca?.diretor || "Kleber Oliveira",
          login: "kleberoliveira",
          email: cfg.marca?.email || "design.excelencia@gmail.com",
          loggedAt: new Date().toISOString()
        };
        const str = JSON.stringify(sessionData);
        sessionStorage.setItem("kgestao_director_session", str);
        if (remember) {
          localStorage.setItem("kgestao_director_session", str);
        }
        return sessionData;
      }

      // 2. Se Supabase estiver conectado, tenta autenticação oficial no Supabase Auth
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: username,
            password: password
          });
          if (!error && data?.user) {
            const sessionData = {
              user: data.user.email,
              email: data.user.email,
              loggedAt: new Date().toISOString()
            };
            const str = JSON.stringify(sessionData);
            sessionStorage.setItem("kgestao_director_session", str);
            if (remember) {
              localStorage.setItem("kgestao_director_session", str);
            }
            return sessionData;
          }
        } catch (e) {
          console.warn("Supabase auth erro:", e);
        }
      }

      throw new Error("Credenciais incorretas. Acesso restrito exclusivamente ao Diretor.");
    },

    logout() {
      if (supabaseClient) {
        try { supabaseClient.auth.signOut(); } catch (e) {}
      }
      sessionStorage.removeItem("kgestao_director_session");
      localStorage.removeItem("kgestao_director_session");
      localStorage.removeItem("kgestao_demo_logged");
      window.location.replace("login.html");
    },

    isAuthenticated() {
      const s = sessionStorage.getItem("kgestao_director_session") || localStorage.getItem("kgestao_director_session");
      return Boolean(s);
    },

    getCurrentDirector() {
      try {
        const s = sessionStorage.getItem("kgestao_director_session") || localStorage.getItem("kgestao_director_session");
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    },

    getSupabaseConfig() {
      return {
        url: localStorage.getItem("kgestao_supabase_url") || supabaseConfig.url || "",
        key: localStorage.getItem("kgestao_supabase_key") || supabaseConfig.anonKey || "",
        isCustom: Boolean(localStorage.getItem("kgestao_supabase_url")),
        isConnected: Boolean(supabaseClient)
      };
    },

    setSupabaseKeys(url, key) {
      if (url && key) {
        localStorage.setItem("kgestao_supabase_url", url.trim());
        localStorage.setItem("kgestao_supabase_key", key.trim());
      } else {
        localStorage.removeItem("kgestao_supabase_url");
        localStorage.removeItem("kgestao_supabase_key");
      }
      location.reload();
    },

    disconnectSupabase() {
      localStorage.removeItem("kgestao_supabase_url");
      localStorage.removeItem("kgestao_supabase_key");
      location.reload();
    },

    clearAllBriefings() {
      localStorage.setItem("kgestao_mock_briefings", JSON.stringify([]));
    },

    resetDemoBriefings() {
      localStorage.setItem("kgestao_mock_briefings", JSON.stringify(INITIAL_DEMO_DATA));
    }
  };
})();
