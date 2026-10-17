/**
 * Options page - save/load settings in chrome.storage.local.
 */

console.log('[Second Brain Options] Loading options page');

const FIELDS = ['llmApiKey', 'llmModel', 'llmBaseUrl', 'llmFormat', 'githubToken', 'githubOwner', 'githubRepo', 'githubBranch', 'notionToken', 'notionDatabaseId'];

// Parse the "Additional repositories" textarea into [{owner, repo, branch}].
// Accepts lines like "owner/repo" or "owner/repo@branch". Blank lines ignored.
function parseReposText(text) {
  return (text || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [path, branch] = line.split('@').map(s => s.trim());
      const [owner, repo] = path.split('/').map(s => s.trim());
      if (!owner || !repo) return null;
      return branch ? { owner, repo, branch } : { owner, repo };
    })
    .filter(Boolean);
}

function reposToText(repos) {
  return (repos || [])
    .map(r => (r.branch ? `${r.owner}/${r.repo}@${r.branch}` : `${r.owner}/${r.repo}`))
    .join('\n');
}

// ── AI provider fields ───────────────────────────────────────────────────────

const providerEl = document.getElementById('llmProvider');
for (const [id, p] of Object.entries(LLM_PROVIDERS)) {
  providerEl.add(new Option(p.label, id));
}

// Fill base URL / format / model from the preset. `keepModel` preserves a typed
// model when only reloading saved settings.
function applyProviderPreset(provider, { keepValues = false } = {}) {
  const preset = LLM_PROVIDERS[provider];
  if (!keepValues) {
    document.getElementById('llmBaseUrl').value = preset.baseUrl;
    document.getElementById('llmFormat').value = preset.format;
    document.getElementById('llmModel').value = preset.model;
  }
  document.getElementById('llmApiKey').placeholder = preset.keyHint;
  document.getElementById('llmKeyHelp').textContent = {
    anthropic: 'Get yours at console.anthropic.com',
    deepseek: 'Get yours at platform.deepseek.com',
    'opencode-go': 'From your OpenCode Go subscription at opencode.ai',
    'opencode-zen': 'From opencode.ai/zen (pay-as-you-go balance)',
    openrouter: 'Get yours at openrouter.ai/keys',
    openai: 'Get yours at platform.openai.com/api-keys',
    custom: 'The key for your OpenAI-compatible endpoint (any value for a local server without auth)',
  }[provider] || '';
}

providerEl.addEventListener('change', () => applyProviderPreset(providerEl.value));

// Ask Chrome for access to the API host. Must run inside a user gesture (click / submit).
async function ensureLLMHostAccess(baseUrl) {
  const pattern = llmOriginPattern(baseUrl);
  if (!pattern) throw new Error('API base URL is not a valid URL');
  if (pattern === 'https://api.anthropic.com/*') return;
  const has = await chrome.permissions.contains({ origins: [pattern] });
  if (has) return;
  const granted = await chrome.permissions.request({ origins: [pattern] });
  if (!granted) throw new Error(`Access to ${pattern.replace('/*', '')} was not granted`);
}

function currentLLMSettings() {
  return {
    llmProvider: providerEl.value,
    llmApiKey:   document.getElementById('llmApiKey').value.trim(),
    llmModel:    document.getElementById('llmModel').value.trim(),
    llmBaseUrl:  document.getElementById('llmBaseUrl').value.trim().replace(/\/+$/, ''),
    llmFormat:   document.getElementById('llmFormat').value,
  };
}

// ── Load settings on open ────────────────────────────────────────────────────

async function loadSettings() {
  console.log('[Second Brain Options] loadSettings called');
  const { settings } = await chrome.storage.local.get('settings');
  if (!settings) { applyProviderPreset(providerEl.value); return; }

  // Settings saved before provider support only hold anthropicApiKey.
  const cfg = getLLMConfig(settings);
  providerEl.value = cfg.provider;
  applyProviderPreset(cfg.provider);
  document.getElementById('llmApiKey').value = cfg.apiKey;
  document.getElementById('llmModel').value = cfg.model;
  document.getElementById('llmBaseUrl').value = cfg.baseUrl;
  document.getElementById('llmFormat').value = cfg.format;

  for (const key of FIELDS.filter(k => !k.startsWith('llm'))) {
    const el = document.getElementById(key);
    if (el && settings[key] != null) {
      el.value = Array.isArray(settings[key]) ? settings[key].join(', ') : settings[key];
    }
  }

  if (Array.isArray(settings.githubRepos)) {
    document.getElementById('githubRepos').value = reposToText(settings.githubRepos);
  }

  if (settings.defaultDestination) {
    const radio = document.querySelector(`input[name="defaultDestination"][value="${settings.defaultDestination}"]`);
    if (radio) radio.checked = true;
  }

  updateDefaultDestinationVisibility();
}

loadSettings();

// ── Show/hide default destination section ─────────────────────────────────────

function updateDefaultDestinationVisibility() {
  const githubFilled = document.getElementById('githubToken').value.trim()
    && document.getElementById('githubOwner').value.trim()
    && document.getElementById('githubRepo').value.trim();
  const notionFilled = document.getElementById('notionToken').value.trim()
    && document.getElementById('notionDatabaseId').value.trim();

  document.getElementById('default-destination-section').style.display =
    (githubFilled && notionFilled) ? 'block' : 'none';
}

