export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  image: string;
  url: string;
}

const NEWS_CACHE_KEY = "superapp_cached_news";

export async function fetchEntertainmentNews(): Promise<NewsArticle[]> {
  const urlParams = new URLSearchParams(window.location.search);
  const simulateError = urlParams.get("news_error") === "true";
  const fetchUrl = simulateError ? "/api/news?error=true" : "/api/news";
  
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch entertainment news");
  }
  return response.json();
}

export function getCachedNews(): NewsArticle[] {
  try {
    const data = localStorage.getItem(NEWS_CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading news from localStorage:", error);
    return [];
  }
}

export function saveNewsToCache(articles: NewsArticle[]): void {
  try {
    localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error("Error writing news to localStorage:", error);
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}
