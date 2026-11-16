# ⚡ Trampo Já!

Plataforma web de intermediação de serviços freelancers, desenvolvida como **Projeto Integrador** do curso de Análise e Desenvolvimento de Sistemas da **Fatec Ferraz de Vasconcelos (2026)**.

O **Trampo Já!** conecta profissionais autônomos a empresas que buscam contratações pontuais de forma rápida, transparente e segura, reduzindo a burocracia dos processos seletivos tradicionais.

---

## 🌐 Links do Projeto (Produção e Repositórios)

- **Aplicação Web (Front-end na Vercel):** https://front-end-trampo-ja.vercel.app/home
- **Documentação da API (Swagger UI no Render):** https://trampoja.onrender.com/swagger-ui/index.html#/
- **Repositório Front-end:** https://github.com/GabrielJum/-Front-End-TrampoJa
- **Repositório Back-end:** https://github.com/yurilirafarias-prog/TrampoJa

> **Nota:** A API está hospedada no plano gratuito do Render e entra em hibernação após 15 minutos sem uso. Caso o servidor esteja hibernando, a primeira requisição pode levar de 30 a 50 segundos para responder.

---

## 🚀 Principais Funcionalidades

- Cadastro e autenticação de usuários (**Freelancers** e **Empresas**)
- Gerenciamento de perfis profissionais e corporativos
- Publicação, busca e filtragem de vagas freelancers
- Comunicação via chat entre empresa e freelancer
- Avaliação mútua após a conclusão do trabalho
- Canal de contato com a administração da plataforma

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** Angular, TypeScript, HTML5, CSS3, Node.js
- **Back-end:** Java, Spring Boot, Spring Security, Spring Data JPA, Apache Maven
- **Banco de Dados:** PostgreSQL
- **Infraestrutura / Deploy:** Vercel (Front-end), Render (Back-end e PostgreSQL)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- Java JDK (17+) e Apache Maven
- Node.js e Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL e pgAdmin 4
- Git e editor de código (ex.: VS Code)

### 1. Configurar o Banco de Dados (PostgreSQL)
1. Abra o **pgAdmin 4** e conecte-se ao seu servidor local (`postgres`).
2. Clique com o botão direito em **Databases > Create > Database...**
3. Crie um banco com o nome exato **`TrampoJa`** (respeitando letras maiúsculas e minúsculas).

### 2. Executar o Back-end (Spring Boot)

`bash`

`git clone [https://github.com/yurilirafarias-prog/TrampoJa.git](https://github.com/yurilirafarias-prog/TrampoJa.git)`

`cd TrampoJa`

Abra src/main/resources/application.properties e substitua ${DB_PASSWORD} pela senha do seu PostgreSQL local em spring.datasource.password.

Execute a aplicação:

`mvn clean install`

`mvn spring-boot:run`

Acesse o Swagger local em: `http://localhost:8080/swagger-ui/index.html`

### 3. Executar o Front-end (Angular)

`git clone [https://github.com/GabrielJum/-Front-End-TrampoJa.git](https://github.com/GabrielJum/-Front-End-TrampoJa.git)`

`cd -Front-End-TrampoJa`

`npm install`

`ng serve`

Acesse no navegador: `http://localhost:4200`

👥 Integrantes

Gabriel Jum Iamashita

Rebeca Martins Caroba

Yuri Carneiro Leite
