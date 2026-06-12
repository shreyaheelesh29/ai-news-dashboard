const fallbackNews = [
  {
    id: "fallback-agents",
    title: "Agent workflows move from demos into business operations",
    source: "Dashboard brief",
    category: "Agents",
    date: "Today",
    url: "https://news.ycombinator.com/",
    summary: "Teams are connecting AI agents to research, support, analytics, and coding workflows where measurable handoffs matter."
  },
  {
    id: "fallback-open-models",
    title: "Open models keep pressure on closed AI platforms",
    source: "Dashboard brief",
    category: "Open Models",
    date: "Today",
    url: "https://huggingface.co/models",
    summary: "New releases are making it easier for builders to run strong models on their own infrastructure."
  },
  {
    id: "fallback-video",
    title: "Generative video tools compete on speed, control, and editing",
    source: "Dashboard brief",
    category: "Video",
    date: "Today",
    url: "https://www.producthunt.com/topics/artificial-intelligence",
    summary: "Video platforms are shifting from novelty clips toward production workflows for creators and marketing teams."
  },
  {
    id: "fallback-chips",
    title: "AI infrastructure demand keeps chips and cloud capacity in focus",
    source: "Dashboard brief",
    category: "Infrastructure",
    date: "Today",
    url: "https://www.theverge.com/ai-artificial-intelligence",
    summary: "Compute availability, inference costs, and custom accelerators remain core stories behind every major AI launch."
  },
  {
    id: "fallback-coding",
    title: "AI coding assistants become full development companions",
    source: "Dashboard brief",
    category: "Coding",
    date: "Today",
    url: "https://github.blog/tag/ai/",
    summary: "The category is expanding from autocomplete into planning, refactoring, testing, reviews, and deployment support."
  },
  {
    id: "fallback-safety",
    title: "AI safety debates follow faster model releases",
    source: "Dashboard brief",
    category: "Policy",
    date: "Today",
    url: "https://hai.stanford.edu/news",
    summary: "Regulators, labs, and enterprises are watching evaluation, provenance, and misuse controls more closely."
  }
];

const tools = [
  { name: "ChatGPT", category: "Chat", score: "98", use: "Research, writing, coding, reasoning, automation, and multimodal workflows.", url: "https://chatgpt.com/" },
  { name: "Claude", category: "Chat", score: "94", use: "Long-context analysis, writing, planning, and careful document work.", url: "https://claude.ai/" },
  { name: "Perplexity", category: "Search", score: "91", use: "Answer engine for cited research, market scans, and topic discovery.", url: "https://www.perplexity.ai/" },
  { name: "Midjourney", category: "Image", score: "89", use: "High-quality image generation for concept art and campaign visuals.", url: "https://www.midjourney.com/" },
  { name: "Runway", category: "Video", score: "88", use: "AI video generation and editing for creative production teams.", url: "https://runwayml.com/" },
  { name: "ElevenLabs", category: "Audio", score: "87", use: "Voice generation, dubbing, narration, and audio localization.", url: "https://elevenlabs.io/" },
  { name: "GitHub Copilot", category: "Coding", score: "92", use: "Code completion, chat, test generation, and development assistance.", url: "https://github.com/features/copilot" },
  { name: "Cursor", category: "Coding", score: "90", use: "AI-native code editor for repo-wide edits, refactors, and debugging.", url: "https://www.cursor.com/" },
  { name: "Notion AI", category: "Productivity", score: "84", use: "Summaries, docs, task extraction, and workspace knowledge assistance.", url: "https://www.notion.com/product/ai" },
  { name: "Hugging Face", category: "Models", score: "95", use: "Open model hub, datasets, inference demos, and AI community releases.", url: "https://huggingface.co/" },
  { name: "Synthesia", category: "Video", score: "82", use: "AI avatar videos for training, onboarding, and internal communication.", url: "https://www.synthesia.io/" },
  { name: "Replit Agent", category: "Coding", score: "83", use: "Browser-based app building with AI coding and deployment workflows.", url: "https://replit.com/" }
];

