# Hacking Apophenia

React applications to help people utilize their apophenia to come up with ideas.

## Installation

The project uses [devcontainers](https://containers.dev/) to provide a consistent development environment

```sh
  cd "<application>"
  npm install
  npm run dev
```

## About the stack

The react applications were bootstrapped with `npm create vite -- --template react`
and will be deployed to Vercel

### Shadcn-ui

Applications use shadcn/ui components, add new components with the `shadcn` cli
i.e. `npx shadcn@latest add <component>`.

The following commands were used to setup shadcn/ui:

```sh
cd "<application>"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init --postcss --esm
echo > "./src/index.css" <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
npx shadcn@latest init
```
