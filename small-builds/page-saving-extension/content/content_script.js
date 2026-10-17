/**
 * Content script - injected into every page at document_idle.
 * Responds to GET_CONTENT messages from the popup/service worker.
 *
 * Page types detected:
 *   linkedin-post - LinkedIn posts/feed
 *   article       - readable long-form content (Readability succeeds)
 *   email         - Gmail / Outlook threads
 *   youtube       - YouTube watch pages (also extracts transcript)
 *   website       - everything else (tools, homepages, etc.)
 */

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'GET_CONTENT') return false;

  console.log('[Content Script] GET_CONTENT received, ytPlayerResponse:', message.ytPlayerResponse ? 'provided' : 'null', 'transcript:', message.transcript?.length || 0);

  // YouTube transcript fetch is async, so we always return true
  extractContent(message.ytPlayerResponse || null, message.transcript || null).then(result => {
    console.log('[Content Script] extractContent result, transcript length:', result.transcript?.length || 0);
    sendResponse({ success: true, data: result });
  }).catch(err => {
    console.error('[Content Script] extractContent error:', err);
    sendResponse({ success: false, error: err.message });
  });

  return true; // keep message channel open for async response
});

async function extractContent(ytPlayerResponse, prefetchedTranscript) {
  const url = window.location.href;
  const title = document.title || '';

  // Detect source type before extraction
  const sourceType = detectSourceType(url);

  let bodyText = null;
  let transcript = null;
  let videoId = null;

  if (sourceType === 'youtube') {
    // For YouTube: extract video ID and transcript from ytInitialPlayerResponse
    videoId = extractYouTubeVideoId(url);
    // Use pre-fetched transcript from popup (which used executeScript MAIN world)
    // or fall back to extracting description from playerResponse
    if (prefetchedTranscript) {
      transcript = prefetchedTranscript;
      bodyText = ytPlayerResponse?.videoDetails?.shortDescription || '';
    } else {
      const ytData = await extractYouTubeData(ytPlayerResponse);
      transcript = ytData.transcript;
      bodyText = ytData.description || '';
    }
  } else {
    // Try Readability first on a document clone
    try {
      const docClone = document.cloneNode(true);
      const reader = new Readability(docClone);
      const article = reader.parse();
      if (article && article.textContent && article.textContent.trim().length > 100) {
        bodyText = article.textContent.trim();
      }
    } catch (_e) {
      // Readability failed - fall through to innerText
    }

    // Fallback to innerText
    if (!bodyText) {
      bodyText = document.body ? document.body.innerText : '';
    }
  }

  // Truncate bodyText to 8000 characters
  if (bodyText && bodyText.length > 8000) {
    bodyText = bodyText.slice(0, 8000) + '\n\n[Content truncated - original was longer]';
  }

  return { url, title, bodyText, sourceType, transcript, videoId };
}

function detectSourceType(url) {
  // YouTube watch pages
  if (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/')
  ) return 'youtube';

  // LinkedIn posts/feed
  if (
    url.includes('linkedin.com/posts/') ||
    url.includes('linkedin.com/feed/') ||
    url.includes('linkedin.com/pulse/')
  ) return 'linkedin-post';

  // LinkedIn profile/company - treat as website
  if (url.includes('linkedin.com')) return 'website';

  // Email clients
  if (
    url.includes('mail.google.com') ||
    url.includes('outlook.live.com') ||
    url.includes('outlook.office.com')
  ) return 'email';

  // Check if Readability finds a readable article
  try {
    const docClone = document.cloneNode(true);
    const reader = new Readability(docClone);
    const article = reader.parse();
    if (article && article.textContent && article.textContent.trim().length > 100) {
      return 'article';
    }
  } catch (_e) {
    // ignore
  }

  // Fallback: tool/product website
  return 'website';
}

// ── YouTube helpers ───────────────────────────────────────────────────────────

function extractYouTubeVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v') || null;
  } catch (_e) {
    return null;
  }
}

