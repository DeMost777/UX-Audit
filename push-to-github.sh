#!/bin/bash

# Flow UX AI - Quick GitHub Push Script
# Run this script to quickly push your project to GitHub

echo "🚀 Flow UX AI - GitHub Push Script"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if .env.local exists and warn
if [ -f ".env.local" ]; then
    echo "⚠️  WARNING: .env.local file detected"
    echo "   Make sure it's in .gitignore (it should be)"
    echo ""
fi

# Add all files
echo "📝 Adding files to Git..."
git add .
echo "✅ Files added"
echo ""

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Create commit
    echo "💾 Creating commit..."
    git commit -m "Initial commit: Flow UX AI MVP

- File upload system with Supabase Storage
- Rule-based UX analysis engine
- Visual canvas with issue highlights
- Dashboard for saved analyses
- PDF export functionality
- NextAuth authentication
- Complete Phase 1 MVP"
    echo "✅ Commit created"
    echo ""
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "🔗 Remote 'origin' already exists"
    echo "   Current remote URL:"
    git remote get-url origin
    echo ""
    read -p "Do you want to change the remote URL? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter new GitHub repository URL: " REPO_URL
        git remote set-url origin "$REPO_URL"
        echo "✅ Remote URL updated"
        echo ""
    fi
else
    echo "🔗 No remote repository configured"
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL
    git remote add origin "$REPO_URL"
    echo "✅ Remote added"
    echo ""
fi

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🌿 Renaming branch to 'main'..."
    git branch -M main
    echo "✅ Branch renamed to 'main'"
    echo ""
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo ""
read -p "Ready to push? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main
    echo ""
    echo "✅ Push complete!"
    echo ""
    echo "🎉 Your project is now on GitHub!"
    echo "   Visit your repository to verify:"
    git remote get-url origin
else
    echo "❌ Push cancelled"
    echo ""
    echo "To push manually later, run:"
    echo "  git push -u origin main"
fi

