# Guia Passo a Passo: Sistema de Briefing Premium + Dashboard
### KGestão de Marcas • Diretor Criativo: Kleber Oliveira

Olá, Kleber! Este guia foi feito pensando especialmente em você: **direto ao ponto, visual e sem complicação técnica**. Você não precisa ser programador para colocar este sistema no ar.

---

## ⚡ Como testar agora mesmo no seu computador (1 minuto)

O projeto já vem com um **Modo Demonstração Inteligente** configurado. Isso significa que você pode ver e testar **todas as telas funcionando agora mesmo**, antes mesmo de criar qualquer conta na internet:

1. Vá até a pasta do projeto:
   `C:\Users\klebe\OneDrive\Desktop\briefing - kgestao`
2. **Dê dois cliques no arquivo `index.html`**:
   - Este é o **Briefing que o seu cliente vê**.
   - Preencha as etapas, escolha as opções e clique em **"Enviar Briefing"**.
3. **Dê dois cliques no arquivo `dashboard.html`**:
   - Este é o seu **Painel do Diretor**.
   - Você verá os briefings recebidos, métricas em tempo real, status, busca e o botão **"Chamar no WhatsApp"**.
   - Clique em qualquer briefing para abrir o **Dossiê Completo**, alterar o status, escrever **Anotações Internas** ou gerar o **PDF**.

---

## ☁️ Passo 1: Criando seu Banco de Dados Gratuito no Supabase (3 minutos)

O **Supabase** é a ferramenta que vai guardar as respostas dos seus clientes com segurança total na nuvem. Ele tem um plano **100% gratuito** que atende perfeitamente:

1. Acesse: **[https://supabase.com](https://supabase.com)** e clique em **"Start your project"**.
2. Crie sua conta gratuita (pode entrar com sua conta Google ou GitHub).
3. Na tela inicial, clique no botão verde **"New Project"** (Novo Projeto).
4. Preencha os campos:
   - **Name:** `kgestao-briefing`
   - **Database Password:** Escolha uma senha forte (anote num bloco de notas).
   - **Region:** Selecione **"South America (São Paulo)"** para máxima velocidade no Brasil.
   - Clique em **"Create new project"** e aguarde cerca de 1 a 2 minutos enquanto ele é configurado.

---

## 🗄️ Passo 2: Criando a Tabela com 1 Clique (SQL Editor)

Deixamos um script pronto chamado `supabase-schema.sql` que cria tudo automaticamente para você:

1. No painel do seu projeto no Supabase, olhe o menu lateral esquerdo e clique no ícone **"SQL Editor"** (parece um terminal com `>_`).
2. Clique no botão **"+ New query"** no topo.
3. Abra o arquivo `supabase-schema.sql` que está na sua pasta, copie **todo o conteúdo** e cole no editor do Supabase.
4. Clique no botão verde **"Run"** (no canto inferior direito ou superior).
5. Pronto! Uma mensagem de sucesso verde aparecerá. Sua tabela `briefings` e todas as regras de segurança estão ativas!

---

## 🔑 Passo 3: Conectando seu Sistema ao Supabase

Agora vamos colocar as duas chaves do Supabase no arquivo `config.js`:

1. No painel do Supabase, clique no ícone de engrenagem **"Project Settings"** (no rodapé do menu lateral esquerdo).
2. No submenu, clique em **"API"**.
3. Você verá dois campos importantes:
   - **Project URL:** algo como `https://abcdefghijk.supabase.co`
   - **Project API keys -> `anon` `public`:** uma sequência longa de caracteres.
4. Abra o arquivo `config.js` na sua pasta e cole nos campos correspondentes:

```javascript
window.KGESTAO_CONFIG = {
  marca: {
    nome: "KGestão de Marcas",
    diretor: "Kleber Oliveira",
    whatsapp: "5511999999999", // Coloque seu WhatsApp real aqui com 55 + DDD + número
    email: "contato@kgestao.com.br",
  },
  supabase: {
    url: "COLE_AQUI_O_PROJECT_URL",
    anonKey: "COLE_AQUI_A_CHAVE_ANON_PUBLIC"
  }
};
```

5. Salve o arquivo `config.js`. Pronto! O sistema agora está conectado ao seu banco real na nuvem!

> 💡 **Dica Rápida:** Você também pode conectar sem abrir código! Basta abrir seu painel (`dashboard.html`), clicar no botão **"⚙ Conectar Supabase"** no topo, colar sua URL e Chave Pública e clicar em **"Salvar e Conectar"**. O painel conecta instantaneamente!

---

## 🚀 Passo 4: Como colocar no ar de graça (Vercel ou Netlify)

Para que seus clientes possam acessar de qualquer lugar (ex: `briefing.kgestao.com.br`):

### Opção Recomendada: Vercel (Gratuito)
1. Crie uma conta gratuita em **[https://vercel.com](https://vercel.com)**.
2. Arraste a pasta `briefing - kgestao` para dentro da tela da Vercel (ou conecte via GitHub se usar).
3. A Vercel vai gerar um link público imediato como `kgestao-briefing.vercel.app`.
4. **Domínio Próprio:** Em *Project Settings -> Domains*, você pode adicionar `briefing.kgestao.com.br` seguindo as instruções de DNS do seu registrador de domínio.

---

## 🎨 O que o Sistema oferece no seu dia a dia:

- **Identidade Visual Autêntica:** Com o monograma "K" e tipografia editorial oficial da KGestão de Marcas.
- **Dossiê com Impressão em PDF Limpa:** Ao clicar em "Exportar em PDF" no Dashboard, uma folha A4 executiva é formatada sem botões nem elementos desnecessários, perfeita para guardar ou apresentar ao cliente.
- **Chamar no WhatsApp com 1 Clique:** Puxa o WhatsApp do cliente e já abre a conversa com mensagem personalizada de recepção.
- **Anotações Internas:** Um campo seguro no painel onde você anota valores, ideias e percepções de cada cliente, que são salvos automaticamente no banco.
- **Filtros e Métricas:** Acompanhe quantos briefings novos chegaram na semana, filtre por status (Novo, Em análise, Em andamento, Concluído) e por tipo de projeto.
