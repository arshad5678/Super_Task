import { useState, useMemo } from "react";
import { ChevronRight, Eye, EyeOff, Cloud, Droplets } from "lucide-react";

export default function Index() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    categories: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);

  const categories = [
    { id: "action", label: "Action", icon: "🔥", color: "from-orange-600 to-red-600" },
    { id: "comedy", label: "Comedy", icon: "😄", color: "from-yellow-500 to-yellow-600" },
    { id: "drama", label: "Drama", icon: "🎭", color: "from-purple-600 to-purple-700" },
    { id: "thriller", label: "Thriller", icon: "🎬", color: "from-red-600 to-pink-600" },
    { id: "horror", label: "Horror", icon: "👑", color: "from-green-600 to-teal-600" },
    { id: "romance", label: "Romance", icon: "💕", color: "from-pink-600 to-red-600" },
    { id: "scifi", label: "Sci-fi", icon: "🚀", color: "from-blue-600 to-blue-700" },
    { id: "fantasy", label: "Fantasy", icon: "✨", color: "from-indigo-600 to-indigo-700" },
    { id: "documentary", label: "Documentary", icon: "🎥", color: "from-amber-700 to-amber-800" },
    { id: "music", label: "Music", icon: "🎵", color: "from-purple-600 to-pink-600" },
  ];

  const toggleCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  const handleCategoriesNext = () => {
    if (formData.categories.length > 0) {
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
    <div className="min-h-screen bg-black text-white">
      {/* Step Indicators */}
      <div className="fixed top-6 right-6 flex items-center gap-2 text-sm">
        <span className="text-cyan-400 font-semibold">Step {currentStep + 1} of 4</span>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`w-2 h-2 rounded-full transition-all ${
                currentStep >= step.number - 1 ? "bg-cyan-400 w-6" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Sign Up */}
      {currentStep === 0 && (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Side - Hero */}
          <div className="flex flex-col justify-center items-center lg:items-start space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Discover new
                <br />
                things on
                <br />
                <span className="text-cyan-400">SuperApp</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Create your account to explore categories,
                <br />
                movies, and curated content personalized for you.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-cyan-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Fresh Picks</p>
                  <p className="text-slate-400 text-sm">Tailored recommendations</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Quick Start</p>
                  <p className="text-slate-400 text-sm">Sign up in under a minute</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block absolute bottom-0 left-0 w-96 h-96 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-md space-y-6">
              <div>
                <p className="text-cyan-400 text-sm font-semibold mb-2">CREATE ACCOUNT</p>
                <h3 className="text-3xl font-bold">Register for SuperApp</h3>
                <p className="text-slate-400 text-sm mt-2">
                  Complete your profile and continue
                  <br />
                  to category discovery.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Full name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Username</label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Mobile number</label>
                  <input
                    type="tel"
                    placeholder="Enter to signal mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-400">
                    I agree to the <span className="text-slate-300">Terms and Conditions</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors mt-6"
                >
                  SIGN UP
                </button>
              </form>

              <p className="text-center text-slate-400 text-sm">
                Already have an account?{" "}
                <span className="text-slate-300 hover:text-cyan-400 cursor-pointer">Login</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Choose Categories */}
      {currentStep === 1 && (
        <div className="min-h-screen p-8 flex flex-col">
          <div className="max-w-6xl mx-auto w-full flex-1">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2">Choose your entertainment category</h2>
              <p className="text-slate-400">
                Select the type of content you want to see. Your selections
                <br />
                will shape the recommendations and dashboard experience.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`relative overflow-hidden rounded-lg p-4 h-32 transition-all transform hover:scale-105 ${
                    formData.categories.includes(category.id)
                      ? `bg-gradient-to-br ${category.color} ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/50`
                      : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <span className="text-3xl">{category.icon}</span>
                    <span className="text-sm font-semibold">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <button
                onClick={handleCategoriesNext}
                disabled={formData.categories.length === 0}
                className="w-full px-6 py-3 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                CONTINUE
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Profile Setup */}
      {currentStep === 2 && (
        <div className="min-h-screen p-8 flex flex-col justify-center items-center">
          <div className="max-w-2xl w-full space-y-8">
            <div>
              <p className="text-cyan-400 text-sm font-semibold mb-2">STEP 3 OF 4</p>
              <h2 className="text-4xl font-bold mb-2">Your profile</h2>
              <p className="text-slate-400">
                Review your details and selected categories
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 space-y-4 border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {formData.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">{formData.fullName}</p>
                  <p className="text-slate-400">@{formData.username}</p>
                  <p className="text-slate-500 text-sm">{formData.email}</p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-300 font-semibold mb-3">Selected Categories</p>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return cat ? (
                      <div
                        key={catId}
                        className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-sm font-medium border border-cyan-400/50"
                      >
                        {cat.icon} {cat.label}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <div className="flex gap-3">
                <span className="text-yellow-400 text-xl">📝</span>
                <div>
                  <p className="font-semibold text-slate-300">Notes</p>
                  <p className="text-slate-400 text-sm">Build something amazing today! 🚀</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleProfileNext}
              className="w-full py-3 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors"
            >
              CONTINUE TO DASHBOARD
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Dashboard */}
      {currentStep === 3 && (
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-cyan-400 text-sm font-semibold mb-2">STEP 4 OF 4</p>
              <h2 className="text-4xl font-bold">Your dashboard will look</h2>
              <p className="text-slate-400 mt-1">
                Here's a preview of your personalized dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weather Widget */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Weather</p>
                    <p className="text-3xl font-bold text-white">32°C</p>
                  </div>
                  <div className="text-5xl">☀️</div>
                </div>
              </div>

              {/* Humidity Widget */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Humidity</p>
                    <p className="text-3xl font-bold text-white">65%</p>
                  </div>
                  <div className="text-5xl">💧</div>
                </div>
              </div>

              {/* News Widget */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex gap-3">
                  <div className="text-4xl">📝</div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold mb-2">NEWS</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Tech giants avoid seen yet in
                      modern of digital world
                    </p>
                  </div>
                </div>
              </div>

              {/* Timer Widget */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-center h-24">
                  <div className="text-center">
                    <p className="text-3xl font-bold">25:00</p>
                    <p className="text-sm text-purple-100">Timer</p>
                  </div>
                </div>
              </div>

              {/* Popcorn Widget - Bubble Style */}
              <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <p className="text-pink-100 text-sm font-semibold">Popcorn</p>
                    <p className="text-2xl font-bold text-white mt-1">Movie Time</p>
                  </div>
                  <div className="text-5xl">🍿</div>
                </div>
              </div>

              {/* Movie Widget */}
              <div className="lg:col-span-1 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-center h-32">
                  <div className="text-5xl">🎬</div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white mb-2">Movies</p>
                  <p className="text-slate-400 text-sm">Action & Thriller</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">4.8 K</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-6 py-3 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                Start Over
              </button>
              <button className="flex-1 py-3 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
