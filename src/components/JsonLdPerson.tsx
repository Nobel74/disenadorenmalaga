import React from 'react';

interface JsonLdPersonProps {
  name: string;
  jobTitle: string;
  url: string;
  photoUrl?: string | null;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function JsonLdPerson({
  name,
  jobTitle,
  url,
  photoUrl,
  email = 'info@disenadorenmalaga.es',
  githubUrl = 'https://github.com/Nobel74',
  linkedinUrl,
}: JsonLdPersonProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: jobTitle,
    url: url,
    image: photoUrl || `${url}/favicon.png`,
    email: `mailto:${email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Málaga',
      addressRegion: 'Andalucía',
      addressCountry: 'ES',
    },
    sameAs: [
      githubUrl,
      ...(linkedinUrl ? [linkedinUrl] : []),
    ].filter(Boolean),
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'WordPress Headless CMS',
      'WPGraphQL',
      'SEO Técnico',
      'Diseño UI/UX',
      'Desarrollo Fullstack',
      'Vanilla CSS',
      'PostCSS',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
