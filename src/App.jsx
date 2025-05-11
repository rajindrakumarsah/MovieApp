import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

//API -  application programming interface - a set of rules that allows one software apllication to talk  to another 

// we have to set api base url from where this api came (base part of the url)
const API_BASE_URL = 'https://api.themoviedb.org/3';

//importing the token key which we have taken from tmdb api , which we put on .env.local due to security reason , we can also put here , but we dont have to
const API_KEY = import.meta.env.VITE_IMDB_API_KEY;

// | Code                               | Meaning                                                  |
// | ---------------------------------- | -------------------------------------------------------- |
// | `method: 'GET'`                    | You are making a **GET** request (to fetch data)         |
// | `headers`                          | You are sending **extra info** in the request            |
// | `accept: 'application/json'`       | You are saying: "I want the response in **JSON** format" |
// | `Authorization: Bearer ${API_KEY}` | You are sending an **API key** to authorize your request |

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // setting state for search
  const [searchTerm, setSearchTerm] = useState('');
  // setting state for error rendering
  const [errorMessage, setErrorMessage] = useState('');
  // setting state for movie
  const [movieList, setMovieList] = useState([]);
  // setting state for Loading
  const [isLoading, setIsLoading] = useState(false);
  // setting state for debounce 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // setting state for trending movies
  const [trendingMovies, setTrendingMovies] = useState([]);

  //call useDebounce hooks with 500 mili second
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies Function - Here query is placed as param to add search function
  const fetchMovies = async (query = '') => {
    //setting the loading true untill is loaded till that time error message is empty
    setIsLoading(true);
    setErrorMessage('');

    try {
      // defining exact endpoint and here is also one cditn : when search query exist it will give same movie ,
      // here we use encodeURIComponent which is used to optimize query, by which if we give uper lower, escape character , it will work fine
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      //calling the api , fetch is used to get the data from website as reply 
      const response = await fetch(endpoint, API_OPTIONS);

      //if the response not work
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      //else , we will get data
      const data = await response.json();

      //if something wrong gonaa happen , then it will throw error
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      // else , it will give result 
      setMovieList(data.results || []);

      // ✅ Only update search count if a valid query and at least one result
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]); // updatd search count everytime when we searched any movie, to show trending list
      }

    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      // no matter what happend , if there is error show error or show results and stop the loading 
      setIsLoading(false);
    }
  };

  // Loadtrendingmovies function to fetch trending movies from Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  };

  //by using useEffect we are fetching the movies
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
    // wehen ever changes , debouncedSearchTerm function is recalled then fetchMovies will be called
    //instead of SearchTerm we use debouncedSearchTerm to optimize the search by waiting 5 second when we stopped typinng then it will show the result
  }, [debouncedSearchTerm]);


  //useEffect for trending movies 
  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>
        {/* pattern is cutom layer by which background imported */}
      <div className="pattern" />
      <div className="wrapper">

        {/* first secttion */}
        <header>

          {/* //adding hero image of header */}
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>

          {/* adding search component :  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          means → "Hey Search component, here’s my state and updater — you can use them!" */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Below Header , we have to place Trending Movie list */}
        {/* if trending movie exitst */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {/* mapping all trendig movies */}
              {trendingMovies.map((movie, index) => (
                // here , key is movie.$id because data is coming from database
                <li key={movie.$id}>
                  {/* index is staring from zero , that's why i  increased it's count */}
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

        {/*this is connditonal rendering : if the movies is not rendered yet till that time show loading spinner
        or if there is error then Render the error message Else Render the movie list within moviecard */}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {/* whenever we want to show any data on react we use map function to map along with that we also use key=id for recognizing
               particular movie , here is condition , if we want to see the details of any movie then key={movie.id} is mandatory to fetch 
               same movie details . here {movie} is props by which all of the info come from moviecard.jsx */}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
