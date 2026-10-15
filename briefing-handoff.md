# Projeto: Sistema de Briefing Premium + Dashboard (KGestão de Marcas)

> Documento de passagem para outra IA continuar o projeto. Cole este arquivo inteiro na nova conversa e peça: "Continue este projeto a partir daqui".

## 1. Contexto
Sou Kleber Oliveira, designer gráfico e diretor criativo de marcas, dono da **KGestão de Marcas**. Quero parar de usar Google Forms para captar briefing de clientes e ter um sistema **premium, refinado e com a minha marca**, onde:

1. O cliente abre um link e preenche o briefing em etapas, com experiência elegante.
2. As respostas chegam até mim automaticamente.
3. Eu vejo tudo em um **dashboard** organizado.

## 2. O que já existe (Fase 1: front-end do cliente)
Uma página HTML única (código completo na seção 7) com:
- Tela de boas-vindas e 5 etapas, uma por vez, com barra de progresso.
- Campos de texto, áreas de texto, seleção (dropdown) e chips de múltipla escolha.
- Validação de campos obrigatórios (nome e contato).
- Rascunho salvo no navegador (localStorage) enquanto o cliente preenche.
- Tela final "Revise e envie", com envio por WhatsApp, e-mail ou copiar texto.
- Visual: editorial e premium, fundo escuro ou claro conforme o sistema, dourado como cor de destaque, Playfair Display (títulos) + Inter (texto). Responsivo.

**Limitação atual:** não existe backend. O briefing só chega a mim se o cliente enviar por WhatsApp/e-mail. Não há dashboard.

## 3. Perguntas do briefing (conteúdo atual)
**Etapa 1 - Sobre você:** nome*, nome da marca/empresa, WhatsApp ou e-mail*, Instagram ou site.
**Etapa 2 - O projeto:** o que precisa (múltipla escolha: Identidade visual, Rebranding, Logotipo, Social media, Embalagens, Site/Landing page, Outro); o que a marca faz e há quanto tempo existe; por que o projeto e por que agora.
**Etapa 3 - Público e posicionamento:** cliente ideal; diferencial; 2 ou 3 concorrentes ou marcas admiradas.
**Etapa 4 - Estilo e personalidade:** como a marca deve ser percebida (múltipla escolha: Premium, Moderna, Acolhedora, Ousada, Minimalista, Divertida, Séria, Natural); cores que ama ou quer evitar; links/referências visuais.
**Etapa 5 - Prazo e investimento:** prazo (Urgente até 15 dias, Até 30 dias, 1 a 3 meses, Sem pressa); faixa de investimento (Ainda não sei, Até R$ 1.000, R$ 1.000 a 3.000, R$ 3.000 a 6.000, Acima de R$ 6.000); algo mais.
(* obrigatório)

## 4. O que quero construir a seguir (Fase 2: backend + dashboard)

### Fluxo do cliente
- Link público (ideal: briefing.meudominio.com.br ou link único por cliente).
- Ao enviar, as respostas são gravadas em banco de dados e o cliente vê uma tela de agradecimento personalizada.
- Opcional: upload de arquivos (logo atual, referências, fotos).
- Opcional: versões diferentes do briefing por tipo de projeto (restaurante/food, marca pessoal, startup/produto, rebranding), com perguntas específicas.

### Dashboard (somente eu, com login)
- Lista de briefings recebidos, com data, nome do cliente, marca, tipo de projeto e **status** (Novo, Em análise, Em andamento, Concluído).
- Busca e filtros (por status, tipo de projeto, data).
- Página de detalhe de cada briefing, com todas as respostas bem formatadas e leitura confortável.
- Botão para **exportar o briefing em PDF** (com a minha marca) e copiar como texto.
- Campo de **anotações internas** por briefing.
- Botão para chamar o cliente direto no WhatsApp.
- Métricas simples no topo: total de briefings, novos esta semana, por tipo de projeto.
- Notificação para mim (e-mail e/ou WhatsApp) sempre que chegar um briefing novo.