['githubToken', 'githubOwner', 'githubRepo', 'notionToken', 'notionDatabaseId'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateDefaultDestinationVisibility);
});

// ── Save ─────────────────────────────────────────────────────────────────────

document.getElementById('settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const statusEl = document.getElementById('save-status');
  const llm = currentLLMSettings();

  // Permission prompt first: it needs the submit gesture, which later awaits would lose.
  try {
    if (llm.llmApiKey) await ensureLLMHostAccess(llm.llmBaseUrl);
  } catch (err) {
    statusEl.style.color = '#dc2626';
    statusEl.textContent = err.message;
    return;
  }
  statusEl.style.color = '';

  const settings = {
    ...llm,
    githubToken:        document.getElementById('githubToken').value.trim(),
    githubOwner:        document.getElementById('githubOwner').value.trim(),
    githubRepo:         document.getElementById('githubRepo').value.trim(),
    githubBranch:       document.getElementById('githubBranch').value.trim() || 'main',
    githubRepos:        parseReposText(document.getElementById('githubRepos').value),
    notionToken:        document.getElementById('notionToken').value.trim(),
    notionDatabaseId:   document.getElementById('notionDatabaseId').value.trim(),
    defaultDestination: document.querySelector('input[name="defaultDestination"]:checked')?.value || 'github',
  };

  await chrome.storage.local.set({ settings });

  statusEl.textContent = 'Saved!';
  setTimeout(() => { statusEl.textContent = ''; }, 2000);
});

// ── Test AI model ─────────────────────────────────────────────────────────────

document.getElementById('test-llm-btn').addEventListener('click', async () => {
  const resultEl = document.getElementById('test-llm-result');
  resultEl.textContent = 'Testing...';
  resultEl.className = '';
  try {
    const llm = currentLLMSettings();
    if (!llm.llmApiKey) throw new Error('Enter your API key first');
    await ensureLLMHostAccess(llm.llmBaseUrl);
    const reply = await callLLM(llm, 'Reply with the single word: ok', 'ping', 512);
    resultEl.textContent = `Connected: ${llm.llmModel} replied "${reply.slice(0, 40)}"`;
    resultEl.className = 'test-ok';
  } catch (err) {
    resultEl.textContent = err.message || 'Network error';
    resultEl.className = 'test-error';
  }
});

// ── Test GitHub connection ────────────────────────────────────────────────────

document.getElementById('test-btn').addEventListener('click', async () => {
  const resultEl = document.getElementById('test-result');
  resultEl.textContent = 'Testing...';
  resultEl.className = '';

  const token = document.getElementById('githubToken').value.trim();
  const owner = document.getElementById('githubOwner').value.trim();
  const repo  = document.getElementById('githubRepo').value.trim();

  if (!token || !owner || !repo) {
    resultEl.textContent = 'Fill in GitHub token, owner, and repo first';
    resultEl.className = 'test-error';
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      resultEl.textContent = `Connected to ${data.full_name}`;
      resultEl.className = 'test-ok';
    } else if (response.status === 401) {
      resultEl.textContent = 'Invalid token (401)';
      resultEl.className = 'test-error';
    } else if (response.status === 404) {
      resultEl.textContent = 'Repo not found (check owner/repo)';
      resultEl.className = 'test-error';
    } else {
      resultEl.textContent = `GitHub error ${response.status}`;
      resultEl.className = 'test-error';
    }
  } catch (err) {
    resultEl.textContent = err.message || 'Network error';
    resultEl.className = 'test-error';
  }
});

// ── Test Notion connection ────────────────────────────────────────────────────

document.getElementById('test-notion-btn').addEventListener('click', async () => {
  const resultEl = document.getElementById('test-notion-result');
  resultEl.textContent = 'Testing...';
  resultEl.className = '';

  const token = document.getElementById('notionToken').value.trim();
  const dbId  = document.getElementById('notionDatabaseId').value.trim();

  if (!token) {
    resultEl.textContent = 'Enter your Notion integration token first';
    resultEl.className = 'test-error';
    return;
  }

  try {
    // Verify token by fetching the integration user
    const userResp = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!userResp.ok) {
      resultEl.textContent = userResp.status === 401 ? 'Invalid token' : `Notion error ${userResp.status}`;
      resultEl.className = 'test-error';
      return;
    }

    const user = await userResp.json();
    const name = user.name || user.bot?.owner?.user?.name || 'integration';

    // If database ID provided, verify it's accessible
    if (dbId) {
      const dbResp = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (!dbResp.ok) {
        if (dbResp.status === 404) {
          resultEl.textContent = `Token OK (${name}) - but database not found. Share the database with your integration.`;
          resultEl.className = 'test-error';
        } else {
          resultEl.textContent = `Token OK - database error ${dbResp.status}`;
          resultEl.className = 'test-error';
        }
        return;
      }

      const db = await dbResp.json();
      const dbName = db.title?.[0]?.plain_text || 'database';
      resultEl.textContent = `Connected as ${name} · database: ${dbName}`;
      resultEl.className = 'test-ok';
    } else {
      resultEl.textContent = `Connected as ${name} (enter database ID to verify)`;
      resultEl.className = 'test-ok';
    }

  } catch (err) {
    resultEl.textContent = err.message || 'Network error';
    resultEl.className = 'test-error';
  }
});
