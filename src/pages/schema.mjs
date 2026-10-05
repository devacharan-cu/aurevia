// Structured data builders. Output is JSON-LD; the layout serialises it safely.
// Note: while `indexable` is false in site settings, pages also carry noindex,
// so this fictional practice never presents itself to search engines as real.
import { ogImageUrl } from '../templates/helpers.mjs';

const DAY_MAP = { 'Monday – Friday': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], Saturday: ['Saturday'] };

export function clinicSchema({ site, care }) {
  const a = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': site.url + '/#clinic',
    name: site.legal_name,
    url: site.url + '/',
    telephone: site.phone,
    email: site.email,
    image: site.url + ogImageUrl('striped-chair'),
    address: { '@type': 'PostalAddress', streetAddress: a.line1, addressLocality: a.city, postalCode: a.postcode, addressCountry: 'GB' },
    openingHoursSpecification: site.hours
      .filter((h) => DAY_MAP[h.days])
      .map((h) => {
        const [opens, closes] = h.time.split('–').map((t) => t.trim());
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_MAP[h.days], opens, closes };
      }),
    availableService: care.map((c) => ({ '@type': 'MedicalProcedure', name: c.title, url: `${site.url}/care/${c.slug}/` })),
  };
}

export const breadcrumbSchema = (site, items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: site.url + it.href })),
});

export const physicianSchema = (site, s) => ({
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: s.name,
  url: `${site.url}/specialists/${s.slug}/`,
  medicalSpecialty: s.discipline,
  knowsLanguage: s.languages,
  worksFor: { '@id': site.url + '/#clinic' },
});

export const articleSchema = (site, a, author) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.dek,
  datePublished: a.date,
  image: site.url + ogImageUrl(a.image),
  author: author ? { '@type': 'Person', name: author.name, url: `${site.url}/specialists/${author.slug}/` } : undefined,
  publisher: { '@type': 'Organization', name: site.legal_name },
  mainEntityOfPage: `${site.url}/journal/${a.slug}/`,
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
