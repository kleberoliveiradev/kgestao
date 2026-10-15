/**
 * ===================================================================
 *  KGestão de Marcas - Configurações Gerais do Sistema de Briefing
 * ===================================================================
 * 
 *  Olá, Kleber! Este é o arquivo onde você coloca seus dados e
 *  as chaves do Supabase quando criar sua conta gratuita.
 * 
 *  DICA: Enquanto você não colocar as chaves do Supabase, o sistema
 *  funciona automaticamente em "MODO DEMONSTRAÇÃO" com dados de teste
 *  para você ver tudo funcionando no seu computador agora mesmo!
 */

window.KGESTAO_CONFIG = {
  // Informações da sua Marca
  marca: {
    nome: "KGestão de Marcas",
    diretor: "Kleber Oliveira",
    whatsapp: "5511983467706", // WhatsApp oficial de Kleber Oliveira
    email: "contato@kgestao.com.br", // Seu e-mail de contato
    instagram: "@kgestaodemarcas",
    instagramUrl: "https://www.instagram.com/kgestaodemarcas/",
    site: "https://kgestao.com.br"
  },

  // Configuração do Portfólio Behance
  behance: {
    username: "kleberoliveirapsd", // Usuário oficial do Behance
    perfilUrl: "https://www.behance.net/kleberoliveirapsd",
    syncAutomatico: false, // Mantém os 3 projetos oficiais selecionados no carrossel
    limiteProjetos: 3, // Sempre exibe 3 projetos
    // 3 Projetos em destaque no carrossel (Sincronizados com o Behance):
    projetosFallback: [
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
    ]
  },

  // Configuração do Supabase (Banco de Dados e Login)
  // Veja o passo a passo no arquivo GUIA_PASSO_A_PASSO.md para pegar essas duas chaves
  supabase: {
    url: "",      // Ex: "https://xyzcompany.supabase.co"
    anonKey: ""   // Ex: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },

  // Mensagem padrão ao chamar o cliente no WhatsApp a partir do Dashboard
  whatsappMensagemPadrao: function(nomeCliente, nomeEmpresa) {
    const empresa = nomeEmpresa ? ` para a ${nomeEmpresa}` : "";
    return `Olá ${nomeCliente}! Aqui é o Kleber da KGestão de Marcas. Recebi o seu briefing${empresa} e adorei conhecer mais sobre o projeto! Quando você tem um momento para conversarmos?`;
  },

  // Mensagem padrão para o cliente avisar você pelo WhatsApp após enviar o briefing
  whatsappMensagemCliente: function(nomeCliente, nomeEmpresa) {
    const empresa = nomeEmpresa ? ` da ${nomeEmpresa}` : "";
    return `Olá Kleber! Sou ${nomeCliente}${empresa}. Acabei de preencher o briefing no seu site!`;
  }
};
