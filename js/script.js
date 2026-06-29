    // ── HERO WORD ANIMATION ──
    const headline = document.getElementById('heroHeadline');
    const words = ['Built', 'for', 'every', 'screen.'];
    if (!headline.children.length) {
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
        span.style.animationDelay = `${0.3 + i * 0.15}s`;
        if (i === words.length - 1) {
          const em = document.createElement('em');
          em.textContent = word;
          em.style.animationDelay = `${0.3 + i * 0.15}s`;
          span.textContent = '';
          span.appendChild(em);
        }
        headline.appendChild(span);
      });
    } else {
      headline.querySelectorAll('.word').forEach((span, i) => {
        span.style.animationDelay = `${0.3 + i * 0.15}s`;
        const em = span.querySelector('em');
        if (em) em.style.animationDelay = `${0.3 + i * 0.15}s`;
      });
    }

    // ── NAV SCROLL ──
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── REVEAL ON SCROLL ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── FILTER TABS ──
    document.getElementById('filterTabs').addEventListener('click', e => {
      if (!e.target.classList.contains('filter-tab')) return;
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });

    // ── CASE STUDY DATA ──
    const projects = {
      xu1: {
        category: 'XULA — Mobile',
        title: 'Homecoming App',
        inactive: true,
        src: 'images/xula-homecoming.png',
        body: `<p>Xavier University of Louisiana needed a dedicated mobile experience for Homecoming 2018 that would serve both returning alumni and on-campus guests throughout the multi-day event.</p><p>The app provided event registration and check-in, a full homecoming schedule, parade route, campus map, and a live social feed — all under the "eXcellence &amp; yoU" theme. A tile-based navigation system made key actions immediately accessible on first launch.</p><p>The result was a seamless, branded event experience that kept thousands of attendees informed and engaged across the week-long celebration.</p>`,
        tags: ['Mobile App', 'UX Design', 'Event Management', 'XULA'],
        images: 1
      },
      xu2: {
        category: 'XULA — Mobile',
        title: 'XULAgo — Campus Health App',
        inactive: true,
        src: 'images/xula-covid.png',
        body: `<p>When the COVID-19 pandemic forced universities to rethink campus access, Xavier University needed a fast, reliable solution to screen students, faculty, and staff before they entered campus.</p><p>XULAgo was developed to deliver a daily health self-assessment and generate a digital health pass directly on the user's phone. The app also surfaced C-19 resources, active case counts, and campus safety information in one place.</p><p>This project was a critical part of XULA's safe return-to-campus strategy and helped the university maintain operations while prioritising community health during an unprecedented crisis.</p>`,
        tags: ['Mobile App', 'COVID-19', 'Campus Safety', 'UX Design', 'XULA'],
        images: 1
      },
      xu3: {
        category: 'XULA — Portal',
        title: 'myXULA — Unified Student Portal',
        url: 'https://www.xula.edu/itc/myxula-mobile-app.html',
        src: 'images/xula-myxula.png',
        body: `<p>Xavier University's students were navigating two separate systems — a legacy web portal and a standalone mobile app — that duplicated features and created friction in their daily academic lives.</p><p>The myXULA project unified both into a single, intuitive platform. The redesigned portal brought together the dashboard, activity feed, announcements, events, calendars, and department pages under one cohesive experience, with a streamlined navigation system and improved information architecture.</p><p>The result significantly reduced the cognitive load on students and gave the university a scalable platform to build on for future digital services.</p>`,
        tags: ['Portal Design', 'Mobile App', 'UX', 'Information Architecture', 'XULA'],
        images: 1
      },
      ls1: {
        category: 'LoneStar College',
        title: 'Books & Bookstore',
        url: 'https://www.lonestar.edu/bookstore.htm',
        src: 'images/Bookstore-LB.webp',
        body: `<p>Lone Star College's bookstore page was a dense wall of text with little visual hierarchy. Students struggled to find key information like textbook ordering, rental check-ins, and hours of operation.</p><p>The redesign introduced a clear services section, visual CTAs, and a modern layout that made the most critical actions immediately accessible — including the virtual bookstore integration with TextbookX.</p>`,
        tags: ['Web Redesign', 'UX', 'Higher Education', 'CMS'],
        images: 1
      },
      ls2: {
        category: 'LoneStar College',
        title: 'Parents & Family',
        url: 'https://www.lonestar.edu/parents.htm',
        src: 'images/Parents-LB.webp',
        body: `<p>The original Parents Resources page was a long-scroll text document that felt impersonal and overwhelming for families new to the college system.</p><p>The redesign reframed the page around family concerns — admissions, financial aid, programs — with a welcoming hero, feature cards for key reasons to choose LSC, and a clear visual admissions process flow.</p>`,
        tags: ['Web Redesign', 'UX', 'Higher Education', 'Content Strategy'],
        images: 1
      },
      ls3: {
        category: 'LoneStar College',
        title: 'Marketing Resources',
        url: 'https://www.lonestar.edu/college-departments/marketing-communications/marketing-resources.htm',
        src: 'images/Marketing-LB.webp',
        body: `<p>The Marketing Resources page was a long, unstructured list of links that made it difficult for staff to locate brand assets quickly. There was no visual differentiation between resource types.</p><p>The redesign introduced clear sections for Styleguides, PowerPoints, and Logos — with thumbnail previews for templates and accordion-style logo categories to reduce scroll fatigue.</p>`,
        tags: ['Web Redesign', 'Information Architecture', 'Higher Education'],
        images: 1
      },
      ls4: {
        category: 'LoneStar College',
        title: 'Career Services',
        url: 'https://www.lonestar.edu/HNCareerServices.htm',
        src: 'images/Career-Services-LB.webp',
        body: `<p>Career Services at LSC-Houston North needed a page that felt as approachable and human as the counsellors themselves. The original page relied on icon-and-text lists that didn't convey the breadth of support available.</p><p>The redesign led with a warm hero, introduced icon-card services blocks, and added a prominent counsellor quote and booking CTA — making it easy for students to take the next step.</p>`,
        tags: ['Web Redesign', 'UX', 'Higher Education', 'Student Services'],
        images: 1
      }
    };

    function openModal(id) {
      const p = projects[id];
      if (!p) return;
      document.getElementById('modalCategory').textContent = p.category;
      document.getElementById('modalTitle').textContent = p.title;
      document.getElementById('modalBody').innerHTML = p.body;
      const tagsEl = document.getElementById('modalTags');
      tagsEl.innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
      const imagesEl = document.getElementById('modalImages');
      let imgHtml = '';
      if (p.src) {
        imgHtml = `<img src="${p.src}" alt="${p.title}" style="width:100%;border-radius:var(--radius);object-fit:cover;" />`;
      } else {
        imgHtml = Array.from({length: p.images}, (_, i) =>
          `<div class="modal-img">Add project image ${i + 1}</div>`
        ).join('');
      }
      let linkHtml = '';
      if (p.url) {
        linkHtml = `<a href="${p.url}" target="_blank" rel="noopener" class="modal-link"><svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>View Live Site</a>`;
      } else if (p.inactive) {
        linkHtml = `<span class="modal-inactive">⚬ Site Inactive — migrated to myXULA</span>`;
      }
      const disclaimer = `<p style="font-size:11px;color:var(--text-muted);margin-top:12px;line-height:1.5;font-style:italic;">* Some design features may have been updated or changed since this project was completed.</p>`;
      imagesEl.innerHTML = imgHtml + linkHtml + (linkHtml ? disclaimer : '');
      document.getElementById('modalOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('modalOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    function handleOverlayClick(e) {
      if (e.target === document.getElementById('modalOverlay')) closeModal();
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    function toggleMenu() {
      const menu = document.getElementById('navLinks');
      const btn = document.getElementById('hamburger');
      menu.classList.toggle('open');
      btn.classList.toggle('open');
    }
    function closeMenu() {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    }
    // Close menu on outside click
    document.addEventListener('click', function(e) {
      const nav = document.getElementById('navbar');
      if (!nav.contains(e.target)) closeMenu();
    });

