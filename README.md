# Planejador Disney 2027

Plataforma interativa de planejamento de viagem. Abra: https://gabrielacacio-wls.github.io/disney-2027-app/

- Funciona offline e pode ser instalada na tela inicial (PWA).
- Os dados ficam salvos no navegador; use **Exportar JSON** ou **Compartilhar link** (aba Checklist) para levar o plano a outro aparelho.
- As datas-chave podem ser baixadas como calendário (.ics) na aba Resumo.

Sem build e sem dependências: `index.html` + `styles.css` + `app.js` (mais `sw.js`/`manifest.webmanifest` do PWA). Ao publicar mudanças, aumente a versão do cache em `sw.js`.
