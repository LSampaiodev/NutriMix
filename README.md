# TagTwo - Sistema de Gerenciamento de Ração

Um sistema moderno para gerenciamento de fórmulas de ração, geração de labels e visualização de dados XML.

## 🚀 Características

- **Upload e Processamento de XML**: Carregue e processe arquivos XML de fórmulas de ração
- **Geração de Labels**: Crie labels personalizados para produtos
- **Dashboard Interativo**: Visualize estatísticas e dados em tempo real
- **Interface Responsiva**: Design moderno e adaptável para diferentes dispositivos
- **Autenticação Segura**: Sistema de login com JWT
- **Arquitetura Limpa**: Seguindo princípios SOLID e padrão MVC

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **UI Components**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Build Tool**: Vite

## 📁 Estrutura do Projeto

```
src/
├── core/                 # Camada de domínio (Model)
│   ├── entities/        # Entidades de negócio
│   ├── repositories/    # Interfaces de repositórios
│   └── services/        # Serviços de domínio
├── infrastructure/      # Camada de infraestrutura
│   ├── api/            # Cliente HTTP e APIs
│   ├── storage/        # Gerenciamento de estado local
│   └── adapters/       # Adaptadores para serviços externos
├── presentation/        # Camada de apresentação (View + Controller)
│   ├── components/     # Componentes React reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Custom hooks
│   └── layouts/        # Layouts da aplicação
├── shared/             # Código compartilhado
│   ├── types/          # Tipos TypeScript
│   ├── constants/      # Constantes da aplicação
│   └── utils/          # Utilitários
└── main.tsx           # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd TagTwo
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:5173` no seu navegador

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run build:dev` - Gera build de desenvolvimento
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza o build de produção

## 🏗️ Arquitetura

O projeto segue os princípios SOLID e o padrão MVC:

### **Model (Domínio)**
- `core/entities/` - Entidades de negócio
- `core/services/` - Lógica de negócio
- `core/repositories/` - Interfaces de acesso a dados

### **View (Apresentação)**
- `presentation/components/` - Componentes React
- `presentation/pages/` - Páginas da aplicação
- `presentation/layouts/` - Layouts

### **Controller (Controle)**
- `presentation/hooks/` - Custom hooks para lógica de controle
- `infrastructure/api/` - Controllers para APIs

## 📝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Suporte

Para suporte, envie um email para lucasoliveirasampaio55@outlook.com ou abra uma issue no repositório.
