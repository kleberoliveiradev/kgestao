-- ===================================================================
--  KGestão de Marcas - Schema do Banco de Dados Supabase (PostgreSQL)
-- ===================================================================
--
--  INSTRUÇÕES PARA O KLEBER:
--  1. Abra seu painel no Supabase (https://app.supabase.com)
--  2. No menu lateral esquerdo, clique no ícone "SQL Editor"
--  3. Clique em "+ New query"
--  4. Cole todo este código abaixo e clique no botão verde "RUN"
--  5. Pronto! Sua tabela estará criada com segurança total.
-- ===================================================================

-- 1. Criação da tabela de briefings
create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Etapa 1: Sobre você
  nome text not null,
  empresa text,
  contato text not null,
  site text,
  
  -- Etapa 2: O projeto
  tipo jsonb default '[]'::jsonb,
  negocio text,
  motivo text,
  
  -- Etapa 3: Público e posicionamento
  publico text,
  dif text,
  concorr text,
  
  -- Etapa 4: Estilo e personalidade
  pers jsonb default '[]'::jsonb,
  cores text,
  ref text,
  
  -- Etapa 5: Prazo e investimento
  prazo text,
  verba text,
  extra text,
  
  -- Gestão interna do Kleber
  status text not null default 'Novo' check (status in ('Novo', 'Em análise', 'Em andamento', 'Concluído')),
  notas_internas text default '',
  resumo_formatado text
);

-- 2. Habilitação de Segurança por Nível de Linha (Row Level Security - RLS)
alter table public.briefings enable row level security;

-- 3. Políticas de Segurança (RLS)
-- Permitir que clientes anônimos no seu site possam ENVIAR (INSERT) seus briefings
drop policy if exists "Permitir envio publico de briefings" on public.briefings;
create policy "Permitir envio publico de briefings"
  on public.briefings
  for insert
  to anon, authenticated
  with check (true);

-- Permitir que APENAS você logado (usuário autenticado) possa VER (SELECT) os briefings
drop policy if exists "Permitir leitura apenas para admin autenticado" on public.briefings;
create policy "Permitir leitura apenas para admin autenticado"
  on public.briefings
  for select
  to authenticated
  using (true);

-- Permitir que APENAS você logado possa ATUALIZAR (UPDATE) status e anotações
drop policy if exists "Permitir atualizacao para admin autenticado" on public.briefings;
create policy "Permitir atualizacao para admin autenticado"
  on public.briefings
  for update
  to authenticated
  using (true);

-- Permitir que APENAS você logado possa EXCLUIR (DELETE) se desejar
drop policy if exists "Permitir exclusao para admin autenticado" on public.briefings;
create policy "Permitir exclusao para admin autenticado"
  on public.briefings
  for delete
  to authenticated
  using (true);

-- 4. Índices para busca ultra-rápida no Dashboard
create index if not exists idx_briefings_created_at on public.briefings (created_at desc);
create index if not exists idx_briefings_status on public.briefings (status);
create index if not exists idx_briefings_nome on public.briefings (nome);

-- ===================================================================
-- (Opcional) Dados de exemplo caso você queira ver o painel preenchido:
-- ===================================================================
-- Descomente as linhas abaixo se quiser inserir 1 briefing de teste no Supabase:
/*
insert into public.briefings (
  nome, empresa, contato, site, tipo, negocio, motivo, publico, dif, concorr, pers, cores, ref, prazo, verba, extra, status, notas_internas
) values (
  'Carolina Mendez',
  'Aura Joias Contemporâneas',
  '11987654321',
  '@aurajoias',
  '["Identidade visual", "Embalagens"]'::jsonb,
  'Joalheria artesanal com prata reciclada e pedras brasileiras. Existe há 2 anos no Instagram e queremos abrir quiosque.',
  'Precisamos de uma marca mais sofisticada para cobrar o valor justo e expandir.',
  'Mulheres de 25 a 45 anos, classe A/B, que valorizam sustentabilidade e design autoral.',
  'Prata 950 com garantia vitalícia e embalagem de veludo reutilizável.',
  'Dryzun, Monte Carlo, Vivara',
  '["Premium", "Minimalista", "Acolhedora"]'::jsonb,
  'Verde oliva profundo, dourado suave e off-white. Evitar tons neon.',
  'Inspirações em design nórdico e botânico.',
  'Até 30 dias',
  'R$ 3.000 a R$ 6.000',
  'Preciso também de sacolas e caixas.',
  'Novo',
  'Cliente muito decidida. Verificar possibilidade de pacote completo com embalagens.'
);
*/
