# Guia de Configuração do Supabase Online

## Passo 1: Criar Projeto no Supabase

1. **Acesse o Supabase**
   - URL: https://supabase.com
   - Email: rh.executivo2018@gmail.com

2. **Crie um novo projeto**
   - Clique em "New Project"
   - Preencha os dados:
     - **Nome**: Projeto360
     - **Senha do banco**: (crie uma senha forte)
     - **Região**: South America (São Paulo) - recomendado para melhor performance no Brasil
   - Clique em "Create new project"

3. **Aguarde a criação**
   - O processo leva cerca de 2 minutos
   - Você verá o status "Setting up"

## Passo 2: Obter Credenciais

1. **Acesse as configurações do projeto**
   - Clique no projeto "Projeto360"
   - Vá em Settings → API

2. **Copie as credenciais**
   - Project URL
   - anon public key
   - service_role secret key

   Exemplo:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Guarde essas credenciais**
   - Elas serão usadas no arquivo .env.local

## Passo 3: Configurar Variáveis de Ambiente

1. **Crie o arquivo .env.local**
   ```bash
   cd ~/projetos/Projeto360
   cp .env.example .env.local
   ```

2. **Edite o arquivo .env.local**
   ```bash
   nano .env.local
   # ou use seu editor preferido
   ```

3. **Substitua com suas credenciais**
   ```env
   # Supabase Online Configuration
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

   # Gemini API (opcional)
   # VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## Passo 4: Executar Scripts SQL

1. **Acesse o SQL Editor no Supabase**
   - Vá em: SQL Editor (no menu lateral)
   - Ou acesse: https://supabase.com/dashboard/project/seu-projeto-id/sql

2. **Execute o script de schema**
   - Copie o conteúdo de: database/supabase_schema.sql
   - Cole no SQL Editor
   - Clique em "Run" (ou pressione Ctrl+Enter)
   - Aguarde a execução (aprox. 1 minuto)

3. **Execute o script de seed**
   - Copie o conteúdo de: database/supabase_seed.sql
   - Cole no SQL Editor
   - Clique em "Run"
   - Aguarde a execução (aprox. 30 segundos)

## Passo 5: Verificar Tabelas Criadas

1. **Acesse o Table Editor**
   - Vá em: Table Editor (no menu lateral)

2. **Verifique as 14 tabelas**
   - ✅ profiles
   - ✅ appointments
   - ✅ health_metrics
   - ✅ habit_logs
   - ✅ medical_records
   - ✅ exams
   - ✅ faq_items
   - ✅ messages
   - ✅ diet_plans
   - ✅ diet_meals
   - ✅ diet_logs
   - ✅ workout_routines
   - ✅ workout_exercises
   - ✅ mentorship_goals

## Passo 6: Configurar Autenticação (Opcional)

1. **Acesse as configurações de autenticação**
   - Vá em: Authentication → Providers

2. **Configure Email Provider**
   - Verify Email: ON (recomendado)
   - Confirm Email: ON
   - Email Change Confirmation: ON

3. **Adicione usuários iniciais**
   - Vá em: Authentication → Users
   - Clique em "Add user"
   - Crie os usuários com os dados do script seed:
     - **Médico**: dr.edgar@clinica.com
     - **Pacientes**: roberto.mendes@email.com, carlos.andrade@email.com, etc.

## Passo 7: Testar a Aplicação

1. **Instale as dependências**
   ```bash
   cd ~/projetos/Projeto360
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação**
   - URL: http://localhost:3000
   - Ou: http://localhost:3001 (se a 3000 estiver em uso)

4. **Teste o login**
   - Clique em "Sou Paciente"
   - Email: roberto.mendes@email.com
   - Senha: (definida no Supabase)

## Passo 8: Configurar Row Level Security (RLS) - Opcional

Para maior segurança, configure políticas RLS:

1. **Acesse cada tabela**
   - Vá em: Table Editor → Clique na tabela → Policies

2. **Habilite RLS**
   - Click em "Enable RLS"

3. **Crie políticas básicas**
   Exemplo para tabela profiles:
   ```sql
   -- Política para leitura pública de perfis (opcional)
   CREATE POLICY "Permitir leitura pública de perfis"
   ON public.profiles FOR SELECT
   USING (true);

   -- Política para usuários atualizarem próprio perfil
   CREATE POLICY "Permitir atualização do próprio perfil"
   ON public.profiles FOR UPDATE
   USING (auth.uid() = id);
   ```

## Troubleshooting

### Erro: "Connection refused"
**Solução**: Verifique se as credenciais no .env.local estão corretas

### Erro: "Table does not exist"
**Solução**: Execute o script supabase_schema.sql novamente no SQL Editor

### Erro: "User not found"
**Solução**: Crie os usuários na aba Authentication → Users do Supabase

### Porta já em uso
**Solução**: Mude a porta em vite.config.ts ou pare o processo usando a porta 3000

## Credenciais Exemplo (substitua pelas suas)

```env
# Supabase Online Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2plY3QzNjAiLCJyb2xlIjoiYW5vbiIsImV4cCI6IjE4MTA5Njk2ODIsImlhdCI6MTY4OTU4NDQ4MiwiZXhwIjoxNzA1MTYwNDgyfQ.abc123...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2plY3QzNjAiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiZXhwIjoxNzA1MTYwNDgyfQ.def456...
```

## Links Úteis

- **Dashboard do Projeto**: https://supabase.com/dashboard
- **SQL Editor**: https://supabase.com/dashboard/project/seu-projeto-id/sql
- **Table Editor**: https://supabase.com/dashboard/project/seu-projeto-id/editor
- **Authentication**: https://supabase.com/dashboard/project/seu-projeto-id/auth/users

## Suporte

Se tiver algum problema:
1. Verifique o console do navegador (F12)
2. Verifique os logs do terminal onde está rodando npm run dev
3. Consulte a documentação: https://supabase.com/docs
