# Simple Git & GitHub Setup Guide

Choose one of two options:

## Option 1: Do It Yourself (5 minutes) ⭐ Recommended

### Step 1: Create GitHub Account (if you don't have one)
1. Go to https://github.com
2. Click "Sign up"
3. Create your account

### Step 2: Create Repository on GitHub
1. Log in to GitHub
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `flow-ux-ai` (or any name you like)
4. Choose **Private** (recommended) or **Public**
5. **DO NOT** check any boxes (no README, no .gitignore, no license)
6. Click **"Create repository"**
7. **Copy the repository URL** (you'll see it on the next page)

### Step 3: Run These Commands in Terminal

Open Terminal and run these commands one by one:

```bash
# Navigate to your project
cd "/Users/denysmostovyi/Documents/PROJECTOR - AI project - v2.0"

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Flow UX AI MVP"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/flow-ux-ai.git

# Rename branch to main
git branch -M main

# Push to GitHub (you'll be asked for username and password)
git push -u origin main
```

**When asked for password**: Use a **Personal Access Token** (not your GitHub password)

### Step 4: Create Personal Access Token (for password)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `Flow UX AI`
4. Check the box: **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## Option 2: I Can Help You Set It Up

If you want me to help, I'll need:

### What I Need From You:

1. **Your GitHub Username**
   - Example: `denysmostovyi` or `your-username`

2. **Repository Name** (or I can suggest one)
   - Example: `flow-ux-ai` or `ux-analyzer`

3. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `Flow UX AI`
   - Check: `repo` scope
   - Copy the token and share it with me

4. **Repository Visibility**
   - Private (recommended) or Public?

### What I Can Do:

✅ Initialize Git repository  
✅ Create initial commit  
✅ Set up remote connection  
✅ Push code to GitHub  

### What You Still Need To Do:

⚠️ **You must create the repository on GitHub first** (I can't do this for you)

**OR** you can give me:
- Your GitHub username
- Repository name you want
- I'll give you the exact commands to run

---

## Quick Command Reference

```bash
# Check if Git is installed
git --version

# If not installed, install it:
# macOS: Already installed, or: brew install git
# Windows: Download from https://git-scm.com/download/win
# Linux: sudo apt-get install git
```

---

## Troubleshooting

### "Git is not installed"
- **macOS**: Usually pre-installed. If not: `brew install git`
- **Windows**: Download from https://git-scm.com/download/win
- **Linux**: `sudo apt-get install git`

### "Repository not found"
- Make sure you created the repository on GitHub first
- Check the repository name is correct
- Verify your username is correct

### "Permission denied"
- Use Personal Access Token instead of password
- Make sure token has `repo` scope checked

### "Large file" error
- Make sure `node_modules/` is in `.gitignore` (it already is)
- Don't commit `.next/` folder (already ignored)

---

## Which Option Should You Choose?

**Choose Option 1 if:**
- You're comfortable with Terminal
- You want to learn how it works
- You prefer doing it yourself

**Choose Option 2 if:**
- You want me to help
- You're not sure about the commands
- You want step-by-step guidance

Just let me know which option you prefer! 🚀

