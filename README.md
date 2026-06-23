# ⚡ ECE Portfolio — Electronics & Communication Engineer

A modern, bilingual (English / Japanese) portfolio website built with vanilla HTML, Tailwind CSS (CDN), and vanilla JavaScript. Designed for GitHub Pages deployment.

---

## 🚀 Live Demo

Once deployed, your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

---

## 📁 File Structure

```
portfolio/
├── index.html      # Main HTML — all content, structure, bilingual data
├── script.js       # Language toggle logic, scroll animations, UI interactions
└── README.md       # This file
```

---

## ✏️ Personalizing the Portfolio

Before deploying, open `index.html` and replace these placeholders:

| Placeholder | Where to find it | Replace with |
|---|---|---|
| `Your Name` / `あなたの名前` | Hero section (line ~130) | Your actual name |
| `your.email@example.com` | Contact section | Your email address |
| `linkedin.com/in/yourprofile` | Contact section | Your LinkedIn URL |
| `github.com/yourusername` | Contact section | Your GitHub URL |

---

## 🛠️ Deploying to GitHub Pages from Replit

### Step 1: Connect Git in Replit

Open the **Shell** tab in Replit and run:

```bash
# Configure your Git identity (only needed once)
git config --global user.email "your.email@gmail.com"
git config --global user.name "Your Name"
```

### Step 2: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `portfolio` (or any name you prefer)
3. Set it to **Public** (required for free GitHub Pages)
4. **Do NOT** initialize with README (we're pushing from Replit)
5. Click **Create repository**
6. Copy the repository URL — it looks like: `https://github.com/YOUR-USERNAME/portfolio.git`

### Step 3: Push from Replit to GitHub

In the Replit **Shell**, run these commands one by one:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create your first commit
git commit -m "Initial portfolio deployment"

# Link your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git

# Push to GitHub
git push -u origin main
```

> **Note:** If the branch is named `master` instead of `main`, use:
> ```bash
> git push -u origin master
> ```

> **Authentication:** GitHub may ask for your credentials. Use your GitHub username and a **Personal Access Token** (not your password). Generate one at: Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → check `repo` scope.

### Step 4: Enable GitHub Pages

1. On GitHub, go to your repository
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Select branch: `main` (or `master`) and folder: `/ (root)`
5. Click **Save**
6. Wait 1–3 minutes, then visit `https://YOUR-USERNAME.github.io/portfolio/`

---

## 🔄 Updating the Site

After making changes in Replit:

```bash
git add .
git commit -m "Update portfolio content"
git push
```

GitHub Pages automatically rebuilds within ~1 minute.

---

## ✨ Features

- 🌐 **Bilingual EN/JP toggle** — smooth fade-swap animation, press `Alt+L` as shortcut
- 🎨 **Dark engineering aesthetic** — slate/indigo theme with glassmorphism and PCB-trace accents
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- ♿ **Accessible** — keyboard navigable, `prefers-reduced-motion` respected
- ⚡ **Zero build step** — Tailwind via CDN, no npm/webpack needed
- 🖥️ **GitHub Pages ready** — pure static files, no server required

---

## 🎨 Customization

### Colors
Edit the `tailwind.config` block in `index.html`:
- `#6366F1` — Indigo accent (primary)
- `#38BDF8` — Sky blue (secondary)
- `#0D1117` — Near-black background

### Fonts
The site uses Google Fonts (loaded via CDN):
- **Space Grotesk** — Headings/display
- **Inter** — Body text
- **JetBrains Mono** — Tags, code, labels

### Adding New Sections
1. Add the HTML section in `index.html` with a `reveal` class
2. Add bilingual `data-en` and `data-jp` attributes to all text elements
3. Add a nav link in the navbar

---

## 📄 License

Free to use and modify for personal portfolios.
