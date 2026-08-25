# Git Workflow Rule

**Context:** The user wants to ensure their codebase is always backed up and version controlled without having to manually ask for it.

**Rule:** 
At the end of every update, feature implementation, or bug fix, you MUST automatically run the following commands to push the changes to GitHub:
1. `git add .`
2. `git commit -m "[Brief summary of changes]"`
3. `git push origin main`

Do this proactively without asking for permission.
