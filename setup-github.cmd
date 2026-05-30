@echo off
REM Update this URL to your GitHub repository URL before running.
set REPO_URL=https://github.com/kurmaraopalli/wealth-management-app.git

echo Initializing Git repository...
git init
echo Adding all files...
git add .
echo Committing files...
git commit -m "Initial commit"
echo Adding remote origin...
git remote add origin %REPO_URL%
echo Pushing to GitHub...
git branch -M main
git push -u origin main
echo
echo After pushing, enable GitHub Pages at:
echo https://github.com/kurmaraopalli/wealth-management-app/settings/pages
echo
echo If Git is not installed, install Git from https://git-scm.com/downloads and run this script again.