### Identidade visual
Premium, editorial, minimalista, dourado como destaque, com espaço para eu trocar logo, paleta e tipografia pela identidade oficial da KGestão de Marcas.

## 5. Sugestão técnica (pode ser ajustada pela IA)
- **Front-end:** React/Next.js (ou Astro) + Tailwind, a partir da página atual.
- **Banco e login:** Supabase (Postgres + Auth + Storage) ou Firebase.
- **Hospedagem:** Vercel ou Netlify, no meu domínio.
- **Notificação:** Resend (e-mail) e/ou API de WhatsApp (Z-API, Evolution API ou similar).
- **PDF:** geração no servidor ou react-pdf.
- Segurança: apenas eu leio os dados (regras de acesso por usuário); cliente só consegue inserir.

Sou designer, não programador: preciso de passo a passo claro, com código pronto para copiar e explicação simples de onde colar cada coisa.

## 6. Prompt sugerido para colar na nova IA
"Leia o documento abaixo. Quero continuar este projeto da Fase 2: criar o backend e o dashboard para receber os briefings. Me guie passo a passo, em português, como se eu fosse iniciante em programação. Comece propondo a arquitetura mais simples possível e me diga o que preciso criar de conta/ferramenta. Depois gere o código, um arquivo por vez, sempre dizendo onde colar."

