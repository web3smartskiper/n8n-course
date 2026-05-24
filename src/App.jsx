import React, { useState, useEffect } from "react";

const PHASES = [
  { id:1, name:"Foundation",    range:"Days 1–15",  hex:"#0F6E56", bg:"#E1F5EE", dark:"#9FE1CB" },
  { id:2, name:"Integrations",  range:"Days 16–35", hex:"#185FA5", bg:"#E6F1FB", dark:"#B5D4F4" },
  { id:3, name:"Intermediate",  range:"Days 36–55", hex:"#854F0B", bg:"#FAEEDA", dark:"#FAC775" },
  { id:4, name:"Advanced",      range:"Days 56–75", hex:"#7B2B15", bg:"#FAECE7", dark:"#F5C4B3" },
  { id:5, name:"Expert",        range:"Days 76–90", hex:"#3C3489", bg:"#EEEDFE", dark:"#CECBF6" },
];

// FREE VIDEO RESOURCES mapped per phase
const VIDEO_RESOURCES = {
  1: [
    { label: "n8n Beginner Full Course – 10-Part Playlist (2025)", url: "https://www.youtube.com/playlist?list=PLYLEmQupIzOEEvgtBduSgYLaug7LKqlSo", note: "Official playlist: triggers, data flow, expressions, webhooks, HTTP requests" },
    { label: "Master n8n in 2 Hours – Complete Guide (2025)", url: "https://www.youtube.com/watch?v=AURnISajubk", note: "Covers Days 1–15: triggers, expressions, Code node, IF/Switch, Merge, webhooks" },
    { label: "n8n Quick Start: Build Your First Workflow", url: "https://www.youtube.com/watch?v=BLG9kpUCnww", note: "15 min: triggers, data flow, conditional logic — great for Days 1–3" },
    { label: "n8n Official Beginner Course (community.n8n.io)", url: "https://community.n8n.io/t/beginner-course-1-9-introduction-to-automation/48589", note: "9-part text + video course directly from n8n team" },
  ],
  2: [
    { label: "n8n Crash Course – 3 Hours (Beginner to AI Agent)", url: "https://www.youtube.com/watch?v=7_PeuTsx7UM", note: "Google Sheets, Slack, Telegram, Airtable, Notion, error handling" },
    { label: "N8N Full Course – Build & Automate Anything (5 hrs)", url: "https://www.youtube.com/watch?v=7WsbtZwOx_U", note: "RSS, pagination, rate limiting, OAuth2, audit logging" },
    { label: "N8N Full Course – Build & Sell AI Automations (6 hrs)", url: "https://www.youtube.com/watch?v=2GZ2SNXWK-c", note: "Covers API auth patterns, POST requests, Slack, Notion, Gmail" },
    { label: "The ONLY n8n Tutorial You Need for Beginners (2025)", url: "https://www.youtube.com/watch?v=uK42llzHjmY", note: "Solid end-to-end build covering integrations and error handling" },
  ],
  3: [
    { label: "Complete n8n Masterclass: Zero to Hero (7.5 hrs)", url: "https://www.youtube.com/watch?v=DkV7ztrhLh8", note: "Sub-workflows, Supabase, OpenAI classification, structured output, files" },
    { label: "Build AI Agents with n8n – Full Course (2025)", url: "https://www.youtube.com/watch?v=geR9PeCuHK4", note: "AI classification, summarization, JSON manipulation, OpenAI setup" },
    { label: "n8n + Supabase AI-Powered Database (YouTube)", url: "https://www.youtube.com/watch?v=7LTyi3g4V_I", note: "Days 36–40: Supabase setup, querying, writing, upsert + RAG" },
    { label: "N8N Full Course 5 Hours – Beginner to Selling AI Systems", url: "https://www.youtube.com/watch?v=K7SoGqR5ISY", note: "Date handling, complex JSON, parallel requests, AI pipelines" },
  ],
  4: [
    { label: "Complete n8n Masterclass: Zero to Hero (7.5 hrs)", url: "https://www.youtube.com/watch?v=DkV7ztrhLh8", note: "Self-hosting, backup, async webhooks, performance, multi-branch architecture" },
    { label: "Ultimate N8N Roadmap – Zero to Hero Series", url: "https://www.youtube.com/watch?v=HOM_G1-6iMM", note: "Advanced patterns: dynamic config, community nodes, AI with memory" },
    { label: "n8n Self-Hosted AI Starter Kit – Official Docs", url: "https://docs.n8n.io/hosting/starter-kits/ai-starter-kit/", note: "Deploy n8n + Ollama + Supabase on your own server for free" },
    { label: "N8N Full Course – Build & Automate Anything (5 hrs)", url: "https://www.youtube.com/watch?v=7WsbtZwOx_U", note: "Monitoring, health checks, tiered error handling, refactoring" },
  ],
  5: [
    { label: "N8N Full Course 5 Hrs – Beginner to Selling AI Systems", url: "https://www.youtube.com/watch?v=K7SoGqR5ISY", note: "Days 76–90: building for real clients, final projects, deployment" },
    { label: "Build AI Agents with n8n – Full Course", url: "https://www.youtube.com/watch?v=geR9PeCuHK4", note: "Component libraries, expert-level agent patterns, sub-workflow systems" },
    { label: "n8n Community Tutorials Forum", url: "https://community.n8n.io/c/tutorials/28", note: "Day 83: Real community workflows. Learn from other people's complex builds." },
    { label: "n8n Official Workflow Templates Library (800+)", url: "https://n8n.io/workflows", note: "Inspiration for your final project — every template is free to copy" },
  ],
};

const PHASE_DOCS = {
  1: "https://docs.n8n.io/getting-started/",
  2: "https://docs.n8n.io/integrations/",
  3: "https://docs.n8n.io/code/",
  4: "https://docs.n8n.io/hosting/",
  5: "https://community.n8n.io/c/tutorials/28",
};

