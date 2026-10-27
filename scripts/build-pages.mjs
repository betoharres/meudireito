// Builds the static benefit pages (beneficios/<slug>/index.html), the hub page (beneficios/index.html)
// and sitemap.xml from scripts/benefit-pages.mjs. No dependencies: run `node scripts/build-pages.mjs`.
//
// The header, footer, mascot and program illustrations are read from index.html, so every page keeps
// the same design as the home page. It also adds a "Saiba mais" link to each home page card.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, UPDATED, UPDATED_LABEL } from './benefit-pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://meudedireito.netlify.app/';
const BRAND = 'Meu De Direito';

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script>: escape "<" so the text can never close the tag.
const jsonLd = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

function fail(message) {
  throw new Error('build-pages: ' + message);
}

function slice(text, start, end) {
  const from = text.indexOf(start);
  if (from === -1) fail('missing ' + start);
  const to = text.indexOf(end, from);
  if (to === -1) fail('missing ' + end + ' after ' + start);
  return text.slice(from, to + end.length);
}

let home = readFileSync(join(ROOT, 'index.html'), 'utf8');
const rules = JSON.parse(readFileSync(join(ROOT, 'regras.json'), 'utf8'));

// ---------- Pieces shared with the home page ----------

const header = slice(home, '<header class="top">', '</header>').replace(/<p class="brand">([^<]+)<\/p>/, '<a class="brand" href="/">$1</a>');
const disclaimer = slice(home, '<footer class="bottom">', '</footer>').match(/<p>([\s\S]*?)<\/p>/)[1].replace(/\s+/g, ' ').trim();
const mascot = slice(home, '<template id="tpl-mascot">', '</template>')
  .replace('<template id="tpl-mascot">', '')
  .replace('</template>', '')
  .trim()
  .replace('<svg class="mascot"', '<svg class="mascot is-waving"');

const cards = new Map();
// Tolerates the line breaks a formatter adds inside tags (e.g. `<span ...\n  ><svg`).
const cardPattern = /<li class="program-card reveal">\s*<span class="program-art ([\w-]+)"\s*>\s*(<svg[\s\S]*?<\/svg\s*>)\s*<\/span\s*>\s*<div>\s*<h3>\s*([^<]+?)\s*<\/h3>/g;
for (const match of home.matchAll(cardPattern)) {
  cards.set(match[3].replace(/\s+/g, ' '), { tile: match[1], art: match[2].replace(/\s+/g, ' ').replace(/\s*\/>/g, '/>') });
}

// ---------- Consistency checks ----------

const bySlug = new Map(PAGES.map((page) => [page.slug, page]));
const programNames = rules.programs.map((program) => program.name);
for (const name of programNames) {
  if (!PAGES.some((page) => page.card === name)) fail('no page for program "' + name + '"');
  if (!cards.has(name)) fail('no home card for program "' + name + '"');
}
for (const page of PAGES) {
  if (!programNames.includes(page.card)) fail(page.slug + ': card "' + page.card + '" is not in regras.json');
  for (const slug of page.related) if (!bySlug.has(slug)) fail(page.slug + ': unknown related page ' + slug);
  if (page.title.length > 65) fail(page.slug + ': title longer than 65 characters');
  if (page.description.length > 160) fail(page.slug + ': description longer than 160 characters');
}

// ---------- Templates ----------

function head({ title, description, url, type }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="pt-BR" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${BRAND}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}og-image.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE}og-image.png" />
    <meta name="color-scheme" content="only light" />
    <meta name="theme-color" content="#f2f2f7" />
    <meta name="referrer" content="no-referrer" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="stylesheet" href="/styles.css" />`;
}

function footer() {
  return `    <footer class="bottom">
      <p>${disclaimer}</p>
      <p class="footer-links"><a href="/">Fazer o teste</a> · <a href="/beneficios/">Todos os benefícios</a></p>
    </footer>
  </body>
</html>
`;
}

function breadcrumb(items) {
  const links = items
    .map(([name, href], index) => (index === items.length - 1
      ? `<li aria-current="page">${escapeHtml(name)}</li>`
      : `<li><a href="${href}">${escapeHtml(name)}</a></li>`))
    .join('');
  return `<nav class="breadcrumb" aria-label="Você está em"><ol>${links}</ol></nav>`;
}

function breadcrumbLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, href], index) => ({ '@type': 'ListItem', position: index + 1, name, item: new URL(href, SITE).href })),
  };
}

function art(name) {
  const card = cards.get(name);
  return `<span class="program-art ${card.tile}">${card.art}</span>`;
}

function section(part) {
  const paragraphs = (part.paragraphs ?? []).map((text) => `<p>${escapeHtml(text)}</p>`).join('\n          ');
  const list = part.list ? `<ul>${part.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
  const example = part.example ? `<p class="example">${escapeHtml(part.example)}</p>` : '';
  return `        <section>
          <h2>${escapeHtml(part.h2)}</h2>
          ${[paragraphs, list, example].filter(Boolean).join('\n          ')}
        </section>`;
}

