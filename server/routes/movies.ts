import { RequestHandler } from "express";

const GENRE_MAP: Record<string, number> = {
  action: 28,
  comedy: 35,
  drama: 18,
  music: 10402,
  sports: 10770,
  thriller: 53,
  fantasy: 14,
  romance: 10749,
};

const MOCK_MOVIES = [
  {
    id: 1,
    title: "The Dark Knight",
    vote_average: 8.5,
    release_date: "2008-07-16",
    poster_path: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 18], // Action, Drama
    runtime: 152,
    genres: ["Action", "Drama"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Maggie Gyllenhaal", "Gary Oldman"]
  },
  {
    id: 2,
    title: "Inception",
    vote_average: 8.3,
    release_date: "2010-07-15",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 53], // Action, Thriller
    runtime: 148,
    genres: ["Action", "Thriller"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy", "Ken Watanabe"]
  },
  {
    id: 3,
    title: "Superbad",
    vote_average: 7.6,
    release_date: "2007-08-17",
    poster_path: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80",
    genre_ids: [35], // Comedy
    runtime: 113,
    genres: ["Comedy"],
    plot: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-filled party goes awry.",
    cast: ["Jonah Hill", "Michael Cera", "Christopher Mintz-Plasse", "Bill Hader", "Seth Rogen"]
  },
  {
    id: 4,
    title: "The Conjuring",
    vote_average: 7.5,
    release_date: "2013-07-17",
    poster_path: "https://images.unsplash.com/photo-1505635338218-a6be6d3af635?auto=format&fit=crop&w=400&q=80",
    genre_ids: [53], // Thriller
    runtime: 112,
    genres: ["Thriller"],
    plot: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    cast: ["Vera Farmiga", "Patrick Wilson", "Lili Taylor", "Ron Livingston", "Shanley Caswell"]
  },
  {
    id: 5,
    title: "Interstellar",
    vote_average: 8.4,
    release_date: "2014-11-05",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    genre_ids: [18, 14], // Drama, Fantasy
    runtime: 169,
    genres: ["Drama", "Fantasy"],
    plot: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Bill Irwin", "Ellen Burstyn"]
  },
  {
    id: 6,
    title: "Whiplash",
    vote_average: 8.5,
    release_date: "2014-10-10",
    poster_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
    genre_ids: [18, 10402], // Drama, Music
    runtime: 106,
    genres: ["Drama", "Music"],
    plot: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser", "Melissa Benoist", "Austin Stowell"]
  },
  {
    id: 7,
    title: "The Notebook",
    vote_average: 7.9,
    release_date: "2004-06-25",
    poster_path: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10749, 18], // Romance, Drama
    runtime: 123,
    genres: ["Romance", "Drama"],
    plot: "An elderly man reads to a woman with Alzheimer's from a notebook that tells the story of a young couple who fell in love in the 1940s.",
    cast: ["Ryan Gosling", "Rachel McAdams", "James Garner", "Gena Rowlands", "James Marsden"]
  },
  {
    id: 8,
    title: "Harry Potter and the Sorcerer's Stone",
    vote_average: 7.9,
    release_date: "2001-11-16",
    poster_path: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [14], // Fantasy
    runtime: 152,
    genres: ["Fantasy"],
    plot: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Richard Harris", "Maggie Smith"]
  },
  {
    id: 9,
    title: "Dune: Part Two",
    vote_average: 8.3,
    release_date: "2024-02-27",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 14], // Action, Fantasy
    runtime: 166,
    genres: ["Action", "Fantasy"],
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"]
  },
  {
    id: 10,
    title: "Everything Everywhere All at Once",
    vote_average: 8.0,
    release_date: "2022-03-24",
    poster_path: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 35, 14], // Action, Comedy, Fantasy
    runtime: 139,
    genres: ["Action", "Comedy", "Fantasy"],
    plot: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis", "James Hong"]
  },
  {
    id: 11,
    title: "Get Out",
    vote_average: 7.6,
    release_date: "2017-02-24",
    poster_path: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
    genre_ids: [53, 18], // Thriller, Drama
    runtime: 104,
    genres: ["Thriller", "Drama"],
    plot: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception eventually reaches a boiling point.",
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford", "Catherine Keener", "Lil Rel Howery"]
  },
  {
    id: 12,
    title: "La La Land",
    vote_average: 7.9,
    release_date: "2016-11-29",
    poster_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10749, 35, 10402], // Romance, Comedy, Music
    runtime: 128,
    genres: ["Romance", "Comedy", "Music"],
    plot: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    cast: ["Ryan Gosling", "Emma Stone", "Amiée Conn", "Terry Walters", "John Legend"]
  },
  {
    id: 13,
    title: "Avatar: The Way of Water",
    vote_average: 7.7,
    release_date: "2022-12-14",
    poster_path: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 14], // Action, Fantasy
    runtime: 192,
    genres: ["Action", "Fantasy"],
    plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    cast: ["Sam Worthington", "Zoe Saldaña", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"]
  },
  {
    id: 14,
    title: "Creed III",
    vote_average: 7.2,
    release_date: "2023-03-01",
    poster_path: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10770, 18], // Sports, Drama
    runtime: 116,
    genres: ["Sports", "Drama"],
    plot: "After dominating the boxing world, Adonis Creed has been thriving in both his career and family life. When a childhood friend and former boxing prodigy, Damian, resurfaces, the face-off is more than just a fight.",
    cast: ["Michael B. Jordan", "Tessa Thompson", "Jonathan Majors", "Wood Harris", "Phylicia Rashad"]
  },
  {
    id: 15,
    title: "A Quiet Place",
    vote_average: 7.4,
    release_date: "2018-04-03",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    genre_ids: [53], // Thriller
    runtime: 90,
    genres: ["Thriller"],
    plot: "A family struggles for survival in a world where most humans have been killed by blind but noise-sensitive creatures. They are forced to communicate in sign language to keep the creatures at bay.",
    cast: ["Emily Blunt", "John Krasinski", "Millicent Simmonds", "Noah Jupe", "Cade Woodward"]
  },
  {
    id: 16,
    title: "Rocky",
    vote_average: 8.0,
    release_date: "1976-11-21",
    poster_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    genre_ids: [10770, 18], // Sports, Drama
    runtime: 120,
    genres: ["Sports", "Drama"],
    plot: "A small-time Philadelphia boxer gets a supremely rare chance to fight the world heavy-weight champion in a bout in which he strives to go the distance for his self-respect.",
    cast: ["Sylvester Stallone", "Talia Shire", "Burt Young", "Carl Weathers", "Burgess Meredith"]
  },
  {
    id: 17,
    title: "Gladiator",
    vote_average: 8.2,
    release_date: "2000-05-01",
    poster_path: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80",
    genre_ids: [28, 18], // Action, Drama
    runtime: 155,
    genres: ["Action", "Drama"],
    plot: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen", "Oliver Reed", "Richard Harris"]
  },
  {
    id: 18,
    title: "Spirited Away",
    vote_average: 8.5,
    release_date: "2001-07-20",
    poster_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    genre_ids: [14, 18], // Fantasy, Drama
    runtime: 125,
    genres: ["Fantasy", "Drama"],
    plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki", "Takeshi Naito", "Yasuko Sawaguchi"]
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

export const handleMovieDetails: RequestHandler = async (req, res) => {
  const idStr = req.query.id as string;
  if (!idStr) {
    res.status(400).json({ error: "Movie ID is required" });
    return;
  }

  const id = Number(idStr);
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    const movie = MOCK_MOVIES.find(m => m.id === id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(movie);
    return;
  }

  try {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB movie details responded with status ${response.status}`);
    }
    const data = await response.json();
    
    // Map TMDB response structure to our enriched details structure
    const details = {
      id: data.id,
      title: data.title,
      vote_average: data.vote_average,
      release_date: data.release_date,
      poster_path: data.poster_path 
        ? (data.poster_path.startsWith("http") ? data.poster_path : `https://image.tmdb.org/t/p/w500${data.poster_path}`)
        : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
      runtime: data.runtime || 120,
      genres: data.genres ? data.genres.map((g: any) => g.name) : [],
      plot: data.overview || "No overview available.",
      cast: data.credits?.cast ? data.credits.cast.slice(0, 5).map((c: any) => c.name) : []
    };
    
    res.json(details);
  } catch (error) {
    console.error("TMDB movie details fetch failed, returning mock fallback if available:", error);
    const movie = MOCK_MOVIES.find(m => m.id === id);
    if (!movie) {
      res.json({
        id,
        title: "Unknown Movie",
        vote_average: 0,
        release_date: "",
        poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
        runtime: 120,
        genres: [],
        plot: "Details could not be loaded from TMDB API.",
        cast: []
      });
      return;
    }
    res.json(movie);
  }
};