const companies = [
  { name: "OpenAI", focus: "Frontier models, ChatGPT, API platform, agents", signal: "Consumer and developer AI adoption", stage: "Frontier Lab" },
  { name: "Anthropic", focus: "Claude models, safety research, enterprise AI", signal: "Long-context and trustworthy assistant workflows", stage: "Frontier Lab" },
  { name: "NVIDIA", focus: "GPUs, AI infrastructure, accelerated computing", signal: "Compute demand behind model training and inference", stage: "Infrastructure" },
  { name: "Hugging Face", focus: "Open-source models, datasets, community tooling", signal: "Open AI ecosystem growth and model distribution", stage: "Platform" },
  { name: "Mistral AI", focus: "Efficient frontier and open-weight models", signal: "European AI competition and deployable model stacks", stage: "Model Lab" },
  { name: "Perplexity", focus: "AI search and answer engine", signal: "Search disruption and cited answer experiences", stage: "Startup" },
  { name: "Runway", focus: "AI video generation and creative tools", signal: "Generative media production moving mainstream", stage: "Creative AI" },
  { name: "Scale AI", focus: "Data, evaluation, and model deployment support", signal: "Enterprise AI readiness and data operations", stage: "Data Platform" }
];

const categories = ["All", "Agents", "Open Models", "Video", "Infrastructure", "Coding", "Policy"];
const toolCategories = ["All", ...new Set(tools.map((tool) => tool.category))];
let news = [...fallbackNews];
let activeNewsCategory = "All";
let activeToolCategory = "All";
let bookmarks = JSON.parse(localStorage.getItem("ai-news-bookmarks") || "[]");

const newsGrid = document.querySelector("#news-grid");
const newsStatus = document.querySelector("#news-status");
const newsSearch = document.querySelector("#news-search");
const toolSearch = document.querySelector("#tool-search");
const bookmarkList = document.querySelector("#bookmark-list");

function saveBookmarks() {
  localStorage.setItem("ai-news-bookmarks", JSON.stringify(bookmarks));
  renderBookmarks();
  updateMetrics();
}

function isBookmarked(id) {
  return bookmarks.some((item) => item.id === id);
}

function toggleBookmark(item) {
  if (isBookmarked(item.id)) {
    bookmarks = bookmarks.filter((bookmark) => bookmark.id !== item.id);
  } else {
    bookmarks = [{ id: item.id, title: item.title, source: item.source, url: item.url }, ...bookmarks].slice(0, 24);
  }
  saveBookmarks();
  renderNews();
}

function textMatches(item, query) {
  const haystack = Object.values(item).join(" ").toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch (error) {
    return "#";
  }
}

