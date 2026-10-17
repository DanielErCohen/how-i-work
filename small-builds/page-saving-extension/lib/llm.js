/**
 * LLM provider layer, shared by the service worker (importScripts) and the
 * options page (<script>). Two wire formats cover every provider:
 *   - 'anthropic': POST {baseUrl}/v1/messages (Anthropic and Anthropic-compatible hosts)
 *   - 'openai':    POST {baseUrl}/chat/completions (DeepSeek, OpenCode, OpenRouter, OpenAI, Ollama, ...)
 */

const LLM_PROVIDERS = {
  anthropic:     { label: 'Anthropic (Claude)',      format: 'anthropic', baseUrl: 'https://api.anthropic.com',      model: 'claude-sonnet-5-5',  keyHint: 'Anthropic API key' },
  deepseek:      { label: 'DeepSeek',                format: 'openai',    baseUrl: 'https://api.deepseek.com',       model: 'deepseek-flash',     keyHint: 'API key' },
  'opencode-go': { label: 'OpenCode Go',             format: 'openai',    baseUrl: 'https://opencode.ai/zen/go/v1',  model: 'deepseek-v4-flash',  keyHint: 'OpenCode Go key' },
  'opencode-zen':{ label: 'OpenCode Zen',            format: 'openai',    baseUrl: 'https://opencode.ai/zen/v1',     model: '',                   keyHint: 'OpenCode Zen key' },
  openrouter:    { label: 'OpenRouter',              format: 'openai',    baseUrl: 'https://openrouter.ai/api/v1',   model: 'deepseek/deepseek-v4-flash', keyHint: 'OpenRouter API key' },
  openai:        { label: 'OpenAI',                  format: 'openai',    baseUrl: 'https://api.openai.com/v1',      model: '',                   keyHint: 'API key' },
  custom:        { label: 'Custom (OpenAI-compatible)', format: 'openai', baseUrl: '',                               model: '',                   keyHint: 'API key' },
};

// Resolve the effective LLM config from stored settings. Settings saved before
// provider support only have `anthropicApiKey`, which maps to the Anthropic preset.
function getLLMConfig(settings) {
  const s = settings || {};
  const provider = LLM_PROVIDERS[s.llmProvider] ? s.llmProvider : 'anthropic';
  const preset = LLM_PROVIDERS[provider];
  return {
    provider,
    apiKey:  (s.llmApiKey || s.anthropicApiKey || '').trim(),
    baseUrl: ((s.llmBaseUrl || preset.baseUrl) || '').trim().replace(/\/+$/, ''),
    format:  s.llmFormat || preset.format,
    model:   (s.llmModel || preset.model || '').trim(),
  };
}

// "https://api.deepseek.com/v1" -> "https://api.deepseek.com/*" (for chrome.permissions).
function llmOriginPattern(baseUrl) {
  try { return `${new URL(baseUrl).origin}/*`; } catch (_e) { return null; }
}

function llmEndpoint(cfg) {
  if (cfg.format === 'anthropic') {
    return /\/v1$/.test(cfg.baseUrl) ? `${cfg.baseUrl}/messages` : `${cfg.baseUrl}/v1/messages`;
  }
  return `${cfg.baseUrl}/chat/completions`;
}

// Non-Claude models like to wrap their answer in a code fence or emit <think> blocks.
function cleanLLMOutput(text) {
  return (text || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim()
    .replace(/^```(?:markdown|md)?\s*\n/i, '')
    .replace(/\n```\s*$/, '')
    .trim();
}

async function callLLM(settings, systemPrompt, userPrompt, maxTokens = 1024) {
  const cfg = getLLMConfig(settings);
  const name = LLM_PROVIDERS[cfg.provider].label;
  if (!cfg.apiKey)  throw new Error(`Add your ${name} API key in Settings`);
  if (!cfg.baseUrl) throw new Error('Add the API base URL in Settings');
  if (!cfg.model)   throw new Error('Add a model name in Settings');

  let headers, body;
  if (cfg.format === 'anthropic') {
    headers = {
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    };
    body = { model: cfg.model, max_tokens: maxTokens, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] };
  } else {
    headers = { Authorization: `Bearer ${cfg.apiKey}`, 'content-type': 'application/json' };
    body = {
      model: cfg.model,
      // OpenAI's newer models reject max_tokens; everyone else still expects it.
      [cfg.baseUrl.includes('api.openai.com') ? 'max_completion_tokens' : 'max_tokens']: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    };
  }

  const response = await fetch(llmEndpoint(cfg), { method: 'POST', headers, body: JSON.stringify(body) });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${name} error ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  let text;
  if (cfg.format === 'anthropic') {
    text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  } else {
    const content = data.choices?.[0]?.message?.content;
    text = Array.isArray(content) ? content.map(p => p.text || '').join('') : (content || '');
  }
  text = cleanLLMOutput(text);
  if (!text) throw new Error(`${name} returned an empty response (model "${cfg.model}")`);
  return text;
}
