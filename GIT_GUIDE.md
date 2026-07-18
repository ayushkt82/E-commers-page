# FlipShop - Git Setup & Version Control Guide

## 🔧 Git Configuration for This Project

### What's Already Set Up

✅ `.gitignore` created - Ignores files that shouldn't be committed  
✅ `.env.example` created - Template for environment variables

---

## 📋 `.gitignore` Explanation

Your `.gitignore` file ignores these important files:

### ❌ **Don't Commit:**
```
node_modules/          - Dependencies (huge, reinstall from package.json)
ecommerce.db           - Database (regenerated on startup)
.env                   - Secrets & sensitive data
.DS_Store              - Mac system files
*.log                  - Log files
.vscode/               - IDE settings (personal)
.idea/                 - IDE settings (personal)
coverage/              - Test coverage reports
```

### ✅ **Do Commit:**
```
server.js              - Backend code
public/                - Frontend files
package.json           - Dependencies list
README.md              - Documentation
.gitignore             - This file
.env.example           - Environment template
```

---

## 🚀 Initialize Git Repository

### Step 1: Initialize Git
```bash
cd d:\front
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Verify What Will Be Committed
```bash
git status
```

You should see:
- ✅ Tracked: `server.js`, `package.json`, source files, docs
- ❌ Ignored: `node_modules/`, `ecommerce.db`, `.env`

### Step 4: Create First Commit
```bash
git commit -m "Initial commit: Complete e-commerce platform

Features:
- Full-stack e-commerce application
- Express.js backend with 25+ endpoints
- Responsive frontend with product catalog
- SQLite database with user/product/order management
- Complete documentation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## 📁 Files to Commit

### Source Code
```
✅ server.js                    - Backend (COMMIT)
✅ package.json                 - Dependencies (COMMIT)
✅ public/index.html            - Frontend (COMMIT)
✅ public/app.js                - Logic (COMMIT)
✅ public/styles.css            - Styles (COMMIT)
```

### Documentation
```
✅ README.md                    - Guide (COMMIT)
✅ QUICKSTART.md                - Quick start (COMMIT)
✅ FEATURES.md                  - Features (COMMIT)
✅ DEPLOYMENT.md                - Deployment (COMMIT)
✅ API_TESTING.md               - API docs (COMMIT)
✅ PROJECT_SUMMARY.md           - Summary (COMMIT)
✅ VISUAL_GUIDE.md              - UI guide (COMMIT)
✅ COMPLETION_REPORT.md         - Status (COMMIT)
✅ INDEX.md                     - Index (COMMIT)
✅ .gitignore                   - Ignore rules (COMMIT)
✅ .env.example                 - Env template (COMMIT)
```

### Config
```
✅ package-lock.json            - Dependency lock (COMMIT)
```

---

## 📦 Files to NOT Commit

### Dependencies
```
❌ node_modules/                - Too large, reinstall via npm install
```

### Database
```
❌ ecommerce.db                 - Auto-created, contains user data
❌ ecommerce.db-shm             - SQLite temporary file
❌ ecommerce.db-wal             - SQLite temporary file
```

### Secrets
```
❌ .env                         - Contains sensitive data
```

### System Files
```
❌ .DS_Store                    - Mac system file
❌ Thumbs.db                    - Windows system file
❌ .idea/                       - IDE settings
❌ .vscode/                     - IDE settings
```

### Logs & Temporary
```
❌ *.log                        - Log files
❌ tmp/                         - Temporary files
❌ coverage/                    - Test coverage
```

---

## 🔐 Security Best Practices

### 1. Use `.env` for Secrets
```
# Create .env from .env.example
cp .env.example .env

# Edit .env and add your secrets
# NEVER commit .env to git
```

### 2. Never Commit
- ❌ Passwords
- ❌ API keys
- ❌ Database credentials
- ❌ JWT secrets
- ❌ AWS keys

### 3. Use `.env.example`
- ✅ Show what variables are needed
- ✅ No actual secrets in it
- ✅ Safe to commit
- ✅ Help others set up

---

## 🌳 Recommended Git Workflow

### Branch Strategy
```
main                    - Production ready
├── feature/search      - Search feature
├── feature/wishlist    - Wishlist feature
├── bugfix/cart-issue   - Bug fix
└── develop             - Development branch
```

### Commit Message Format
```
[Type] Description

Body explaining changes

Co-authored-by: Name <email>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `perf:` - Performance
- `test:` - Tests

### Example Commits
```bash
git commit -m "feat: Add product search functionality"

