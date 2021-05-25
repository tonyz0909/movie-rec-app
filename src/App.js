import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Alert from './components/Alert';
import Menu from './components/Menu';
import OutlinedCard from './components/OutlinedCard';
import Search from './components/Search';
import FiltersDialogue from './components/FiltersDialogue';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const queryMap = {
  'top': `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`,
  'trending': `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}`,
  'popular': `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`
}

function App() {
  // localStorage.removeItem('movieData');
  // retrieve cached data
  const storedData = JSON.parse(localStorage.getItem('movieData'));
  const storedBrowseData = JSON.parse(localStorage.getItem('trending'));

  // movie data
  const [movieData, setMovieData] = useState(storedData || {}); // complete list of movies
  const [filteredMovies, setFilteredMovies] = useState(storedData || []); // filtered list of movies
  const [tmdbMovies, setTmdbMovies] = useState(storedBrowseData || {}); // list of tmdb movies
  const [browseMode, setBrowseMode] = useState('trending');
  const [browsing, setBrowsing] = useState(false); // whether 'browse' tab is selected

  // other config
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // filtering configuration
  const [sortBy, setSortBy] = useState("none");
  const sortingCriteria = ["Search Order", "Google Users", "IMDB", "Rotten Tomatoes"];
  const [filters, setFilters] = useState({
    imdb: 0,
    rt: 0,
    gu: 0,
    duration: 240,
  });
  const [filtersOpen, showFilters] = useState(false);

  // theming
  const classes = useStyles();
  const palletType = darkMode ? 'dark' : 'light';
  const theme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });

  // update cache for search movies
  useEffect(() => {
    // localStorage only accepts strings, so stringify before storing
    localStorage.setItem('movieData', JSON.stringify(movieData));
  }, [movieData]);

  // update cache for browse movies
  useEffect(() => {
    let moviesToShow = JSON.parse(localStorage.getItem(browseMode)) || {};
    setTmdbMovies(moviesToShow);
    updateFilteredMovies(moviesToShow);
  }, [browseMode]);

  // update data to display on grid of cards
  useEffect(() => {
    browsing ? updateFilteredMovies(tmdbMovies) : updateFilteredMovies(movieData);
  }, [sortBy, filters, browsing]);

  // for debug purposes
  // useEffect(() => {
  //   console.error(errors);
  // }, [errors]);

  // remove movie from cache 
  let deleteMovie = (title) => {
    let newMovieData = { ...movieData };
    delete newMovieData[title];
    setMovieData(newMovieData);
    updateFilteredMovies(newMovieData);
  }

  // sort movies and update cards
  let updateFilteredMovies = (movieData) => {
    let unsortedMovies = Object.values(movieData);
    // deep copy first before sorting
    let movieDataSorted = JSON.parse(JSON.stringify(unsortedMovies));
    let comparator = null;
    if (sortBy == 'IMDB') {
      comparator = (a, b) => b.imdbRating - a.imdbRating;
    } else if (sortBy == 'Google Users') {
      comparator = (a, b) => b.googleUsersPercent - a.googleUsersPercent;
    } else if (sortBy == 'Rotten Tomatoes') {
      comparator = (a, b) => b.rottenTomatoesRating - a.rottenTomatoesRating;
    }
    if (comparator) movieDataSorted.sort(comparator);
    else movieDataSorted.reverse(); // sort by recently added

    // filter
    movieDataSorted = movieDataSorted.filter(movie => {
      return movie.imdbRating >= filters['imdb'] && movie.rottenTomatoesRating >= filters['rt'] && movie.googleUsersPercent >= filters['gu'] && movie.durationMins <= filters['duration']
    });
    setFilteredMovies(movieDataSorted);
  }

  let getTmdbMovies = async () => {
    setIsLoading(true);
    let response = await fetch(queryMap[browseMode]);
    let trending = await response.json();
    trending = await getMoviesData(trending);
    setTmdbMovies(trending);
    updateFilteredMovies(trending);
    localStorage.setItem(browseMode, JSON.stringify(trending));
    setIsLoading(false);
  }

  let getMoviesData = async (trending) => {
    let moviesData = {};
    for (let i = 0; i < 20; i++) {
      // console.log(tmdbMovies);
      // console.log(trending.results[i].title);
      // console.log(tmdbMovies[trending.results[i].title]);
      if (!(trending.results[i].title in tmdbMovies)) {
        let imageUrl = `https://image.tmdb.org/t/p/w500/${trending.results[i]['poster_path']}`
        let newMovie = await getUrl(trending.results[i].title, imageUrl);
        if (newMovie) {
          moviesData[trending.results[i].title] = newMovie;
        }
      } else {
        // console.log('using cache for movie: ' + trending.results[i].title);
        moviesData[trending.results[i].title] = tmdbMovies[trending.results[i].title];
      }
    }
    return moviesData;
  }

  // add a searched movie
  let addMovie = (e, movieTitle) => {
    e.preventDefault();
    getUrl(movieTitle, null).then(newMovie => {
      // console.log(newMovie);
      // if movie hasn't already been added, add to movies list
      if (newMovie && !movieData[newMovie.title]) {
        let title = newMovie.title;
        let newMovieData = { ...movieData };
        newMovieData[title] = newMovie;
        setMovieData(newMovieData);
        updateFilteredMovies(newMovieData);
      }
    });
  }

  // google scrape movie by title
  let getUrl = async (movieTitle, imageUrl) => {
    const parser = new DOMParser();
    let query = 'https://www.google.com/search?q=' + encodeURIComponent(movieTitle).replace(/%20/g, "+");
    // console.log(query);

    let response = await fetch(query);
    let data = await response.text();
    const doc = parser.parseFromString(data, "text/html");
    let processedMovieData = await processMovieData(doc, movieTitle, imageUrl);
    return processedMovieData;
  }

  let processMovieData = async (movieHTML, movieTitle, imageUrl) => {
    try {

      let googleUsersRating = movieHTML.getElementsByClassName('srBp4 Vrkhme').length > 0 ? movieHTML.getElementsByClassName('srBp4 Vrkhme')[0].childNodes[0].data : null; // not all movies have google user ratings
      let imdbRating = movieHTML.querySelectorAll('span.gsrt')[0].innerHTML;
      let rottenTomatoesRating = movieHTML.querySelectorAll('span.gsrt')[1].innerHTML;
      let metadata = (movieHTML.getElementsByClassName('wx62f PZPZlf x7XAkb')[0] || movieHTML.querySelectorAll('div.wwUB2c.PZPZlf span')[0]).outerText.split("‧");
      let title = (movieHTML.querySelectorAll('span.u9DLmf')[0] || movieHTML.querySelectorAll('h2.qrShPb.kno-ecr-pt.PZPZlf.mfMhoc span')[0]).innerHTML.replace('&amp;', '&');
      imageUrl = imageUrl || (movieHTML.querySelectorAll('g-img.ivg-i.PZPZlf').length > 0 ? movieHTML.querySelectorAll('g-img.ivg-i.PZPZlf')[0].getAttribute("data-lpage") : null); // not all movies have image thumbnails

      // backup image url option (alternate format)
      if (imageUrl == null) {
        let query = encodeURIComponent(movieTitle).replace(/%20/g, "+");
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=210fc31dd8bed65f0aaba2bf322a7627&language=en-US&query=${query}&page=1&include_adult=false`);
        let json = await response.json();
        if (json.results.length > 0) {
          if (json.results[0].title == title) {
            imageUrl = `https://image.tmdb.org/t/p/w500/${json.results[0]['poster_path']}`;
          }
        }
      }

      // convert ratings into numbers
      imdbRating = parseFloat(imdbRating.slice(0, 3));
      rottenTomatoesRating = parseInt(rottenTomatoesRating.slice(0, 3));
      let googleUsersPercent = googleUsersRating ? parseInt(googleUsersRating.slice(0, 2)) : 0;

      let [rating, year] = metadata.shift().split(" ").slice(0, 2);
      let [genre, duration] = metadata;
      genre = genre.trim();
      duration = duration.trim();
      let durationMins = parseInt(duration[0]) * 60 + parseInt(duration.split(" ")[1].slice(0, -1))
      metadata = {
        rating, year, genre, duration
      }
      // console.log(trailerUrl);
      // console.log(title);
      // console.log(googleUsersRating);
      // console.log("IMBD: " + imdbRating);
      // console.log("Rotton Tomatoes: " + rottenTomatoesRating);
      // console.log(metadata);

      return {
        googleUsersRating,
        googleUsersPercent,
        imdbRating,
        rottenTomatoesRating,
        metadata,
        durationMins,
        title,
        imageUrl,
        // trailerUrl
      };
    } catch (e) {
      console.error(e);
      setErrors(movieTitle);
      return null;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Search
        addMovie={addMovie}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showFilters={showFilters} />
      <Container maxWidth="xl" >
        <Box width="85%" style={{ margin: 'auto' }}>
          <div className={classes.root}>
            <Menu browsing={browsing} setBrowsing={setBrowsing} />
          </div>
          {browsing &&
            <Box style={{ textAlign: 'center' }}>
              <Button onClick={getTmdbMovies} color="primary" disabled={isLoading} style={{ float: 'left' }}><RefreshIcon /></Button>
              <Select
                value={browseMode}
                onChange={(e) => setBrowseMode(e.target.value)}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'trending'}>Trending</MenuItem>
                <MenuItem value={'popular'}>Popular (TMDb)</MenuItem>
                <MenuItem value={'top'}>Top Rated</MenuItem>
              </Select>
            </Box>
          }
          {isLoading &&
            <Box style={{ textAlign: 'center', marginTop: '2em' }}>
              <CircularProgress size={50} />
            </Box>
          }
          <Grid container spacing={4}>
            {filteredMovies[0] && filteredMovies.map((movie) => {
              return (
                <Grid item sm={12} md={6} lg={4} key={movie.title}>
                  <OutlinedCard movieData={movie} deleteMovie={deleteMovie} browsing={browsing} />
                </Grid>
              )
            })}
          </Grid>
          <Alert errors={errors} />
        </Box>
        <FiltersDialogue
          open={filtersOpen}
          close={() => showFilters(false)}
          filters={filters}
          setFilters={setFilters}
          sortingCriteria={sortingCriteria}
          sortBy={sortBy}
          setSortBy={setSortBy} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