function pageHtml(page) {
  const url = `${SITE}beneficios/${page.slug}/`;
  const crumbs = [['Início', '/'], ['Benefícios', '/beneficios/'], [page.card, `/beneficios/${page.slug}/`]];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbLd(crumbs),
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.description,
        inLanguage: 'pt-BR',
        datePublished: UPDATED,
        dateModified: UPDATED,
        mainEntityOfPage: url,
        image: `${SITE}og-image.png`,
        author: { '@type': 'Organization', name: BRAND, url: SITE },
        publisher: { '@type': 'Organization', name: BRAND, url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}apple-touch-icon.png` } },
        citation: page.sources.map((source) => source.url),
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      },
    ],
  };
  const sources = page.sources.length === 0 ? '' : `
        <section class="sources">
          <h2>Fontes oficiais</h2>
          <ul>${page.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a></li>`).join('')}</ul>
        </section>`;
  const related = page.related.map((slug) => {
    const other = bySlug.get(slug);
    return `<li><a href="/beneficios/${slug}/">${art(other.card)}<span>${escapeHtml(other.h1)}</span></a></li>`;
  }).join('');

  return `${head({ title: page.title, description: page.description, url, type: 'article' })}
    <script type="application/ld+json">
${jsonLd(ld)}
    </script>
  </head>
  <body class="is-intro page">
    ${header}

    <main class="article">
      ${breadcrumb(crumbs)}
      <div class="speech">
        <span class="mascot-slot">${mascot}</span>
        <div class="bubble"><h1>${escapeHtml(page.h1)}</h1></div>
      </div>
      <p class="article-lead">${escapeHtml(page.lead)}</p>
      <p class="article-meta">Atualizado em ${UPDATED_LABEL} · Site independente, não é do governo</p>
      <a class="button button-primary article-start" href="/">Descobrir se tenho direito</a>

      <div class="article-sheet">
        <section class="answer-box" aria-labelledby="resposta-rapida">
          ${art(page.card)}
          <div>
            <h2 id="resposta-rapida">Resposta rápida</h2>
            <ul>${page.quick.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </div>
        </section>

${page.sections.map(section).join('\n\n')}

        <div class="more-cta">
          <p>Descubra em 1 minuto se você tem direito a este e a outros benefícios.</p>
          <a class="button button-primary" href="/">Fazer o teste grátis</a>
        </div>

        <section class="faq">
          <h2>Perguntas frequentes</h2>
          ${page.faq.map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join('\n          ')}
        </section>
${sources}
        <section class="related">
          <h2>Veja também</h2>
          <ul class="related-list">${related}</ul>
        </section>
      </div>
    </main>

${footer()}`;
}

function hubHtml() {
  const url = `${SITE}beneficios/`;
  const title = 'Benefícios sociais do governo em 2026: quem tem direito';
  const description = 'Veja os benefícios sociais do governo federal em 2026, quem tem direito a cada um e como pedir: Bolsa Família, BPC, Gás do Povo, Tarifa Social, Pé-de-Meia e mais.';
  const crumbs = [['Início', '/'], ['Benefícios', '/beneficios/']];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbLd(crumbs),
      {
        '@type': 'CollectionPage',
        name: title,
        description,
        url,
        inLanguage: 'pt-BR',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: PAGES.map((page, index) => ({ '@type': 'ListItem', position: index + 1, name: page.card, url: `${SITE}beneficios/${page.slug}/` })),
        },
      },
    ],
  };
  const items = PAGES.map((page) => `          <li class="program-card">
            ${art(page.card)}
            <div>
              <h2><a href="/beneficios/${page.slug}/">${escapeHtml(page.card)}</a></h2>
              <p>${escapeHtml(page.lead)}</p>
            </div>
          </li>`).join('\n');
  return `${head({ title, description, url, type: 'website' })}
    <script type="application/ld+json">
${jsonLd(ld)}
    </script>
  </head>
  <body class="is-intro page">
    ${header}

    <main class="article">
      ${breadcrumb(crumbs)}
      <div class="speech">
        <span class="mascot-slot">${mascot}</span>
        <div class="bubble"><h1>Benefícios sociais do governo: quem tem direito a cada um</h1></div>
      </div>
      <p class="article-lead">Escolha um benefício para ver quem tem direito, quanto vale e como pedir. Ou faça o teste e descubra todos de uma vez.</p>
      <a class="button button-primary article-start" href="/">Fazer o teste grátis</a>
      <div class="article-sheet">
        <ul class="program-cards hub-list">
${items}
        </ul>
      </div>
    </main>

${footer()}`;
}

// ---------- Write the pages ----------

for (const page of PAGES) {
  const dir = join(ROOT, 'beneficios', page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), pageHtml(page));
}
mkdirSync(join(ROOT, 'beneficios'), { recursive: true });
writeFileSync(join(ROOT, 'beneficios', 'index.html'), hubHtml());

const urls = [SITE, `${SITE}beneficios/`, ...PAGES.map((page) => `${SITE}beneficios/${page.slug}/`)];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${UPDATED}</lastmod>\n  </url>`).join('\n')}
</urlset>
`);

// Home page cards link to their page. Re-running replaces the link instead of adding another one.
for (const page of PAGES) {
  const start = home.search(new RegExp('<h3>\\s*' + page.card.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*</h3>'));
  if (start === -1) fail('home card not found: ' + page.card);
  const end = home.indexOf('</li>', start);
  const card = home.slice(start, end);
  const link = `<a class="program-link" href="/beneficios/${page.slug}/">Quem tem direito? Saiba mais</a>`;
  const updated = card.includes('class="program-link"')
    ? card.replace(/<a class="program-link"[^>]*>[^<]*<\/a>/, link)
    : card.replace(/(<\/p>)(\s*<\/div>\s*)$/, `$1\n                  ${link}$2`);
  if (!updated.includes(link)) fail('could not add the link to the home card of ' + page.card);
  home = home.slice(0, start) + updated + home.slice(end);
}
writeFileSync(join(ROOT, 'index.html'), home);

console.log(`Built ${PAGES.length} benefit pages, the hub page and sitemap.xml (${urls.length} URLs).`);
