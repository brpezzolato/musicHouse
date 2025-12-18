# 🎵 MusicHouse

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📖 Descrição

O **MusicHouse** é um sistema ERP/PDV desenvolvido para a empresa fictícia **VendeTudo S.A.**, com o objetivo de gerenciar vendas, estoque e clientes, focando em soluções para o segmento musical.  
O sistema oferece uma interface amigável e funcionalidades completas para facilitar o trabalho de funcionários e administradores.

---

## ⚙️ Funcionalidades

- Cadastro e gerenciamento de produtos
- Controle de estoque em tempo real
- Registro e gerenciamento de vendas
- Dashboard com informações resumidas de vendas e produtos mais vendidos
- Sistema de usuários com níveis de permissão (funcionários e administradores)

---

## 🛠 Tecnologias utilizadas

- **Frontend:** Next.js, React, Bootstrap
- **Backend:** Node.js, Express
- **Banco de dados:** MySQL
- **Autenticação:** JWT

---

## 🚀 Como usar

1. Clone o repositório:

   ```bash
   git clone <link-do-repositorio>
   ```

2. Instale as dependências:

   ```bash
    npm install
   ```

3. Configure o arquivo .env com as informações do banco e chaves necessárias:

   ```bash
    DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=senha
   DB_NAME=musichouse
   JWT_SECRET=sua_chave_secreta
   ```

4. Inicie o backend:

   ```bash
    node app.js
   ```

5. Inicie o frontend:

   ```bash
    npm run dev
   ```

6. Acesse no navegador: http://localhost:3000

--

## 📂 Estrutura do projeto

```bash
    MusicHouse/
    ├── backend/            # Backend Node.js + Express
    ├── frontend/           # Frontend Next.js + React
    ├── database/           # Scripts e modelo do MySQL
    ├── README.md
    └── .env
```

--

## 👥 Autor

- Arthur Buscarino Benedetti
- Bruno Pezolato Holosi
- Fábio Henrique Lourenço Pacheco **(Gerente do Projeto)**
- Giovanni Buscarino Benedetti
- Giulia Berraquero Ventre

--

## ⚠️ Observação

Este projeto é fictício e foi desenvolvido com fins acadêmicos para o TCC.
