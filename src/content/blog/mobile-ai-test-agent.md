---
title: Building a mobile AI test agent
date: 10-03-2026
description: How I built a mobile AI test agent from scratch.
status: In progress
---

## The Goal

With the influx of AI and AI-powered testing products, I noticed that mobile was still largely untouched — getting an AI to test your app as if it were a real user wasn't really a thing yet. It felt like an area worth exploring.

My vision was to build an AI agent that, when triggered via Slack or CI/CD, would spin up and test a mobile application like a real user would. You give it a goal — _"Login"_, _"Find a bug"_ — and it goes off to achieve it. Along the way, it creates a report of any issues (**minor**, **major**, or **critical**) and reports back. If a major crash or error occurs, it stops and fails the test.

---

## Day 1

### Goal: Get a POC up as quickly as possible

Leaning on Claude, I was able to get a working POC up within the first couple of hours. My current setup:

1. **[idb](https://github.com/facebook/idb)** — built by Meta to control your simulator on Mac
2. **iOS Simulator** on Mac
3. **Python**
4. **Claude** as the agent brain

### The Flow

- User triggers the command: `python3 main.py --goal "test the login flow"`
- The simulator launches, takes a screenshot (saved to `/outputs`), and captures the accessibility tree via idb.
- The screenshot and accessibility tree are sent with a system prompt to Claude, which returns an action like:

```json
{
  "action": "scroll_down",
  "target": "Log out",
  "observation": "Back on the Profile screen. The Log out button is partially visible at the very bottom, cut off by the tab bar and the center search FAB button. The text 'Log out' is barely visible at y=760, overlapping with the tab bar at y=789. I need to scroll down further to reveal the full Log out button above the tab bar.",
  "issue": null
}
```

> **Note:** To avoid paying for the Claude API during prototyping, I'm currently copy and pasting the outputs manually. This will eventually be fully automated.

<video controls width="100%" playsinline>
  <source src="/videos/mobile-ai-agent-demo.mov" />
</video>

## Day 2

<!--
### Goal: Build out the POC to be more robust. Should be able to do all actions within a simulator. -->

Stay tuned...
