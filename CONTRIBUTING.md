# Contribuindo para o Projeto360

Obrigado por considerar contribuir para o Projeto360!

## Como Contribuir

### 1. Fork o Repositório

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USUARIO/Projeto360.git
cd Projeto360
```

### 2. Crie uma Branch

```bash
# Crie uma branch para sua feature
git checkout -b feature/sua-feature

# Ou para bugfix
git checkout -b fix/algum-bug
```

### 3. Faça Suas Mudanças

```bash
# Faça suas alterações
git add .
git commit -m "Adiciona nova feature X"
```

### 4. Push para o Branch

```bash
# Push para o seu fork
git push origin feature/sua-feature
```

### 5. Abra um Pull Request

1. Vá para o repositório original: https://github.com/ecalefi/Projeto360
2. Clique em "Pull Request"
3. Selecione o branch da sua feature
4. Preencha o template de PR
5. Aguarde a revisão

## Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade de login
fix: corrige bug na validação de formulário
docs: atualiza documentação de instalação
style: formata código com Prettier
refactor: refatora componente de dashboard
test: adiciona testes para o contexto de autenticação
chore: atualiza dependências
```

## Padrão de Código

### TypeScript

- Use TypeScript sempre que possível
- Evite `any`
- Defina interfaces para objetos complexos
- Use tipos para retornos de funções

### React

- Use componentes funcionais
- Use hooks em vez de classes
- Prefira custom hooks para lógica reutilizável
- Use memoization (useMemo, useCallback) quando necessário

### Nomenclatura

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Funções**: camelCase (`getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Variáveis**: camelCase (`userName`)
- **Arquivos**: kebab-case (`user-profile.tsx`)

## Estrutura de Pastas

```
src/
├── components/        # Componentes React
│   ├── common/      # Componentes reutilizáveis
│   ├── features/    # Componentes específicos de features
│   └── layouts/     # Layouts de páginas
├── pages/           # Páginas da aplicação
├── contexts/        # Contextos React
├── hooks/           # Custom hooks
├── lib/             # Bibliotecas e utilitários
├── services/         # Serviços externos
├── types/           # Definições TypeScript
└── utils/           # Funções utilitárias
```

## Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Com coverage
npm run test:coverage
```

### Escrever Testes

- Testes devem ser independentes
- Use descrições claras
- Teste casos de sucesso e falha
- Mantenha testes atualizados

## Processo de Revisão

### O que esperar

- Revisão de código por mantenedor
- Feedback construtivo
- Sugestões de melhorias
- Verificação de testes
- Verificação de documentação

### Tempo de Resposta

- Pull requests serão revisados assim que possível
- Perguntas nos PRs são respondidas em até 48h
- Merge feito após aprovação e CI verde

## Relatório de Issues

Ao reportar issues, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir**
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** (se aplicável)
- **Ambiente** (OS, browser, versão)
- **Logs** relevantes

Use o template de issue:

```markdown
## Descrição
Breve descrição do problema

## Passos para Reproduzir
1. Ir para '...'
2. Clicar em '...'
3. Ver '...'

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
(Se aplicável)

## Ambiente
- OS: [Ubuntu 20.04 / macOS / Windows 11]
- Browser: [Chrome / Firefox / Safari]
- Versão: [1.0.0]
```

## Código de Conduta

- Seja respeitoso e inclusivo
- Use linguagem apropriada
- Foque no que é melhor para a comunidade
- Aceite feedback construtivo

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto.

## Dúvidas?

- Abra uma issue com a tag `question`
- Entre em contato: evertoncalefi@gmail.com
- GitHub: [@ecalefi](https://github.com/ecalefi)

---

**Obrigado por contribuir! 🎉**
