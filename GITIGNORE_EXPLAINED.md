# 🔖 GIT & GITIGNORE - QUICK REFERENCE

## What is `.gitignore`?

A file that tells Git which files/folders to **NOT commit** to the repository.

### Example:
```
node_modules/          ← Don't track (huge folder)
ecommerce.db           ← Don't track (contains data)
.env                   ← Don't track (has secrets)
```

---

## Your `.gitignore` Ignores:

### 🚫 **DON'T COMMIT** These:

| File/Folder | Reason | Size |
|-------------|--------|------|
| `node_modules/` | Reinstallable from package.json | 100+ MB |
| `ecommerce.db` | Auto-created, contains data | 50 KB |
| `.env` | Has secrets (API keys, passwords) | - |
| `.DS_Store` | macOS system file | - |
| `Thumbs.db` | Windows system file | - |
| `*.log` | Log files | - |
| `.idea/` | IDE settings (personal) | - |
| `.vscode/` | IDE settings (personal) | - |
| `coverage/` | Test coverage reports | - |

### ✅ **DO COMMIT** These:

| File | Reason |
|------|--------|
| `server.js` | Your code |
| `app.js` | Your code |
| `styles.css` | Your code |
| `package.json` | Dependencies list (locked) |
| `README.md` | Documentation |
| `.gitignore` | Ignore rules |
| `.env.example` | Environment template |
| All documentation | Guides & instructions |

---

## Quick Commands

### Initialize Git
```bash
cd d:\front
git init
```

### Check Status
```bash
git status
```

You should see:
- ✅ `server.js`, `app.js`, etc. (tracked)
- ❌ `node_modules/`, `ecommerce.db` (ignored)

### Add & Commit
```bash
git add .
git commit -m "Initial commit: FlipShop"
```

### Push to GitHub
```bash
git remote add origin https://github.com/user/flipshop.git
git push -u origin main
```

### See Ignored Files
```bash
git status --ignored
```

---

## Why `.gitignore` Matters

### Without `.gitignore`:
```
Repository commits everything:
- node_modules/ (100+ MB)
- ecommerce.db (contains user data)
- .env (secrets exposed!)
- System files

Result: 
- Huge repo (slow downloads)
- Security risk
- Unnecessary data
```

### With `.gitignore`:
```
Repository commits only code:
- Source files (64 KB)
- Documentation (140 KB)
- Configuration (2 KB)

Result:
- Small repo (fast downloads)
- Secure (secrets protected)
- Clean repository
```

---

## What Your `.gitignore` Prevents

### ✅ Prevents Accidental Commits:
1. **Large Files** - `node_modules/` won't bloat repo
2. **Secrets** - `.env` won't expose API keys
3. **Data** - `ecommerce.db` won't expose user data
4. **System Files** - `.DS_Store` won't clutter repo
5. **IDE Settings** - `.vscode/` won't cause conflicts

### ✅ Keeps Repo Small:
- Without `.gitignore`: 100+ MB
- With `.gitignore`: 150 KB
- Download speed: **1000x faster!**

### ✅ Maintains Security:
- No secrets in repository
- Safe to push to GitHub public
- No database data exposed
- No API keys leaked

---

## Files in Your Project

### Git Will Track (✅)
```
d:\front\
├── server.js                    ✅ (13 KB)
├── package.json                 ✅ (2 KB)
├── public/
│   ├── index.html               ✅ (11 KB)
│   ├── app.js                   ✅ (24 KB)
│   └── styles.css               ✅ (16 KB)
├── .gitignore                   ✅
├── .env.example                 ✅
└── [12 documentation files]     ✅
```

### Git Will Ignore (❌)
```
d:\front\
├── node_modules/                ❌ (ignored)
├── ecommerce.db                 ❌ (ignored)
├── .env                         ❌ (ignored - doesn't exist)
└── [system files]               ❌ (ignored)
```

---

## `.gitignore` Rules Syntax

### Basic Rules
```
# Comment (ignored by git)

node_modules/          # Ignore folder
*.log                  # Ignore all .log files
.env                   # Ignore specific file
.DS_Store              # Ignore file
```

### Advanced Rules
```
# Ignore all in folder
public/build/

# Ignore type globally
*.tmp

# Negate rule (don't ignore this one)
!important.log

# Ignore in this directory only
/temp/

# Ignore in all directories
**/temp/
```

---

## After Committing

### Everyone Can:
```bash
# Clone your repo
git clone https://github.com/user/flipshop.git

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start app
npm start
```

### They Won't Get:
- ❌ `node_modules/` (they run npm install)
- ❌ `ecommerce.db` (auto-created on startup)
- ❌ `.env` (they create from .env.example)

---

## Security Best Practices

### ✅ DO This:
```bash
# Create .env from template
cp .env.example .env

# Add your secrets to .env
# NEVER commit .env
```

### ❌ DON'T Do This:
```bash
# ❌ Don't commit .env
git add .env
git commit -m "Add secrets"  # WRONG!

# ❌ Don't paste secrets in code
API_KEY = "sk_test_abc123"  // WRONG!

# ❌ Don't hardcode passwords
password = "admin123"  // WRONG!
```

---

## If You Accidentally Commit Something

### Remove File (Keep Locally)
```bash
git rm --cached ecommerce.db
git commit -m "Remove ecommerce.db from tracking"
```

### Remove & Rewrite History (Advanced)
```bash
# Use only if not yet pushed
git reset HEAD~1

# Or use git filter-branch for old commits
git filter-branch --tree-filter 'rm -f .env' HEAD
```

### If Already Pushed:
```bash
# 1. Remove it now
git rm --cached .env
git commit -m "Remove .env"
git push

# 2. Rotate all secrets immediately
# Change API keys, passwords, tokens
```

---

## Your `.gitignore` Includes:

```
✅ Node.js files
✅ Environment variables
✅ Database files
✅ System files
✅ IDE settings
✅ Log files
✅ Temporary files
✅ Build artifacts
✅ Test coverage
✅ Cache files
```

---

## Next Steps

### 1. Initialize Git
```bash
git init
```

### 2. Check What Gets Committed
```bash
git add .
git status
```

### 3. Verify `.gitignore` Works
```bash
git status --ignored
```

Should show:
- Tracked: source files, docs
- Ignored: node_modules, ecommerce.db

### 4. Create First Commit
```bash
git commit -m "Initial commit: FlipShop"
```

### 5. (Optional) Push to GitHub
```bash
git remote add origin https://github.com/user/repo.git
git push -u origin main
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `.gitignore` | Ignore rules (created ✅) |
| `.env.example` | Environment template (created ✅) |
| `GIT_GUIDE.md` | Detailed git guide (read it!) |
| `GIT_SETUP_COMPLETE.md` | Setup instructions |

---

## Summary

**`.gitignore` = Tell Git what NOT to track**

✅ Keep repo small & fast  
✅ Keep secrets safe  
✅ Keep data private  
✅ Keep it clean  

**Your project is ready for Git!** 🎉

---

**Read more:** [GIT_GUIDE.md](GIT_GUIDE.md)