function createChip(label, active, onClick) {
  const button = document.createElement("button");
  button.className = `chip${active ? " active" : ""}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderNewsFilters() {
  const filterNode = document.querySelector("#news-filters");
  filterNode.replaceChildren(...categories.map((category) => createChip(category, category === activeNewsCategory, () => {
    activeNewsCategory = category;
    renderNewsFilters();
    renderNews();
  })));
}

function renderToolFilters() {
  const filterNode = document.querySelector("#tool-filters");
  filterNode.replaceChildren(...toolCategories.map((category) => createChip(category, category === activeToolCategory, () => {
    activeToolCategory = category;
    renderToolFilters();
    renderTools();
  })));
}

function renderNews() {
  const query = newsSearch.value || "";
  const filtered = news.filter((item) => {
    const categoryMatch = activeNewsCategory === "All" || item.category === activeNewsCategory;
    return categoryMatch && textMatches(item, query);
  });

  if (!filtered.length) {
    newsGrid.innerHTML = `<div class="empty-state">No matching AI news signals. Try another keyword or category.</div>`;
    return;
  }

  newsGrid.replaceChildren(...filtered.map((item) => {
    const article = document.createElement("article");
    article.className = "news-card";
    article.innerHTML = `
      <div class="card-content">
        <div class="card-meta">
          <span class="tag">${escapeHtml(item.category)}</span>
          <span class="card-source">${escapeHtml(item.source)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
      </div>
      <div class="card-actions">
        <a class="text-link" href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">Read signal</a>
        <button class="bookmark-button${isBookmarked(item.id) ? " saved" : ""}" type="button" aria-label="Bookmark ${escapeHtml(item.title)}">
          ${isBookmarked(item.id) ? "Saved" : "Save"}
        </button>
      </div>
    `;
    article.querySelector(".bookmark-button").addEventListener("click", () => toggleBookmark(item));
    return article;
  }));
  document.querySelector("#news-count").textContent = String(filtered.length);
}

function renderTools() {
  const query = toolSearch.value || "";
  const filtered = tools.filter((tool) => {
    const categoryMatch = activeToolCategory === "All" || tool.category === activeToolCategory;
    return categoryMatch && textMatches(tool, query);
  });

  const cards = filtered.map((tool) => {
    const article = document.createElement("article");
    article.className = "tool-card";
    article.innerHTML = `
      <div class="tool-meta">
        <span class="tag">${escapeHtml(tool.category)}</span>
        <span class="tool-score">${escapeHtml(tool.score)}</span>
      </div>
      <h3>${escapeHtml(tool.name)}</h3>
      <p>${escapeHtml(tool.use)}</p>
      <a class="text-link" href="${safeUrl(tool.url)}" target="_blank" rel="noreferrer">Open tool</a>
    `;
    return article;
  });

  document.querySelector("#tool-grid").replaceChildren(...(cards.length ? cards : [emptyNode("No AI tools match that search yet.")]));
  document.querySelector("#tool-count").textContent = String(filtered.length);
}

function renderCompanies() {
  const cards = companies.map((company) => {
    const article = document.createElement("article");
    article.className = "company-card";
    article.innerHTML = `
      <div>
        <div class="company-meta">
          <span class="company-logo">${escapeHtml(company.name.slice(0, 2).toUpperCase())}</span>
          <span>${escapeHtml(company.stage)}</span>
        </div>
        <h3>${escapeHtml(company.name)}</h3>
        <p>${escapeHtml(company.focus)}</p>
      </div>
      <span class="tag">${escapeHtml(company.signal)}</span>
    `;
    return article;
  });
  document.querySelector("#company-grid").replaceChildren(...cards);
}

function emptyNode(message) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = message;
  return div;
}

function renderBookmarks() {
  if (!bookmarks.length) {
    bookmarkList.replaceChildren(emptyNode("Save news cards and they will appear here, even after refreshing."));
    return;
  }

  bookmarkList.replaceChildren(...bookmarks.map((bookmark) => {
    const item = document.createElement("div");
    item.className = "bookmark-item";
    item.innerHTML = `
      <div>
        <a href="${safeUrl(bookmark.url)}" target="_blank" rel="noreferrer">${escapeHtml(bookmark.title)}</a>
        <div class="bookmark-source">${escapeHtml(bookmark.source)}</div>
      </div>
      <button class="bookmark-button saved" type="button">Remove</button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      bookmarks = bookmarks.filter((saved) => saved.id !== bookmark.id);
      saveBookmarks();
      renderNews();
    });
    return item;
  }));
}

function updateMetrics() {
  document.querySelector("#bookmark-count").textContent = String(bookmarks.length);
}

function mapHackerNewsHit(hit, index) {
  const title = hit.title || hit.story_title || "Untitled AI story";
  const summary = hit.comment_text
    ? hit.comment_text.replace(/<[^>]+>/g, "").slice(0, 180)
    : "Fresh AI-related discussion pulled from a public news API. Open the signal to inspect the source conversation.";
  const category = categories[(index % (categories.length - 1)) + 1];
  return {
    id: `hn-${hit.objectID}`,
    title,
    source: "Hacker News",
    category,
    date: hit.created_at,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    summary
  };
}

async function loadLiveNews() {
  newsStatus.textContent = "Loading live AI headlines from a public news API...";
  try {
    const response = await fetch("https://hn.algolia.com/api/v1/search_by_date?query=artificial%20intelligence%20OR%20AI&tags=story&hitsPerPage=12");
    if (!response.ok) {
      throw new Error("News request failed");
    }
    const data = await response.json();
    const hits = (data.hits || []).filter((hit) => hit.title || hit.story_title);
    news = hits.length ? hits.map(mapHackerNewsHit) : fallbackNews;
    newsStatus.textContent = hits.length
      ? `Live feed connected. Showing ${news.length} AI signals.`
      : "Using curated fallback signals while the live feed is quiet.";
  } catch (error) {
    news = fallbackNews;
    newsStatus.textContent = "Live feed unavailable right now. Showing curated AI signals.";
  }
  renderNews();
}

function updateDate() {
  const formatted = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
  document.querySelector("#updated-at").textContent = `Updated ${formatted}`;
}

document.querySelector("#refresh-news").addEventListener("click", loadLiveNews);
document.querySelector("#clear-bookmarks").addEventListener("click", () => {
  bookmarks = [];
  saveBookmarks();
  renderNews();
});
newsSearch.addEventListener("input", renderNews);
toolSearch.addEventListener("input", renderTools);

renderNewsFilters();
renderToolFilters();
renderTools();
renderCompanies();
renderBookmarks();
updateMetrics();
updateDate();
loadLiveNews();