## 7. Código completo da Fase 1 (briefing-premium.html)
Antes de usar, editar no topo do script: `WHATS`, `EMAIL` e `MARCA`.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Briefing | KGestão de Marcas</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#f6f3ee;--card:#fff;--tx:#1a1814;--mut:#7a7469;--ln:#e4ded3;--ac:#a9811f;--acx:#fff;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e0d0b;--card:#17150f;--tx:#f2ede3;--mut:#9a9385;--ln:#2c281e;--ac:#d4af37;--acx:#0e0d0b}}
:root[data-theme="dark"]{--bg:#0e0d0b;--card:#17150f;--tx:#f2ede3;--mut:#9a9385;--ln:#2c281e;--ac:#d4af37;--acx:#0e0d0b}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{background:var(--bg);color:var(--tx);font:16px/1.6 Inter,system-ui,sans-serif}
main{max-width:640px;margin:0 auto;padding:40px 22px 64px}
.brand{font:500 12px Inter,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:var(--ac)}
h1,h2{font-family:"Playfair Display",Georgia,serif;font-weight:500;line-height:1.2;margin:.3em 0}
h1{font-size:clamp(30px,7vw,42px)}
h2{font-size:clamp(26px,6vw,34px)}
.sub{color:var(--mut);margin:0 0 28px}
.bar{height:2px;background:var(--ln);margin:26px 0 8px}
.bar i{display:block;height:100%;background:var(--ac);transition:width .4s}
.cnt{font-size:12px;color:var(--mut);letter-spacing:.12em;text-transform:uppercase}
.fld{margin:26px 0}
label{display:block;font-weight:500;margin-bottom:8px}
input,textarea,select{width:100%;background:transparent;color:var(--tx);border:0;border-bottom:1px solid var(--ln);padding:10px 2px;font:inherit;border-radius:0;outline:0}
textarea{resize:vertical;min-height:84px}
select option{background:var(--card);color:var(--tx)}
input:focus,textarea:focus,select:focus{border-color:var(--ac)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid var(--ln);background:transparent;color:var(--tx);padding:8px 16px;border-radius:99px;font:inherit;font-size:14px;cursor:pointer}
.chip.on{background:var(--ac);color:var(--acx);border-color:var(--ac)}
.nav{display:flex;gap:12px;margin-top:40px;flex-wrap:wrap}
.btn{border:1px solid var(--ac);background:var(--ac);color:var(--acx);padding:14px 28px;font:500 14px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}
.btn.g{background:transparent;color:var(--tx);border-color:var(--ln)}
.err{color:#c0392b;font-size:13px;margin-top:6px}
.sum{width:100%;min-height:260px;border:1px solid var(--ln);padding:14px;font-size:14px;background:var(--card);line-height:1.5}
.ok{font-size:13px;color:var(--ac);min-height:20px;margin-top:10px}
</style>
</head>
<body>
<main id="app"></main>
<script>
// >>> EDITE AQUI: seu WhatsApp (com 55 + DDD) e seu e-mail
var WHATS="5511999999999", EMAIL="contato@seudominio.com.br", MARCA="KGestão de Marcas";

var STEPS=[
{t:"Sobre você",d:"Vamos começar pelo básico.",f:[
 ["nome","Seu nome","text",1],["empresa","Nome da marca ou empresa","text"],["contato","WhatsApp ou e-mail","text",1],["site","Instagram ou site (se tiver)","text"]]},
{t:"O projeto",d:"Conte o que você imagina para a sua marca.",f:[
 ["tipo","O que você precisa?","chips",0,["Identidade visual","Rebranding","Logotipo","Social media","Embalagens","Site / Landing page","Outro"]],
 ["negocio","O que sua marca faz e há quanto tempo existe?","area"],
 ["motivo","Por que esse projeto, e por que agora?","area"]]},
{t:"Público e posicionamento",d:"Quanto mais claro aqui, mais certeiro fica o resultado.",f:[
 ["publico","Quem é o seu cliente ideal?","area"],
 ["dif","O que torna sua marca diferente das outras?","area"],
 ["concorr","Cite 2 ou 3 concorrentes ou marcas que você admira","area"]]},
{t:"Estilo e personalidade",d:"Aqui entra a sensação que a marca deve causar.",f:[
 ["pers","Como sua marca deve ser percebida?","chips",0,["Premium","Moderna","Acolhedora","Ousada","Minimalista","Divertida","Séria","Natural"]],
 ["cores","Cores que você ama (ou quer evitar)","text"],
 ["ref","Links ou referências visuais que te inspiram","area"]]},
{t:"Prazo e investimento",d:"Para alinhar expectativas desde o início.",f:[
 ["prazo","Para quando você precisa?","select",0,["Urgente (até 15 dias)","Até 30 dias","1 a 3 meses","Sem pressa"]],
 ["verba","Faixa de investimento prevista","select",0,["Ainda não sei","Até R$ 1.000","R$ 1.000 a R$ 3.000","R$ 3.000 a R$ 6.000","Acima de R$ 6.000"]],
 ["extra","Mais alguma coisa que eu deva saber?","area"]]}
];
var S={},step=0,app=document.getElementById("app");
try{S=JSON.parse(localStorage.getItem("brf")||"{}")}catch(e){}
function save(){try{localStorage.setItem("brf",JSON.stringify(S))}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function head(){return '<div class="brand">'+MARCA+'</div>'}

function intro(){
 app.innerHTML=head()+'<h1>Vamos criar algo único para a sua marca.</h1><p class="sub">Este briefing leva cerca de 5 minutos. Suas respostas me ajudam a entender seu negócio, seu público e o que você sonha para a sua marca antes de eu começar a criar.</p><div class="nav"><button class="btn" id="go">Começar</button></div>';
 document.getElementById("go").onclick=function(){step=0;render()};
}
function render(){
 var s=STEPS[step],h=head()+'<div class="bar"><i style="width:'+((step+1)/(STEPS.length+1)*100)+'%"></i></div><div class="cnt">Etapa '+(step+1)+' de '+STEPS.length+'</div><h2>'+s.t+'</h2><p class="sub">'+s.d+'</p>';
 s.f.forEach(function(f){
  var k=f[0],v=S[k]||"";
  h+='<div class="fld"><label for="'+k+'">'+f[1]+(f[3]?" *":"")+'</label>';
  if(f[2]=="text")h+='<input id="'+k+'" value="'+esc(v)+'">';
  else if(f[2]=="area")h+='<textarea id="'+k+'">'+esc(v)+'</textarea>';
  else if(f[2]=="select")h+='<select id="'+k+'"><option value="">Selecione</option>'+f[4].map(function(o){return'<option'+(v==o?" selected":"")+'>'+o+'</option>'}).join("")+'</select>';
  else h+='<div class="chips" data-k="'+k+'">'+f[4].map(function(o){return'<button type="button" class="chip'+((S[k]||[]).indexOf(o)>-1?" on":"")+'">'+o+'</button>'}).join("")+'</div>';
  h+='<div class="err" id="e_'+k+'"></div></div>';
 });
 h+='<div class="nav">'+(step?'<button class="btn g" id="bk">Voltar</button>':'')+'<button class="btn" id="nx">'+(step==STEPS.length-1?"Revisar":"Continuar")+'</button></div>';
 app.innerHTML=h;window.scrollTo(0,0);
 Array.prototype.forEach.call(app.querySelectorAll(".chips"),function(c){
  Array.prototype.forEach.call(c.children,function(b){b.onclick=function(){
   var k=c.dataset.k,a=S[k]||[],i=a.indexOf(b.textContent);
   if(i>-1)a.splice(i,1);else a.push(b.textContent);
   S[k]=a;b.classList.toggle("on");save()}})});
 document.getElementById("nx").onclick=next;
 if(step)document.getElementById("bk").onclick=function(){collect();step--;render()};
}
function collect(){STEPS[step].f.forEach(function(f){var e=document.getElementById(f[0]);if(e&&f[2]!="chips")S[f[0]]=e.value.trim()});save()}
function next(){
 collect();var ok=true;
 STEPS[step].f.forEach(function(f){if(f[3]&&!S[f[0]]){document.getElementById("e_"+f[0]).textContent="Preencha este campo para continuar.";ok=false}});
 if(!ok)return;
 if(step<STEPS.length-1){step++;render()}else review();
}
function build(){
 var t="BRIEFING - "+(S.empresa||S.nome)+"\n";
 STEPS.forEach(function(s){t+="\n== "+s.t.toUpperCase()+" ==\n";
  s.f.forEach(function(f){var v=S[f[0]];if(Array.isArray(v))v=v.join(", ");if(v)t+=f[1]+"\n"+v+"\n\n"})});
 return t.trim();
}
function review(){
 var t=build();
 app.innerHTML=head()+'<div class="bar"><i style="width:100%"></i></div><div class="cnt">Última etapa</div><h2>Revise e envie</h2><p class="sub">Confira suas respostas. Para enviar, escolha uma das opções abaixo.</p><textarea class="sum" id="sum" readonly>'+esc(t)+'</textarea><div class="nav"><a class="btn" id="wa" target="_blank" rel="noopener" href="https://wa.me/'+WHATS+'?text='+encodeURIComponent(t)+'">Enviar por WhatsApp</a><a class="btn g" href="mailto:'+EMAIL+'?subject='+encodeURIComponent("Briefing - "+(S.empresa||S.nome))+'&body='+encodeURIComponent(t)+'">Enviar por e-mail</a><button class="btn g" id="cp">Copiar respostas</button><button class="btn g" id="ed">Editar</button></div><div class="ok" id="ok"></div>';
 document.getElementById("ed").onclick=function(){step=0;render()};
 document.getElementById("cp").onclick=function(){
  var ta=document.getElementById("sum"),m=document.getElementById("ok");ta.select();
  function done(){m.textContent="Respostas copiadas."}
  try{navigator.clipboard.writeText(t).then(done,function(){document.execCommand("copy");done()})}catch(e){try{document.execCommand("copy");done()}catch(x){m.textContent="Selecione o texto e copie manualmente."}}};
}
intro();
</script>
</body>
</html>

```