const C = [
  {day:1,p:1,title:"Setup and first workflow",learn:"Sign up at n8n.io (free cloud) or install locally: npm install -g n8n, then run n8n. Read the Getting Started section at docs.n8n.io. Watch any recent 'n8n beginner' YouTube video for orientation.",build:"Build a workflow: Manual Trigger → Send Email node. Use your own address. Execute it. Confirm the email arrives.",check:"n8n is running. You can create, execute, and save a workflow."},
  {day:2,p:1,title:"Triggers and scheduling",learn:"Read about trigger nodes at docs.n8n.io. Understand three types: Manual, Schedule (cron), Webhook. A trigger is the first node — nothing runs without it.",build:"Schedule Trigger set to daily at 8am → Send Email with body: 'Good morning, today is {{ $now.format(\"YYYY-MM-DD\") }}'. Activate it.",check:"You know the three trigger types and can write basic expressions inside node fields."},
  {day:3,p:1,title:"How data flows in n8n",learn:"Read 'Data structure' at docs.n8n.io. Every node receives an array called items. Each item has a json property. Data flows forward. This is the most important concept in all of n8n.",build:"Add a Set node between trigger and email. Create two fields: greeting = 'Good morning' and date = today via expression. Use {{ $json.greeting }} and {{ $json.date }} in the email body.",check:"You can reference data from a previous node using expressions."},
  {day:4,p:1,title:"HTTP Request basics",learn:"The HTTP Request node connects n8n to any API. Read its docs page. Understand GET vs POST. Practice on a no-auth API first: api.coindesk.com/v1/bpi/currentprice.json",build:"HTTP Request node → GET https://api.coindesk.com/v1/bpi/currentprice.json. Execute and inspect the returned JSON. Forward the BTC price into an email.",check:"You can fetch data from a public API and reference the JSON in a following node."},
  {day:5,p:1,title:"First real API integration",learn:"Sign up for a free OpenWeatherMap API key at openweathermap.org. Read the current weather endpoint docs. Understand how API keys work: query parameter or header.",build:"Fetch weather: https://api.openweathermap.org/data/2.5/weather?q=Lagos&appid=YOURKEY&units=metric. Extract temperature, description, and city using a Set node. Email the result.",check:"You can authenticate with an API key and extract specific fields from a JSON response."},
  {day:6,p:1,title:"Expressions deep dive",learn:"Read 'Expressions' at docs.n8n.io. Key syntax: {{ $json.fieldName }} for previous node, {{ $('NodeName').item.json.field }} for any node. Learn $now for dates. Expressions go inside {{ }}.",build:"Rebuild yesterday's weather workflow. This time skip the Set node — write expressions directly in the email body: 'Weather in {{ $json.name }}: {{ $json.main.temp }}°C, {{ $json.weather[0].description }}'",check:"You can write expressions that access nested JSON and combine fields into a string."},
  {day:7,p:1,title:"Code node introduction",learn:"Read the Code node docs. You receive an array called items and must return an array. items[0].json.field accesses data. JavaScript only. No external libraries.",build:"Add a Code node to your weather workflow that: rounds temperature to 1 decimal, capitalizes the weather description, adds a feels_like field. Return the modified items array.",check:"You can write a Code node that transforms data and returns a valid items array."},
  {day:8,p:1,title:"IF node and conditional logic",learn:"Read the IF node docs. It splits your workflow into true and false branches. Both branches can continue independently or merge later.",build:"Extend the weather workflow with an IF node: temp > 30 → email 'Hot day, stay hydrated'. temp < 15 → 'Cold day, dress warm'. Otherwise → 'Nice weather'. Test all three by swapping the city.",check:"You can split workflow execution based on a condition and run different actions per branch."},
  {day:9,p:1,title:"Switch node",learn:"The Switch node routes to 3+ paths based on a value. Read its docs. Good for categorization when IF only gives you two options.",build:"Generate a random number 1–10 in a Code node. Route via Switch: 1–3 → 'Low', 4–7 → 'Medium', 8–10 → 'High'. Send yourself an email with the number and its category.",check:"You can route workflow execution to three or more paths."},
  {day:10,p:1,title:"Merge node",learn:"Merge combines data from multiple branches or nodes. Read its docs. Main modes: Append (stacks items), Merge by Index (pairs by position).",build:"Two HTTP Request nodes: one fetches weather for Lagos, one for London. Merge with Append mode. Code node creates a comparison string. Email the comparison.",check:"You can fetch data from two sources and combine them into a single stream."},
  {day:11,p:1,title:"Loops and batch processing",learn:"Read about Split in Batches node. By default n8n passes all items through a node at once. Sometimes you need one at a time — for API calls that can't handle bulk requests.",build:"Code node creates 5 items, each with a different city name. Connect to HTTP Request node using {{ $json.city }} in the URL. Loop through all 5 and collect weather for each.",check:"You can process a list through a per-item API call and collect all results."},
  {day:12,p:1,title:"Webhooks introduction",learn:"A webhook is a URL that listens for incoming HTTP requests. When data hits it, your workflow runs. Read 'Webhooks' at docs.n8n.io.",build:"Workflow with a Webhook trigger. Copy the URL. Go to webhook.site in another tab and use it to POST JSON to your URL. See the data arrive in n8n and inspect it.",check:"You understand how webhooks work and can receive external data through one."},
  {day:13,p:1,title:"Real webhook with a form",learn:"Sign up for Tally.so (free). Create a form with Name and Email fields. In Tally integrations, add your n8n webhook URL.",build:"Webhook trigger → Set node (extract name and email) → Send Email to yourself: 'New submission: [name] ([email])'. Fill the form. Confirm delivery.",check:"You have a live form-to-email workflow with a real webhook connection."},
  {day:14,p:1,title:"Build day",learn:"No new concepts. Review days 1–13.",build:"Build from scratch without looking at previous workflows: scheduled morning workflow, fetches weather for 3 cities, flags any city over 35°C as a heat warning, formats a clean HTML email with all results.",check:"You can build a multi-step workflow from memory: trigger + HTTP requests + loop + logic + email."},
  {day:15,p:1,title:"Phase 1 review",learn:"Spend an hour on community.n8n.io reading threads. Find 3 beginner questions you now know the answer to. This tells you how far you've come.",build:"Fix anything from days 1–14 that still feels shaky. If expressions are uncertain, redo day 6. If Code node is uncomfortable, redo day 7 with a new task.",check:"Confident with: triggers, HTTP requests, expressions, Code node, IF/Switch, Merge, webhooks. If any is uncertain, fix it today."},
  {day:16,p:2,title:"Google Sheets – reading",learn:"Connect your Google account in n8n credentials. Read the Google Sheets node docs. Focus on: Get Many Rows, Append Row, Update Row.",build:"Create a Google Sheet with 5 rows: Name, Email, City. Workflow reads all rows and formats each as a sentence using a Set node. Execute and inspect.",check:"You can authenticate with Google and read rows from a spreadsheet."},
  {day:17,p:2,title:"Google Sheets – writing",learn:"Re-read the Google Sheets docs focusing on Append Row and Update Row. Understand how to map workflow data to specific columns.",build:"Combine with day 13's Tally webhook. When form submitted: (1) append row to Google Sheet, (2) send welcome email to the submitter. Test end to end.",check:"You have a live form → spreadsheet → email workflow."},
  {day:18,p:2,title:"Gmail node",learn:"Read the Gmail node docs. It can send, read, label, and search emails. Connect your Gmail account in credentials.",build:"Workflow searches Gmail inbox for emails with 'invoice' in subject. Extracts sender, subject, and date for each result. Appends each to a Google Sheet.",check:"You can read from Gmail programmatically and pipe results to another service."},
  {day:19,p:2,title:"Slack node",learn:"Create a free Slack workspace at slack.com. Create a Slack app at api.slack.com with bot token permissions. Read the n8n Slack node docs.",build:"When Tally form is submitted: post a Slack message to a channel — 'New lead: [name] ([email]) at [time]'. Test by filling the form.",check:"You can send Slack messages from n8n and know how to create a Slack app."},
  {day:20,p:2,title:"Airtable node",learn:"Sign up for Airtable free tier. Create a 'Contacts' table. Read n8n Airtable node docs. Get your API key from airtable.com/account.",build:"Update the form workflow: submission → create Airtable record AND send Slack message AND send welcome email. Three actions from one webhook.",check:"You can write to Airtable and chain multiple actions from a single trigger."},
  {day:21,p:2,title:"Notion node",learn:"Sign up for Notion free tier. Create a database. Read the Notion API docs briefly, then the n8n Notion node docs. Create a Notion integration to get the API key.",build:"Tally form with Title, Description, Priority fields. On submission: create a Notion database page with those fields.",check:"You can create Notion pages from n8n and understand Notion's database structure."},
  {day:22,p:2,title:"Telegram Bot node",learn:"Open Telegram. Search @BotFather. Use /newbot to create a bot and get a token. Read the n8n Telegram node docs.",build:"Replace your weather email with a Telegram message. Every morning your bot sends you weather for your city. Receive it on your phone.",check:"You have a live Telegram bot that sends messages from n8n."},
  {day:23,p:2,title:"Build day: lead capture system",learn:"No new concepts. Consolidate days 16–22.",build:"Complete lead capture system: form → Airtable record + Slack team alert + welcome email. If they selected 'Urgent' on the form, also send Telegram to your phone.",check:"You have a production-ready multi-service workflow handling real data."},
  {day:24,p:2,title:"POST requests",learn:"So far mostly GET. POST creates data. Read HTTP Request node docs on POST. You set the body type (JSON) and the payload.",build:"POST to jsonplaceholder.typicode.com/posts with a title, body, and userId. Inspect the response. Then loop through 3 different data items and create 3 posts.",check:"You can send POST requests with a JSON body and handle the response."},
  {day:25,p:2,title:"API authentication patterns",learn:"APIs use different auth: API Key in query param, API Key in header, Bearer token, Basic auth. Read HTTP Request auth docs. Learn to store secrets as n8n credentials rather than hardcoding them.",build:"Pick a free API you're personally interested in (sports, finance, music). Sign up, get an API key, connect via n8n credentials (not hardcoded), and build a workflow that pulls data you care about.",check:"You can connect to any key-authenticated API and store credentials securely."},
  {day:26,p:2,title:"OAuth2 authentication",learn:"OAuth2 is required for Google, Microsoft, and most major consumer services. Read 'OAuth2' in n8n docs. You used it on day 16 — now understand what was happening.",build:"Connect a new OAuth2 service you haven't used: GitHub (read your repos), Spotify (read listening history), or Dropbox (list files). Build a simple read workflow.",check:"You understand the OAuth2 flow and can set up a new OAuth2 credential from scratch."},
  {day:27,p:2,title:"Pagination",learn:"Most APIs cap responses at 100 items. For more, you must paginate. Read n8n pagination docs. Three patterns exist: cursor-based, page-based, offset-based.",build:"Use JSONPlaceholder: fetch posts with _page=1, _page=2, _page=3 (using _limit=10). Merge all three results. Count total items. Verify you have 30.",check:"You can handle paginated APIs and collect results across multiple requests."},
  {day:28,p:2,title:"Rate limiting and error recovery",learn:"APIs limit request frequency. Too many too fast = 429 error. Read about error handling and the Wait node in n8n docs.",build:"Loop through 20 cities fetching weather for each. Add a Wait node (500ms) between each request. Add error handling so one failed city logs the error but the workflow continues for the rest.",check:"Your workflows handle rate limits and don't crash when one item fails."},
  {day:29,p:2,title:"RSS feed monitoring",learn:"RSS lets you monitor websites for new content without an API key. Most blogs, news sites, and YouTube channels have feeds. n8n has an RSS node.",build:"Find an RSS feed for a site you read. Check every hour. When there's a new post, send yourself a Telegram message with the title and link.",check:"You can monitor any RSS feed and trigger actions on new content."},
  {day:30,p:2,title:"Build day: RSS digest",learn:"No new concepts.",build:"Monitor 3 RSS feeds. Code node filters only articles containing your keyword. Remove duplicates. Format a daily digest. Send via Telegram or email every evening at 6pm.",check:"You have a working content monitor that filters noise and delivers relevant updates."},
  {day:31,p:2,title:"Error Trigger node",learn:"The Error Trigger fires when any workflow in your n8n instance fails. Read its docs. This is how you know about problems instead of finding out days later.",build:"Create a dedicated 'Error Reporter' workflow. Error Trigger → Telegram message with workflow name, error message, and timestamp. Deliberately break another workflow to test it.",check:"No workflow can fail silently. You get alerted instantly."},
  {day:32,p:2,title:"Handling partial failure",learn:"Read about 'Continue on Error' in n8n settings and using IF nodes to check for errors after HTTP requests.",build:"Workflow hits 5 different APIs. Some work, some return errors. After each request, check success or failure. Collect all successes in one array and failures in another. Email a summary.",check:"You can build workflows that survive partial failure without crashing."},
  {day:33,p:2,title:"Retry logic",learn:"Some failures are temporary. Implement retry logic: attempt → check → retry up to 3 times → give up. Read n8n retry settings.",build:"Code node simulates 50% random failure (throw an error randomly). Implement retry: try 3 times before marking failed. Log which attempt succeeded.",check:"Your workflows retry failed operations before giving up."},
  {day:34,p:2,title:"Audit logging",learn:"Production workflows need logs: what ran, when, with what input, outcome. Read about writing to Google Sheets or Supabase as a log destination.",build:"Pick your most complex workflow. Add a logging step at the end that writes to a Google Sheet: timestamp, workflow name, input summary, output summary, status.",check:"You have a workflow with a proper audit log."},
  {day:35,p:2,title:"Phase 2 capstone",learn:"No new concepts. Full build day.",build:"Complete lead management system: Tally form → Airtable + Slack + welcome email + Telegram if 'hot' lead + everything logged to Google Sheet + Error Trigger alerts on failure. Fully error-handled.",check:"Production-grade, multi-service workflow with error handling and logging. Every piece of phases 1 and 2 is represented."},
  {day:36,p:3,title:"Supabase setup",learn:"Sign up at supabase.com (free, no card needed). Create a project. Create a 'contacts' table: id (auto), name, email, city, created_at. Get your project URL and anon key.",build:"Connect Supabase to n8n via HTTP Request using Supabase's REST API (documented in your project under API). Fetch all rows from contacts. Verify data arrives in n8n.",check:"You have a real Postgres database running and connected to n8n."},
  {day:37,p:3,title:"Querying Supabase",learn:"Supabase's REST API supports filtering: ?name=eq.John, ?created_at=gt.2024-01-01. Ordering with ?order=created_at.desc. Read the API docs in your Supabase project under 'Tables and Views'.",build:"Query contacts filtered by a specific city, ordered by created_at descending, limited to 10 results. Format results and send to Telegram.",check:"You can query a database with filters, ordering, and limits."},
  {day:38,p:3,title:"Writing to Supabase",learn:"Supabase insert via POST, update via PATCH, delete via DELETE. Use 'Prefer: return=representation' header to get the created record back.",build:"Update your form workflow: replace Airtable write with Supabase insert. Get the created record's ID back in the response and log it.",check:"You can insert records into Postgres from n8n and retrieve the created row."},
  {day:39,p:3,title:"Upsert and sync",learn:"An upsert inserts if the record doesn't exist, updates if it does. Prevents duplicates. Read Supabase upsert docs.",build:"Workflow syncs Google Sheets contacts to Supabase. For each row: if email exists in Supabase, update; if not, insert. Run twice to confirm no duplicates are created.",check:"You can sync data between two services without creating duplicates."},
  {day:40,p:3,title:"Move from sheets to a real database",learn:"Reflect on which workflows use Google Sheets as a makeshift database. Sheets breaks above ~1000 rows and can't do real queries.",build:"Take your lead capture system. Replace the Sheets data store with Supabase. All leads go to Supabase. Logging can stay in Sheets. Verify everything works.",check:"Your main workflow uses a real database for data storage."},
  {day:41,p:3,title:"Sub-workflows: the concept",learn:"A sub-workflow is a workflow called by another workflow. It keeps complex automations clean and logic reusable. Read 'Call n8n Workflow' and 'Execute Workflow' node docs.",build:"Extract your email formatting logic into a dedicated 'Format Email' workflow. Call it from your main workflow using Execute Workflow. Verify output is identical.",check:"You can extract reusable logic into a sub-workflow and call it from a parent."},
  {day:42,p:3,title:"Reusable notification sub-workflow",learn:"Think about notifications you send in many workflows: Telegram, email, Slack. Instead of setting these up in every workflow, centralize them.",build:"Build a 'Send Notification' sub-workflow that accepts: message, channel (telegram/email/slack), urgency (normal/urgent). Update two existing workflows to use it.",check:"You have a reusable notification system. Adding a new channel means updating one workflow, not ten."},
  {day:43,p:3,title:"Passing data between workflows",learn:"Read how to pass input data to a sub-workflow and return data from it. The 'When Called by Another Workflow' trigger receives input. The last node's output is returned.",build:"Build 'Enrich Contact' sub-workflow: takes email as input, checks Supabase for existing data, returns a formatted contact object. Call it from lead capture to check if a new lead already exists.",check:"You can pass structured data into sub-workflows and use the returned data in the parent."},
  {day:44,p:3,title:"Workflow architecture",learn:"No new n8n concepts. Read examples of well-structured n8n projects in the community forum. Think about your workflows like a developer thinks about code modules.",build:"Draw the architecture of your lead system on paper. Identify what's reusable, what's duplicated, what should be a sub-workflow. Refactor to match the cleaner design.",check:"Your workflow system has a clear architecture you can explain to someone else."},
  {day:45,p:3,title:"OpenAI setup",learn:"Sign up at platform.openai.com. New accounts get free credits. Create an API key. Read n8n OpenAI node docs. Key params: model, messages, temperature, max_tokens.",build:"Manual trigger → Set node with a paragraph of text → OpenAI node that summarizes it in one sentence → log the result. Test with 3 different paragraphs.",check:"You can send text to OpenAI and use the response in a workflow."},
  {day:46,p:3,title:"Classification with AI",learn:"One of the most useful AI patterns: give it text, get a category back. The key is a system prompt that returns only the category name — nothing else.",build:"Classifier workflow: receives text → sends to OpenAI with system prompt 'Classify this as exactly one of: complaint, question, sales-inquiry, feedback. Return only the word.' → Switch node routes based on result. Test with 5 sample inputs.",check:"You can use AI to classify free-form text and route workflow execution based on the result."},
  {day:47,p:3,title:"AI email triage",learn:"Combine Gmail (day 18) with AI classification. Build something that actually saves time.",build:"Runs every 30 minutes: fetch unread Gmail messages → for each, send subject + first 500 chars to OpenAI to classify (complaint/question/sales/spam) → label in Gmail based on classification → if 'complaint', send Slack alert.",check:"You have a live AI email triage system. Check it after a few hours."},
  {day:48,p:3,title:"Summarization pipeline",learn:"Read about handling long OpenAI responses and max_tokens. Understand that input length affects cost.",build:"Paste a long article URL → HTTP Request fetches the page → extract the text → OpenAI summarizes in 3 bullet points → save to Notion page titled with the article headline.",check:"You can pipe web content through AI summarization and save to a database."},
  {day:49,p:3,title:"Structured AI output",learn:"Getting AI to return JSON is more useful than free text in workflows. System prompt: 'Return only a JSON object with fields: X, Y, Z. No other text.'",build:"Update your email classifier. OpenAI returns JSON: { category, sentiment, action_required, suggested_reply }. Code node parses the JSON. Use all four fields in workflow logic.",check:"You can reliably extract structured JSON from an AI response and use its fields downstream."},
  {day:50,p:3,title:"Build day: AI content pipeline",learn:"No new concepts.",build:"Monitor 3 RSS feeds every 2 hours → AI classifies topic (tech/business/other) → filter to your chosen categories → AI writes a 2-sentence summary → save to Notion with title, URL, topic, summary, date → daily 6pm digest compiled and sent via Telegram.",check:"You have an automated research assistant that reads, filters, and summarizes content for you."},
  {day:51,p:3,title:"Complex JSON manipulation",learn:"Real APIs return messy nested JSON. Learn JavaScript array methods in n8n's Code node: map, filter, reduce, flatMap.",build:"Fetch https://api.github.com/repos/n8n-io/n8n/issues?per_page=30. Code node: filter open issues only, extract title + number + labels + created_at, sort by date descending, return top 10. No API key needed.",check:"You can reshape deeply nested JSON into a clean flat structure."},
  {day:52,p:3,title:"Date and time handling",learn:"n8n has Luxon built in via $now and DateTime. Learn: formatting, date arithmetic, timezone conversion, date comparison. This comes up in every real project.",build:"Read your Supabase contacts. For each: calculate days since created_at. Flag contacts older than 30 days as 'stale'. Send a weekly Monday report listing stale contacts.",check:"You can do date arithmetic in expressions and the Code node without confusion."},
  {day:53,p:3,title:"Working with files",learn:"Read n8n docs on binary data. Learn the Move Binary Data node and handling file attachments.",build:"Webhook receives a CSV file (test with Postman or a file-upload form). n8n parses the CSV. Each row is imported as a contact into Supabase.",check:"You can receive file data via webhook, parse it, and use the contents in a workflow."},
  {day:54,p:3,title:"Parallel HTTP requests",learn:"Multiple HTTP calls can run at the same time instead of sequentially. Learn parallel execution in n8n and when to use it vs looping.",build:"10 GitHub usernames hardcoded in a Code node. Fetch all 10 user profiles in parallel (not in a loop). Compare follower counts. Send yourself a leaderboard. Note how much faster parallel is.",check:"You can run parallel HTTP requests and know when parallel beats sequential."},
  {day:55,p:3,title:"Phase 3 capstone",learn:"No new concepts. Final phase 3 build.",build:"AI-powered content system: Tally form accepts a topic to monitor → saved to Supabase → every 3 hours fetch news for all saved topics → AI classifies relevance and summarizes → only high-relevance articles saved to Notion → daily Telegram digest → errors trigger Slack alert. Fully error-handled and logged.",check:"This is a real product. If someone paid you to build this, you'd deliver exactly this."},
  {day:56,p:4,title:"Self-hosting on Railway",learn:"The free cloud tier limits executions. Self-hosting is free. Sign up at railway.app. Read n8n self-hosting docs at docs.n8n.io/hosting.",build:"Deploy n8n on Railway using the official n8n template. Set required environment variables (N8N_ENCRYPTION_KEY etc. — listed in docs). Access your instance at the Railway URL.",check:"You have a self-hosted n8n instance running 24/7 at no cost."},
  {day:57,p:4,title:"Environment variables and secrets",learn:"Hardcoded credentials in workflows are a security risk. Read n8n environment variable docs. API keys should be env vars, not strings inside nodes.",build:"Move your OpenWeatherMap and OpenAI keys to Railway environment variables. Update n8n credentials to reference them. Export a workflow as JSON and verify no API key appears in the file.",check:"No secrets are hardcoded in your workflows."},
  {day:58,p:4,title:"Migrating to self-hosted",learn:"Read n8n docs on exporting and importing workflows. Note: credentials are never exported for security — you must re-enter them.",build:"Export all workflows from cloud n8n. Import to self-hosted. Re-enter all credentials. Test each workflow. Build everything on self-hosted from now on.",check:"All your workflows run on your self-hosted instance."},
  {day:59,p:4,title:"Automated backup to GitHub",learn:"Self-hosted n8n stores data in a local database. Without backups, a server failure means losing everything. Read n8n backup options.",build:"Backup workflow: runs at midnight daily → uses n8n API to export all workflows as JSON → saves to a GitHub repository using the GitHub node. Verify files appear in GitHub.",check:"Your workflows are backed up to GitHub automatically every night."},
  {day:60,p:4,title:"n8n API",learn:"n8n has its own REST API for managing workflows, executions, and credentials. Read the API docs (Settings → API in your instance).",build:"Monitoring workflow: runs hourly → queries n8n API for all workflows → checks for failed executions in the last hour → sends Telegram summary if failures exist.",check:"You can manage and monitor your n8n instance programmatically."},
  {day:61,p:4,title:"Async webhook processing",learn:"If processing takes >30 seconds, the sender times out waiting. Learn to respond immediately and process in the background.",build:"Webhook that: (1) immediately responds HTTP 200 with 'received', (2) continues processing in the background, (3) sends Telegram when processing is complete. Test with a slow workflow (add a Wait node to simulate slowness).",check:"Your webhooks respond instantly and don't time out during long processing."},
  {day:62,p:4,title:"Webhook signature verification",learn:"Anyone who knows your webhook URL can send fake data. Legitimate services include an HMAC-SHA256 signature in request headers. Read how signature verification works.",build:"Enable webhook signature verification for your Tally webhook. Code node: extract signature from headers, compute your own HMAC using the secret, compare. Reject requests that don't match.",check:"Your webhooks verify that data comes from legitimate sources."},
  {day:63,p:4,title:"Performance testing",learn:"Workflows that work for 10 items may break at 1000. Read about Split in Batches performance and execution limits.",build:"Workflow processes 100 Supabase contacts. Version A: sequential (one at a time). Version B: batches of 10. Time both. Document the difference.",check:"You understand the tradeoff between sequential and parallel processing."},
  {day:64,p:4,title:"Multi-branch architecture",learn:"Real systems split into many parallel paths. Read examples of complex n8n workflows in the community forum.",build:"Incoming webhook routes by payload type to 4 parallel branches: (1) Supabase insert, (2) Slack message, (3) Notion page, (4) send email. All four run in parallel. Merge to write a single 'all complete' log entry.",check:"You can design and build workflows with multiple parallel branches that merge cleanly."},
  {day:65,p:4,title:"Dynamic configuration",learn:"Hard-coded logic breaks when requirements change. Dynamic logic reads its rules from a database. Changing behavior means updating data, not editing workflows.",build:"Take your email classifier. Move the classification categories and routing targets into a Supabase table. Workflow reads the rules at runtime. Change routing by updating the database, not the workflow.",check:"Your workflow behavior can be changed without touching the workflow itself."},
  {day:66,p:4,title:"Community nodes",learn:"n8n supports community-built nodes. Read 'Community nodes' at docs.n8n.io. On self-hosted, install via Settings → Community Nodes.",build:"Browse npm (search 'n8n-nodes-'). Find and install 3 community nodes relevant to your work. Build a test workflow with each one.",check:"You can discover, install, and use community nodes."},
  {day:67,p:4,title:"Multi-step AI chains",learn:"Chaining AI calls — where each builds on the previous — produces better results than one call that does everything. Read about prompt chaining.",build:"3-step article analysis: Step 1: AI extracts main claims. Step 2: AI evaluates each claim for credibility (using previous output as context). Step 3: AI writes a balanced assessment. Test with a real news article.",check:"You can build multi-step AI pipelines where each step refines the previous."},
  {day:68,p:4,title:"AI with memory",learn:"A single AI call has no memory. To give context, store conversation history and include it in each new call. Read about stateful AI workflows.",build:"Telegram bot with 3-turn memory: message → AI responds with context of previous turn → second message → AI knows what was said before. History stored in Supabase. Clears after 1 hour inactivity.",check:"Your AI workflows maintain context across multiple interactions."},
  {day:69,p:4,title:"Build day: AI assistant on Telegram",learn:"No new concepts.",build:"Full Telegram AI assistant: receives messages via webhook → checks conversation history from Supabase → '/news' fetches and summarizes headlines → '/weather CITY' fetches weather → other messages go to OpenAI with full history → reply saved to Supabase → sent via Telegram.",check:"You have a working AI chatbot on Telegram with memory and tool routing. You built it from scratch."},
  {day:70,p:4,title:"Workflow health monitoring",learn:"Production workflows fail. Find out immediately, not days later. Design a monitoring strategy: what to alert on, what to log, what to ignore.",build:"Daily health check: runs each critical workflow with test data and verifies output. Weekly report every Monday: total executions, success rate, most common errors, slowest workflows. Sent to Telegram.",check:"You know the health of your workflow system at all times."},
  {day:71,p:4,title:"Documentation inside n8n",learn:"Six months from now you won't remember why you built something a certain way. Learn: node notes (right-click → Add note), workflow descriptions, sticky notes.",build:"Go through every workflow. Add a description explaining what it does and why. Add notes to any non-obvious node. Add sticky notes to complex logic sections.",check:"Every workflow is documented well enough for someone else to understand and maintain it."},
  {day:72,p:4,title:"Edge case testing",learn:"Workflows that work for normal data break on edge cases. Empty inputs, null values, very long strings, special characters, concurrent executions.",build:"Pick your most complex workflow. Write 10 edge cases that could break it. Build each as a test. Fix every failure you find.",check:"Your most important workflow handles edge cases without crashing."},
  {day:73,p:4,title:"Tiered error handling",learn:"Not all errors are equal. A timeout should retry. A bad API key should alert immediately. A duplicate record should skip silently.",build:"Tiered error handler in your lead system: (1) network errors → retry 3 times with exponential backoff, (2) auth errors → immediate Telegram alert and stop, (3) data errors → log to Supabase and continue, (4) unknown errors → Slack alert with full details.",check:"Your error handling distinguishes between error types and responds appropriately."},
  {day:74,p:4,title:"Refactoring",learn:"Refactoring improves structure without changing behavior. In n8n: split large workflows, remove duplicate logic, clean up node names, standardize data formats.",build:"Look at your largest workflow. Apply: every node has a clear descriptive name. Duplicated logic is extracted to sub-workflows. Dates, field names, and formats are consistent throughout.",check:"Your most complex workflow is readable and you'd be comfortable showing it to another developer."},
  {day:75,p:4,title:"Phase 4 capstone",learn:"No new concepts. Hardest build yet.",build:"Automated business intelligence system: pulls data daily from 3 sources → AI analyzes trends → generates a narrative weekly report → saves to Notion → Telegram summary. Fully self-hosted, error-handled, logged, and backed up nightly to GitHub.",check:"You can build a production-grade self-hosted system that manages itself and uses AI to generate insights."},
  {day:76,p:5,title:"Audit everything",learn:"Expert level means knowing how to evaluate, not just build. No new concepts today.",build:"Review every workflow. For each ask: error handling? Documented? Edge cases covered? Survives server restart? Backed up? Create a list of every gap found.",check:"You have an honest list of every weakness in your workflow system."},
  {day:77,p:5,title:"Fix all gaps",learn:"No new concepts. Fix day.",build:"Work through the audit list from day 76. Fix everything. No workflow should be undocumented, unmonitored, or missing error handling by end of today.",check:"Every workflow you've built meets production standards."},
  {day:78,p:5,title:"Personal component library",learn:"Expert n8n users maintain a library of reusable sub-workflows they drop into any new project.",build:"Build or finalize 5 reusable sub-workflows: (1) Send Notification, (2) Enrich Contact, (3) AI Classify, (4) Log to Audit, (5) Retry HTTP. Document each one clearly.",check:"You have a personal library of 5 plug-in sub-workflows ready for any new project."},
  {day:79,p:5,title:"Find a real person to build for",learn:"No tutorials. Find someone with a real repetitive task: a small business owner, a freelancer, a friend with a side project.",build:"Interview them for 30 minutes. Ask: what takes the most time? What do you copy-paste constantly? What do you check manually every day? Write a 1-paragraph spec and get their agreement to test it.",check:"You have a real person with a real problem that n8n can solve."},
  {day:80,p:5,title:"Build their solution: core",learn:"Building for others is different. They won't check logs. It has to just work.",build:"Build the happy path first — the workflow that works when everything goes right. Get the main functionality working and show it to them.",check:"The core workflow works end to end with real data."},
  {day:81,p:5,title:"Build their solution: harden it",learn:"Now add everything a production workflow needs.",build:"Add: error handling for all failure modes, Telegram alert to yourself on failure, input validation, audit log, documentation. Test with bad data intentionally.",check:"The workflow handles bad inputs, partial failures, and edge cases without breaking."},
  {day:82,p:5,title:"Deploy and hand over",learn:"Handing over means the other person can use it and knows who to call if it breaks.",build:"Activate on self-hosted instance. Write a 1-page handover doc: what it does, how to trigger it, what to do if it stops working. Send it to them. Monitor for 24 hours.",check:"Another person is using an automation you built. It's running in production."},
  {day:83,p:5,title:"Community forum deep dive",learn:"Spend 2 hours on community.n8n.io. Find the 5 most complex workflows shared there. For each: read the full description, understand every node, identify what you'd do differently.",build:"Pick one community workflow you haven't tried. Adapt it for your own use case using your existing sub-workflows, Supabase instance, and notification system.",check:"You can read, understand, and improve other people's complex n8n workflows."},
  {day:84,p:5,title:"Final project: planning",learn:"No tutorials. This is your capstone. It should solve a real problem you have.",build:"Write a 1-page spec: what problem does it solve, what data does it use, what services connect, what is the user experience, how are errors handled, how is it monitored. Map every workflow and sub-workflow before touching n8n.",check:"You have a complete technical spec for your most ambitious automation project."},
  {day:85,p:5,title:"Final project: day 1",learn:"Build from your spec. Don't deviate unless you find something impossible.",build:"Build the foundation: all credentials set up, all Supabase tables created, all empty sub-workflow shells created, main workflow skeleton in place. Structure is there even if most nodes are empty.",check:"The architecture is in place. You can see the full shape of the system."},
  {day:86,p:5,title:"Final project: day 2",learn:"Fill in the functionality.",build:"Complete each sub-workflow and connect to the main flow. Test each component in isolation before connecting. By end of day, the happy path works end to end.",check:"The core system works with good data."},
  {day:87,p:5,title:"Final project: harden and test",learn:"Break it intentionally.",build:"Write 10 test cases covering edge cases and failure modes. Run each. Fix every failure. Run all 10 again until they all pass.",check:"Your project handles everything you can throw at it."},
  {day:88,p:5,title:"Final project: documentation",learn:"A system you can't explain is a system you don't fully understand.",build:"Write complete docs: what it does in plain English, architecture diagram, setup guide (how would someone recreate this?), runbook (what to do when each thing breaks). Store in Notion.",check:"Someone else could rebuild this system from your documentation."},
  {day:89,p:5,title:"Performance review",learn:"Check your monitoring data from the past 3 months. Look at: most-used workflows, most-failed, slowest, most valuable.",build:"Based on data: (1) optimize your slowest workflow by 20%+, (2) fix the most common error in your logs, (3) shut down any workflow that never runs. Write a 1-paragraph reflection on what you learned.",check:"Your workflow system is lean. You removed anything not earning its keep."},
  {day:90,p:5,title:"What you can build now",learn:"No tutorials. No new concepts. You're done with structured learning.",build:"Write down 5 automations you can build now that you couldn't have imagined on day 1. Pick one and start building it. Not because it's assigned — because you want to. That's the difference.",check:"You can build any automation someone can describe to you. You know what n8n can and can't do. You build defensively, document thoroughly, and handle failures. That's expert level."},
];

