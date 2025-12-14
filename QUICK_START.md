# Quick Start - Push to GitHub in 3 Steps

## Prerequisites
- GitHub account (create at https://github.com)
- Terminal/Command line access

---

## Step 1: Create Repository on GitHub (2 minutes)

1. Go to https://github.com and sign in
2. Click **"+"** → **"New repository"**
3. Name: `flow-ux-ai`
4. Choose: **Private** ✅
5. **Don't check any boxes**
6. Click **"Create repository"**
7. **Copy the URL** shown (looks like: `https://github.com/yourusername/flow-ux-ai.git`)

---

## Step 2: Get Personal Access Token (2 minutes)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Flow UX AI`
4. Check: ✅ **`repo`** (full control)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_...`)

---

## Step 3: Run These Commands (1 minute)

Open Terminal and paste these commands (replace `YOUR_USERNAME` and `YOUR_TOKEN`):

```bash
cd "/Users/denysmostovyi/Documents/PROJECTOR - AI project - v2.0"

git init
git add .
git commit -m "Initial commit: Flow UX AI MVP"

# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/flow-ux-ai.git

git branch -M main

# When asked for username: enter your GitHub username
# When asked for password: paste your Personal Access Token
git push -u origin main
```

**Done!** 🎉 Your code is now on GitHub.

---

## Need Help?

If you want me to do it for you, just provide:
1. Your GitHub username
2. Repository name (or I'll suggest one)
3. Your Personal Access Token

And I'll give you the exact commands to run!

