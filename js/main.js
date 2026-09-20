(function () {
  const PROMPTS = [
    {
      q: 'Write a Python async web scraper with rate limiting and retry logic',
      a: `Here's a production-ready async scraper with rate limiting, exponential backoff, and proper error handling:

<pre><code>import asyncio
import aiohttp
from aiohttp import ClientTimeout
from dataclasses import dataclass
from typing import Optional
import random

@dataclass
class ScraperConfig:
    max_concurrent: int = 5
    requests_per_second: float = 2.0
    max_retries: int = 3
    timeout: int = 30

class AsyncScraper:
    def __init__(self, config: ScraperConfig):
        self.config = config
        self.semaphore = asyncio.Semaphore(config.max_concurrent)
        self._last_request = 0.0

    async def _rate_limit(self):
        min_interval = 1.0 / self.config.requests_per_second
        now = asyncio.get_event_loop().time()
        wait = min_interval - (now - self._last_request)
        if wait > 0:
            await asyncio.sleep(wait)
        self._last_request = asyncio.get_event_loop().time()

    async def fetch(self, session, url: str) -> Optional[str]:
        async with self.semaphore:
            for attempt in range(self.config.max_retries):
                await self._rate_limit()
                try:
                    async with session.get(url, timeout=ClientTimeout(total=self.config.timeout)) as resp:
                        resp.raise_for_status()
                        return await resp.text()
                except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                    delay = (2 ** attempt) + random.uniform(0, 1)
                    if attempt == self.config.max_retries - 1:
                        print(f"Failed {url}: {e}")
                        return None
                    await asyncio.sleep(delay)
        return None

async def main():
    urls = ["https://example.com/page1", "https://example.com/page2"]
    config = ScraperConfig(max_concurrent=5, requests_per_second=2.0)
    scraper = AsyncScraper(config)
    async with aiohttp.ClientSession() as session:
        tasks = [scraper.fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    print(f"Fetched {sum(1 for r in results if r)} / {len(urls)} pages")

asyncio.run(main())</code></pre>

Key design choices:
• <code>Semaphore</code> caps concurrent connections
• Token-bucket style rate limiting prevents IP bans
• Exponential backoff with jitter on transient failures
• Typed config dataclass for easy tuning`
    },
    {
      q: 'Explain quantum entanglement like I am 15',
      a: `Imagine you have two magic coins. You split them apart — one goes to Tokyo, one stays with you.

When you flip yours and get **heads**, the coin in Tokyo *instantly* shows tails. Always the opposite. Every time.

That's weird because:
1. The coins didn't "agree" beforehand on who would be heads
2. Nothing traveled between them — no signal, no WiFi
3. This works even if Tokyo is on the other side of the planet

<strong>What actually happens:</strong>
Before you look, both coins exist in a fuzzy state — not heads, not tails, but *both possibilities at once*. Physicists call this a **superposition**.

When you observe your coin, the fuzzy state "collapses" into one definite outcome. The other coin must become the opposite — not because it got a message, but because they were always one connected system.

<strong>Important nuance:</strong> You can't use this to send messages faster than light. You can't choose what your coin shows — nature picks randomly. But the correlation is real and has been tested thousands of times.

Einstein called it "spooky action at a distance." Modern physics calls it one of the most verified phenomena in science.`
    },
    {
      q: 'Build a React dashboard component with dark mode toggle',
      a: `Full dashboard shell with theme persistence:

<pre><code>import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    &lt;ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

export function Dashboard() {
  const { dark, toggle } = useContext(ThemeContext);
  const stats = [
    { label: 'Active Users', value: '12,847', change: '+12%' },
    { label: 'Revenue', value: '$48.2k', change: '+8%' },
    { label: 'API Calls', value: '2.1M', change: '+24%' },
  ];

  return (
    &lt;div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100"&gt;
      &lt;header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800"&gt;
        &lt;h1 className="text-xl font-bold"&gt;Analytics&lt;/h1&gt;
        &lt;button onClick={toggle} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"&gt;
          {dark ? '☀️ Light' : '🌙 Dark'}
        &lt;/button&gt;
      &lt;/header&gt;
      &lt;main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"&gt;
        {stats.map(s => (
          &lt;div key={s.label} className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800"&gt;
            &lt;p className="text-sm text-gray-500"&gt;{s.label}&lt;/p&gt;
            &lt;p className="text-3xl font-bold mt-1"&gt;{s.value}&lt;/p&gt;
            &lt;span className="text-green-500 text-sm"&gt;{s.change}&lt;/span&gt;
          &lt;/div&gt;
        ))}
      &lt;/main&gt;
    &lt;/div&gt;
  );
}</code></pre>

Uses React Context for theme state, respects system preference on first visit, persists to localStorage. Tailwind <code>dark:</code> variants handle styling.`
    },
    {
      q: 'What are the best strategies for learning a new programming language fast?',
      a: `Based on cognitive science and what works for senior engineers switching stacks:

<strong>1. Project-first, not tutorial-first (week 1)</strong>
Pick one small but *complete* project in the new language — a CLI tool, API, or script you'd actually use. Tutorials give illusion of competence; shipping gives real skill.

<strong>2. Translate, don't memorize (week 1–2)</strong>
Take code you wrote in your best language and rewrite it. Same logic, new syntax. Your brain maps concepts you already know to new keywords.

<strong>3. Read idiomatic code (week 2)</strong>
Find the language's top open-source repo (for Rust: ripgrep, for Go: Docker). Read *how* they structure things — error handling, naming, module layout. Style matters as much as syntax.

<strong>4. Spaced repetition for syntax (ongoing)</strong>
Flashcards for syntax you look up repeatedly. Anki or just a notes file. Syntax is the tax — automate paying it.

<strong>5. One deep dive per week</strong>
Pick one concept the language is known for:
• Rust → ownership & lifetimes
• Haskell → monads & type classes
• Go → concurrency patterns
• Python → decorators & context managers

<strong>6. Teach or explain (week 3+)</strong>
Write a blog post or explain a concept to a friend. If you can't explain it simply, you don't understand it yet.

<strong>Avoid:</strong> jumping between 5 languages, endless video courses without coding, comparing yourself to people with 10 years in that language.

<strong>Timeline reality:</strong> Conversational fluency in 2–4 weeks. Professional productivity in 2–3 months. Mastery takes years — but you don't need mastery to ship.`
    },
    {
      q: 'Optimize this SQL query that runs slow on 10M rows',
      a: `Given a typical slow pattern like:

<pre><code>SELECT u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2025-01-01'
GROUP BY u.id, u.name
ORDER BY orders DESC;</code></pre>

<strong>Problems:</strong>
1. Filter on <code>orders.created_at</code> after LEFT JOIN nullifies the join benefit
2. No index on <code>(user_id, created_at)</code>
3. GROUP BY includes redundant column

<strong>Optimized version:</strong>

<pre><code>SELECT u.name, COALESCE(o.cnt, 0) AS orders
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) AS cnt
  FROM orders
  WHERE created_at > '2025-01-01'
  GROUP BY user_id
) o ON u.id = o.user_id
ORDER BY orders DESC;</code></pre>

<strong>Required index:</strong>
<code>CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);</code>

<strong>Why it's faster:</strong>
• Subquery filters 10M → ~500K rows *before* joining
• Index supports both WHERE and GROUP BY
• Users table scanned once, not per-order

<strong>Verify with:</strong> <code>EXPLAIN ANALYZE</code> — look for Index Scan vs Seq Scan. Target: &lt;100ms on 10M rows with proper indexing.

If still slow: consider partial index <code>WHERE created_at > '2025-01-01'</code> or materialized view for dashboard queries.`
    },
    {
      q: 'Design a microservices architecture for an e-commerce platform',
      a: `Here's a battle-tested decomposition for scale:

<strong>Core services:</strong>

| Service | Responsibility | DB |
|---------|---------------|-----|
| **Product Catalog** | SKUs, categories, search index | PostgreSQL + Elasticsearch |
| **Inventory** | Stock levels, reservations | PostgreSQL (strong consistency) |
| **Cart** | Session carts, merge on login | Redis |
| **Order** | Order lifecycle, saga orchestration | PostgreSQL |
| **Payment** | Stripe/Adyen integration, idempotency | PostgreSQL |
| **User** | Auth, profiles, addresses | PostgreSQL |
| **Notification** | Email, SMS, push | Queue + templates |
| **Shipping** | Carrier APIs, tracking | PostgreSQL |

<strong>Critical patterns:</strong>

1. **Saga for checkout** — Order service orchestrates: reserve inventory → charge payment → confirm order → release inventory on failure

2. **Event bus (Kafka/NATS)** — <code>OrderPlaced</code>, <code>PaymentCaptured</code>, <code>InventoryReserved</code> for async decoupling

3. **API Gateway** — Kong/Envoy handles auth, rate limiting, routing. BFF pattern for mobile vs web

4. **CQRS for catalog** — Write to PostgreSQL, async sync to Elasticsearch for search. Eventual consistency OK for product listings

<strong>What NOT to split early:</strong>
• Don't microservice a startup — modular monolith first
• Don't split until team pain justifies ops overhead
• Inventory + Order need careful distributed transaction design

<strong>Observability stack:</strong> OpenTelemetry traces across services, Prometheus metrics, structured logging with correlation IDs.

Start with 3 services max: API, Worker, Search. Split when deploy cadence or team boundaries force it.`
    }
  ];

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  const btnRandom = document.getElementById('btn-random');
  const tryRandomHero = document.getElementById('try-random-hero');
  const promptChips = document.getElementById('prompt-chips');
  let isTyping = false;

  function pickRandom() {
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  }

  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg';
    el.innerHTML = `
      <div class="msg-avatar" style="background:rgba(255,255,255,0.08);display:grid;place-items:center;font-size:0.75rem;font-weight:700;color:var(--muted)">You</div>
      <div class="msg-content">
        <div class="msg-role">You</div>
        <div class="msg-text">${escapeHtml(text)}</div>
      </div>`;
    chatMessages.appendChild(el);
    scrollChat();
  }

  function addThinkingMessage() {
    const el = document.createElement('div');
    el.className = 'msg';
    el.id = 'thinking-msg';
    el.innerHTML = `
      <img class="msg-avatar ai" src="https://huggingface.co/moonshotai/Kimi-K3/resolve/main/assets/kimi-logo.png" alt="Kimi">
      <div class="msg-content">
        <div class="msg-role">Kimi K3 · reasoning</div>
        <div class="thinking">Thinking<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span></div>
      </div>`;
    chatMessages.appendChild(el);
    scrollChat();
    return el;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function stripTags(html) {
    return html
      .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '\n[code block]\n')
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<code>(.*?)<\/code>/g, '$1')
      .replace(/<[^>]+>/g, '');
  }

  async function typeResponse(thinkingEl, html) {
    thinkingEl.querySelector('.thinking').remove();
    const textEl = document.createElement('div');
    textEl.className = 'msg-text';
    thinkingEl.querySelector('.msg-content').appendChild(textEl);

    const plain = stripTags(html);
    const chars = plain.split('');
    for (let i = 0; i < chars.length; i++) {
      textEl.textContent += chars[i];
      scrollChat();
      const delay = chars[i] === '\n' ? 6 : (Math.random() * 10 + 3);
      await sleep(delay);
    }

    await sleep(200);
    textEl.innerHTML = html;

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    textEl.appendChild(cursor);
    await sleep(400);
    cursor.remove();
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runPrompt(text) {
    if (isTyping || !text.trim()) return;
    isTyping = true;
    btnSend.disabled = true;
    btnRandom.disabled = true;

    const match = PROMPTS.find((p) => p.q === text.trim());
    const item = match || pickRandom();
    const question = match ? text.trim() : item.q;

    addUserMessage(question);
    chatInput.value = '';

    await sleep(600 + Math.random() * 800);
    const thinkingEl = addThinkingMessage();
    await sleep(1200 + Math.random() * 1500);
    await typeResponse(thinkingEl, item.a);

    isTyping = false;
    btnSend.disabled = false;
    btnRandom.disabled = false;
  }

  PROMPTS.slice(0, 4).forEach((p) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'prompt-chip';
    chip.textContent = p.q.length > 42 ? p.q.slice(0, 40) + '…' : p.q;
    chip.title = p.q;
    chip.addEventListener('click', () => runPrompt(p.q));
    promptChips.appendChild(chip);
  });

  btnSend.addEventListener('click', () => runPrompt(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runPrompt(chatInput.value);
    }
  });
  btnRandom.addEventListener('click', () => {
    const item = pickRandom();
    runPrompt(item.q);
  });
  if (tryRandomHero) {
    tryRandomHero.addEventListener('click', () => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const item = pickRandom();
        runPrompt(item.q);
      }, 400);
    });
  }

  setTimeout(() => {
    const item = pickRandom();
    runPrompt(item.q);
  }, 1800);

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  document.querySelectorAll('.reveal').forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
  });

  const copyBtn = document.getElementById('copy-password');
  const passEl = document.getElementById('access-password');
  if (copyBtn && passEl) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(passEl.textContent.trim());
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      } catch {
        copyBtn.textContent = 'Select & copy';
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('open');
      if (id === '#download') {
        const passBlock = document.getElementById('password');
        if (passBlock) {
          passBlock.classList.remove('highlight');
          void passBlock.offsetWidth;
          passBlock.classList.add('highlight');
          setTimeout(() => passBlock.classList.remove('highlight'), 1400);
        }
      }
    });
  });
})();
