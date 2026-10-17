/**
 * Popup script - orchestrates the capture UI.
 */

const pageTitleEl      = document.getElementById('page-title');
const sourceBadge      = document.getElementById('source-badge');
const pageTypeHint     = document.getElementById('page-type-hint');
const tagsInput        = document.getElementById('tags');
const noteInput        = document.getElementById('note');
const saveBtn          = document.getElementById('save-btn');
const statusEl         = document.getElementById('status');
const saveLinksEl      = document.getElementById('save-links');
const settingsBtn      = document.getElementById('settings-btn');
const destinationsEl     = document.getElementById('destinations');
const destinationsListEl = document.getElementById('destinations-list');
const screenshotDrop   = document.getElementById('screenshot-drop');
const screenshotPlaceholder = document.getElementById('screenshot-placeholder');
const screenshotPreviewWrap = document.getElementById('screenshot-preview-wrap');
const screenshotPreview     = document.getElementById('screenshot-preview');
const screenshotClear       = document.getElementById('screenshot-clear');
const captureBtn            = document.getElementById('capture-btn');
const standaloneModeEl      = document.getElementById('standalone-mode');

const TYPE_LABELS = {
  'youtube':       { badge: 'YT',      hint: 'YouTube video - transcript will be extracted automatically' },
  'linkedin-post': { badge: 'LI Post', hint: 'LinkedIn post' },
  'article':       { badge: 'Article', hint: 'Article' },
  'email':         { badge: 'Email',   hint: 'Email thread' },
  'website':       { badge: 'Tool',    hint: 'Website / tool - exec summary will be generated' },
  'other':         { badge: 'Page',    hint: 'Web page' },
};

let currentTab = null;
let pageContent = null;
let availableDestinations = []; // [{ id, kind, label, owner, repo, branch }]
let screenshotDataUrl = null;

