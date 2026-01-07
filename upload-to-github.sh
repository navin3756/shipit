#!/bin/bash

# ShipIt GitHub Upload Script
# This script will create a new GitHub repo and push all code

echo "🚀 ShipIt GitHub Upload Script"
echo "================================"
echo ""

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "✓ GitHub CLI detected"
    
    # Check if authenticated
    if gh auth status &> /dev/null; then
        echo "✓ Already authenticated with GitHub"
        
        # Create repo
        echo ""
        echo "Creating repository 'shipit-production'..."
        gh repo create shipit-production --public --description "ShipIt - The last-mile logistics platform for AI-generated software" --source=. --push
        
        echo ""
        echo "✅ Done! Your repo is live at: https://github.com/$(gh api user -q .login)/shipit-production"
    else
        echo "Please authenticate with: gh auth login"
    fi
else
    echo "GitHub CLI not installed. Using git directly..."
    echo ""
    
    # Get GitHub username
    read -p "Enter your GitHub username: " GITHUB_USER
    read -p "Enter repository name (default: shipit-production): " REPO_NAME
    REPO_NAME=${REPO_NAME:-shipit-production}
    
    echo ""
    echo "Please create a new repository at: https://github.com/new"
    echo "Repository name: $REPO_NAME"
    echo ""
    read -p "Press Enter after creating the repository..."
    
    # Initialize and push
    git init
    git add .
    git commit -m "feat: Initial commit - ShipIt production ready

- Full-stack React 19 + TypeScript application
- Supabase backend with Realtime subscriptions  
- Google Gemini AI code analysis
- Footer with legal links, social proof, status indicator
- Header with Dashboard, Experts, Pricing, Integrations nav
- Expert portal with dark theme"
    
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    git push -u origin main
    
    echo ""
    echo "✅ Done! Your repo is live at: https://github.com/$GITHUB_USER/$REPO_NAME"
fi
