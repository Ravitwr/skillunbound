import { readFile } from 'node:fs/promises';

const slugs = [
  'ai-agents-engineering', 'generative-ai-engineer-senior-prep', 'mlops-and-llmops-engineering',
  'vibe-coding', 'django', 'express', 'flask', 'go', 'java', 'mongodb', 'node', 'spring-boot',
  'github', 'ethereum-eth', 'hyperledger', 'chatgpt', 'aws', 'devops-and-platform-engineering',
  'terraform', 'data-science-foundations', 'data-engineering', 'excel', 'power-bi', 'python', 'r',
  'sql', 'digital-marketing', 'angular', 'typescript', 'vue-js', 'advanced-react-and-testing',
  'lamp-stack', 'mean-stack', 'mern-stack', 'next-js-path', 'coding-for-kids', 'flutter', 'kotlin',
  'react-native', 'cybersecurity', 'data-science-with-python', 'react',
];

const decodeJsonString = (value) => JSON.parse(`"${value}"`);

export function extractVideos(html) {
  const pattern = /"title":"((?:\\.|[^"\\])*)","ytLink":"((?:\\.|[^"\\])*)","ytChannelLink":"((?:\\.|[^"\\])*)","ytChannelName":"((?:\\.|[^"\\])*)"/g;
  const videos = [];
  const seen = new Set();
  let match;

  while ((match = pattern.exec(html))) {
    const url = decodeJsonString(match[2]);
    const videoId = new URL(url).searchParams.get('v');
    if (!videoId || seen.has(videoId)) continue;
    seen.add(videoId);
    videos.push({
      videoId,
      title: decodeJsonString(match[1]),
      creator: decodeJsonString(match[4]),
      channelUrl: decodeJsonString(match[3]),
      url,
    });
  }

  return videos;
}

async function auditSlug(slug) {
  const sourcePath = `https://learn.dropoutdeveloper.in/paths/${slug}`;
  const apiUrl = `https://api.dropoutdeveloper.in/paths/${slug}`;
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(apiUrl, {
        headers: { 'user-agent': 'SkillUnbound curriculum audit', 'cache-control': 'no-cache' },
      });
      if (!response.ok) throw new Error(`${response.status} ${apiUrl}`);
      const payload = await response.json();
      const videos = (payload.path?.paths || []).flatMap((section, sectionIndex) =>
        (section.courses || []).map((course, courseIndex) => {
          const url = course.ytLink;
          const videoId = new URL(url).searchParams.get('v');
          return {
            videoId,
            title: course.title,
            creator: course.ytChannelName,
            channelUrl: course.ytChannelLink,
            url,
            duration: course.time || 'Runtime shown on YouTube',
            sourceSection: section.title,
            sourceSectionIndex: sectionIndex,
            sourceCourseIndex: courseIndex,
          };
        }),
      ).filter((video) => video.videoId && video.title && video.creator);
      if (!videos.length) throw new Error(`No public YouTube lessons found at ${sourcePath}`);
      return [slug, { sourcePath, videos }];
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
    }
  }
  throw lastError;
}

async function auditAll(selectedSlugs = slugs) {
  const output = {};
  let cursor = 0;
  async function worker() {
    while (cursor < selectedSlugs.length) {
      const slug = selectedSlugs[cursor++];
      const [key, value] = await auditSlug(slug);
      output[key] = value;
      if (cursor < selectedSlugs.length) await new Promise((resolve) => setTimeout(resolve, 900));
    }
  }
  await worker();
  return Object.fromEntries(selectedSlugs.map((slug) => [slug, output[slug]]));
}

if (process.argv[2] === '--file') {
  const html = await readFile(process.argv[3], 'utf8');
  process.stdout.write(JSON.stringify(extractVideos(html)));
} else {
  const startArg = process.argv.find((arg) => arg.startsWith('--start='));
  const countArg = process.argv.find((arg) => arg.startsWith('--count='));
  const start = startArg ? Number(startArg.split('=')[1]) : 0;
  const count = countArg ? Number(countArg.split('=')[1]) : slugs.length;
  const paths = await auditAll(slugs.slice(start, start + count));
  process.stdout.write(JSON.stringify({ verifiedAt: new Date().toISOString().slice(0, 10), paths }));
}
