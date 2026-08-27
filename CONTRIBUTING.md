# Contributing to IPU Student Portal (Quantx_Learning)

First off, thank you for considering contributing! This project is built by and for the community, and every contribution — code, docs, design, or ideas — genuinely helps.

This guide is written to be usable by first-time open-source contributors, including those joining through **ASOC (Altraverse Open Source Cohort)**.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Labels](#issue-labels)
- [Coding Conventions](#coding-conventions)
- [Getting Help](#getting-help)

---

## Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Be kind, be patient, and remember everyone was a beginner once.

---

## Ways to Contribute

You don't need to write code to contribute:

- 🐛 **Report bugs** — open an issue using the bug report template
- 💡 **Suggest features** — open an issue using the feature request template
- 📝 **Improve documentation** — fix typos, clarify setup steps, add examples
- 🎨 **Design/UX** — mockups, accessibility improvements, responsive fixes
- 💻 **Code** — pick up an issue labeled `good first issue` or `help wanted`
- 🧪 **Testing** — write tests, report edge cases

---

## Getting Started

1. **Fork** this repository and clone your fork:
   ```bash
   git clone https://github.com/Abhinavjs903/Quantx_Learning.git
   cd Quantx_Learning
   ```

2. **Add the upstream remote** so you c open a pull request.

---

## Development Workflow

1. Sync your fork before starting new work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. Create a new branch off `main` for every issue/feature — don't work directly on `main`.
3. Make focused, small commits. Prefer several small PRs over one giant PR.
4. Run linters/tests locally before pushing (once CI is set up, this will also run automatically).
5. Push your branch and open a PR against `main`.

---

## Branch Naming

Use this format:

```
<type>/<short-description>
```

Examples:
- `feature/sgpa-calculator`
- `fix/login-redirect-bug`
- `docs/update-readme-setup`an keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/Abhinavjs903/Quantx_Learning.git
   ```

3. **Install dependencies** (see the [README](./README.MD) "Getting Started" section for the current stack-specific steps).

4. **Create a branch** for your work (see [Branch Naming](#branch-naming) below).

5. Make your changes, commit them, and
- `refactor/subject-model`

Types: `feature`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): short summary

optional longer description
```

Examples:
```
feat(toolkit): add CGPA calculator
fix(auth): resolve token expiry redirect loop
docs(readme): add local setup instructions
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Pull Request Process

1. Fill out the PR template completely — link the issue it closes (e.g. `Closes #12`).
2. Keep PRs focused on a single issue/feature. Avoid unrelated changes.
3. Make sure your branch is up to date with `main` before requesting review.
4. Ensure any new code has reasonable test coverage where applicable.
5. Update documentation if your change affects setup, usage, or architecture.
6. A maintainer will review your PR. Please respond to review comments — don't take feedback personally, it's about the code, not you.
7. Once approved, a maintainer will merge it. Please don't merge your own PR.

**PRs that will be closed without review:**
- Spam / low-effort PRs (e.g. only whitespace changes with no purpose)
- PRs unrelated to any open issue without prior discussion
- Plagiarized or AI-generated boilerplate with no understanding shown when asked to explain

---

## Issue Labels

| Label | Meaning |
|---|---|
| `good first issue` | Great starting point for new contributors |
| `help wanted` | Actively looking for contributors |
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Docs-only changes |
| `frontend` | UI/frontend related |
| `backend` | API/server related |
| `design` | UX/UI design work |
| `difficulty: easy` / `medium` / `hard` | Rough complexity indicator |
| `asoc` | Issue curated for ASOC cohort contributors |

Always comment on an issue to claim it before starting work, so two people don't duplicate effort. Maintainers will assign it to you.

---

## Coding Conventions

- Use clear, descriptive variable and function names.
- Keep functions small and focused on one responsibility.
- Comment non-obvious logic, not obvious code.
- Match the existing code style/formatting (Prettier/ESLint config, once added, is the source of truth).
- Write tests for new logic where a testing framework is in place.

---

## Getting Help

- Open a [Discussion](../../discussions) if you're unsure where to start.
- Comment on the issue you're working on if you get stuck — mentors and maintainers are here to help.
- Tag a maintainer in your PR if it's been quiet for a few days.

Thank you again for contributing — happy hacking! 🎓
