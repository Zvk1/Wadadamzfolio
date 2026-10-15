// Edit this file to personalize the portfolio. Empty URLs stay as clear placeholders.
window.PORTFOLIO = {
  name: 'Zaki Boongaling', availability: 'Open for internships',
  university: 'Technological Institute of The Philippines - Manila',
  photo: '/profile-refined.png',
  photoLight: '/profile-black-shirt.png',
  links: { github: 'https://github.com/Zvk1', linkedin: 'https://www.linkedin.com/in/zak1-boongaling', email: 'zaki.bnglng@gmail.com', other: '' },
  projects: [
    {
      title: 'review.mnl', category: 'WEB APPLICATION', number: '01', visual: 'network',
      description: 'A centralized website for finding, enrolling in, and promoting review centers.',
      tags: [], role: 'Full stack', url: 'https://review-mnl-gamma.vercel.app',
      image: '/assets/projects/review-mnl/screenshot.png', imageAlt: 'review.mnl homepage with review center search and categories'
    },
    {
      title: 'The Event Lab', category: 'STUDENT EVENT PLATFORM', number: '02', visual: 'terminal',
      description: 'A website for TIP students that simplifies event scheduling and coordination.',
      tags: [], role: 'Frontend and backend', url: 'https://theeventlabs.netlify.app',
      image: '/assets/projects/the-event-lab/screenshot.png', imageAlt: 'The Event Lab About page describing the project story and mission'
    }
  ],
  ctfs: [
    {
      title: 'Cyber Apocalypse CTF 2026: The Salt Crown',
      event: 'Hack The Box', category: 'CTF', status: 'Participated',
      dates: 'July 24-29, 2026; After Party: July 31-August 2, 2026', url: ''
    },
    {
      title: 'LearnPossible 2 CTF', event: 'Hexcore Labs PH',
      category: 'CTF', status: 'Upcoming', dates: 'Starts October 16, 2026', url: ''
    }
  ],
  certifications: [
    {
      title: 'Cyber Apocalypse CTF 2026: The Salt Crown - Certificate of Participation',
      issuer: 'Hack The Box', date: 'July 2026', status: 'Participation',
      details: 'Team TIPwners.sh placed 875th of 6,744 teams, solving 26 of 136 challenges for 15,250 points. The certificate lists July 24-29, 2026.',
      url: '/assets/certifications/cyber-apocalypse-2026/certificate.pdf',
      linkLabel: 'View certificate'
    }
  ]
};
