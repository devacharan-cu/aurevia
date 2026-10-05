import { esc, html } from '../templates/helpers.mjs';
import { pageIntro } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema } from './schema.mjs';

const doc = (sections) => html`
  <section class="wrap pb-24 md:pb-36">
    <div class="grid gap-12 border-t border-line pt-14 lg:grid-cols-12">
      <nav class="lg:col-span-3" aria-label="Sections">
        <ol class="toc lg:sticky lg:top-28">${sections.map((s, i) => `<li><a href="#${s.id}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</a></li>`)}</ol>
      </nav>
      <div class="prose-aurevia lg:col-span-7 lg:col-start-5">
        ${sections.map((s) => `<h2 id="${s.id}">${esc(s.title)}</h2>${s.body}`)}
      </div>
    </div>
  </section>`;

export default function legal(ctx) {
  const { site, credits } = ctx;

  /* ---------- Privacy ---------- */
  const privacySections = [
    { id: 'summary', title: 'In short', body: `<p>We collect only what we need to reply to you. We don’t sell it, we don’t use advertising trackers, and we don’t share it with employers or insurers without your written consent.</p><p><strong>This is a design concept.</strong> ${esc(site.concept_notice)} If the forms on this site are connected to an inbox, what you send is read only by the people running the concept, and deleted once your message is answered.</p>` },
    { id: 'collect', title: 'What we collect', body: `<p>When you use the enquiry or contact form: your name, email address, phone number, the area of care you chose, your contact preferences, and any message you write. We ask you not to include detailed medical information in the form.</p><p>The site itself sets no cookies and runs no analytics.</p>` },
    { id: 'use', title: 'How we use it', body: `<ul><li>To reply to your enquiry by the method you chose</li><li>To arrange an appointment, if you decide to book one</li><li>To keep a record of the enquiry for up to twelve months if no appointment follows</li></ul>` },
    { id: 'processors', title: 'Who processes it', body: `<p>Form submissions are delivered by Web3Forms, an email-forwarding service, which passes them to our coordinators’ inbox. The site is hosted on Cloudflare Pages. Neither receives more than is needed to deliver the page or the message.</p>` },
    { id: 'rights', title: 'Your rights', body: `<p>You can ask to see, correct or delete the information we hold about you, or object to how it’s used. Write to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and we will respond within one month.</p>` },
    { id: 'records', title: 'Medical records', body: `<p>If you become a patient, your clinical records are kept confidentially, separately from enquiry emails, and shared only with your consent or where the law requires it. A full records notice is provided at your first appointment.</p>` },
  ];

  /* ---------- Colophon ---------- */
  const colophonSections = [
    { id: 'concept', title: 'The concept', body: `<p>Aurevia is a fictional private medical practice, designed and built as a portfolio project. The brief: make private healthcare feel like hospitality rather than a hospital, and earn trust through clarity rather than claims.</p><p>Every person, fee, room and address on this site is invented. The specialists hold no real qualifications and are represented by typographic plates rather than photographs of real people. The journal articles are written in general terms and are not medical advice.</p>` },
    { id: 'identity', title: 'Identity', body: `<p>The mark is an arched doorway with a point of light inside it, which is where the name comes from: <em>aura</em>, light, and a way in. The same idea runs through the photography, which favours rooms described by the light falling into them.</p><p>Type is set in <strong>Newsreader</strong>, a literary serif by Production Type, for headlines and quotations, and <strong>Hanken Grotesk</strong> for everything that needs to be read quickly. Both are self-hosted variable fonts.</p>` },
    { id: 'build', title: 'Build', body: `<p>Static HTML generated from structured content by a small Node script, styled with Tailwind CSS, and enhanced with a few kilobytes of vanilla JavaScript loaded per page. Content is editable through Decap CMS, forms are delivered by Web3Forms, and the site deploys to Cloudflare Pages. Everything works without JavaScript; motion respects reduced-motion settings.</p>` },
    { id: 'photography', title: 'Photography', body: `<p>Photographs are from Unsplash, used under the Unsplash License. With thanks to:</p><ul>${credits.map((c) => `<li><a href="${esc(c.source)}" rel="noopener">${esc(c.photographer)}</a> <span class="text-muted">— ${esc(c.file.replace(/-/g, ' '))}</span></li>`).join('')}</ul>` },
  ];

  const page = (id, path, title, intro, sections, description) => {
    const crumbs = [{ label: 'Home', href: '/' }, { label: title.replace(/\*/g, ''), href: path }];
    return {
      path,
      html: layout(ctx, { id, path, title: title.replace(/\*/g, ''), description, jsonld: [breadcrumbSchema(site, crumbs)] },
        pageIntro({ crumbs, eyebrowLabel: id === 'privacy' ? 'Privacy' : 'Colophon', title, intro }) + doc(sections)),
    };
  };

  return [
    page('privacy', '/privacy/', 'Privacy, *plainly.*', 'What happens to the details you give us, in the order you are likely to wonder about it.', privacySections,
      'How Aurevia handles the details you send through its forms: what is collected, why, who processes it, and your rights.'),
    page('colophon', '/colophon/', 'Colophon & *credits.*', 'A note on how Aurevia was made, and on the people whose photographs it borrows.', colophonSections,
      'About the Aurevia concept: identity, typography, technology and photography credits.'),
  ];
}
