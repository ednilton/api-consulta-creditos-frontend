# 🔜 Frontend – `api-consulta-creditos-frontend`

Aplicação Angular 19 desenvolvida para permitir a consulta de créditos de ISSQN por meio de uma interface amigável, moderna, responsiva e conectada a uma API RESTful.

## 🎯 Funcionalidades

* 🔍 Consulta de créditos por número de NFS-e
* 📄 Visualização detalhada do crédito por código
* 📱 Responsivo (mobile-first)
* 🔄 Integração com API RESTful via `HttpClient`
* 💬 Layout moderno com PrimeNG + Angular Material
* 💡 SSR opcional com Express para ambientes server-side

---

## ⚙️ Tecnologias Utilizadas

| Biblioteca         | Versão   |
| ------------------ | -------- |
| Angular            | ^19.2.0  |
| Angular CLI        | ^19.2.15 |
| PrimeNG            | ^19.1.4  |
| PrimeIcons         | ^7.0.0   |
| PrimeFlex          | ^3.3.1   |
| Angular Material   | ^15      |
| Bootstrap (estilo) | ^5       |
| Express (SSR)      | ^4.18.2  |
| TypeScript         | \~5.7.2  |
| RxJS               | \~7.8.0  |
| Zone.js            | \~0.15.0 |

---

## 📁 Estrutura do Projeto

```
src/app/
├── components/      # Componentes UI reutilizáveis
├── services/        # Serviços de consumo da API
├── models/          # Interfaces e tipagens TS
├── pages/           # Páginas principais
├── shared/          # Pipes, guards, interceptors

angular.json         # Configuração Angular
package.json         # Scripts e dependências
Dockerfile           # Container frontend opcional
```

---

## ▶️ Scripts Disponíveis

```bash
npm install            # Instala as dependências
git start              # Alias para ng serve
npm run build          # Compila a aplicação
npm run test           # Executa os testes com Karma
npm run serve:ssr      # Executa modo SSR (caso configurado)
```

---

## 🧪 Testes Automatizados

* Testes com Jasmine e Karma configurados
* Relatórios de cobertura com `karma-coverage`

---

## 🔧 Executar Localmente

Pré-requisitos:

* Node.js 16+
* Angular CLI 15+

```bash
git clone https://github.com/ednilton/api-consulta-creditos-frontend.git
cd api-consulta-creditos-frontend
npm install
ng serve
```

Acesse em: `http://localhost:4200`

---

## 🌐 Integração com Backend

* Endpoints configurados no `environment.ts`
* Base URL: `http://localhost:8080/api/creditos`
* Exemplo:

```ts
this.http.get(`${api}/123456`);
```

---

## 🧠 Boas Práticas Aplicadas

* SOLID e Clean Code no design dos serviços e componentes
* Organização por feature (pages + components)
* Reaproveitamento com módulos compartilhados
* Estilo CSS via SCSS + PrimeFlex utilitário

---

## 👨‍💻 Desenvolvedor

**Ednilton Curt Rauh**
📧 [edrauh@gmail.com](mailto:edrauh@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/ednilton-rauh-63838a47)

---

Este projeto é parte do desafio técnico para a vaga de desenvolvedor sênior da empresa Gestiona Tecnologia para o cliente Eicon.