git commit -m "fix: Cart not updating on quantity change"

git commit -m "docs: Update API documentation"

git commit -m "refactor: Improve database query efficiency"
```

---

## 📊 Git Commands Reference

### Basic Setup
```bash
# Initialize repository
git init

# Configure user
git config user.name "Your Name"
git config user.email "your@email.com"

# Add all files
git add .

# Check status
git status

# Create commit
git commit -m "Your message"
```

### Working with Changes
```bash
# See changes
git diff

# Add specific file
git add path/to/file

# Add by type
git add *.js          # All JavaScript files
git add public/       # All files in public/

# Undo changes
git checkout -- file

# Remove file
git rm file
git rm -r node_modules/
```

### Branching
```bash
# Create branch
git checkout -b feature/name

# Switch branch
git checkout main

# List branches
git branch -a

# Delete branch
git branch -d feature/name
```

### Remote Repository
```bash
# Add remote
git remote add origin https://github.com/user/repo.git

# Push to remote
git push -u origin main

# Pull from remote
git pull origin main

# Clone repository
git clone https://github.com/user/repo.git
```

---

## 🐛 Troubleshooting Git

### Problem: `node_modules` got committed
**Solution:**
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

### Problem: `.env` got committed
**Solution:**
```bash
# Remove it
git rm --cached .env
git commit -m "Remove .env from tracking"

# Clear history (advanced)
git filter-branch --tree-filter 'rm -f .env' HEAD
```

### Problem: Large file got committed
**Solution:**
```bash
git reset HEAD~1              # Undo last commit
git reset path/to/file        # Unstage file
git add .gitignore            # Add to .gitignore
git commit -m "Fix: Large file"
```

### Problem: Need to see commit history
```bash
# See all commits
git log

# See commits for specific file
git log -- path/to/file

# See commits with changes
git log -p

# See short log
git log --oneline
```

---

## 💾 Setup for GitHub/GitLab

### 1. Create Remote Repository
- Go to GitHub.com or GitLab.com
- Create new repository (don't initialize)
- Copy the URL

### 2. Add Remote
```bash
git remote add origin https://github.com/user/flipshop.git
```

### 3. Push to Remote
```bash
git branch -M main
git push -u origin main
```

### 4. Future Pushes
```bash
git push
```

---

## 📝 Sample `.gitignore` Checklist

Your `.gitignore` includes:
- ✅ Node dependencies
- ✅ Environment files
- ✅ Database files
- ✅ Log files
- ✅ IDE settings
- ✅ System files
- ✅ Temporary files
- ✅ Build artifacts

---

## 🚀 Deploying from GitHub

### Using GitHub Pages (Frontend only)
```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Add only public folder
git add public/

git commit -m "Deploy to GitHub Pages"

git push origin gh-pages
```

### Using Heroku
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Using Railway
1. Connect GitHub repo
2. Railway auto-deploys on push
3. Set environment variables in Railway

---

## 📋 Before First Commit Checklist

- ✅ `.gitignore` created
- ✅ `.env.example` created
- ✅ No `.env` file (use .env.example)
- ✅ No `node_modules` in files to commit
- ✅ `package.json` ready
- ✅ `package-lock.json` ready
- ✅ All documentation complete
- ✅ Code is clean
- ✅ Ready to commit!

---

## 🎯 Quick Start Commands

```bash
# 1. Initialize
cd d:\front
git init

# 2. Configure
git config user.name "Your Name"
git config user.email "your@email.com"

# 3. Add files
git add .

# 4. Check status
git status

# 5. First commit
git commit -m "Initial commit: FlipShop e-commerce platform"

# 6. (Optional) Add to GitHub
git remote add origin https://github.com/user/flipshop.git
git push -u origin main
```

---

## 📚 Additional Resources

- [Git Official](https://git-scm.com/)
- [GitHub Docs](https://docs.github.com/)
- [GitLab Docs](https://docs.gitlab.com/)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)

---

## ✅ You're Ready!

Your project is ready for version control:
- ✅ `.gitignore` configured
- ✅ `.env.example` provided
- ✅ All files organized
- ✅ Ready to commit!

### Next Steps:
1. Run `git init`
2. Run `git add .`
3. Run `git commit -m "Initial commit: FlipShop"`
4. Push to GitHub (optional)

---

**Happy version controlling! 🎉**
