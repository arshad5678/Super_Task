import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Star, Film, RefreshCw } from "lucide-react";
import { searchMovies, getPosterUrl, type Movie } from "@/services/movieApi";
import MovieDetailsModal from "@/components/MovieDetailsModal";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 10402, name: "Music" },
  { id: 10770, name: "Sports" },
  { id: 53, name: "Thriller" },
  { id: 14, name: "Fantasy" },
  { id: 10749, name: "Romance" },
];

export default function Movies() {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(query, selectedGenre);
      setMovies(results);
    } catch (err: any) {
      setError(err.message || "Failed to search movies");
    } finally {
      setLoading(false);
    }
  }, [query, selectedGenre]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadMovies();
    }, 300); // 300ms debounce for search query input changes

    return () => clearTimeout(delayDebounce);
  }, [query, selectedGenre, loadMovies]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <span className="text-cyan-400 text-xs font-bold tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                ENTERTAINMENT HUB
              </span>
              <h1 className="text-4xl lg:text-5xl font-black mt-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Discover Movies
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by movie title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-slate-400 text-sm font-semibold whitespace-nowrap mr-2">Categories:</span>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border transform hover:scale-105 ${
                selectedGenre === genre.id
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black border-transparent shadow-lg shadow-cyan-500/25"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-slate-900/20 border border-red-500/20 rounded-2xl p-8">
            <p className="text-red-400 text-lg font-semibold">⚠️ {error}</p>
            <button
              onClick={loadMovies}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold uppercase tracking-wider hover:from-pink-400 hover:to-red-400 transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
            >
              <RefreshCw size={16} />
              Retry Search
            </button>
          </div>
        )}

        {/* Movie Grid */}
        {!error && (
          loading ? (
            // Skeleton Loading Grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse">
                  <div className="aspect-[2/3] w-full bg-slate-900 rounded-2xl border border-slate-800"></div>
                  <div className="h-4 bg-slate-900 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-900 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3 bg-slate-900/10 border border-slate-800/50 rounded-2xl p-8">
              <Film size={48} className="text-slate-600 animate-pulse" />
              <p className="text-slate-400 font-semibold text-lg">No movies found</p>
              <p className="text-slate-500 text-sm">Try tweaking your search term or select a different category filter</p>
            </div>
          ) : (
            // Real Movie Cards Grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovieId(movie.id)}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  {/* Poster Wrapper */}
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-slate-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-400/10">
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Rating Badge Overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 border border-slate-800 text-[10px] font-bold text-yellow-400 backdrop-blur-sm">
                      <Star size={10} className="fill-yellow-400" />
                      {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  {/* Title & Release Date */}
                  <div className="px-1">
                    <p className="text-slate-200 text-xs font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {movie.title}
                    </p>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      {movie.release_date ? movie.release_date.substring(0, 4) : "Unknown Year"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      
      {/* Movie Details Modal Overlay */}
      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </div>
  );
}
