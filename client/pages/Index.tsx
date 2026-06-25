import { useState, useEffect, useCallback } from "react";
import { ChevronRight, Eye, EyeOff, ArrowRight, Star, Play, Pause, RotateCcw } from "lucide-react";
import { saveUserData, getUserData, saveCategories, getCategories } from "@/lib/storage";
import { fetchWeather, getWeatherEmoji } from "@/lib/weather";
import {
  fetchEntertainmentNews,
  getCachedNews,
  saveNewsToCache,
  formatRelativeTime,
  type NewsArticle,
} from "@/services/newsApi";
import {
  fetchMovieRecommendations,
  getCachedRecommendations,
  saveRecommendationsToCache,
  getPosterUrl,
  type Movie,
} from "@/services/movieApi";
import { Link } from "react-router-dom";
import MovieDetailsModal from "@/components/MovieDetailsModal";

export interface Note {
  id: string;
  text: string;
  createdAt: number;
}

export default function Index() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("superapp_current_step");
    return savedStep ? Number(savedStep) : 0;
  });
  const [formData, setFormData] = useState(() => {
    const savedUser = getUserData();
    const savedCats = getCategories();
    return {
      fullName: savedUser?.fullName || "",
      username: savedUser?.username || "",
      email: savedUser?.email || "",
      mobile: savedUser?.mobile || "",
      password: savedUser?.password || "",
      categories: savedCats || [],
    };
  });
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation States
  const [errors, setErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    username: false,
    email: false,
    mobile: false,
    password: false,
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const errs = {
      fullName: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
    };

    // Full Name: required, minimum 3 characters
    if (formData.fullName.trim() === "") {
      errs.fullName = "Full Name is required";
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = "Full Name must be at least 3 characters";
    }

    // Username: required, no spaces allowed
    if (formData.username.trim() === "") {
      errs.username = "Username is required";
    } else if (/\s/.test(formData.username)) {
      errs.username = "Username cannot contain spaces";
    }

    // Email: valid email format
    if (formData.email.trim() === "") {
      errs.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
    }

    // Mobile Number: exactly 10 digits
    if (formData.mobile.trim() === "") {
      errs.mobile = "Mobile Number is required";
    } else {
      const digitsOnly = formData.mobile.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        errs.mobile = "Mobile Number must be exactly 10 digits";
      }
    }

    // Password: minimum 8 characters
    if (formData.password === "") {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    setErrors(errs);
  }, [formData]);

  const isFormValid =
    !errors.fullName &&
    !errors.username &&
    !errors.email &&
    !errors.mobile &&
    !errors.password &&
    agreeToTerms;

  useEffect(() => {
    localStorage.setItem("superapp_current_step", String(currentStep));
  }, [currentStep]);

  // Enforce step validation to prevent accessing later steps without required data
  useEffect(() => {
    if (currentStep > 0 && (!formData.fullName || !formData.username || !formData.email || !formData.mobile || !formData.password)) {
      setCurrentStep(0);
    } else if (currentStep > 1 && formData.categories.length < 3) {
      setCurrentStep(1);
    }
  }, [currentStep, formData]);

  // Weather widget state and integration
  const [weatherCity, setWeatherCity] = useState(() => {
    return localStorage.getItem("superapp_weather_city") || "London";
  });
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    if (currentStep !== 3) return;

    let isMounted = true;
    const loadWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const data = await fetchWeather(weatherCity);
        if (isMounted) {
          setWeatherData(data);
          localStorage.setItem("superapp_weather_city", weatherCity);
        }
      } catch (err: any) {
        if (isMounted) {
          setWeatherError(err.message || "Failed to load weather");
        }
      } finally {
        if (isMounted) {
          setWeatherLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, [weatherCity, currentStep]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setWeatherCity(searchCity.trim());
      setSearchCity("");
    }
  };

  // Entertainment News widget state and integration
  const [news, setNews] = useState<NewsArticle[]>(() => getCachedNews());
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);

  const loadNews = useCallback(async (showLoading = false) => {
    if (showLoading) setNewsLoading(true);
    setNewsError(null);
    try {
      const articles = await fetchEntertainmentNews();
      setNews(articles);
      setActiveNewsIndex(0);
      saveNewsToCache(articles);
    } catch (err: any) {
      setNewsError(err.message || "Failed to load entertainment news");
    } finally {
      if (showLoading) setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentStep !== 3) return;

    const cache = getCachedNews();
    const shouldShowLoading = cache.length === 0;

    loadNews(shouldShowLoading);

    // Automatically refresh news every 10 minutes
    const interval = setInterval(() => {
      loadNews(false);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentStep, loadNews]);

  // Auto-advance news article index every 2 seconds
  useEffect(() => {
    if (currentStep !== 3 || news.length <= 1) return;
    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % news.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep, news.length]);

  // Movie Recommendations widget state and integration
  const [recommendationsByCategory, setRecommendationsByCategory] = useState<Record<string, Movie[]>>(() => getCachedRecommendations() as any);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Sync active category with selected categories
  useEffect(() => {
    if (formData.categories.length > 0) {
      if (!activeCategory || !formData.categories.includes(activeCategory)) {
        setActiveCategory(formData.categories[0]);
      }
    } else {
      setActiveCategory(null);
    }
  }, [formData.categories, activeCategory]);

  const loadRecommendations = useCallback(async (showLoading = false) => {
    if (showLoading) setRecLoading(true);
    setRecError(null);
    try {
      const resultsMap: Record<string, Movie[]> = {};
      await Promise.all(
        formData.categories.map(async (catId) => {
          const res = await fetchMovieRecommendations([catId]);
          resultsMap[catId] = res;
        })
      );
      setRecommendationsByCategory(resultsMap);
      saveRecommendationsToCache(resultsMap);
    } catch (err: any) {
      setRecError(err.message || "Failed to load movie recommendations");
    } finally {
      if (showLoading) setRecLoading(false);
    }
  }, [formData.categories]);

  useEffect(() => {
    if (currentStep !== 3) return;

    const cache = getCachedRecommendations();
    const shouldShowLoading = Object.keys(cache).length === 0;

    loadRecommendations(shouldShowLoading);
  }, [currentStep, loadRecommendations]);

  // Custom Duration Timer State
  const [customHours, setCustomHours] = useState(() => {
    const saved = localStorage.getItem("superapp_timer_hours");
    return saved ? Number(saved) : 0;
  });
  const [customMinutes, setCustomMinutes] = useState(() => {
    const saved = localStorage.getItem("superapp_timer_minutes");
    return saved ? Number(saved) : 25;
  });
  const [customSeconds, setCustomSeconds] = useState(() => {
    const saved = localStorage.getItem("superapp_timer_seconds");
    return saved ? Number(saved) : 0;
  });
  const [totalDuration, setTotalDuration] = useState(() => {
    const saved = localStorage.getItem("superapp_timer_total_duration");
    return saved ? Number(saved) : 25 * 60;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("superapp_pomodoro_time_left");
    const savedRunning = localStorage.getItem("superapp_pomodoro_is_running") === "true";
    const savedLastUpdated = localStorage.getItem("superapp_pomodoro_last_updated");
    
    if (savedTime !== null) {
      const parsedTime = Number(savedTime);
      if (savedRunning && savedLastUpdated) {
        const elapsed = Math.floor((Date.now() - Number(savedLastUpdated)) / 1000);
        return Math.max(0, parsedTime - elapsed);
      }
      return parsedTime;
    }
    return 25 * 60;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const savedTime = localStorage.getItem("superapp_pomodoro_time_left");
    const savedRunning = localStorage.getItem("superapp_pomodoro_is_running") === "true";
    const savedLastUpdated = localStorage.getItem("superapp_pomodoro_last_updated");
    
    if (savedRunning && savedTime !== null && savedLastUpdated) {
      const parsedTime = Number(savedTime);
      const elapsed = Math.floor((Date.now() - Number(savedLastUpdated)) / 1000);
      if (parsedTime - elapsed <= 0) return false;
      return true;
    }
    return false;
  });

  const [timerExpired, setTimerExpired] = useState(false);

  const syncTimeLeft = (h: number, m: number, s: number) => {
    const total = h * 3600 + m * 60 + s;
    setTimeLeft(total);
    setTotalDuration(total);
  };

  // Persist timer state to localStorage
  useEffect(() => {
    localStorage.setItem("superapp_timer_hours", String(customHours));
    localStorage.setItem("superapp_timer_minutes", String(customMinutes));
    localStorage.setItem("superapp_timer_seconds", String(customSeconds));
    localStorage.setItem("superapp_timer_total_duration", String(totalDuration));
    localStorage.setItem("superapp_pomodoro_time_left", String(timeLeft));
    localStorage.setItem("superapp_pomodoro_is_running", String(isRunning));
    localStorage.setItem("superapp_pomodoro_last_updated", String(Date.now()));
  }, [customHours, customMinutes, customSeconds, totalDuration, timeLeft, isRunning]);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setTimerExpired(true);
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "sine";
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
          } catch (e) {
            console.warn("Audio Context alert failed:", e);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimerExpired(false);
    const total = customHours * 3600 + customMinutes * 60 + customSeconds;
    setTimeLeft(total);
    setTotalDuration(total);
  }, [customHours, customMinutes, customSeconds]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Notes State & Handlers
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("superapp_notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Auto-save notes to localStorage
  useEffect(() => {
    localStorage.setItem("superapp_notes", JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = useCallback(() => {
    setNoteText("");
    setEditingNoteId("new");
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setNoteText(note.text);
    setEditingNoteId(note.id);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!noteText.trim()) return;
    if (noteText.length > 150) return;

    if (editingNoteId === "new") {
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText.trim(),
        createdAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    } else if (editingNoteId) {
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNoteId ? { ...n, text: noteText.trim() } : n))
      );
    }
    setEditingNoteId(null);
    setNoteText("");
  }, [noteText, editingNoteId]);

  const handleCancelNote = useCallback(() => {
    setEditingNoteId(null);
    setNoteText("");
  }, []);

  const categories = [
    { id: "action", label: "Action", icon: "🔥", color: "from-red-500 via-orange-500 to-yellow-400", darkColor: "from-red-600 to-orange-700" },
    { id: "comedy", label: "Comedy", icon: "😄", color: "from-yellow-400 to-amber-500", darkColor: "from-yellow-500 to-amber-600" },
    { id: "drama", label: "Drama", icon: "🎭", color: "from-purple-500 to-indigo-600", darkColor: "from-purple-600 to-indigo-700" },
    { id: "music", label: "Music", icon: "🎵", color: "from-purple-500 to-pink-500", darkColor: "from-purple-600 to-pink-600" },
    { id: "sports", label: "Sports", icon: "⚽", color: "from-emerald-400 to-teal-500", darkColor: "from-emerald-500 to-teal-600" },
    { id: "thriller", label: "Thriller", icon: "🎬", color: "from-pink-500 to-red-600", darkColor: "from-pink-600 to-red-700" },
    { id: "fantasy", label: "Fantasy", icon: "✨", color: "from-indigo-500 to-purple-600", darkColor: "from-indigo-600 to-purple-700" },
    { id: "romance", label: "Romance", icon: "💕", color: "from-pink-400 to-rose-500", darkColor: "from-pink-500 to-rose-600" },
  ];

  const toggleCategory = (id: string) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id];
      saveCategories(newCategories);
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.username && formData.email && formData.mobile && formData.password) {
      saveUserData({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      setCurrentStep(1);
    }
  };

  const handleCategoriesNext = () => {
    if (formData.categories.length >= 3) {
      setCurrentStep(2);
    }
  };

  const handleProfileNext = () => {
    setCurrentStep(3);
  };

  const steps = [
    { number: 1, label: "Sign Up" },
    { number: 2, label: "Categories" },
    { number: 3, label: "Profile" },
    { number: 4, label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Step Indicators */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        <span className="text-cyan-400 font-bold text-sm tracking-widest">STEP {currentStep + 1}/4</span>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentStep >= step.number - 1 ? "bg-cyan-400 w-8" : "bg-slate-700 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: SIGN UP */}
      {currentStep === 0 && (
        <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-6 lg:p-16 items-center">
          {/* Left Hero Section */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-cyan-400 text-sm font-bold tracking-widest bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/30">
                  ENTERTAINMENT PLATFORM
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                Discover New
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Things
                </span>
                <br />
                on SuperApp
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                Create your account to explore unlimited categories, movies, and content personalized just for you.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { title: "Fresh Picks", subtitle: "Tailored for you" },
                { title: "Quick Start", subtitle: "Sign up in 60s" },
              ].map((feature, i) => (
                <div key={i} className="group">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="text-sm text-slate-400">{feature.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Form Section */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Form Header */}
              <div className="mb-8 space-y-2">
                <span className="text-cyan-400 text-xs font-bold tracking-widest">GET STARTED</span>
                <h2 className="text-3xl font-bold">Create Your Account</h2>
                <p className="text-slate-400 text-sm">Complete your profile to begin your journey</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="space-y-5">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      onBlur={() => handleBlur("fullName")}
                      className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none transition-all backdrop-blur-sm ${
                        touched.fullName && errors.fullName
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                          : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                      }`}
                      required
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Username</label>
                  <input
                    type="text"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    onBlur={() => handleBlur("username")}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none transition-all backdrop-blur-sm ${
                      touched.username && errors.username
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    }`}
                    required
                  />
                  {touched.username && errors.username && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => handleBlur("email")}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none transition-all backdrop-blur-sm ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    }`}
                    required
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    onBlur={() => handleBlur("mobile")}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none transition-all backdrop-blur-sm ${
                      touched.mobile && errors.mobile
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    }`}
                    required
                  />
                  {touched.mobile && errors.mobile && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.mobile}</p>
                  )}
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onBlur={() => handleBlur("password")}
                      className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-500 focus:outline-none transition-all backdrop-blur-sm ${
                        touched.password && errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                          : "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                    I agree to the <span className="text-cyan-400 hover:text-cyan-300">Terms and Conditions</span>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                  SIGN UP
                </button>
              </form>

              {/* Login Link */}
              <p className="text-center text-slate-400 text-sm mt-6">
                Already have an account?{" "}
                <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold">Login</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CATEGORIES */}
      {currentStep === 1 && (
        <div className="relative z-10 min-h-screen p-6 lg:p-16 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-12 space-y-4">
              <span className="text-cyan-400 text-xs font-bold tracking-widest">PERSONALIZATION</span>
              <h2 className="text-4xl lg:text-5xl font-black">
                Choose Your Entertainment
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl">
                Select the categories that match your interests. We'll use your selections to personalize your experience.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`group relative overflow-hidden rounded-xl p-6 h-40 transition-all transform ${
                    formData.categories.includes(category.id)
                      ? `bg-gradient-to-br ${category.darkColor} ring-2 ring-cyan-400 shadow-2xl shadow-cyan-400/50 scale-105`
                      : "bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:scale-105"
                  }`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10`} />
                  </div>
                  <div className="relative flex flex-col items-center justify-center h-full gap-3 z-10">
                    <span className="text-4xl">{category.icon}</span>
                    <span className="font-bold text-sm uppercase tracking-wide">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-8 py-4 rounded-lg border-2 border-slate-700 text-white font-bold uppercase tracking-wider hover:border-slate-600 hover:bg-slate-900/50 transition-all transform hover:scale-105"
              >
                BACK
              </button>
              <div className="flex flex-col items-center sm:items-end gap-2">
                <button
                  onClick={handleCategoriesNext}
                  disabled={formData.categories.length < 3}
                  className="group px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30 flex items-center gap-2"
                >
                  CONTINUE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {formData.categories.length < 3 && (
                  <span className="text-red-400 text-xs font-semibold tracking-wide">
                    Select at least 3 categories (Choose {3 - formData.categories.length} more)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PROFILE REVIEW */}
      {currentStep === 2 && (
        <div className="relative z-10 min-h-screen p-6 lg:p-16 flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <span className="text-cyan-400 text-xs font-bold tracking-widest">REVIEW & CONTINUE</span>
              <h2 className="text-4xl font-black">Your Profile</h2>
              <p className="text-slate-300">Confirm your details before moving forward</p>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm space-y-6">
              {/* Avatar & Info */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-black">
                    {formData.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{formData.fullName}</p>
                  <p className="text-cyan-400 font-semibold">@{formData.username}</p>
                  <p className="text-slate-400 text-sm">{formData.email}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

              {/* Selected Categories */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">SELECTED INTERESTS</p>
                <div className="grid grid-cols-2 gap-2">
                  {formData.categories.map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return cat ? (
                      <div
                        key={catId}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/50 text-cyan-400 text-sm font-semibold flex items-center gap-2"
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-4 rounded-lg border-2 border-slate-700 text-white font-bold uppercase tracking-wider hover:border-slate-600 hover:bg-slate-900/50 transition-all transform hover:scale-105"
              >
                BACK
              </button>
              <button
                onClick={handleProfileNext}
                className="flex-1 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30"
              >
                CONTINUE TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: DASHBOARD */}
      {currentStep === 3 && (
        <div className="relative z-10 min-h-screen p-6 lg:p-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12 space-y-4">
              <span className="text-cyan-400 text-xs font-bold tracking-widest">YOUR DASHBOARD</span>
              <h2 className="text-4xl lg:text-5xl font-black">Welcome to SuperApp</h2>
              <p className="text-lg text-slate-300">Your personalized entertainment hub is ready</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Weather Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-sky-600/25">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-sky-200 text-[10px] font-bold uppercase tracking-widest mb-1">WEATHER</p>
                      <h3 className="text-white text-lg font-black truncate max-w-[180px]">{weatherData?.city || weatherCity}</h3>
                    </div>
                    {weatherData && !weatherLoading && !weatherError && (
                      <div className="text-5xl">{getWeatherEmoji(weatherData.condition)}</div>
                    )}
                  </div>
 
                  {weatherLoading ? (
                    <div className="animate-pulse space-y-2 py-2">
                      <div className="h-8 bg-white/20 rounded w-20"></div>
                      <div className="h-4 bg-white/10 rounded w-28"></div>
                    </div>
                  ) : weatherError ? (
                    <div className="space-y-2 py-1">
                      <p className="text-red-200 text-xs font-semibold">⚠️ {weatherError}</p>
                      <button
                        onClick={() => setWeatherCity((prev) => prev)}
                        className="px-3 py-1.5 bg-white/25 hover:bg-white/35 rounded text-white text-xs font-bold transition-all shadow-md"
                      >
                        RETRY
                      </button>
                    </div>
                  ) : (
                    <div className="py-1 space-y-3">
                      <div>
                        <p className="text-5xl font-black text-white">{weatherData?.temp ?? "--"}°C</p>
                        <p className="text-sky-100 text-xs font-semibold mt-1 uppercase tracking-wide">
                          {weatherData?.condition} - {weatherData?.description}
                        </p>
                      </div>
                      
                      {/* Expanded metrics grid: Pressure & Wind Speed */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                        <div>
                          <p className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">PRESSURE</p>
                          <p className="text-sm font-black text-white mt-0.5">{weatherData?.pressure ?? "--"} hPa</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">WIND</p>
                          <p className="text-sm font-black text-white mt-0.5">{weatherData?.wind_speed ?? "--"} m/s</p>
                        </div>
                      </div>
                    </div>
                  )}
 
                  <form onSubmit={handleSearchSubmit} className="flex gap-2 mt-2 w-full">
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="flex-1 bg-black/20 placeholder-sky-200/50 border border-white/20 focus:border-white text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
                    />
                  </form>
                </div>
              </div>
 
              {/* Humidity Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-500/25">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
                <div className="relative z-10 flex items-center justify-between h-full w-full">
                  {weatherLoading ? (
                    <div className="animate-pulse space-y-2 w-full">
                      <div className="h-4 bg-white/20 rounded w-1/3"></div>
                      <div className="h-8 bg-white/10 rounded w-1/2"></div>
                    </div>
                  ) : weatherError ? (
                    <div>
                      <p className="text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-2">HUMIDITY</p>
                      <p className="text-2xl font-black text-white">--%</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-2">HUMIDITY</p>
                      <p className="text-5xl font-black text-white">{weatherData?.humidity ?? "--"}%</p>
                    </div>
                  )}
                  <div className="text-6xl select-none">💧</div>
                </div>
              </div>

              {/* News Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-700 p-6 hover:border-slate-600 transition-all backdrop-blur-sm flex flex-col h-full min-h-[380px] justify-between">
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">ENTERTAINMENT NEWS</p>
                      <h3 className="text-white text-lg font-black">Trending Now</h3>
                    </div>
                    <div className="text-3xl animate-bounce">📰</div>
                  </div>

                  {/* Body Content */}
                  {newsLoading ? (
                    // Skeleton Loader
                    <div className="flex-1 space-y-4 py-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-14 h-14 bg-slate-800 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-slate-800/60 rounded w-5/6"></div>
                            <div className="h-2 bg-slate-800/40 rounded w-1/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : newsError ? (
                    // Error State
                    <div className="flex-1 flex flex-col justify-center items-center py-4 text-center space-y-3">
                      <p className="text-red-400 text-sm font-medium">⚠️ {newsError}</p>
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("news_error");
                          window.history.replaceState({}, "", url.toString());
                          loadNews(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-xs uppercase tracking-wider hover:from-pink-400 hover:to-red-400 transition-all hover:scale-105 transform shadow-lg shadow-pink-500/20"
                      >
                        RETRY
                      </button>
                    </div>
                  ) : (
                    // Highlighted Article
                    (() => {
                      const art = news[activeNewsIndex];
                      if (!art) return null;
                      return (
                        <div
                          onClick={() => window.open(art.url, "_blank")}
                          className="flex-1 flex flex-col justify-between cursor-pointer group/item hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-slate-800/80 gap-3"
                        >
                          {art.image && (
                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
                              <img
                                src={art.image}
                                alt={art.title}
                                className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col gap-1.5">
                            <h4 className="text-white text-sm font-black leading-snug group-hover/item:text-cyan-400 transition-colors line-clamp-2">
                              {art.title}
                            </h4>
                            <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">
                              {art.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                            <span className="text-cyan-400">{art.source}</span>
                            <span>{formatRelativeTime(art.publishedAt)}</span>
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Footer */}
                  <div className="text-[10px] text-slate-500 text-center border-t border-slate-800/60 pt-2 flex justify-between items-center">
                    <span>Refreshes automatically</span>
                    <button
                      onClick={() => loadNews(true)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors uppercase tracking-wider text-[9px]"
                      disabled={newsLoading}
                    >
                      Refresh Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Timer Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-6 hover:scale-105 transition-transform flex flex-col justify-between min-h-[220px] select-none shadow-lg shadow-purple-600/25">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                
                {/* Timer Expired Flash Alert */}
                {timerExpired && (
                  <div className="absolute inset-0 bg-red-600 flex flex-col justify-center items-center gap-2 z-20 animate-pulse text-white p-4">
                    <span className="text-4xl">⏰</span>
                    <span className="font-black tracking-widest text-lg">TIME'S UP!</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimerExpired(false);
                        resetTimer();
                      }}
                      className="mt-2 px-4 py-2 bg-white text-red-600 font-bold uppercase rounded-lg text-xs hover:bg-red-50 transition-all active:scale-95 shadow-md"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Header info */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest">FOCUS TIME</p>
                  <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">
                    {isRunning ? "Running" : "Paused"}
                  </span>
                </div>

                {/* Config or Countdown Row */}
                <div className="relative z-10 flex-1 flex flex-col justify-center items-center my-3 w-full">
                  {!isRunning && timeLeft === totalDuration ? (
                    /* Selectors View */
                    <div className="flex gap-4 items-center justify-center">
                      {/* Hours */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customHours + 1) % 24;
                            setCustomHours(nextVal);
                            syncTimeLeft(nextVal, customMinutes, customSeconds);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▲
                        </button>
                        <span className="text-3xl font-black text-white">{customHours.toString().padStart(2, "0")}</span>
                        <span className="text-[8px] font-bold text-purple-200 uppercase tracking-widest">HRS</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customHours - 1 + 24) % 24;
                            setCustomHours(nextVal);
                            syncTimeLeft(nextVal, customMinutes, customSeconds);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▼
                        </button>
                      </div>
                      <span className="text-xl font-bold text-purple-200/50 mt-1">:</span>
                      {/* Minutes */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customMinutes + 1) % 60;
                            setCustomMinutes(nextVal);
                            syncTimeLeft(customHours, nextVal, customSeconds);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▲
                        </button>
                        <span className="text-3xl font-black text-white">{customMinutes.toString().padStart(2, "0")}</span>
                        <span className="text-[8px] font-bold text-purple-200 uppercase tracking-widest">MINS</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customMinutes - 1 + 60) % 60;
                            setCustomMinutes(nextVal);
                            syncTimeLeft(customHours, nextVal, customSeconds);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▼
                        </button>
                      </div>
                      <span className="text-xl font-bold text-purple-200/50 mt-1">:</span>
                      {/* Seconds */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customSeconds + 1) % 60;
                            setCustomSeconds(nextVal);
                            syncTimeLeft(customHours, customMinutes, nextVal);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▲
                        </button>
                        <span className="text-3xl font-black text-white">{customSeconds.toString().padStart(2, "0")}</span>
                        <span className="text-[8px] font-bold text-purple-200 uppercase tracking-widest">SECS</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextVal = (customSeconds - 1 + 60) % 60;
                            setCustomSeconds(nextVal);
                            syncTimeLeft(customHours, customMinutes, nextVal);
                          }}
                          className="text-purple-200 hover:text-white p-1 hover:scale-110 active:scale-90 transition-transform font-bold"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Countdown/Running View */
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-4xl font-black text-white tracking-widest">{formatTime(timeLeft)}</p>
                      <p className="text-[9px] font-bold text-purple-200 mt-2 uppercase tracking-widest">
                        Target: {customHours.toString().padStart(2, "0")}:{customMinutes.toString().padStart(2, "0")}:{customSeconds.toString().padStart(2, "0")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls & Progress */}
                <div className="relative z-10 space-y-3">
                  {/* Controls row */}
                  <div className="flex gap-4 justify-center items-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (timeLeft > 0) {
                          setIsRunning(prev => !prev);
                        }
                      }}
                      disabled={timeLeft === 0}
                      className="px-6 py-2 rounded-full bg-white text-purple-600 hover:bg-purple-100 disabled:opacity-50 transition-colors shadow-lg active:scale-95 transform flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider"
                    >
                      {isRunning ? <Pause size={12} className="fill-purple-600" /> : <Play size={12} className="fill-purple-600 ml-0.5" />}
                      {isRunning ? "Pause" : "Start"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        resetTimer();
                      }}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95 transform flex items-center justify-center"
                      title="Reset"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-1000 ease-linear shadow-glow"
                      style={{ width: `${totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes Card (previously Popcorn Card) */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 to-red-600 p-6 hover:scale-105 transition-all flex flex-col justify-between min-h-[220px]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                
                {/* Header */}
                <div className="relative z-10 flex justify-between items-center w-full mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">NOTES</p>
                    <span className="text-[10px] font-bold text-orange-200 bg-black/25 px-2 py-0.5 rounded-full">
                      {notes.length}
                    </span>
                  </div>
                  {editingNoteId === null && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCreateNote();
                      }}
                      className="p-1 rounded-lg bg-white/20 text-white hover:bg-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-xs font-bold px-2.5 py-1"
                      title="Add Note"
                    >
                      + Add
                    </button>
                  )}
                </div>

                {editingNoteId !== null ? (
                  /* Create / Edit Note Inline Form */
                  <div className="relative z-10 flex-1 flex flex-col justify-between gap-3 w-full">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value.slice(0, 150))}
                      placeholder="Write a quick note..."
                      className="w-full flex-1 bg-black/20 border border-white/25 rounded-xl px-3 py-2 text-xs text-white placeholder-orange-200/60 focus:outline-none focus:border-white/40 transition-all resize-none min-h-[90px]"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[10px] font-bold ${noteText.length >= 140 ? 'text-yellow-300' : 'text-orange-200'}`}>
                        {noteText.length}/150
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancelNote();
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveNote();
                          }}
                          disabled={!noteText.trim()}
                          className="px-3 py-1 text-[10px] font-bold uppercase bg-white text-orange-700 hover:bg-orange-100 rounded-lg disabled:opacity-50 disabled:hover:bg-white transition-all shadow-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Notes List View */
                  <div className="relative z-10 flex-1 flex flex-col justify-between w-full h-full">
                    {notes.length === 0 ? (
                      <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                        <span className="text-3xl mb-1 animate-pulse">📝</span>
                        <p className="text-orange-100 text-xs font-semibold">No notes yet</p>
                        <p className="text-orange-200/70 text-[10px] mt-0.5">Click + Add to create your first note</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto max-h-[140px] pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-white/20">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="flex justify-between gap-3 bg-black/15 hover:bg-black/25 border border-white/5 hover:border-white/10 rounded-xl p-2.5 transition-all group/item"
                          >
                            <p className="text-white text-xs leading-relaxed break-words flex-1 pr-1 font-medium whitespace-pre-wrap">
                              {note.text}
                            </p>
                            <div className="flex gap-1.5 items-start">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditNote(note);
                                }}
                                className="p-1 text-orange-200 hover:text-white transition-colors"
                                title="Edit note"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                className="p-1 text-orange-200 hover:text-red-300 transition-colors"
                                title="Delete note"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Movies Card - Larger */}
              <Link
                to="/movies"
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-6 hover:scale-105 transition-all flex flex-col justify-between min-h-[380px]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 flex flex-col h-full justify-between gap-4 w-full">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">RECOMMENDED MOVIES</p>
                      <h3 className="text-white text-lg font-black">Picked for You</h3>
                    </div>
                    <div className="text-3xl animate-pulse">🎬</div>
                  </div>

                  {recLoading ? (
                    <div className="flex gap-4 py-1 animate-pulse">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex-1 flex flex-col gap-2">
                          <div className="aspect-[2/3] bg-white/10 rounded-xl border border-white/5"></div>
                          <div className="h-3 bg-white/10 rounded w-5/6"></div>
                        </div>
                      ))}
                    </div>
                  ) : recError ? (
                    <div className="flex-1 flex flex-col justify-center items-center py-4 text-center space-y-3">
                      <p className="text-red-200 text-xs font-semibold">⚠️ {recError}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          loadRecommendations(true);
                        }}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-all text-white"
                      >
                        RETRY
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Category Pills/Tabs inside the Movies Card */}
                      {formData.categories.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {formData.categories.map((catId) => {
                            const cat = categories.find((c) => c.id === catId);
                            const isActive = activeCategory === catId;
                            return cat ? (
                              <button
                                key={catId}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveCategory(catId);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase transition-all whitespace-nowrap border ${
                                  isActive
                                    ? "bg-white text-indigo-900 border-white"
                                    : "bg-white/10 text-indigo-100 border-white/15 hover:bg-white/20"
                                }`}
                              >
                                <span>{cat.icon} </span>
                                {cat.label}
                              </button>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Display movies for the active category */}
                      <div className="flex gap-4 py-1 min-h-[140px]">
                        {activeCategory && recommendationsByCategory[activeCategory]?.length > 0 ? (
                          recommendationsByCategory[activeCategory].slice(0, 2).map((movie) => (
                            <div
                              key={movie.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedMovieId(movie.id);
                              }}
                              className="flex-1 flex flex-col gap-2 group/item cursor-pointer"
                            >
                              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/10 shadow bg-slate-900 group-hover/item:border-white/30 transition-all">
                                <img
                                  src={getPosterUrl(movie.poster_path)}
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-bold text-yellow-400">
                                  <Star size={8} className="fill-yellow-400" />
                                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                                </div>
                              </div>
                              <div className="px-0.5">
                                <p className="text-white text-xs font-bold truncate group-hover/item:text-cyan-300 transition-colors leading-tight">
                                  {movie.title}
                                </p>
                                <p className="text-indigo-100 text-[10px] mt-0.5">
                                  {movie.release_date ? movie.release_date.substring(0, 4) : "Unknown"}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-center py-4">
                            <p className="text-indigo-200 text-xs italic">No recommendations loaded</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="text-[10px] text-indigo-100/70 text-center border-t border-white/10 pt-2 flex justify-between items-center w-full">
                    <span>Based on your categories</span>
                    <span className="font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[9px] uppercase tracking-wider">
                      Explore All <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-8 py-3 rounded-lg border-2 border-slate-700 text-white font-bold uppercase tracking-wider hover:border-slate-600 hover:bg-slate-900/50 transition-all"
              >
                START OVER
              </button>
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-400/30 hover:scale-105 transform">
                EXPLORE DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Details Modal Overlay */}
      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </div>
  );
}