// Build the list of configured destinations from settings: every GitHub repo
// (primary + additional) plus Notion. Used to render the multi-select picker.
function getGitHubTargets(settings) {
  const targets = [];
  const seen = new Set();
  const add = (owner, repo, branch) => {
    if (!owner || !repo) return;
    const key = `${owner}/${repo}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    targets.push({ owner, repo, branch: branch || settings?.githubBranch || 'main' });
  };
  if (settings?.githubToken) {
    add(settings.githubOwner, settings.githubRepo, settings.githubBranch);
    for (const r of settings?.githubRepos || []) add(r.owner, r.repo, r.branch);
  }
  return targets;
}

function buildDestinations(settings) {
  const dests = [];
  for (const t of getGitHubTargets(settings)) {
    dests.push({ id: `gh:${t.owner}/${t.repo}`, kind: 'github', label: `${t.owner}/${t.repo}`, ...t });
  }
  if (settings?.notionToken && settings?.notionDatabaseId) {
    dests.push({ id: 'notion', kind: 'notion', label: 'Notion database' });
  }
  return dests;
}

function renderDestinations(settings) {
  availableDestinations = buildDestinations(settings);

  // Default selection: all GitHub repos ticked (the whole point of multi-repo),
  // plus Notion if it's the chosen default or the only configured destination.
  const hasGitHub = availableDestinations.some(d => d.kind === 'github');
  const notionDefault = settings?.defaultDestination === 'notion' || !hasGitHub;

  // Only show the picker when there's a real choice (more than one destination).
  if (availableDestinations.length <= 1) {
    destinationsEl.classList.add('hidden');
    return;
  }

  destinationsEl.classList.remove('hidden');
  destinationsListEl.innerHTML = '';
  for (const dest of availableDestinations) {
    const checked = dest.kind === 'github' ? true : notionDefault;
    const label = document.createElement('label');
    label.className = 'dest-option';
    label.innerHTML = `
      <input type="checkbox" value="${dest.id}" ${checked ? 'checked' : ''} />
      <span class="dest-name">${dest.label}</span>
      <span class="dest-kind" data-kind="${dest.kind}">${dest.kind}</span>`;
    destinationsListEl.appendChild(label);
  }
}

function getSelectedDestinations() {
  if (availableDestinations.length <= 1) return availableDestinations;
  const checkedIds = new Set(
    Array.from(destinationsListEl.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value)
  );
  return availableDestinations.filter(d => checkedIds.has(d.id));
}

// ── Init ─────────────────────────────────────────────────────────────────────

// ── Screenshot ───────────────────────────────────────────────────────────────

function setScreenshot(dataUrl) {
  screenshotDataUrl = dataUrl;
  screenshotPreview.src = dataUrl;
  screenshotPlaceholder.classList.add('hidden');
  screenshotPreviewWrap.classList.remove('hidden');
}

function clearScreenshot() {
  screenshotDataUrl = null;
  screenshotPreview.src = '';
  screenshotPreviewWrap.classList.add('hidden');
  screenshotPlaceholder.classList.remove('hidden');
}

// Paste anywhere in the popup
document.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (!file) continue;
      const reader = new FileReader();
      reader.onload = (ev) => setScreenshot(ev.target.result);
      reader.readAsDataURL(file);
      e.preventDefault();
      break;
    }
  }
});

// Click on the drop zone to focus (so paste works)
screenshotDrop.addEventListener('click', () => screenshotDrop.focus());

// Clear button
screenshotClear.addEventListener('click', (e) => {
  e.stopPropagation();
  clearScreenshot();
});

// Capture current tab
captureBtn.addEventListener('click', async () => {
  try {
    captureBtn.disabled = true;
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    setScreenshot(dataUrl);
  } catch (err) {
    showStatus('error', 'Capture failed: ' + (err.message || 'unknown error'));
  } finally {
    captureBtn.disabled = false;
  }
});

// Standalone mode toggle
standaloneModeEl.addEventListener('change', () => {
  const isStandalone = standaloneModeEl.checked;
  document.body.classList.toggle('standalone-active', isStandalone);
  if (isStandalone) {
    saveBtn.textContent = 'Save Screenshot';
    saveBtn.disabled = false;
  } else {
    saveBtn.textContent = 'Save to Second Brain';
    // Re-disable if page content didn't load
    if (!pageContent) saveBtn.disabled = true;
  }
});

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage().catch(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
  });
});

// Load settings + current tab in parallel
Promise.all([
  chrome.storage.local.get('settings'),
  new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab))),
]).then(async ([{ settings }, tab]) => {
  // ── Set up destination picker (multi-select: any number of repos + Notion) ──
  renderDestinations(settings);

  // ── Load tab content ──
  currentTab = tab;
  if (!tab) return showStatus('error', 'No active tab found');

  pageTitleEl.textContent = truncate(tab.title || tab.url, 60);

  try {
    // For YouTube tabs, pre-fetch ytInitialPlayerResponse and transcript from the page world
    // using executeScript (MAIN world) before asking the content script for content.
    let ytPlayerResponse = null;
    let transcript = null;
    const tabUrl = tab.url || '';
    if (tabUrl.includes('youtube.com/watch') || tabUrl.includes('youtu.be/')) {
      console.log('[Popup] YouTube tab detected, extracting ytInitialPlayerResponse and transcript');
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: async () => {
            console.log('[Popup MAIN world] Starting transcript extraction from DOM');
            const pr = window.ytInitialPlayerResponse || null;
            if (!pr) return { playerResponse: null, transcript: null };

            // Try extracting from YouTube transcript panel DOM
            try {
              // Look for transcript panel elements
              const transcriptSelectors = [
                '#transcript', // YouTube transcript panel
                'ytd-transcript-renderer',
                '#segments-container',
                '.ytd-transcript-segment-renderer',
                '[target-id="transcript"]',
              ];

              let transcriptText = '';
              for (const selector of transcriptSelectors) {
                const el = document.querySelector(selector);
                if (el) {
                  console.log('[Popup MAIN world] Found transcript element:', selector);
                  // Extract text from all segments
                  const segments = el.querySelectorAll('.ytd-transcript-segment-renderer, [class*="segment"], [class*="transcript-line"]');
                  if (segments.length > 0) {
                    transcriptText = Array.from(segments).map(s => s.textContent?.trim()).filter(Boolean).join(' ');
                    console.log('[Popup MAIN world] Extracted from segments, length:', transcriptText.length);
                    if (transcriptText.length > 50) break;
                  }
                  // Fallback: get all text content
                  transcriptText = el.textContent?.trim() || '';
                  console.log('[Popup MAIN world] Extracted from element textContent, length:', transcriptText.length);
                  if (transcriptText.length > 50) break;
                }
              }

              if (transcriptText.length > 50) {
                // Clean up the transcript (remove timestamps, etc.)
                transcriptText = transcriptText.replace(/\d+:\d+/g, '').replace(/\s+/g, ' ').trim();
                console.log('[Popup MAIN world] DOM transcript extracted, length:', transcriptText.length);
                return { playerResponse: pr, transcript: transcriptText };
              }
            } catch (e) {
              console.error('[Popup MAIN world] DOM extraction error:', e);
            }

            console.log('[Popup MAIN world] No transcript found via DOM');
            return { playerResponse: pr, transcript: null };
          },
        });
        const result = results?.[0]?.result || { playerResponse: null, transcript: null };
        ytPlayerResponse = result.playerResponse;
        transcript = result.transcript;
        console.log('[Popup] ytInitialPlayerResponse:', ytPlayerResponse ? 'found' : 'null');
        console.log('[Popup] transcript length:', transcript?.length || 0);
        if (ytPlayerResponse) {
          console.log('[Popup] Has captions?', !!ytPlayerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks);
        }
      } catch (e) {
        console.error('[Popup] executeScript error:', e);
      }
    }

    const response = await sendMessageToTab(tab.id, { action: 'GET_CONTENT', ytPlayerResponse, transcript });
    if (response && response.success) {
      pageContent = response.data;
      pageTitleEl.textContent = truncate(pageContent.title || tab.title, 60);
      const typeInfo = TYPE_LABELS[pageContent.sourceType] || TYPE_LABELS['other'];
      sourceBadge.textContent = typeInfo.badge;
      sourceBadge.dataset.type = pageContent.sourceType;
      pageTypeHint.textContent = 'Identified: ' + typeInfo.hint;
      pageTypeHint.classList.remove('hidden');
    } else {
      showStatus('error', response?.error || 'Could not read page content');
      saveBtn.disabled = true;
    }
  } catch (err) {
    if (err.message && (err.message.includes('Cannot access') || err.message.includes('chrome://'))) {
      showStatus('error', 'Cannot capture this page type');
    } else {
      showStatus('error', err.message || 'Could not connect to page');
    }
    saveBtn.disabled = true;
  }
});


// ── Save ─────────────────────────────────────────────────────────────────────

saveBtn.addEventListener('click', async () => {
  const isStandalone = standaloneModeEl.checked;

  if (!isStandalone && !pageContent) return;
  if (isStandalone && !screenshotDataUrl) {
    showStatus('error', 'Paste or capture a screenshot first');
    return;
  }

  const destinations = getSelectedDestinations();
  if (destinations.length === 0) {
    showStatus('error', 'Pick at least one destination');
    return;
  }

  saveBtn.disabled = true;
  saveLinksEl.classList.add('hidden');
  saveLinksEl.innerHTML = '';
  showStatus('info', isStandalone ? 'Saving screenshot...' : 'Extracting...');

  const tags = tagsInput.value.trim();
  const note = noteInput.value.trim();

  const renderResults = (results = []) => {
    saveLinksEl.innerHTML = '';
    for (const r of results) {
      const labelPrefix = r.label ? `${r.label}: ` : '';
      if (r.status === 'error') {
        const span = document.createElement('span');
        span.className = 'save-link is-error';
        span.textContent = `${labelPrefix}${r.error || 'failed'}`;
        saveLinksEl.appendChild(span);
      } else if (r.url) {
        const a = document.createElement('a');
        a.className = 'save-link';
        a.href = r.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const verb = r.status === 'duplicate' ? 'Already saved' : (r.kind === 'notion' ? 'Open in Notion' : 'View on GitHub');
        a.textContent = `${labelPrefix}${verb} →`;
        saveLinksEl.appendChild(a);
      }
    }
    if (saveLinksEl.children.length > 0) saveLinksEl.classList.remove('hidden');
  };

  const listener = (message) => {
    if (message.action !== 'STATUS_UPDATE') return;

    switch (message.status) {
      case 'processing':
        showStatus('info', message.message || 'Processing with Claude...');
        break;
      case 'committing':
        showStatus('info', message.message || 'Saving...');
        break;
      case 'success':
        showStatus('success', message.message || 'Saved!');
        saveBtn.disabled = false;
        renderResults(message.results);
        chrome.runtime.onMessage.removeListener(listener);
        break;
      case 'error':
        showStatus('error', message.message || 'Something went wrong');
        saveBtn.disabled = false;
        renderResults(message.results);
        chrome.runtime.onMessage.removeListener(listener);
        break;
    }
  };

  chrome.runtime.onMessage.addListener(listener);

  if (isStandalone) {
    chrome.runtime.sendMessage({
      action: 'SAVE_SCREENSHOT',
      screenshotDataUrl,
      tabUrl:   currentTab?.url   || '',
      tabTitle: currentTab?.title || 'Untitled',
      tags,
      note,
      destinations,
    });
  } else {
    chrome.runtime.sendMessage({
      action: 'SAVE_PAGE',
      payload: { ...pageContent, screenshotDataUrl },
      tags,
      note,
      destinations,
      popupTabId: currentTab?.id,
    });
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function showStatus(type, message) {
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
}

function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

async function sendMessageToTab(tabId, message) {
  try {
    return await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  } catch (err) {
    // Content script not yet running (tab was open before extension install/reload).
    // Inject it programmatically and retry once.
    if (err.message && err.message.includes('Receiving end does not exist')) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['lib/readability.js', 'content/content_script.js'],
      });
      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }
    throw err;
  }
}
