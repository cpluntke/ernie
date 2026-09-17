---
name: ux-critique
description: Run the ux-critic subagent on a page of the prototype and get back a ranked list of issues to fix before a PR. Use whenever the user asks to critique, review, audit, or check a screen or URL for usability or accessibility for 80+ users, or says "pre-PR check", "is this ready to submit", or "run the critic". Also run it yourself before opening any PR that touches UI.
context: fork
agent: ux-critic
---

Audit the page(s) below against `docs/research/design-criteria-80-plus.md`
and return the ranked issue list in your standard output format.

Target: $ARGUMENTS

If no URL was given, start the app (see `package.json` scripts or the README),
audit the pages the current branch changed (check `git diff --name-only main`
to find them), and stop the server when done.
