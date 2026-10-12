(function () {
  'use strict';

  const data = window.SkillUnboundData;
  const main = document.querySelector('#main');
  const toast = document.querySelector('#toast');
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  };
  const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const slugText = (value) => safe(value).replace(/\n/g, '<br>');
  let toastTimer;
  let activeAudio;

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  function routeParts() {
    const hashRoute = location.hash.replace(/^#\/?/, '');
    const pathRoute = location.pathname.replace(/^\/+|\/+$/g, '');
    return (hashRoute || pathRoute || '').split('/').filter(Boolean).map(decodeURIComponent);
  }

  function setMeta(title, description, canonicalPath = '/', schema = null) {
    document.title = `${title} — Skill Unbound`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = description;
    const canonicalUrl = new URL(canonicalPath, 'https://skillunbound.dev').href;
    document.querySelector('link[rel="canonical"]').href = canonicalUrl;
    document.querySelector('meta[property="og:title"]').content = `${title} — Skill Unbound`;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:url"]').content = canonicalUrl;
    document.querySelector('#routeSchema')?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = 'routeSchema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.append(script);
    }
  }

  function progressFor(pathId) {
    const all = storage.get('skillunbound.progress.v2', {});
    return all[pathId] || { enrolledAt: null, milestones: {} };
  }

  function saveProgress(pathId, progress) {
    const all = storage.get('skillunbound.progress.v2', {});
    all[pathId] = progress;
    storage.set('skillunbound.progress.v2', all);
  }

  function completion(path, progress) {
    const done = path.milestones.filter((item) => progress.milestones[item.id]?.completed).length;
    return { done, total: path.milestones.length, percent: Math.round((done / path.milestones.length) * 100) };
  }

  function card(path) {
    const progress = progressFor(path.id);
    const stats = completion(path, progress);
    return `<article class="card">
      <div class="card-meta"><span class="tag ${path.contentType === 'Original course' ? 'tag-accent' : ''}">${safe(path.contentType)}</span><span class="tag">${safe(path.category)}</span></div>
      <h3><a href="#/path/${encodeURIComponent(path.id)}">${safe(path.title)}</a></h3>
      <p>${safe(path.summary)}</p>
      <div class="card-foot"><span>${path.weeks} weeks · ${safe(path.difficulty)}</span>${progress.enrolledAt ? `<span>${stats.percent}% complete</span>` : '<span>Free</span>'}</div>
    </article>`;
  }

  function renderHome() {
    setMeta('Learn by building', 'Free project-based technology paths with public resources and evidence-based progress.');
    const featured = ['ai-agents-engineering', 'nodejs', 'web-accessibility'].map((id) => data.paths.find((path) => path.id === id));
    main.innerHTML = `<section class="hero"><div class="shell">
      <span class="eyebrow">Open learning, useful proof</span>
      <h1>Learn the skill.<br><span class="accent">Build the evidence.</span></h1>
      <p class="lede">Fifty original, project-led curricula with ${data.youtubeVideoCount} existing Dropout Developer YouTube lessons. Progress is earned with working deliverables—not by opening a video.</p>
      <div class="hero-actions"><a class="button button-primary" href="#/paths">Explore all paths ↗</a><a class="button" href="#/roadmap">Build a personal roadmap</a></div>
      <div class="hero-proof" aria-label="Catalog facts">
        <article><strong>${data.paths.length}</strong><span>launch paths and courses</span></article>
        <article><strong>${data.tools.length}</strong><span>privacy-labeled browser tools</span></article>
        <article><strong>0</strong><span>paywalls required by Skill Unbound</span></article>
      </div>
    </div></section>
    <section class="section"><div class="shell"><div class="section-head"><div><span class="eyebrow">Start with a direction</span><h2>Three ways in.</h2><p>Pick a focused path, make visible progress, and leave with something another person can inspect.</p></div><a class="button" href="#/paths">Browse catalog</a></div><div class="card-grid">${featured.map(card).join('')}</div></div></section>
    <section class="section" style="background:#17211b;color:white"><div class="shell"><div class="section-head"><div><span class="eyebrow" style="color:#d8f56a">Local-first tools</span><h2>Useful before sign-up exists.</h2><p style="color:#bdc9c0">Plan a roadmap, track practice, inspect a public GitHub profile, or rehearse narration. Each tool says where data goes.</p></div><a class="button" href="#/tools">Open tools</a></div></div></section>`;
  }

  function renderCatalog() {
    setMeta('Learning paths', 'Search and filter 50 project-based learning paths and original courses.', '/paths');
    const categories = [...new Set(data.paths.map((path) => path.category))].sort();
    main.innerHTML = `<section class="section"><div class="shell">
      <div class="section-head"><div><span class="eyebrow">${data.youtubeVideoCount} Dropout videos · verified public sources</span><h1 style="font-size:clamp(3rem,7vw,5.6rem)">Choose what to build next.</h1><p>Every item has outcomes, prerequisites, milestones, a capstone, attribution, and an evidence-based completion rule.</p></div></div>
      <div class="catalog-tools" role="search">
        <div class="field"><label for="catalogSearch">Search</label><input id="catalogSearch" type="search" placeholder="Try Python, data, mobile…"></div>
        <div class="field"><label for="catalogCategory">Category</label><select id="catalogCategory"><option value="">All categories</option>${categories.map((category) => `<option>${safe(category)}</option>`).join('')}</select></div>
        <div class="field"><label for="catalogType">Type</label><select id="catalogType"><option value="">All types</option><option>Curated path</option><option>Original course</option></select></div>
      </div>
      <p class="result-count" id="resultCount" aria-live="polite"></p><div class="card-grid" id="catalogGrid"></div>
    </div></section>`;
    const search = document.querySelector('#catalogSearch');
    const category = document.querySelector('#catalogCategory');
    const type = document.querySelector('#catalogType');
    const grid = document.querySelector('#catalogGrid');
    const resultCount = document.querySelector('#resultCount');
    function draw() {
      const term = search.value.trim().toLowerCase();
      const filtered = data.paths.filter((path) => {
        const haystack = [path.title, path.category, path.difficulty, path.summary, ...path.skills, ...path.tags].join(' ').toLowerCase();
        return (!term || haystack.includes(term)) && (!category.value || path.category === category.value) && (!type.value || path.contentType === type.value);
      });
      resultCount.textContent = `${filtered.length} of ${data.paths.length} results`;
      grid.innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="empty-state"><h3>No matching paths</h3><p>Try a broader keyword or clear a filter.</p></div>';
    }
    [search, category, type].forEach((element) => element.addEventListener('input', draw));
    draw();
  }

  function resourceMarkup(resource) {
    if (resource.kind === 'YouTube video') {
      return `<li class="resource video-resource"><details class="video-disclosure" data-video>
        <summary><span class="video-thumb"><img src="${safe(resource.thumbnail)}" alt="" loading="lazy"><span class="play-badge" aria-hidden="true">▶</span></span><span class="resource-copy"><strong>${safe(resource.title)}</strong><small>${safe(resource.creator)}</small></span><span class="resource-action">Watch</span></summary>
        <div class="video-frame"><iframe data-src="${safe(resource.embedUrl)}" title="${safe(resource.title)} by ${safe(resource.creator)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
        <p class="video-links"><a href="${safe(resource.url)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a><a href="${safe(resource.sourcePath)}" target="_blank" rel="noopener noreferrer">Source path ↗</a></p>
      </details></li>`;
    }
    return `<li class="resource reference-resource"><a href="${safe(resource.url)}" target="_blank" rel="noopener noreferrer"><span class="resource-icon" aria-hidden="true">↗</span><span class="resource-copy"><strong>${safe(resource.title)}</strong><small>${safe(resource.creator)} · ${safe(resource.kind)}</small></span></a></li>`;
  }

  function renderPath(id) {
    const path = data.paths.find((item) => item.id === id);
    if (!path) return renderNotFound();
    setMeta(path.title, path.summary, `/path/${path.id}`, {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: path.title,
      description: path.summary,
      provider: { '@type': 'Organization', name: 'Skill Unbound', url: 'https://skillunbound.dev/' },
      educationalLevel: path.difficulty,
      timeRequired: `P${path.weeks}W`,
      isAccessibleForFree: true,
      url: `https://skillunbound.dev/path/${path.id}`,
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `${path.hoursPerWeek} hours per week` },
    });
    const progress = progressFor(id);
    const stats = completion(path, progress);
    const milestoneMarkup = path.milestones.map((milestone, index) => {
      const saved = progress.milestones[milestone.id] || {};
      const resources = milestone.resourceIndexes.map((resourceIndex) => path.resources[resourceIndex]).filter(Boolean);
      return `<details class="milestone ${saved.completed ? 'completed' : ''}" ${index === stats.done ? 'open' : ''}>
        <summary><span class="milestone-index">${saved.completed ? '✓' : index + 1}</span><span><small>WEEK ${milestone.week} · ${resources.length} ${resources.length === 1 ? 'RESOURCE' : 'RESOURCES'}</small><h3>${safe(milestone.title)}</h3></span><span class="milestone-status">${saved.completed ? 'Complete' : 'View week'} →</span></summary>
        <div class="milestone-body"><div class="build-brief"><span class="eyebrow">Build</span><p>${safe(milestone.deliverable)}</p></div>
          <h4 class="lesson-heading">Lessons</h4>
          <ul class="resource-list">${resources.map(resourceMarkup).join('')}</ul>
          <details class="course-notes"><summary>Project brief and checks</summary><div><p>${safe(milestone.outcome)}</p><p><strong>Checkpoint:</strong> ${safe(milestone.checkpoint)}</p><p><strong>Tip:</strong> ${safe(milestone.hint)}</p><ul>${milestone.tests.map((test) => `<li>${safe(test)}</li>`).join('')}</ul><small>${safe(milestone.rubric)}</small></div></details>
          <details class="evidence-panel"><summary><span>${saved.completed ? 'Update evidence' : 'Mark this week complete'}</span><small>Requires a link or useful note</small></summary>
            <form class="evidence-form" data-evidence-form="${safe(milestone.id)}">
              <label class="check-row"><input type="checkbox" name="resourceChecked" ${saved.resourceChecked ? 'checked' : ''}> <span>I used these lessons in my work.</span></label>
              <div class="field"><label for="evidence-${safe(milestone.id)}">Evidence link or note</label><textarea id="evidence-${safe(milestone.id)}" name="evidence" minlength="20" required placeholder="Repository, artifact, test result, or a useful note">${safe(saved.evidence || '')}</textarea></div>
              ${index === path.milestones.length - 1 ? `<div class="field"><label for="assessment-${safe(milestone.id)}">Capstone reflection</label><textarea id="assessment-${safe(milestone.id)}" name="selfAssessment" minlength="40" required placeholder="What works, what you verified, and what you would improve">${safe(saved.selfAssessment || '')}</textarea></div>` : ''}
              <div class="inline-actions"><button class="button button-primary" type="submit">${saved.completed ? 'Save changes' : 'Complete week'}</button>${saved.completed ? '<button class="button button-quiet button-danger" type="button" data-reopen>Reopen</button>' : ''}</div>
            </form>
          </details>
        </div>
      </details>`;
    }).join('');
    main.innerHTML = `<div class="shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/paths">Paths</a><span>/</span><span>${safe(path.title)}</span></nav>
      <section class="detail-hero"><div class="meta-row"><span class="tag ${path.contentType === 'Original course' ? 'tag-accent' : ''}">${safe(path.contentType)}</span><span class="tag">${safe(path.category)}</span><span class="tag">${safe(path.difficulty)}</span></div><h1>${safe(path.title)}</h1><p class="lede">${safe(path.summary)}</p></section>
      <div class="detail-layout"><section class="course-plan"><div class="course-plan-head"><div><span class="eyebrow">Course plan</span><h2>${path.milestones.length} focused weeks</h2></div><p>Watch, build, and save one piece of evidence each week.</p></div><div class="milestone-list">${milestoneMarkup}</div></section>
      <aside class="detail-aside" aria-label="Path summary"><h2 style="font-size:1.45rem">Your progress</h2><div class="progress-meter" aria-label="${stats.percent}% complete"><span style="width:${stats.percent}%"></span></div><p><strong>${stats.done}/${stats.total}</strong> milestones complete</p><button class="button button-primary" id="enrollButton" type="button">${progress.enrolledAt ? 'Continue learning' : 'Enroll locally'}</button>
        <dl><dt>Duration</dt><dd>${path.weeks} weeks</dd><dt>Weekly time</dt><dd>${safe(path.hoursPerWeek)} hours</dd>${path.youtubeCount ? `<dt>Dropout videos</dt><dd>${path.youtubeCount}</dd>` : ''}<dt>Resources checked</dt><dd>${safe(path.verifiedAt)}</dd></dl>
        <h3>Prerequisites</h3><ul>${path.prerequisites.map((item) => `<li>${safe(item)}</li>`).join('')}</ul>
        ${path.prerequisitePathIds.length ? `<h3>Recommended first</h3><ul>${path.prerequisitePathIds.map((pathId) => { const prerequisite = data.paths.find((item) => item.id === pathId); return prerequisite ? `<li><a href="#/path/${safe(prerequisite.id)}">${safe(prerequisite.title)}</a></li>` : ''; }).join('')}</ul>` : ''}
        <h3>Skills</h3><div class="meta-row">${path.skills.map((item) => `<span class="tag">${safe(item)}</span>`).join('')}</div>
        <details class="side-details"><summary>Source and assessment</summary><p>${safe(path.assessment)}</p>${path.referenceUrl ? `<a href="${safe(path.referenceUrl)}" target="_blank" rel="noopener noreferrer">Original path inventory ↗</a>` : `<p>${safe(path.referencePurpose)}</p>`}</details>
      </aside></div></div>`;

    document.querySelectorAll('[data-video]').forEach((details) => {
      details.addEventListener('toggle', () => {
        const iframe = details.querySelector('iframe[data-src]');
        if (details.open && iframe && !iframe.hasAttribute('src')) iframe.src = iframe.dataset.src;
      });
    });

    document.querySelector('#enrollButton').addEventListener('click', () => {
      if (!progress.enrolledAt) {
        progress.enrolledAt = new Date().toISOString();
        saveProgress(path.id, progress);
        notify('Enrolled locally. Your progress stays in this browser.');
        renderPath(id);
      } else {
        document.querySelector('.milestone:not(.completed)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    document.querySelectorAll('[data-evidence-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const milestoneId = form.dataset.evidenceForm;
        const evidence = String(formData.get('evidence') || '').trim();
        const selfAssessment = String(formData.get('selfAssessment') || '').trim();
        const isCapstone = milestoneId.endsWith('-capstone');
        if (!formData.get('resourceChecked') || evidence.length < 20 || (isCapstone && selfAssessment.length < 40)) {
          notify('Add the required review confirmation and meaningful evidence first.');
          return;
        }
        progress.enrolledAt ||= new Date().toISOString();
        progress.milestones[milestoneId] = { resourceChecked: true, evidence, selfAssessment, completed: true, completedAt: new Date().toISOString() };
        saveProgress(path.id, progress);
        notify('Milestone completed with evidence.');
        renderPath(id);
      });
      form.querySelector('[data-reopen]')?.addEventListener('click', () => {
        const item = progress.milestones[form.dataset.evidenceForm];
        if (item) item.completed = false;
        saveProgress(path.id, progress);
        renderPath(id);
      });
    });
  }

  function renderRoadmap() {
    setMeta('Roadmap builder', 'Build and save a personalized project-based learning roadmap in your browser.', '/roadmap');
    const saved = storage.get('skillunbound.roadmap.v2', null);
    main.innerHTML = `<section class="section"><div class="shell"><div class="section-head"><div><span class="eyebrow">Plan around reality</span><h1 style="font-size:clamp(3rem,7vw,5.6rem)">A roadmap with a finish line.</h1><p>Choose a destination, tell us where you are, and get a schedule made from the path’s real milestones.</p></div></div>
      <div class="roadmap-layout"><form class="form-card form-grid" id="roadmapForm">
        <div class="field full"><label for="roadmapPath">Learning path</label><select id="roadmapPath" name="path">${data.paths.map((path) => `<option value="${safe(path.id)}">${safe(path.title)}</option>`).join('')}</select></div>
        <div class="field"><label for="roadmapLevel">Current level</label><select id="roadmapLevel" name="level"><option value="new">New to the topic</option><option value="some">Know the basics</option><option value="experienced">Related experience</option></select></div>
        <div class="field"><label for="roadmapHours">Hours per week</label><input id="roadmapHours" name="hours" type="number" min="2" max="40" value="6" required></div>
        <div class="field"><label for="roadmapWeeks">Target timeline</label><input id="roadmapWeeks" name="weeks" type="number" min="3" max="52" value="8" required></div>
        <div class="field"><label for="roadmapGoal">Goal</label><input id="roadmapGoal" name="goal" placeholder="e.g. qualify for backend internships" required></div>
        <div class="field full"><label for="roadmapProject">Project interest</label><input id="roadmapProject" name="project" placeholder="e.g. a community event API"></div>
        <div class="privacy full">Plan data and progress are stored only in this browser. No account or tracking request is made.</div>
        <button class="button button-primary full" type="submit">Generate roadmap ↗</button>
      </form><section class="output-card roadmap-output" id="roadmapOutput" aria-live="polite"></section></div>
    </div></section>`;
    const form = document.querySelector('#roadmapForm');
    const output = document.querySelector('#roadmapOutput');
    function drawPlan(plan) {
      if (!plan) {
        output.innerHTML = '<h2>Your plan will appear here.</h2><p>It will use the chosen path’s milestones—not generic generated filler.</p>';
        return;
      }
      const path = data.paths.find((item) => item.id === plan.pathId);
      if (!path) return;
      output.innerHTML = `<div class="meta-row"><span class="tag tag-success">Saved locally</span><span class="tag">${safe(plan.hours)} hours/week</span></div><h2>${safe(path.title)}</h2><p><strong>Goal:</strong> ${safe(plan.goal)}</p>${plan.weeks.map((week) => `<article class="plan-week"><strong>Week ${week.from}${week.to > week.from ? `–${week.to}` : ''}: ${safe(week.title)}</strong><p>${safe(week.deliverable)}</p></article>`).join('')}<div class="inline-actions"><button class="button button-primary" id="downloadRoadmap">Download plan</button><button class="button" id="copyRoadmap">Copy</button><button class="button button-danger" id="resetRoadmap">Reset</button></div>`;
      const text = `${path.title}\nGoal: ${plan.goal}\nTime: ${plan.hours} hours/week\n\n${plan.weeks.map((week) => `Week ${week.from}${week.to > week.from ? `-${week.to}` : ''}: ${week.title}\n${week.deliverable}`).join('\n\n')}`;
      document.querySelector('#downloadRoadmap').onclick = () => downloadFile('skillunbound-roadmap.txt', text, 'text/plain');
      document.querySelector('#copyRoadmap').onclick = () => copyText(text);
      document.querySelector('#resetRoadmap').onclick = () => { localStorage.removeItem('skillunbound.roadmap.v2'); form.reset(); drawPlan(null); };
    }
    if (saved) {
      form.elements.path.value = saved.pathId;
      form.elements.level.value = saved.level;
      form.elements.hours.value = saved.hours;
      form.elements.weeks.value = saved.targetWeeks;
      form.elements.goal.value = saved.goal;
      form.elements.project.value = saved.project || '';
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const path = data.paths.find((item) => item.id === values.get('path'));
      const level = values.get('level');
      const hours = Number(values.get('hours'));
      const targetWeeks = Number(values.get('weeks'));
      const sourceMilestones = level === 'experienced' ? path.milestones.slice(2) : level === 'some' ? path.milestones.slice(1) : path.milestones;
      const weight = sourceMilestones.map((_, index) => index === sourceMilestones.length - 1 ? 2 : 1);
      const totalWeight = weight.reduce((sum, value) => sum + value, 0);
      let cursor = 1;
      const weeks = sourceMilestones.map((milestone, index) => {
        const span = Math.max(1, Math.round((targetWeeks * weight[index]) / totalWeight));
        const result = { title: milestone.title, deliverable: index === sourceMilestones.length - 1 && values.get('project') ? `Adapt the capstone into: ${values.get('project')}. ${milestone.deliverable}` : milestone.deliverable, from: cursor, to: Math.min(targetWeeks, cursor + span - 1) };
        cursor = result.to + 1;
        return result;
      }).filter((item) => item.from <= targetWeeks);
      if (weeks.length) weeks[weeks.length - 1].to = targetWeeks;
      const plan = { pathId: path.id, level, hours, targetWeeks, goal: String(values.get('goal')), project: String(values.get('project') || ''), weeks, createdAt: new Date().toISOString() };
      storage.set('skillunbound.roadmap.v2', plan);
      drawPlan(plan);
      notify('Roadmap saved locally.');
    });
    drawPlan(saved);
  }

  function toolCard(tool) {
    return `<article class="card"><div class="card-meta"><span class="tag">${safe(tool.category)}</span><span class="tag tag-success">Privacy labeled</span></div><h3><a href="#/tool/${safe(tool.id)}">${safe(tool.title)}</a></h3><p>${safe(tool.description)}</p><p class="privacy">${safe(tool.privacy)}</p></article>`;
  }

  function renderTools() {
    setMeta('Browser tools', 'Five useful, privacy-labeled learning tools that run in the browser.', '/tools');
    main.innerHTML = `<section class="section"><div class="shell"><div class="section-head"><div><span class="eyebrow">Your local toolbox</span><h1 style="font-size:clamp(3rem,7vw,5.6rem)">Small tools. Clear boundaries.</h1><p>Every tool explains what stays local, what calls a public API, and what needs an optional self-hosted service.</p></div></div><div class="card-grid">${data.tools.map(toolCard).join('')}</div></div></section>`;
  }

  function toolShell(tool, body, output = '') {
    setMeta(tool.title, tool.description, `/tools/${tool.id}`, { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: tool.title, description: tool.description, applicationCategory: tool.category, operatingSystem: 'Any modern browser', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' } });
    main.innerHTML = `<div class="shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/tools">Tools</a><span>/</span><span>${safe(tool.title)}</span></nav><section class="detail-hero"><span class="eyebrow">${safe(tool.category)} tool</span><h1>${safe(tool.title)}</h1><p class="lede">${safe(tool.description)}</p><div class="privacy">${safe(tool.privacy)}</div></section><section class="section-tight"><div class="tool-layout">${body}<section class="output-card tool-output" id="toolOutput" aria-live="polite">${output}</section></div></section></div>`;
  }

  function renderTool(id) {
    const tool = data.tools.find((item) => item.id === id);
    if (!tool) return renderNotFound();
    if (id === 'roadmap-generator') return renderRoadmap();
    if (id === 'dsa-tracker') return renderDsa(tool);
    if (id === 'github-scorer') return renderGithubScorer(tool);
    if (id === 'local-tts') return renderTts(tool);
    if (id === 'voiceover-builder') return renderVoiceover(tool);
  }

  function renderDsa(tool) {
    toolShell(tool, `<form class="form-card" id="dsaControls"><div class="field"><label for="dsaSet">Practice set</label><select id="dsaSet"><option value="blind75">Blind 75</option><option value="neetcode150">NeetCode 150</option></select></div><div class="field" style="margin-top:14px"><label for="problemSearch">Filter problems</label><input id="problemSearch" type="search" placeholder="Search title or topic"></div><div class="privacy">Set names and links identify the public study lists. Notes and completion state stay in local storage.</div><div class="inline-actions"><button class="button" type="button" id="exportDsa">Export progress</button><button class="button button-danger" type="button" id="resetDsa">Reset selected set</button></div></form>`, '<h2>Practice progress</h2><div id="dsaResults"></div>');
    const setSelect = document.querySelector('#dsaSet');
    const search = document.querySelector('#problemSearch');
    const results = document.querySelector('#dsaResults');
    function stateKey() { return `skillunbound.dsa.${setSelect.value}`; }
    function draw() {
      const set = data.dsaSets[setSelect.value];
      const state = storage.get(stateKey(), {});
      const term = search.value.trim().toLowerCase();
      const matches = set.problems.filter((problem) => !term || `${problem.title} ${problem.topic} ${problem.difficulty}`.toLowerCase().includes(term));
      const completed = set.problems.filter((problem) => state[problem.id]?.done).length;
      results.innerHTML = `<div class="between"><h2>${safe(set.title)}</h2><p><strong>${completed}/${set.problems.length}</strong> complete</p></div><div class="progress-meter"><span style="width:${Math.round(completed / set.problems.length * 100)}%"></span></div><p><a href="${safe(set.source)}" target="_blank" rel="noopener noreferrer">Source list ↗</a></p><div class="problem-list">${matches.map((problem) => `<label class="problem"><input type="checkbox" data-problem="${safe(problem.id)}" ${state[problem.id]?.done ? 'checked' : ''}><span><strong>${safe(problem.title)}</strong><small>${safe(problem.topic)}</small></span><span class="tag">${safe(problem.difficulty)}</span></label>`).join('')}</div>`;
      results.querySelectorAll('[data-problem]').forEach((checkbox) => checkbox.addEventListener('change', () => {
        const next = storage.get(stateKey(), {});
        next[checkbox.dataset.problem] = { done: checkbox.checked, updatedAt: new Date().toISOString() };
        storage.set(stateKey(), next);
        draw();
      }));
    }
    setSelect.addEventListener('change', draw);
    search.addEventListener('input', draw);
    document.querySelector('#exportDsa').onclick = () => {
      const set = data.dsaSets[setSelect.value];
      const state = storage.get(stateKey(), {});
      const text = set.problems.map((problem) => `[${state[problem.id]?.done ? 'x' : ' '}] ${problem.title} — ${problem.topic}`).join('\n');
      downloadFile(`${setSelect.value}-progress.txt`, text, 'text/plain');
    };
    document.querySelector('#resetDsa').onclick = () => { localStorage.removeItem(stateKey()); draw(); notify('Selected tracker reset.'); };
    draw();
  }

  function renderGithubScorer(tool) {
    toolShell(tool, `<form class="form-card" id="githubForm"><div class="field"><label for="githubUser">GitHub username</label><input id="githubUser" name="username" autocomplete="off" pattern="[A-Za-z0-9-]{1,39}" required placeholder="octocat"></div><div class="privacy">Submitting calls GitHub’s public API for the profile, recent repositories, and recent public events. Skill Unbound does not proxy, retain, or sell the response.</div><button class="button button-primary" type="submit">Score public profile</button><h3 style="margin-top:26px">Transparent 100-point rubric</h3><ul><li>Profile completeness: 20</li><li>Portfolio breadth: 25</li><li>Repository documentation signals: 20</li><li>Community signals: 15</li><li>Recent public activity: 20</li></ul></form>`, '<h2>Enter a username to begin.</h2><p>No score is produced until GitHub returns public data.</p>');
    const form = document.querySelector('#githubForm');
    const output = document.querySelector('#toolOutput');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = new FormData(form).get('username').trim();
      output.innerHTML = '<h2>Reading public GitHub data…</h2>';
      try {
        const headers = { Accept: 'application/vnd.github+json' };
        const [profileResponse, reposResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
          fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers }),
          fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`, { headers }),
        ]);
        if (!profileResponse.ok) throw new Error(profileResponse.status === 404 ? 'GitHub user not found.' : `GitHub returned ${profileResponse.status}. Try again after the public rate limit resets.`);
        const profile = await profileResponse.json();
        const repos = reposResponse.ok ? await reposResponse.json() : [];
        const events = eventsResponse.ok ? await eventsResponse.json() : [];
        const originals = repos.filter((repo) => !repo.fork);
        const documented = originals.filter((repo) => repo.description && (repo.license || repo.homepage || (repo.topics || []).length));
        const recentCutoff = Date.now() - (90 * 24 * 60 * 60 * 1000);
        const recentEvents = events.filter((item) => new Date(item.created_at).getTime() >= recentCutoff);
        const breakdown = {
          'Profile completeness': Math.min(20, [profile.bio, profile.blog, profile.location, profile.company, profile.avatar_url].filter(Boolean).length * 3 + (profile.hireable ? 3 : 0) + (profile.twitter_username ? 2 : 0)),
          'Portfolio breadth': Math.min(25, Math.round(originals.length * 2.5)),
          'Documentation signals': Math.min(20, documented.length * 4),
          'Community signals': Math.min(15, Math.round(Math.log2((profile.followers || 0) + 1) * 3 + repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / 5)),
          'Recent public activity': Math.min(20, recentEvents.length),
        };
        const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
        output.innerHTML = `<div class="score-ring" style="--score:${score}" data-score="${score}" aria-label="Score ${score} out of 100"></div><h2>${safe(profile.login)}’s public profile</h2><div class="metric-grid">${Object.entries(breakdown).map(([name, value]) => `<div class="metric"><strong>${value}</strong><span>${safe(name)}</span></div>`).join('')}</div><p>This is a portfolio-readiness heuristic, not a measure of engineering ability. Private work, caregiving, employment constraints, and access barriers are invisible to it.</p><div class="inline-actions"><a class="button" href="${safe(profile.html_url)}" target="_blank" rel="noopener noreferrer">Open profile ↗</a><button class="button button-primary" id="downloadBadge">Download SVG badge</button></div>`;
        document.querySelector('#downloadBadge').onclick = () => {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="120" role="img" aria-label="Skill Unbound profile readiness score ${score} out of 100"><rect width="420" height="120" rx="18" fill="#17211b"/><text x="28" y="48" fill="#d8f56a" font-family="system-ui" font-size="18" font-weight="700">SKILL UNBOUND · PUBLIC PROFILE</text><text x="28" y="88" fill="white" font-family="system-ui" font-size="32" font-weight="800">${safe(profile.login)} · ${score}/100</text></svg>`;
          downloadFile(`${profile.login}-skillunbound-score.svg`, svg, 'image/svg+xml');
        };
      } catch (error) {
        output.innerHTML = `<h2>Couldn’t score this profile</h2><p>${safe(error.message)}</p><p>Check the username or try later if GitHub’s unauthenticated rate limit has been reached.</p>`;
      }
    });
  }

  function voiceOptions() {
    if (!window.speechSynthesis) return '<option value="">Speech synthesis is unavailable in this browser</option>';
    return window.speechSynthesis.getVoices().map((voice, index) => `<option value="${index}">${safe(voice.name)} — ${safe(voice.lang)}${voice.localService ? ' (local)' : ''}</option>`).join('');
  }

  function renderTts(tool) {
    toolShell(tool, `<form class="form-card" id="ttsForm"><div class="field"><label for="ttsEngine">Engine</label><select id="ttsEngine" name="engine"><option value="browser">Installed browser / OS voice</option><option value="piper">Self-hosted Piper-compatible HTTP endpoint</option></select></div><div class="field" id="piperFields" hidden><label for="piperEndpoint">Local endpoint</label><input id="piperEndpoint" name="endpoint" type="url" placeholder="http://127.0.0.1:5000/synthesize"><small>Expected response: an audio file for JSON input { text, voice }.</small></div><div class="field"><label for="ttsVoice">Voice</label><select id="ttsVoice" name="voice"></select></div><div class="field"><label for="ttsText">Text</label><textarea id="ttsText" name="text" maxlength="5000" required placeholder="Paste text to speak…"></textarea></div><div class="form-grid"><div class="field"><label for="ttsRate">Rate</label><input id="ttsRate" name="rate" type="range" min="0.5" max="2" step="0.1" value="1"></div><div class="field"><label for="ttsPitch">Pitch</label><input id="ttsPitch" name="pitch" type="range" min="0.5" max="2" step="0.1" value="1"></div></div><div class="privacy">Browser voices use the browser’s speech service and may be local or vendor-provided; inspect the “local” label. Piper mode sends the text only to the endpoint you enter.</div><div class="inline-actions"><button class="button button-primary" type="submit">Speak</button><button class="button" id="pauseSpeech" type="button">Pause / resume</button><button class="button button-danger" id="stopSpeech" type="button">Stop</button></div></form>`, '<h2>Engine status</h2><p id="ttsStatus">Choose a voice and enter text. Audio export depends on the configured Piper endpoint; the Web Speech API does not expose raw audio.</p>');
    const form = document.querySelector('#ttsForm');
    const voiceSelect = document.querySelector('#ttsVoice');
    const engine = document.querySelector('#ttsEngine');
    const piperFields = document.querySelector('#piperFields');
    const status = document.querySelector('#ttsStatus');
    function loadVoices() {
      const options = voiceOptions();
      voiceSelect.innerHTML = options || '<option value="">No installed voices reported yet</option>';
    }
    loadVoices();
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices, { once: true });
    engine.addEventListener('change', () => { piperFields.hidden = engine.value !== 'piper'; });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const text = String(values.get('text')).trim();
      if (engine.value === 'piper') {
        const endpoint = String(values.get('endpoint') || '').trim();
        if (!endpoint) return notify('Enter your local Piper-compatible endpoint.');
        status.textContent = 'Requesting audio from your configured endpoint…';
        try {
          const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice: voiceSelect.options[voiceSelect.selectedIndex]?.text || 'default' }) });
          if (!response.ok) throw new Error(`Endpoint returned ${response.status}.`);
          const blob = await response.blob();
          if (activeAudio) activeAudio.pause();
          activeAudio = new Audio(URL.createObjectURL(blob));
          await activeAudio.play();
          status.innerHTML = `Playing audio returned by your endpoint. <button class="button" id="savePiper" type="button">Save audio</button>`;
          document.querySelector('#savePiper').onclick = () => downloadBlob('skillunbound-speech.wav', blob);
        } catch (error) { status.textContent = `Piper request failed: ${error.message}`; }
        return;
      }
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return notify('Speech synthesis is unavailable in this browser.');
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices[Number(values.get('voice'))] || null;
      utterance.rate = Number(values.get('rate'));
      utterance.pitch = Number(values.get('pitch'));
      utterance.onstart = () => { status.textContent = 'Speaking with the selected browser voice.'; };
      utterance.onend = () => { status.textContent = 'Finished.'; };
      utterance.onerror = (speechEvent) => { status.textContent = `Speech failed: ${speechEvent.error}.`; };
      window.speechSynthesis.speak(utterance);
    });
    document.querySelector('#pauseSpeech').onclick = () => { if (window.speechSynthesis) window.speechSynthesis.paused ? window.speechSynthesis.resume() : window.speechSynthesis.pause(); };
    document.querySelector('#stopSpeech').onclick = () => { window.speechSynthesis?.cancel(); if (activeAudio) activeAudio.pause(); status.textContent = 'Stopped.'; };
  }

  function renderVoiceover(tool) {
    toolShell(tool, `<form class="form-card" id="voiceoverForm"><div class="field"><label for="voiceoverText">Tutorial transcript or narration</label><textarea id="voiceoverText" name="text" minlength="30" maxlength="20000" required placeholder="Paste text you own or are permitted to adapt…"></textarea></div><div class="form-grid"><div class="field"><label for="voiceoverMinutes">Target duration (minutes)</label><input id="voiceoverMinutes" name="minutes" type="number" min="1" max="60" value="5" required></div><div class="field"><label for="voiceoverPace">Words per minute</label><input id="voiceoverPace" name="pace" type="number" min="90" max="220" value="145" required></div></div><div class="privacy">Only pasted text is processed, in this browser. This tool does not fetch, copy, download, or modify YouTube media. Use text you own or have permission to adapt.</div><button class="button button-primary" type="submit">Build timed script</button></form>`, '<h2>Timed segments</h2><p>Segments will appear here with estimated start times and a rehearsal control.</p>');
    const form = document.querySelector('#voiceoverForm');
    const output = document.querySelector('#toolOutput');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const text = String(values.get('text')).trim();
      const minutes = Number(values.get('minutes'));
      const pace = Number(values.get('pace'));
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) || [text];
      const targetWords = Math.max(30, Math.round((minutes * pace) / Math.max(1, Math.ceil(minutes))));
      const segments = [];
      let current = [];
      let words = 0;
      sentences.forEach((sentence) => {
        const count = sentence.split(/\s+/).length;
        if (current.length && words + count > targetWords) { segments.push(current.join(' ')); current = []; words = 0; }
        current.push(sentence); words += count;
      });
      if (current.length) segments.push(current.join(' '));
      let elapsed = 0;
      const timed = segments.map((segment, index) => {
        const duration = Math.max(3, Math.round((segment.split(/\s+/).length / pace) * 60));
        const item = { index, text: segment, start: elapsed, duration };
        elapsed += duration;
        return item;
      });
      const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      output.innerHTML = `<div class="meta-row"><span class="tag">${timed.length} segments</span><span class="tag">≈ ${formatTime(elapsed)}</span><span class="tag">${text.split(/\s+/).length} words</span></div><h2>Timed narration</h2><div class="transcript-segments">${timed.map((segment) => `<article class="segment"><time>${formatTime(segment.start)}</time><p>${safe(segment.text)}</p><button class="button" type="button" data-rehearse="${segment.index}">Rehearse segment</button></article>`).join('')}</div><div class="inline-actions"><button class="button button-primary" id="downloadScript">Download timed script</button><button class="button button-danger" id="stopRehearsal">Stop speech</button></div>`;
      output.querySelectorAll('[data-rehearse]').forEach((button) => button.onclick = () => { if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return notify('Speech synthesis is unavailable in this browser.'); window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(timed[Number(button.dataset.rehearse)].text)); });
      document.querySelector('#stopRehearsal').onclick = () => window.speechSynthesis?.cancel();
      document.querySelector('#downloadScript').onclick = () => downloadFile('timed-voiceover.txt', timed.map((segment) => `[${formatTime(segment.start)}] ${segment.text}`).join('\n\n'), 'text/plain');
    });
  }

  function renderStatic(page) {
    const pages = {
      about: ['About Skill Unbound', `<p class="lede">Skill Unbound is a free-first, project-based learning catalog. It links to excellent public material, adds original structure and assignments, and asks learners to keep evidence of what they built.</p><h2>What this launch is</h2><ul><li>A local-first catalog, roadmap builder, practice tracker, and portfolio evidence system.</li><li>Original Skill Unbound copy and assignments with source attribution.</li><li>An honest public MVP: no fake mentors, testimonials, certificates, or AI claims.</li></ul><h2>What it is not yet</h2><p>Accounts, cross-device sync, managed AI models, automated repository evaluation, and credentials require a backend and operational review. They are intentionally not represented as live.</p>`],
      privacy: ['Privacy', `<p class="lede">The public MVP is designed to work without an account.</p><h2>Local data</h2><p>Roadmaps, path evidence, enrollment state, and DSA progress are stored in your browser’s local storage. Clear site data to remove them.</p><h2>External requests</h2><p>Opening a learning resource sends a normal browser request to its publisher. The GitHub scorer requests public profile data directly from GitHub only after you submit a username. TTS may use your operating system’s voice service; Piper mode sends text only to the endpoint you enter.</p><h2>No analytics claim</h2><p>This repository contains no analytics or advertising script. Hosting providers may retain operational request logs under their own policies.</p>`],
      credits: ['Credits and source policy', `<p class="lede">Skill Unbound links out; it does not republish third-party lessons.</p><h2>Attribution</h2><p>Each curated path includes the existing public YouTube lessons listed by Dropout Developer, with the publishing creator shown beside every lesson. Videos use YouTube's privacy-enhanced embed domain, never autoplay, and load only when opened.</p><h2>Curriculum provenance</h2><p>Dropout Developer is the source inventory for these video selections. Skill Unbound adds original interface design, summaries, outcomes, exercises, rubrics, capstones, and evidence gates.</p><h2>Corrections</h2><p>Until a reviewed submission workflow is online, propose source corrections through the repository’s issue template.</p>`],
    };
    const selected = pages[page] || pages.about;
    setMeta(selected[0], `${selected[0]} for Skill Unbound.`, `/${page}`);
    main.innerHTML = `<section class="section"><div class="shell static-copy"><span class="eyebrow">Skill Unbound</span><h1 style="font-size:clamp(3rem,7vw,5.6rem)">${selected[0]}</h1>${selected[1]}</div></section>`;
  }

  function renderNotFound() {
    setMeta('Not found', 'The requested Skill Unbound page was not found.');
    main.innerHTML = '<section class="section"><div class="shell empty-state"><h1 style="font-size:3rem">That page wandered off.</h1><p>The catalog may have changed, but your local progress has not been deleted.</p><a class="button button-primary" href="#/">Return home</a></div></section>';
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadFile(filename, content, type) { downloadBlob(filename, new Blob([content], { type })); }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); notify('Copied to clipboard.'); }
    catch { notify('Clipboard access was unavailable. Use the download instead.'); }
  }

  function render() {
    const [route, id] = routeParts();
    document.querySelector('#primaryNav').classList.remove('open');
    document.querySelector('#menuButton').setAttribute('aria-expanded', 'false');
    if (!route) renderHome();
    else if (route === 'paths') renderCatalog();
    else if (route === 'path') renderPath(id);
    else if (route === 'roadmap') renderRoadmap();
    else if (route === 'tools') renderTools();
    else if (route === 'tool') renderTool(id);
    else if (['about', 'privacy', 'credits'].includes(route)) renderStatic(route);
    else renderNotFound();
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }

  document.querySelector('#menuButton').addEventListener('click', (event) => {
    const nav = document.querySelector('#primaryNav');
    const open = nav.classList.toggle('open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  window.addEventListener('hashchange', render);
  window.addEventListener('beforeunload', () => window.speechSynthesis?.cancel());
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  render();
}());