const ph = (d) => PHASES.find(p => p.id === d.p);

export default function App() {
  const [done, setDone] = useState({});
  const [activePhase, setActivePhase] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const saved = localStorage.getItem("n8n-90d-v2");
        if (saved) setDone(JSON.parse(saved));
      } catch (_) {}
      setLoaded(true);
    }
    load();
  }, []);

  async function toggle(dayNum, e) {
    e.stopPropagation();
    const next = { ...done, [dayNum]: !done[dayNum] };
    setDone(next);
    try { localStorage.setItem("n8n-90d-v2", JSON.stringify(next)); } catch(_) {}
  }

  const total = Object.values(done).filter(Boolean).length;
  const pct = Math.round((total / 90) * 100);
  const phaseDays = C.filter(d => d.p === activePhase);
  const firstUndone = C.find(d => !done[d.day]);
  const currentDay = firstUndone ? firstUndone.day : 90;
  const currentPhase = PHASES.find(p => p.id === activePhase);
  const videos = VIDEO_RESOURCES[activePhase] || [];

  if (!loaded) return <div style={{padding:"2rem",color:"var(--color-text-secondary)",fontSize:14}}>Loading your progress…</div>;

  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:680,margin:"0 auto",padding:"1rem 0"}}>
      <h2 className="sr-only">n8n 90-Day Expert Learning Plan</h2>

      {/* Header */}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.5rem"}}>
          <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-secondary)"}}>n8n expert plan · 90 days</span>
          <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{total}/90 complete · Day {currentDay} active</span>
        </div>
        <div style={{height:6,background:"var(--color-background-secondary)",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:"var(--color-text-primary)",borderRadius:99,transition:"width 0.3s ease"}}/>
        </div>
        <div style={{marginTop:"0.35rem",fontSize:12,color:"var(--color-text-tertiary)"}}>{pct}% complete</div>
      </div>

      {/* Phase tabs */}
      <div style={{display:"flex",gap:6,marginBottom:"1.25rem",flexWrap:"wrap"}}>
        {PHASES.map(p => {
          const pDone = C.filter(d => d.p === p.id && done[d.day]).length;
          const pTotal = C.filter(d => d.p === p.id).length;
          const active = activePhase === p.id;
          return (
            <button key={p.id} onClick={() => { setActivePhase(p.id); setShowVideos(false); setExpanded(null); }}
              style={{padding:"6px 12px",borderRadius:"var(--border-radius-md)",border: active ? `1.5px solid ${p.hex}` : "0.5px solid var(--color-border-tertiary)",background: active ? p.bg : "transparent",color: active ? p.hex : "var(--color-text-secondary)",fontSize:12,fontWeight: active ? 600 : 400,cursor:"pointer",transition:"all 0.15s"}}>
              {p.name}
              <span style={{marginLeft:6,fontSize:10,opacity: active ? 1 : 0.6}}>{pDone}/{pTotal}</span>
            </button>
          );
        })}
      </div>

      {/* Phase header + video toggle */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:`1.5px solid ${currentPhase.hex}22`}}>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--color-text-primary)"}}>{currentPhase.name} — {currentPhase.range}</div>
          <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginTop:2}}>
            {C.filter(d=>d.p===activePhase&&done[d.day]).length} of {C.filter(d=>d.p===activePhase).length} days done
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <a href={PHASE_DOCS[activePhase]} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:500,color:currentPhase.hex,textDecoration:"none",padding:"5px 10px",border:`1px solid ${currentPhase.hex}44`,borderRadius:"var(--border-radius-md)",background:currentPhase.bg}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Docs
          </a>
          <button onClick={() => setShowVideos(v => !v)}
            style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:500,color: showVideos ? "#fff" : currentPhase.hex,padding:"5px 10px",border:`1px solid ${currentPhase.hex}`,borderRadius:"var(--border-radius-md)",background: showVideos ? currentPhase.hex : currentPhase.bg,cursor:"pointer",transition:"all 0.15s"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            {showVideos ? "Hide Videos" : "Free Videos"}
          </button>
        </div>
      </div>

      {/* Video panel */}
      {showVideos && (
        <div style={{marginBottom:"1.25rem",padding:"1rem",borderRadius:"var(--border-radius-md)",background:currentPhase.bg,border:`1px solid ${currentPhase.hex}33`}}>
          <div style={{fontSize:12,fontWeight:600,color:currentPhase.hex,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:6}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Free Video Resources — Phase {activePhase}: {currentPhase.name}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {videos.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                style={{display:"flex",flexDirection:"column",gap:2,padding:"10px 12px",borderRadius:"var(--border-radius-sm)",background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",textDecoration:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:22,height:22,borderRadius:4,flexShrink:0,background:currentPhase.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={currentPhase.hex}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.4,flex:1}}>{v.label}</span>
                  <svg style={{flexShrink:0,opacity:0.35}} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
                <span style={{fontSize:11,color:"var(--color-text-tertiary)",paddingLeft:30}}>{v.note}</span>
              </a>
            ))}
          </div>
          <div style={{marginTop:"0.75rem",fontSize:11,color:"var(--color-text-tertiary)",paddingTop:"0.6rem",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
            All links are 100% free · No signup required · Opens YouTube or official docs
          </div>
        </div>
      )}

      {/* Day list */}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {phaseDays.map(d => {
          const phase = ph(d);
          const isDone = !!done[d.day];
          const isOpen = expanded === d.day;
          const isToday = d.day === currentDay;

          return (
            <div key={d.day} style={{borderRadius:"var(--border-radius-md)",border: isToday && !isDone ? `1.5px solid ${phase.hex}` : isDone ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",overflow:"hidden",transition:"border 0.15s"}}>
              <div onClick={() => setExpanded(isOpen ? null : d.day)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",userSelect:"none"}}>
                <div onClick={(e) => toggle(d.day, e)} style={{width:20,height:20,borderRadius:4,flexShrink:0,border: isDone ? "none" : "1.5px solid var(--color-border-secondary)",background: isDone ? phase.hex : "transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s"}}>
                  {isDone && (<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                </div>
                <div style={{width:36,height:24,borderRadius:4,flexShrink:0,background: isDone ? "var(--color-background-secondary)" : isToday ? phase.bg : "var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color: isDone ? "var(--color-text-tertiary)" : isToday ? phase.hex : "var(--color-text-secondary)"}}>
                  {d.day}
                </div>
                <div style={{flex:1,fontSize:13,fontWeight: isToday && !isDone ? 500 : 400,color: isDone ? "var(--color-text-tertiary)" : "var(--color-text-primary)",textDecoration: isDone ? "line-through" : "none"}}>
                  {d.title}
                  {isToday && !isDone && (<span style={{marginLeft:8,fontSize:10,fontWeight:500,padding:"2px 6px",borderRadius:99,background: phase.bg,color: phase.hex}}>today</span>)}
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,opacity:0.4,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {isOpen && (
                <div style={{padding:"0 14px 14px 14px",borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {label:"Learn",icon:"",content:d.learn},
                    {label:"Build",icon:"",content:d.build},
                    {label:"Checkpoint",icon:"",content:d.check},
                  ].map(({label,icon,content}) => (
                    <div key={label} style={{paddingTop:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,color: label==="Checkpoint" ? phase.hex : "var(--color-text-secondary)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                        <span style={{fontSize:13}}>{icon}</span>{label}
                      </div>
                      <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.6}}>{content}</div>
                    </div>
                  ))}
                  <div style={{marginTop:4,padding:"8px 10px",borderRadius:"var(--border-radius-sm)",background:phase.bg,fontSize:11,color:phase.hex,display:"flex",alignItems:"center",gap:6}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    Free videos for this phase → tap <strong>Free Videos</strong> button above
                  </div>
                  <button onClick={(e)=>toggle(d.day,e)} style={{marginTop:4,padding:"7px 14px",border: isDone ? "0.5px solid var(--color-border-tertiary)" : `1.5px solid ${phase.hex}`,borderRadius:"var(--border-radius-md)",background: isDone ? "transparent" : phase.bg,color: isDone ? "var(--color-text-secondary)" : phase.hex,fontSize:12,fontWeight:500,cursor:"pointer",alignSelf:"flex-start",transition:"all 0.15s"}}>
                    {isDone ? "Mark incomplete" : "Mark day complete"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{marginTop:"1.5rem",padding:"0.75rem 1rem",borderRadius:"var(--border-radius-md)",background:"var(--color-background-secondary)",fontSize:12,color:"var(--color-text-tertiary)",lineHeight:1.6}}>
        Progress saves automatically. Free resources:{" "}
        <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer" style={{color:"inherit"}}>docs.n8n.io</a> ·{" "}
        <a href="https://community.n8n.io" target="_blank" rel="noopener noreferrer" style={{color:"inherit"}}>community.n8n.io</a> ·{" "}
        <a href="https://n8n.io/workflows" target="_blank" rel="noopener noreferrer" style={{color:"inherit"}}>n8n.io/workflows</a>
      </div>
    </div>
  );
}
