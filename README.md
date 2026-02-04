# NutriMix - Sistema de Automação e Rotulagem

Plataforma para gestão de produtos, rótulos, impressões e integrações por unidade (planta), com importação de XML, geração de preview (Labelary/ZPL) e controle de usuários.

## Principais recursos
- Login e controle de acesso por unidade e permissão
- Importação de XML e parsing de fórmulas
- Gestão de produtos e rótulos
- Preview de rótulos via Labelary
- Histórico de impressão e listagens
- Emissão de certificados

## Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Radix UI + shadcn/ui
- **Estilo**: Tailwind CSS
- **Backend**: Express + Prisma (MySQL)

## Estrutura
```
app/                 # Rotas do Next.js (App Router)
components/          # Componentes compartilhados
pages/api/           # Proxies para o backend
backend/             # API Express + Prisma
  prisma/            # Schema e migrations
  src/               # Rotas e serviços
```

## Pré-requisitos
- Node.js 18+
- MySQL disponível (ex.: `nutrimix` em `localhost:3306`)

## Configuração
1. Ajuste o banco no arquivo `backend/.env`:
```
DATABASE_URL="mysql://root:@localhost:3306/nutrimix"
```

2. Instale dependências:
```
cd backend
npm install
cd ..
npm install
```

3. Rode migrations e seed (cria o admin padrão):
```
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## Rodando localmente
1. Backend:
```
cd backend
npm run start
```

2. Frontend:
```
npm run dev
```

3. Acesse:
```
http://localhost:3000
```

## Login padrão (seed)
- **Login**: `losampaio`
- **Senha**: `123MUdar456`

## Licença
MIT. Veja o arquivo `LICENSE`.
