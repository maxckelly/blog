---
title: Learning Swift - Day Five
date: 2026-07-26
description: This is day 5 out of 100 of learning Swift
status: Done
---

## AWS claude code event

- "Harness engineering": Combine deterministic + non deterministic controls.
  - Guides: Steer before teh agent acts this is things like `claude.md`, specs, skills and rules
  - Sensors: judege what it produce: tests, type checkers & linters, reviewers, security scanners
- CLAUDE.md is a markdown file that is automatically loaded into context by Claude Code. You can treat it like a high level summary of your project, which commonly includes:
  - A brief project overview
  - A stack summary
  - Quirks, conventions, rules, tenets
  - Inline or referenced common workflows, scripts, processes
  - CLAUDE.md has specific loading behaviour, depending on its location. You can use them strategically to efficiently load information at the right time.

  - Scope Location Loading
  - User ~/.claude/CLAUDE.md Eager; every session
  - Project ./CLAUDE.md Eager; session start
  - Folder subdir/CLAUDE.md Lazy; when Claude reads files in that directory
  - All levels are additive; folder-level adds to project-level, project-level adds to user-level. It is generally recommended to keep your CLAUDE.md lean and under 200 lines, especially at user and project-level, because the contents will always load into context.

- Don't allow the agent to repeat the same mistake twice. To do this run a retro after sessions with the agent. To do this run `/retro` skill

### Memory

- CLAUDE.md: auto-loaded into context at session start; scoped via directory hierarchy (user, project, folder)
  - Docs: read on-demand into context; referenced from CLAUDE.md; builds a referential tree
  - Skills: judgement-driven workflows stored as markdown in .claude/skills/; encode what and why, the agent decides how; invoked via slash command, natural language, or automatically via CLAUDE.md instructions
  - Scripts: deterministic automation; same inputs, same outputs; shell / Python / CLI wrappers invoked via Bash
  - MCP: external tools and data sources connected via Model Context Protocol; the agent discovers and calls them like built-in tools; configured per-project or per-user

### Skills

A Skill is a markdown file that teaches Claude Code a reusable workflow. Unlike a script (which is deterministic — same input, same output), a Skill encodes judgement: it describes what to do and why, and the agent decides how to proceed at each step.

Skills live in .claude/skills/ and consist of a markdown file with frontmatter:

```md
.claude/skills/code-review/SKILL.md

---

name: code-review
description: Review code and provide feedback
allowed-tools: Bash(git \*) Read

---

# Instructions

Review the code changes...
```

- allowed-tools gates what the Skill can use — the agent can't exceed these permissions
  Invoked via /code-review (slash command) or automatically when Claude Code recognises the intent
- User-level Skills (~/.claude/skills/) are personal; project-level Skills (.claude/skills/) are shared via the repo
- A Skill committed to the repo means every team member gets the same workflow on day one
  Only descriptions load at session start, the body is loaded on-demand

### Retros on agent sessions

- A retro reviews recent work for workflow improvements by reading what the agent did - the corrections, the redundant discovery, the wrong assumptions - and proposes where each belongs as a persisted guide: a CLAUDE.md note, a referenced doc, a Skill, or a deterministic script.
- This is the below example of how you might run a "retro" on the session:

```md
Review the session we just ran to get the web UI dev server up.
Look specifically for:

- Wrong tool calls or tool misuse
- Excessive repo discovery; redundant file reads
- Wrong assumptions about stack, structure, or conventions
- Corrections: what went wrong and why
- Workflows which are likely to be repeated in future

For each finding, propose improvements under the following categories:

1. CLAUDE.md gap
2. Docs gap
3. Skills candidate
4. Script/automation candidate
```

- Then turn this into a skills which lives in `.claude/skills`

### Specs

- A spec describes a user-facing deliverable end-to-end: data model, API behaviour, UI interaction, error handling. This vertical scope makes the spec holistically verifiable by providing a source of truth throughout the build cycle.
- Instead of relying on yourself to adequately describe a feature build - something humans often don't excel at - we can ask the agent to interview you to capture the pertinent details in a structured way.

```md
Interview me about adding persistent test history to Locust. Walk down each decision one at a time; for each question, recommend an answer & wait for me to agree or override. If a question can be answered from the codebase, explore the codebase instead. When we've covered all open questions, save the completed spec to `specs/history.md`.
```

### TDD with the agent

- We can create skills that allow the agent to have a tester and a builder. The tester runs first and writes the test before the builder works. This tester skill is responsible for.
