---
title: Building a mobile AI test agent called Tappy
date: 2026-03-11
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
  <source src="/videos/mobile-ai-agent-demo.mp4" />
</video>

## Day 2

### Goal: The output

Today I focused on the output of Tappy and how we might actually make use of it. There's no point running these tests if they don't help move us forward. The way I've envisioned it is that Tappy runs the tests and produces a set of results, outputted as a markdown file for our QA AI reviewer (Scrappy). The output includes:

1. **Session report** — collects the goal, steps taken, completion status, issues (with screenshots), screens visited, and duration.
2. **History entry** — every step taken, including actions, targets, observations, and any issues flagged.

### Connecting the dots

With all the pieces created and working, I shifted focus to wiring everything together. I wanted to find a cheap and fast solution, so I explored local models:

1. **qwen2.5vl:7b** (5 GB) — too small; the Ollama runner crashed on vision requests.
2. **qwen2.5vl:32b** (21 GB) — hung on step 1. Only 59/65 layers fit on the GPU, and GPU offload made vision inference too slow.
3. **qwen2.5vl:72b** (21 GB) — way too large for my machine.
4. **llama3.2-vision** (7.8 GB) — results weren't good enough and essentially made the whole POC pointless.

I ended up shifting to Google Gemini since we already have an API key for it. After a few runs it produced good results along with a solid summary and some suggestions. However, there are still some gaps — like not scrolling to find a button.
