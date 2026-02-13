# Ambiente de Desenvolvimento

## Variáveis de Ambiente

Copie o arquivo `.env.example` e renomeie para `.env.local`:

```bash
cp .env.example .env.local
```

### Variáveis Configuráveis

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (opcional - para recursos de IA)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Como obter credenciais do Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie as credenciais necessárias

## Scripts Disponíveis

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev          # Inicia servidor frontend
npm run dev:backend   # Inicia servidor backend

# Build
npm run build         # Build para produção
npm run preview       # Preview do build

# Banco de Dados
npm run db:migrate    # Executa migrations
npm run db:seed       # Popula banco com dados de teste
npm run db:reset      # Reseta o banco (CUIDADO)

# Testes
npm run test          # Executa testes unitários
npm run test:e2e      # Executa testes E2E

# Lint
npm run lint          # Verifica código
npm run lint:fix      # Corrige problemas automaticamente
```

## Docker

O projeto inclui suporte a Docker para facilitar o desenvolvimento:

```bash
# Inicia todos os serviços
docker-compose up

# Inicia em background
docker-compose up -d

# Para todos os serviços
docker-compose down

# Visualiza logs
docker-compose logs -f
```

## Troubleshooting

### Problemas comuns

**Problema**: Erro de conexão com Supabase
**Solução**: Verifique se as credenciais no `.env.local` estão corretas

**Problema**: Porta já em uso
**Solução**: Mude a porta no `vite.config.ts` ou pare o processo usando a porta

**Problema**: Tipos TypeScript não encontrados
**Solução**: Execute `npm install` novamente para reinstalar dependências

## Links Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Recharts](https://recharts.org/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
