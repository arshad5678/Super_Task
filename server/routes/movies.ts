import { RequestHandler } from "express";

const GENRE_MAP: Record<string, number> = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  scifi: 878,
  documentary: 99,
  romance: 10749,
  fantasy: 14,
};

const MOCK_MOVIES = [
  {
    id: 1,
    title: "The Dark Knight",
    vote_average: 8.5,
    release_date: "2008-07-16",
    poster_path: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 18], // Action, Drama
  },
  {
    id: 2,
    title: "Inception",
    vote_average: 8.3,
    release_date: "2010-07-15",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 878], // Action, Sci-Fi
  },
  {
    id: 3,
    title: "Superbad",
    vote_average: 7.6,
    release_date: "2007-08-17",
    poster_path: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80",
    genre_ids: [35], // Comedy
  },
  {
    id: 4,
    title: "The Conjuring",
    vote_average: 7.5,
    release_date: "2013-07-17",
    poster_path: "https://images.unsplash.com/photo-1505635338218-a6be6d3af635?auto=format&fit=crop&w=400&q=80",
    genre_ids: [27], // Horror
  },
  {
    id: 5,
    title: "Interstellar",
    vote_average: 8.4,
    release_date: "2014-11-05",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    genre_ids: [878, 18], // Sci-Fi, Drama
  },
  {
    id: 6,
    title: "March of the Penguins",
    vote_average: 7.4,
    release_date: "2005-01-26",
    poster_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
    genre_ids: [99], // Documentary
  },
  {
    id: 7,
    title: "The Notebook",
    vote_average: 7.9,
    release_date: "2004-06-25",
    poster_path: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10749, 18], // Romance, Drama
  },
  {
    id: 8,
    title: "Harry Potter and the Sorcerer's Stone",
    vote_average: 7.9,
    release_date: "2001-11-16",
    poster_path: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [14], // Fantasy
  },
  {
    id: 9,
    title: "Dune: Part Two",
    vote_average: 8.3,
    release_date: "2024-02-27",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [878, 28], // Sci-Fi, Action
  },
  {
    id: 10,
    title: "Everything Everywhere All at Once",
    vote_average: 8.0,
    release_date: "2022-03-24",
    poster_path: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=400&q=80",
    genre_ids: [878, 28, 35], // Sci-Fi, Action, Comedy
  },
  {
    id: 11,
    title: "Get Out",
    vote_average: 7.6,
    release_date: "2017-02-24",
    poster_path: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
    genre_ids: [27, 18], // Horror, Drama
  },
  {
    id: 12,
    title: "La La Land",
    vote_average: 7.9,
    release_date: "2016-11-29",
    poster_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10749, 35, 18], // Romance, Comedy, Drama
  },
  {
    id: 13,
    title: "Avatar: The Way of Water",
    vote_average: 7.7,
    release_date: "2022-12-14",
    poster_path: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=400&q=80",
    genre_ids: [878, 28, 14], // Sci-Fi, Action, Fantasy
  },
  {
    id: 14,
    title: "Free Solo",
    vote_average: 8.0,
    release_date: "2018-09-28",
    poster_path: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    genre_ids: [99], // Documentary
  },
  {
    id: 15,
    title: "A Quiet Place",
    vote_average: 7.4,
    release_date: "2018-04-03",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    genre_ids: [27, 878], // Horror, Sci-Fi
  },
  {
    id: 16,
    title: "The Matrix",
    vote_average: 8.2,
    release_date: "1999-03-30",
    poster_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [878, 28], // Sci-Fi, Action
  },
  {
    id: 17,
    title: "Gladiator",
    vote_average: 8.2,
    release_date: "2000-05-01",
    poster_path: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 18], // Action, Drama
  },
  {
    id: 18,
    title: "Spirited Away",
    vote_average: 8.5,
    release_date: "2001-07-20",
    poster_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    genre_ids: [14, 18], // Fantasy, Drama
  }
];

export const handleRecommendations: RequestHandler = async (req, res) => {
  const categoriesQuery = req.query.genres as string; // Comma-separated category names, e.g. "Action,Sci-Fi"
  if (!categoriesQuery) {
    res.json([]);
    return;
  }

  // Convert categories names to genre IDs
  const genres = categoriesQuery.split(",").map(cat => cat.toLowerCase().trim());
  const genreIds = genres.map(g => GENRE_MAP[g] || GENRE_MAP[g.replace("-", "")]).filter(Boolean);

  if (genreIds.length === 0) {
    res.json([]);
    return;
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    // Return mock recommendations matching user selected genres
    const recommendations = MOCK_MOVIES.filter(movie => 
      movie.genre_ids.some(gid => genreIds.includes(gid))
    ).sort((a, b) => b.vote_average - a.vote_average);
    res.json(recommendations);
    return;
  }

  try {
    const genresParam = genreIds.join(",");
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genresParam}&sort_by=popularity.desc`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB recommendations API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("TMDB recommendations fetch failed, returning mock fallback:", error);
    const recommendations = MOCK_MOVIES.filter(movie => 
      movie.genre_ids.some(gid => genreIds.includes(gid))
    ).sort((a, b) => b.vote_average - a.vote_average);
    res.json(recommendations);
  }
};

export const handleSearchMovies: RequestHandler = async (req, res) => {
  const query = req.query.query as string;
  const genreIdStr = req.query.genreId as string;
  const genreId = genreIdStr ? Number(genreIdStr) : null;

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    // Search within our local mock database
    let results = MOCK_MOVIES;
    if (query) {
      results = results.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase().trim())
      );
    }
    if (genreId) {
      results = results.filter(movie => movie.genre_ids.includes(genreId));
    }
    res.json(results.sort((a, b) => b.vote_average - a.vote_average));
    return;
  }

  try {
    let url = "";
    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
    }

    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB search API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("TMDB search fetch failed, returning mock fallback:", error);
    let results = MOCK_MOVIES;
    if (query) {
      results = results.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (genreId) {
      results = results.filter(movie => movie.genre_ids.includes(genreId));
    }
    res.json(results);
  }
};