async function extractYouTubeData(playerResponse) {
  // playerResponse is passed in from the popup via chrome.scripting.executeScript
  // (MAIN world), which is the only CSP-safe way to read ytInitialPlayerResponse.

  console.log('[Content Script] extractYouTubeData called, playerResponse:', !!playerResponse);

  if (!playerResponse) {
    console.log('[Content Script] No playerResponse, returning null transcript');
    return { transcript: null, description: '' };
  }

  // Extract description
  const description = playerResponse?.videoDetails?.shortDescription || '';
  console.log('[Content Script] Description length:', description.length);

  // Extract caption track URL
  let captionBaseUrl = null;
  try {
    const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    console.log('[Content Script] Caption tracks found:', tracks?.length || 0);
    if (tracks && tracks.length > 0) {
      // Prefer English, fall back to first available
      const enTrack = tracks.find(t => t.languageCode === 'en' || t.languageCode === 'en-US');
      const track = enTrack || tracks[0];
      captionBaseUrl = track.baseUrl;
      console.log('[Content Script] Caption baseUrl found:', !!captionBaseUrl);
    }
  } catch (_e) {
    console.error('[Content Script] Error extracting caption baseUrl:', _e);
  }

  if (!captionBaseUrl) {
    return { transcript: null, description };
  }

  // Fetch captions from the PAGE world (has the right cookies/session context)
  // YouTube rejects caption URL requests from the content script due to signature validation.
  // We inject a script into the page world to fetch using the page's fetch, then pass back via CustomEvent.
  console.log('[Content Script] Fetching captions from page world via injected script');
  const transcript = await new Promise((resolve) => {
    const eventName = '__sb_yt_captions_' + Date.now();

    const onCaptions = (e) => {
      document.removeEventListener(eventName, onCaptions);
      try { resolve(e.detail); } catch (_) { resolve(null); }
    };
    document.addEventListener(eventName, onCaptions);

    const script = document.createElement('script');
    script.textContent = `(function(){
      var baseUrl = ${JSON.stringify(captionBaseUrl)};
      fetch(baseUrl + '&fmt=json3')
        .then(function(r) { return r.text(); })
        .then(function(text) {
          document.dispatchEvent(new CustomEvent(${JSON.stringify(eventName)}, {
            detail: JSON.stringify({ type: 'json3', text: text })
          }));
        })
        .catch(function() {
          // json3 failed, try XML
          fetch(baseUrl)
            .then(function(r) { return r.text(); })
            .then(function(text) {
              document.dispatchEvent(new CustomEvent(${JSON.stringify(eventName)}, {
                detail: JSON.stringify({ type: 'xml', text: text })
              }));
            })
            .catch(function() {
              document.dispatchEvent(new CustomEvent(${JSON.stringify(eventName)}, {
                detail: JSON.stringify({ type: 'error', text: '' })
              }));
            });
        });
    })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    setTimeout(() => { document.removeEventListener(eventName, onCaptions); resolve(null); }, 5000);
  });

  if (!transcript || !transcript.text) {
    console.log('[Content Script] Page-world fetch returned null or empty');
    return { transcript: null, description };
  }

  console.log('[Content Script] Page-world fetch succeeded, type:', transcript.type, 'length:', transcript.text.length);

  // Parse the response based on type
  let lines = [];
  if (transcript.type === 'json3') {
    try {
      const data = JSON.parse(transcript.text);
      for (const event of (data.events || [])) {
        if (!event.segs) continue;
        const text = event.segs.map(s => s.utf8 || '').join('').trim();
        if (text && text !== '\n') lines.push(text);
      }
    } catch (e) {
      console.error('[Content Script] Failed to parse json3:', e);
    }
  } else if (transcript.type === 'xml') {
    const textNodes = transcript.text.match(/<text[^>]*>([^<]*)<\/text>/g) || [];
    lines = textNodes.map(node => {
      return node.replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
        .trim();
    }).filter(Boolean);
  }

  let result = lines.join(' ').replace(/\s+/g, ' ').trim();
  console.log('[Content Script] Transcript extracted, length:', result.length);
  if (result.length > 12000) {
    result = result.slice(0, 12000) + '\n\n[Transcript truncated]';
  }
  return { transcript: result, description };
}
