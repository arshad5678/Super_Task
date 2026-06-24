import { useState } from "react";
import { ChevronRight, Eye, EyeOff, ArrowRight } from "lucide-react";

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
    { id: "action", label: "Action", icon: "🔥", color: "from-red-500 via-orange-500 to-yellow-400", darkColor: "from-red-600 to-orange-700" },
    { id: "comedy", label: "Comedy", icon: "😄", color: "from-yellow-400 to-amber-500", darkColor: "from-yellow-500 to-amber-600" },
    { id: "drama", label: "Drama", icon: "🎭", color: "from-purple-500 to-indigo-600", darkColor: "from-purple-600 to-indigo-700" },
    { id: "thriller", label: "Thriller", icon: "🎬", color: "from-pink-500 to-red-600", darkColor: "from-pink-600 to-red-700" },
    { id: "horror", label: "Horror", icon: "👑", color: "from-green-500 to-teal-600", darkColor: "from-green-600 to-teal-700" },
    { id: "romance", label: "Romance", icon: "💕", color: "from-pink-400 to-rose-500", darkColor: "from-pink-500 to-rose-600" },
    { id: "scifi", label: "Sci-fi", icon: "🚀", color: "from-blue-500 to-cyan-500", darkColor: "from-blue-600 to-cyan-600" },
    { id: "fantasy", label: "Fantasy", icon: "✨", color: "from-indigo-500 to-purple-600", darkColor: "from-indigo-600 to-purple-700" },
    { id: "documentary", label: "Documentary", icon: "🎥", color: "from-amber-600 to-orange-700", darkColor: "from-amber-700 to-orange-800" },
    { id: "music", label: "Music", icon: "🎵", color: "from-purple-500 to-pink-500", darkColor: "from-purple-600 to-pink-600" },
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
    if (formData.fullName && formData.username && formData.email && formData.mobile && formData.password) {
      setCurrentStep(1);
    }
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

            {/* Decorative Elements */}
            <div className="hidden lg:block pt-8">
              <div className="w-32 h-32 border border-cyan-400/20 rounded-lg absolute bottom-20 left-20 animate-pulse" />
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
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                      required
                    />
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
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                    required
                  />
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
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
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
                </div>

                {/* Terms */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
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
                  className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30"
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
            <div className="flex justify-end">
              <button
                onClick={handleCategoriesNext}
                disabled={formData.categories.length === 0}
                className="group px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30 flex items-center gap-2"
              >
                CONTINUE
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
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
            <button
              onClick={handleProfileNext}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30"
            >
              CONTINUE TO DASHBOARD
            </button>
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
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-2">WEATHER</p>
                    <p className="text-5xl font-black">32°C</p>
                  </div>
                  <div className="text-6xl">☀️</div>
                </div>
              </div>

              {/* Humidity Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-600 to-blue-600 p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-semibold mb-2">HUMIDITY</p>
                    <p className="text-5xl font-black">65%</p>
                  </div>
                  <div className="text-6xl">💧</div>
                </div>
              </div>

              {/* News Card */}
              <div className="group rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-700 p-6 hover:border-slate-600 hover:scale-105 transition-all backdrop-blur-sm">
                <div className="flex gap-4 h-full flex-col justify-between">
                  <div className="text-4xl">📰</div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2 tracking-widest">BREAKING NEWS</p>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      New streaming features available for all users
                    </p>
                  </div>
                </div>
              </div>

              {/* Timer Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-purple-100 font-semibold mb-2">FOCUS TIME</p>
                  <p className="text-5xl font-black">25:00</p>
                </div>
              </div>

              {/* Popcorn Card */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 to-red-600 p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold">POPCORN</p>
                    <p className="text-2xl font-black mt-1">Movie Time</p>
                  </div>
                  <div className="text-6xl">🍿</div>
                </div>
              </div>

              {/* Movies Card - Larger */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-6 hover:scale-105 transition-transform cursor-pointer md:col-span-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                <div className="relative z-10 space-y-4 h-32 flex flex-col justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-semibold">MOVIES</p>
                    <p className="text-xl font-black mt-1">Action & Thriller</p>
                  </div>
                  <div className="text-4xl">🎬</div>
                </div>
              </div>
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
    </div>
  );
}
