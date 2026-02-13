# Guia: Como executar scripts SQL no Supabase Online

## Problema
O Supabase bloqueia acesso direto ao schema via API pública. Para criar tabelas, precisamos da **service_role key**.

## Solução 1: Via SQL Editor no Dashboard (RECOMENDADO)

### Passo a Passo:

1. **Acesse o SQL Editor**
   - Vá em: https://supabase.com/dashboard
   - Clique no projeto "Projeto360"
   - Menu lateral: SQL Editor
   - URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

2. **Copie o conteúdo do schema**
   - Abra o arquivo: `database/supabase_schema.sql`
   - Copie todo o conteúdo (Ctrl+A, Ctrl+C)

3. **Cole no SQL Editor**
   - Cole no campo de texto do SQL Editor
   - Clique em "Run" (botão verde no canto superior direito)
   - Aguarde a execução (aprox. 1 minuto)

4. **Execute o seed**
   - Copie o conteúdo de: `database/supabase_seed.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - Aguarde a execução (aprox. 30 segundos)

5. **Verifique as tabelas**
   - Vá em: Table Editor (menu lateral)
   - URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
   - Confirme que as 14 tabelas foram criadas:
     - profiles
     - appointments
     - health_metrics
     - habit_logs
     - medical_records
     - exams
     - faq_items
     - messages
     - diet_plans
     - diet_meals
     - diet_logs
     - workout_routines
     - workout_exercises
     - mentorship_goals

## Solução 2: Obter a Service Role Key

Se quiser executar scripts automaticamente, você precisa da **service_role secret key**:

### Como obter:

1. Acesse: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
2. Role até o final da página
3. Copie a **service_role secret key**
4. Me forneça para configurar

### Uso:

```bash
# Depois de ter a service_role_key, posso executar:
curl -X POST \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  https://wgnedvfzwczybumzbjgo.supabase.co/rest/v1/rpc/exec_sql \
  -d '{"sql": "$(cat database/supabase_schema.sql)" }'
```

## Solução 3: Via Interface Web (mais fácil)

1. **Abra o arquivo** `database/supabase_schema.sql`
2. **Copie todo o conteúdo**
3. **Cole no SQL Editor** do Supabase Dashboard
4. **Clique em Run**
5. **Repita** para o arquivo `database/supabase_seed.sql`

## Recomendação

Use a **Solução 1** (via SQL Editor) porque:
- ✅ Mais fácil (copiar e colar)
- ✅ Visual (você vê o resultado)
- ✅ Erros são mostrados em tempo real
- ✅ Não precisa de service_role_key
- ✅ Seguro (não precisa de API key)

## Links Diretos

- **Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
- **Table Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
- **Settings API**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api

## Próximo Passo

Depois de executar os scripts SQL:

1. **Criar usuários no Auth**
   - Vá em: Authentication → Users
   - Clique em "Add user"
   - Crie:
     - dr.edgar@clinica.com (admin)
     - roberto.mendes@email.com (patient)
     - carlos.andrade@email.com (patient)
     - andre.silva@email.com (patient)
     - felipe.costa@email.com (patient)
     - marcos.vinicius@email.com (patient)

2. **Testar a aplicação**
   ```bash
   cd ~/projetos/Projeto360
   npm install
   npm run dev
   ```

3. **Acessar**
   - http://localhost:3000
   - Fazer login com os usuários criados
