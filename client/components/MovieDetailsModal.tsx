import { useEffect, useState } from "react";
import { X, Star, Clock, Calendar, User } from "lucide-react";
import { fetchMovieDetails, getPosterUrl, type MovieDetail } from "@/services/movieApi";

interface MovieDetailsModalProps {
  movieId: number | null;
  onClose: () => void;
}

export default function MovieDetailsModal({ movieId, onClose }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setDetails(null);
      return;
    }

    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(movieId);
        setDetails(data);
      } catch (err: any) {
        setError(err.message || "Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [movieId]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (movieId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [movieId]);

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300">
      {/* Modal Container */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col md:flex-row min-h-[350px] max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
          title="Close details"
        >
          <X size={18} />
        </button>

        {loading ? (
          /* Loading / Skeleton View */
          <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 animate-pulse w-full">
            <div className="aspect-[2/3] w-full md:w-48 bg-slate-900 rounded-2xl border border-slate-850 flex-shrink-0"></div>
            <div className="flex-1 space-y-4 py-2">
              <div className="h-6 bg-slate-900 rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-slate-900 rounded w-16"></div>
                <div className="h-4 bg-slate-900 rounded w-16"></div>
              </div>
              <div className="h-20 bg-slate-900 rounded w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-900 rounded w-1/2"></div>
                <div className="h-4 bg-slate-900 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          /* Error View */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-400 font-semibold">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase rounded-lg text-xs tracking-wider transition-all hover:scale-105 active:scale-95"
            >
              Close
            </button>
          </div>
        ) : details ? (
          /* Content View */
          <>
            {/* Poster Section */}
            <div className="relative w-full md:w-48 aspect-[2/3] md:aspect-auto flex-shrink-0 bg-slate-950">
              <img
                src={getPosterUrl(details.poster_path)}
                alt={details.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:hidden" />
            </div>

            {/* Details Section */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[50vh] md:max-h-[450px] scrollbar-thin">
              <div className="space-y-4">
                {/* Title & Ratings */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
                    {details.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-400 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                      <Star size={12} className="fill-yellow-400" />
                      <span>{details.vote_average ? details.vote_average.toFixed(1) : "N/A"}</span>
                    </div>
                    {details.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{details.runtime} mins</span>
                      </div>
                    )}
                    {details.release_date && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{details.release_date.substring(0, 4)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genre Chips */}
                {details.genres && details.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {details.genres.map((g, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-bold uppercase tracking-wider"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Plot / Overview */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PLOT SUMMARY</p>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {details.plot}
                  </p>
                </div>

                {/* Cast Members */}
                {details.cast && details.cast.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOP CAST</p>
                    <div className="flex flex-wrap gap-2">
                      {details.cast.map((actor, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300"
                        >
                          <User size={12} className="text-slate-400" />
                          <span>{actor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
