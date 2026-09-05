# abid-mitul.github.io — Setup

Everything here is ready to push into your new repo `abid-mitul.github.io`.

## What's in this bundle

```
index.html                 → the full site (all 6 sections, wired to the CMS)
assets/css/style.css        → the design system
assets/js/content-loader.js → fetches content/*.json and renders it into index.html
content/*.json              → your content, pre-filled with what you'd already told me
admin/index.html             → the CMS app shell (visit yoursite.com/admin)
admin/config.yml             → CMS field definitions for all 6 sections
```

## 1. Push everything into your new repo

On your computer:
```bash
git clone https://github.com/abid-mitul/abid-mitul.github.io.git
```
Copy every file from this download into that cloned folder (overwrite the
default README if you want, or keep both). Then:
```bash
cd abid-mitul.github.io
git add .
git commit -m "Initial portfolio site with Decap CMS"
git push
```

Don't have git installed / prefer not to use the command line? You can
also just drag-and-drop-upload all these files directly on github.com,
inside your repo, using the "Add file → Upload files" button.

## 2. Check the site is live

Visit `https://abid-mitul.github.io/` (may take 1-2 minutes after pushing).
You should see the full site already populated with your education,
experience, and projects — I pre-filled it from what you'd shared with me.

## 3. Fill in the gaps

A few fields were left blank because I didn't have exact details (dates,
IEEE paper titles, credential URLs, etc.) — these show up as empty lines
on the site right now. You can either:
- Edit `content/*.json` directly and push again, or
- Use the CMS at `/admin` once OAuth is set up (step 4) — much easier
  for ongoing updates.

## 4. Set up GitHub OAuth (one-time, so /admin requires login)

1. Sign up free at netlify.com — you do NOT need to deploy anything there,
   just create any placeholder "site" to access the dashboard.
2. Go to **Site settings → Access control → OAuth**, add a GitHub
   provider. Netlify walks you through creating a GitHub OAuth App and
   pasting the Client ID/Secret back in.
3. Nothing else to configure — `admin/config.yml` already points at
   `api.netlify.com`.
4. Visit `https://abid-mitul.github.io/admin`, log in with GitHub, and
   you'll see all 6 sections ready to edit.

## Notes

- Each of the 6 sections is one JSON file (not one file per entry) so
  your plain-JS site can fetch it directly with no build step.
- Uploaded images/certificates/resume go into `/uploads` at the repo
  root automatically when added through the CMS.
- The design system (colors, type, the vertical "wire" line connecting
  sections) lives entirely in `assets/css/style.css` — safe to tweak
  colors via the `:root` variables at the top of that file.
