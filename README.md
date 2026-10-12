# Skill Unbound — static learning platform MVP

An original, responsive static site inspired by the **category of features** found in technical learning platforms. **Not** an authorized clone of Dropout Developer, and none of its branding, proprietary lesson texts, or UI assets are included.

## What's working
- Public learning-path directory: category filtering and search, nine original track summaries, external official learning resources.
- Custom roadmap planner: goal, experience, available hours, and project preference. Rule-based milestone scheduling (not AI); all saved in browser localStorage.
- Project assignment catalog: six original detailed exercises, requirements, stretch goals, copy assignment, GitHub link.
- Tools: JSON formatter, Base64 encode/decode, word and character counter.
- Progress tracking: interactive completion checkboxes, downloadable and copyable plan.
- Responsive navigation, community section, accessibility basics, SEO description.

## Not implemented (requires backend/integrations)
- Actual AI-generated curricula or intelligent skill assessment
- User accounts / cross-device sync
- GitHub submission ingestion, test sandbox or automated AI code review
- Real community forum or contributor workflow
- Exam verification, certificates, payments, mentors, newsletters
- Search across YouTube, verified dynamic videos, comprehensive 30+ developer utilities

## Deploy to Cloudflare Pages
1. Sign in to Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
2. Upload the files in this directory (or the extracted ZIP) with `index.html` at the top level. Deploy.
3. Pages project → **Custom domains** → **Set up a custom domain** → choose your purchased Cloudflare domain. Follow prompts.
4. Confirm HTTPS works, then optionally add `www` redirect.

**No build step required.** Works as plain HTML/CSS/JavaScript. For local preview, open index.html or serve with `python3 -m http.server 8000`.

## Before going live
- Brand and canonical website are set to **Skill Unbound** and `https://skillunbound.dev`.
- Replace `hello@skillunbound.dev` with your configured inbox, and `https://github.com` community placeholders with your own GitHub organization.
- Review the learning resources and assignment difficulty before public release.
- Add your actual legal/privacy pages and any consent-dependent analytics once needed.
- Verify domain/trademark rights for your chosen name.

## Repo layout
- `index.html` — main site and sections
- `styles.css` — responsive visual design
- `app.js` — original catalog data and client-side interactions

## GitHub setup and Cloudflare Pages

Create a new GitHub repository named `skillunbound` and push with:

```bash
git init
git add .
git commit -m "Initial Skill Unbound static website"
git branch -M main
gh auth login
gh repo create skillunbound --public --source=. --remote=origin --push
```

For an existing Cloudflare Pages project named `skillunbound`, run `bash deploy-cloudflare.sh`. It performs a direct upload; Git pushes will not auto-deploy until you connect the Pages project to GitHub or add GitHub Actions. Avoid exposing personal emails in public content until your inbox is configured.
