# Skill Unbound

Skill Unbound is a free-first, project-based technical learning catalog. It links to public learning material with attribution, adds original outcomes and assignments, and requires portfolio evidence before a milestone counts as complete.

## Implemented launch scope

- 42 curated technical learning paths from the ClickUp launch batch.
- 367 existing public YouTube lessons audited from the corresponding Dropout Developer paths, distributed across the curricula as lazy-loaded privacy-enhanced embeds.
- 8 original Skill Unbound courses, bringing the catalog to 50 items.
- Search and filters for category and content type.
- Path pages with prerequisites, outcomes, build deliverables, checkpoints, source provenance, and capstones.
- Local enrollment and evidence-based progress. Merely opening a resource cannot complete a milestone.
- Personal roadmap generator using real path milestones, experience, hours, target timeline, goal, and project interest.
- Blind 75 and NeetCode 150 practice trackers with local progress and export.
- Public GitHub profile scorer with a visible 100-point rubric and downloadable SVG badge.
- Speech playground using installed voices or an optional self-hosted Piper-compatible endpoint.
- Tutorial voiceover planner with timed segments, local rehearsal, and text export.
- Responsive navigation, reduced-motion support, keyboard focus, semantic landmarks, metadata, robots.txt, sitemap, and a service worker.
- Contributor guidance, a resource-correction issue form, and a pull-request checklist.

## Honest boundaries

This repository is a static public MVP. It does **not** claim to provide accounts, cross-device sync, managed AI generation, automated code review, real credentials, mentor access, payments, or a production content-admin workflow. Those features require a backend, security/privacy review, and operations work.

The “neural TTS” tool does not pretend that every browser voice is neural or local. It labels browser/OS voices as reported by the platform and supports a user-configured self-hosted Piper-compatible endpoint for open-source neural synthesis.

## Run locally

No build step or dependency install is required.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Verify

Node.js 20 or newer is recommended.

```bash
npm test
npm run check
```

The tests verify catalog counts, all 42 video inventories and 367 video IDs, independent path structure, source metadata, the five ClickUp tool tasks, and both DSA set sizes.

## Data and privacy

- Roadmaps, enrollment, milestone evidence, and DSA progress use browser local storage.
- The GitHub scorer calls GitHub’s public API directly after a username is submitted.
- Browser speech behavior depends on the installed browser/OS voice provider.
- Piper mode sends text only to the endpoint the user enters.
- No analytics, advertising, account, or upload code is included.

## Source policy

Dropout Developer path pages provide the inventory of existing public YouTube lessons. Skill Unbound does not copy competitor branding, layouts, lesson summaries, assignments, certificates, or protected assets. It embeds the original YouTube uploads on demand and identifies their publishing creators while adding original milestones, exercises, rubrics, capstones, and evidence gates.

To refresh video titles and metadata from the public Dropout Developer API when it is not rate-limited, run `node scripts/audit-dropout-videos.mjs`. The checked-in catalog keeps the audited video IDs and creators available without a runtime API dependency.

## Deploy to Cloudflare Pages

The project is static. Publish the repository root with no build command. The existing `deploy-cloudflare.sh` remains available for a manual Wrangler upload, but production should connect Cloudflare Pages to the `main` branch so pull requests receive preview deployments and production has a clear rollback history.

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). The repository owner still needs to choose and add a software/content license before third-party reuse should be assumed.
