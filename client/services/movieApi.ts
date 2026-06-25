export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
}

const RECOMMENDATIONS_CACHE_KEY = "superapp_cached_movie_recommendations";

export async function fetchMovieRecommendations(genres: string[]): Promise<Movie[]> {
  const genresParam = genres.join(",");
  const response = await fetch(`/api/movies/recommendations?genres=${encodeURIComponent(genresParam)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch movie recommendations");
  }
  return response.json();
}

export async function searchMovies(query: string, genreId?: number | null): Promise<Movie[]> {
  let url = `/api/movies/search?query=${encodeURIComponent(query)}`;
  if (genreId) {
    url += `&genreId=${genreId}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to search movies");
  }
  return response.json();
}

export type GroupedRecommendations = Record<string, Movie[]>;

export function getCachedRecommendations(): GroupedRecommendations {
  try {
    const data = localStorage.getItem(RECOMMENDATIONS_CACHE_KEY);
    if (!data) return {};
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch (error) {
    console.error("Error reading movies from localStorage:", error);
    return {};
  }
}

export function saveRecommendationsToCache(movies: GroupedRecommendations): void {
  try {
    localStorage.setItem(RECOMMENDATIONS_CACHE_KEY, JSON.stringify(movies));
  } catch (error) {
    console.error("Error writing movies to localStorage:", error);
  }
}

export function getPosterUrl(path: string): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80"; // standard movie placeholder
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
}
