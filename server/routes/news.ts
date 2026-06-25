import { RequestHandler } from "express";

export const handleNews: RequestHandler = async (req, res) => {
  if (req.query.error === "true") {
    res.status(500).json({ error: "Simulated News API failure" });
    return;
  }

  const apiKey = process.env.GNEWS_API_KEY || process.env.NEWS_API_KEY;

  if (!apiKey) {
    // Return mock data if key is not configured
    const mockData = getMockNews();
    res.json(mockData);
    return;
  }

  try {
    // We fetch from GNews category=entertainment
    const url = `https://gnews.io/api/v4/top-headlines?category=entertainment&lang=en&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid news API Key. Falling back to mock news data.");
        res.json(getMockNews());
        return;
      }
      throw new Error(`News API responded with status ${response.status}`);
    }

    const data = await response.json();
    const articles = (data.articles || []).map((art: any) => ({
      title: art.title,
      source: art.source?.name || "Unknown Source",
      publishedAt: art.publishedAt || new Date().toISOString(),
      image: art.image || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=400&q=80",
      url: art.url || "#",
    }));

    res.json(articles);
  } catch (error) {
    console.error("News fetch failed, returning fallback mock news:", error);
    res.json(getMockNews());
  }
};

function getMockNews() {
  const now = new Date();
  return [
    {
      title: "Hollywood Stars Align for the Grand Gala Night in Los Angeles",
      source: "Hollywood Reporter",
      publishedAt: now.toISOString(),
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
      url: "https://example.com/hollywood-gala"
    },
    {
      title: "Next-Gen Streaming Platform Announces 50 New Original Series",
      source: "Variety",
      publishedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // 45m ago
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=400&q=80",
      url: "https://example.com/streaming-announcement"
    },
    {
      title: "Indie Film Wins Top Honors at International Film Festival",
      source: "IndieWire",
      publishedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(), // 2.5h ago
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
      url: "https://example.com/indie-film-award"
    }
  ];
}
