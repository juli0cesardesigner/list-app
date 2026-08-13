# Lista de Compras PWA (Glassmorphism OLED)

Aplicação PWA minimalista de alta performance para gerenciamento de lista de compras, construída com **TypeScript**, **Vite**, **React 19**, **Tailwind CSS v4**, **NeonDB (PostgreSQL Serverless)** e preparada para deploy no **Cloudflare Pages**.

---

## 🚀 Tecnologias

- **Frontend**: React 19 + TypeScript + Vite 6
- **Estilização**: Tailwind CSS v4 + Custom Glassmorphism (OLED Dark Mode)
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Banco de Dados**: NeonDB (Neon Serverless Postgres via `@neondatabase/serverless`)
- **Deploy**: Cloudflare Pages (com `wrangler.jsonc` e `public/_redirects`)

---

## 🛠️ Como Executar Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Crie um arquivo `.env` baseado no `.env.example`:
```env
VITE_NEON_DATABASE_URL="postgres://usuario:senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require"
```
*(Nota: Se a variável não for informada, o sistema operará com persistência em armazenamento local offline).*

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## 📦 Build e Deploy no Cloudflare Pages

### Build Local
```bash
npm run build
```

### Deploy no Cloudflare Pages
1. No painel do Cloudflare Pages, conecte seu repositório Git.
2. Selecione o preset **Vite**.
3. **Build Command**: `npm run build`
4. **Build Output Directory**: `dist`
5. Adicione a variável de ambiente `VITE_NEON_DATABASE_URL` nas configurações do projeto.
