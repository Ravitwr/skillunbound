const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../data.js');
const youtube = require('../youtube-data.js');

const projectRoot = path.resolve(__dirname, '..');

test('launch catalog has 42 curated paths and 8 original courses', () => {
  assert.equal(data.paths.length, 50);
  assert.equal(data.paths.filter((item) => item.contentType === 'Curated path').length, 42);
  assert.equal(data.paths.filter((item) => item.contentType === 'Original course').length, 8);
  assert.equal(new Set(data.paths.map((item) => item.id)).size, data.paths.length);
});

test('every catalog item is independently shippable', () => {
  for (const path of data.paths) {
    assert.ok(path.title);
    assert.ok(path.summary.length > 40, path.id);
    assert.ok(path.prerequisites.length, path.id);
    assert.ok(Array.isArray(path.prerequisitePathIds), path.id);
    assert.ok(path.skills.length >= 4, path.id);
    assert.ok(path.milestones.length >= 5, path.id);
    assert.ok(path.capstone.length > 30, path.id);
    assert.ok(path.completionRule.includes('evidence'), path.id);
    assert.ok(path.assessment.includes('rubric'), path.id);
    for (const milestone of path.milestones) {
      assert.ok(milestone.outcome.length > 30, `${path.id}:${milestone.id}`);
      assert.ok(milestone.deliverable.length > 30, `${path.id}:${milestone.id}`);
      assert.ok(milestone.checkpoint.length > 30, `${path.id}:${milestone.id}`);
      assert.ok(milestone.hint.length > 30, `${path.id}:${milestone.id}`);
      assert.ok(milestone.rubric.length > 30, `${path.id}:${milestone.id}`);
      assert.equal(milestone.tests.length, 3, `${path.id}:${milestone.id}`);
    }
  }
});

test('prerequisite path graph contains only valid non-self links', () => {
  const ids = new Set(data.paths.map((item) => item.id));
  for (const path of data.paths) {
    for (const prerequisiteId of path.prerequisitePathIds) {
      assert.ok(ids.has(prerequisiteId), `${path.id}:${prerequisiteId}`);
      assert.notEqual(path.id, prerequisiteId);
    }
  }
});

test('curated resources include attribution and verification metadata', () => {
  for (const path of data.paths.filter((item) => item.contentType === 'Curated path')) {
    assert.match(path.referenceUrl, /^https:\/\/learn\.dropoutdeveloper\.in\/paths\//);
    assert.ok(path.resources.length >= 2, path.id);
    for (const resource of path.resources) {
      assert.match(resource.url, /^https:\/\//, resource.url);
      assert.ok(resource.creator);
      assert.ok(resource.duration);
      assert.match(resource.access, /^Free public access/);
      assert.equal(resource.verifiedAt, data.verifiedAt);
    }
  }
});

test('all existing Dropout Developer YouTube lessons are assigned to curricula', () => {
  assert.equal(Object.keys(youtube.videoSets).length, 42);
  assert.equal(youtube.totalVideos, 367);
  assert.equal(data.youtubeVideoCount, 367);

  for (const path of data.paths.filter((item) => item.contentType === 'Curated path')) {
    const videos = path.resources.filter((resource) => resource.kind === 'YouTube video');
    assert.ok(videos.length > 0, path.id);
    assert.equal(path.youtubeCount, videos.length, path.id);
    assert.equal(new Set(videos.map((video) => video.videoId)).size, videos.length, path.id);

    for (const video of videos) {
      assert.match(video.videoId, /^[A-Za-z0-9_-]{11}$/);
      assert.ok(video.title.length > 8, video.videoId);
      assert.doesNotMatch(video.title, /^(Dropout )?video lesson/i, video.videoId);
      assert.equal(video.url, `https://www.youtube.com/watch?v=${video.videoId}`);
      assert.equal(video.embedUrl, `https://www.youtube-nocookie.com/embed/${video.videoId}`);
      assert.match(video.thumbnail, /^https:\/\/i\.ytimg\.com\/vi\//);
      assert.match(video.sourcePath, /^https:\/\/learn\.dropoutdeveloper\.in\/paths\//);
    }

    const assignedVideoIds = path.milestones
      .flatMap((milestone) => milestone.resourceIndexes)
      .map((resourceIndex) => path.resources[resourceIndex])
      .filter((resource) => resource?.kind === 'YouTube video')
      .map((resource) => resource.videoId);
    assert.deepEqual(new Set(assignedVideoIds), new Set(videos.map((video) => video.videoId)), path.id);
  }

  const nodePath = data.paths.find((item) => item.id === 'nodejs');
  assert.equal(nodePath.resources.find((resource) => resource.videoId === 'fgTGADljAeg').title, 'Build A REST API With Node.js, Express, & MongoDB - Quick');
});

test('the five ClickUp browser-tool tasks are represented', () => {
  assert.deepEqual(data.tools.map((tool) => tool.id), [
    'roadmap-generator',
    'dsa-tracker',
    'github-scorer',
    'local-tts',
    'voiceover-builder',
  ]);
  assert.equal(data.dsaSets.blind75.problems.length, 75);
  assert.equal(data.dsaSets.neetcode150.problems.length, 150);
});

test('production UI includes the Ivory and Charcoal Study Hall themes', () => {
  const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');

  assert.match(html, /id="themeToggle"/);
  assert.match(html, /prefers-color-scheme: dark/);
  assert.match(css, /--page: #f2eee5/);
  assert.match(css, /:root\[data-theme="dark"\]/);
  assert.match(css, /--page: #151819/);
  assert.match(css, /--gold-fill: #e5b747/);
  assert.match(app, /skillunbound\.theme/);
  assert.match(app, /Learn with intent/);
});
