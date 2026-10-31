# Page-saving extension

A Chrome extension that saves a web page or a podcast transcript from YouTube as an AI-written note in your second brain.

<details>
<summary><b>Why I built it:</b> Links I sent to my own WhatsApp inbox got read once and never found again, so I built a one-click path into my second brain.</summary>

- It detects the page type and pulls transcripts from YouTube, which covers the podcasts I follow.
- It writes an AI summary note and files it in a GitHub repo or a Notion database.
- Only the pages I pick get saved, so the second brain holds the significant ones.

</details>

It saves with one click to one or more GitHub second brains, a Notion database or both, in every destination you tick. It identifies the page type and extracts the content, including YouTube transcripts.

---

## Setup (15 to 20 minutes)

### Install the extension

1. Get the repo if you do not have it yet: `git clone https://github.com/DanielErCohen/how-i-work.git`
2. In Chrome open `chrome://extensions` and switch on **Developer mode** (top right)
3. Click **Load unpacked** and choose the folder `how-i-work/small-builds/page-saving-extension`
4. Pin the extension from the puzzle-piece menu so the icon stays visible

### 1. Create a Notion database (if using Notion)

1. Open Notion and create a new database called "Saved Articles"
2. Download the `notion-db-template.csv` file from this folder
3. In your Notion database, click **⋮** (three dots) → **Import** → **CSV**
4. Select the `notion-db-template.csv` file
5. After import, delete the example row
6. Copy the database ID from your URL:
   - Open the database
   - Look at the URL: `https://www.notion.so/<name>/<DATABASE-ID>?v=...`
   - Copy the long string (32 characters) - that's your database ID

### 2. Create a Notion integration (if using Notion)

1. Go to https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Name it "Second Brain" (or anything you like)
4. Copy the **Integration Token** (starts with `ntn_`; older tokens start with `secret_`)
5. Go back to your "Saved Articles" database in Notion
6. Click **⋮** → **Connections** → **Add connection**
7. Find your integration and click to add it

### 3. Get your GitHub details (if using GitHub)

1. Create a **private** repo for your captures. Captures can include email threads, so use a private repo.
2. Go to https://github.com/settings/personal-access-tokens/new to create a fine-grained token
3. Give it a name like "Second Brain Extension"
4. Under **Repository access**, choose **Only select repositories** and pick that one repo
5. Under **Repository permissions**, set **Contents** to **Read and write**
6. Copy the token (a long random string)
7. You'll also need your GitHub username and repository name

> **Saving to more than one repo?** Scope the token to just the repos you list (a fine-grained token can cover several). Fill in your main repo in the **Repository Name** field, then add the others under **Additional repositories** (one `owner/repo` per line). Each capture is saved to all of them at once.

### 4. Get an API key for an AI model

Pick any provider; the extension talks to it directly with your key.

| Provider | Where to get a key | Default model |
|---|---|---|
| Anthropic (Claude) | console.anthropic.com → API keys | `claude-sonnet-5-5` |
| DeepSeek | platform.deepseek.com | `deepseek-flash` |
| OpenCode Go | opencode.ai (subscription) | `deepseek-v4-flash` |
| OpenCode Zen | opencode.ai/zen (balance) | set the model yourself |
| OpenRouter | openrouter.ai/keys | `deepseek/deepseek-v4-flash` |
| OpenAI | platform.openai.com/api-keys | set the model yourself |
| Custom | any OpenAI-compatible endpoint, including local Ollama | set URL and model yourself |

Model IDs change often. Treat the default as a starting point and use **Test model** in Settings to confirm it works. Chrome asks once for permission to reach the provider's host when you save or test.

### 5. Add everything to extension settings

1. Click the extension icon in your browser
2. Click **Settings** in the popup
3. Fill in:
   - **AI model**: provider, API key, and model (from step 4). Base URL and API format fill in from the provider; edit them for a custom endpoint
   - **GitHub token, owner, repo** (from step 3) - and optionally more repos under **Additional repositories**
   - **Notion token, database ID** (from steps 1 and 2) - optional
4. When more than one destination is configured, the popup shows a checklist so you can pick exactly which repos (and Notion) each capture goes to. The **Default Destination** setting controls what's pre-ticked.

---

## Using the extension

### Supported page types

The extension auto-detects the page type and shows it in the popup:

| Badge | Type | What happens |
|---|---|---|
| **Article** | Blog post / article | AI-generated structured note with summary + key insights |
| **LI Post** | LinkedIn post | Same as article |
| **Email** | Gmail / Outlook thread | Same as article |
| **YT** | YouTube video | Transcript auto-extracted, AI summary from PM perspective |
| **Tool** | Tool / product website | AI exec summary: what it does, AI PM relevance, key features |

### Saving a page

1. Open any article, YouTube video, tool website, or LinkedIn post
2. Click the extension icon
3. The popup shows the detected type (e.g. "Identified: YouTube video - transcript will be extracted automatically")
4. (Optional) Add tags or a personal note
5. If more than one destination is configured, tick every repo (and/or Notion) you want this saved to
6. Click **Save to Second Brain**

### What happens next

- The extension reads the page content (and extracts transcript for YouTube)
- The AI model analyzes it **once**, picks a category, and applies a type-appropriate template
- The same note is saved to every destination you ticked (each repo gets its own copy, including the screenshot)
- You get a link per destination - and if one fails, the others still succeed

### GitHub

Files go to `00-inbox/` in each repo, with the category in the note's frontmatter. Run `/capture` in your second brain to file them.

| Type | Filename prefix | Example |
|---|---|---|
| Article / LinkedIn / Email | *(none)* | `2026-05-13_how-llms-learn.md` |
| YouTube video | `yt_` | `yt_2026-05-13_video-title.md` |
| Website / Tool | `tool_` | `tool_2026-05-13_linear-project-mgmt.md` |

### Notion

Pages appear in your "Saved Articles" database with:
- Title
- Category
- Source URL
- Date saved
- Tags
- Source type (article, LinkedIn, email, etc.)
- Your personal notes

---

## Troubleshooting

**"Invalid token"** - Make sure you copied the full token without extra spaces.

**"Database not found"** - Check that your integration is connected to the database:
- Open the database in Notion
- Click **⋮** → **Connections**
- Your integration should be listed. If not, click **Add connection** to add it.

**"Error 401/403 from the model"** - Wrong key for the selected provider, or the provider is not the one the key belongs to.

**"Error 404 / model not found"** - The model ID is wrong for that provider. Check the provider's model list and use **Test model**.

**"Cannot capture this page"** - Some pages (Chrome pages, PDFs in browser) can't be read. Works best on regular articles.

---

## Privacy

- Your API keys and tokens are stored in `chrome.storage.local`, in plain text, in your browser profile. No server holds them.
- The extension only sends your page content to the AI provider you chose and your chosen destinations
- No data is saved anywhere else
