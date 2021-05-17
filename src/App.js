import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Alert from './components/Alert';
import Filters from './components/Filters';
import Menu from './components/Menu';
import OutlinedCard from './components/OutlinedCard';
import Trailer from './components/Trailer';
import Search from './components/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function App() {
  // localStorage.removeItem('movieData');
  const storedData = JSON.parse(localStorage.getItem('movieData'));
  const storedTrendingData = JSON.parse(localStorage.getItem('trendingMovies'));
  const [darkMode, setDarkMode] = useState(false);
  // const testData = require('./test-data.json');
  // const [title, setTitle] = useState("batman begins");
  const [movieData, setMovieData] = useState(storedData || {}); // complete list of movies, test json - testData
  const [filteredMovies, setFilteredMovies] = useState(storedData || []); // filtered list of movies
  const [trendingMovies, setTrendingMovies] = useState(storedTrendingData || {});
  const [useTrending, setUseTrending] = useState(false);
  const [errors, setErrors] = useState([]);
  const [sortBy, setSortBy] = useState("none");
  const sortingCriteria = ["Search Order", "Google Users", "IMDB", "Rotten Tomatoes"];
  const [filters, setFilters] = useState({
    imdb: 0,
    rt: 0,
    gu: 0,
    duration: 240,
  });
  const classes = useStyles();

  const palletType = darkMode ? 'dark' : 'light';
  const theme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });

  useEffect(() => {
    // localStorage only accepts strings, so stringify before storing
    localStorage.setItem('movieData', JSON.stringify(movieData));
    // console.log(movieData);
  }, [movieData]);

  useEffect(() => {
    // localStorage only accepts strings, so stringify before storing
    localStorage.setItem('trendingMovies', JSON.stringify(trendingMovies));
    // console.log(trendingMovies);
  }, [trendingMovies]);

  // useEffect(() => {
  //   console.log(filteredMovies);
  // }, [filteredMovies]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    useTrending ? updateFilteredMovies(trendingMovies) : updateFilteredMovies(movieData);
  }, [sortBy, filters, useTrending]);

  let deleteMovie = (title) => {
    let newMovieData = { ...movieData };
    delete newMovieData[title];
    setMovieData(newMovieData);
    updateFilteredMovies(newMovieData);
  }

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
    else movieDataSorted.reverse(); // sort by recency added

    // filter
    movieDataSorted = movieDataSorted.filter(movie => {
      return movie.imdbRating >= filters['imdb'] && movie.rottenTomatoesRating >= filters['rt'] && movie.googleUsersPercent >= filters['gu'] && movie.durationMins <= filters['duration']
    });
    setFilteredMovies(movieDataSorted);
  }

  let getTrendingMovies = async () => {
    // https://developers.themoviedb.org/3/discover/movie-discover
    // fetch("https://api.themoviedb.org/3/discover/movie?api_key=210fc31dd8bed65f0aaba2bf322a7627&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=2021&with_watch_monetization_types=flatrate")
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data.results.map(result => result.title));
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    //https://api.themoviedb.org/3/trending/movie/week?api_key=210fc31dd8bed65f0aaba2bf322a7627

    // setUseTrending(true);
    let response = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=210fc31dd8bed65f0aaba2bf322a7627");
    let trending = await response.json();
    console.log(trending);
    trending = await getMoviesData(trending);
    console.log(trending);
    setTrendingMovies(trending);
    updateFilteredMovies(trending);
  }

  let getMoviesData = async (trending) => {
    let moviesData = trendingMovies;
    for (let i = 0; i < 20; i++) {
      console.log(trendingMovies);
      console.log(trending.results[i].title);
      console.log(trendingMovies[trending.results[i].title]);
      if (!(trending.results[i].title in trendingMovies)) {
        let imageUrl = `https://image.tmdb.org/t/p/w500/${trending.results[i]['poster_path']}`
        let newMovie = await getUrl(trending.results[i].title, imageUrl);
        if (newMovie) {
          moviesData[trending.results[i].title] = newMovie;
        }
      } else {
        console.log('movie already in cache');
      }
    }
    return moviesData;
  }

  let addMovie = (e, movieTitle) => {
    e.preventDefault();
    getUrl(movieTitle, null).then(newMovie => {
      console.log(newMovie);
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

  let getUrl = async (movieTitle, imageUrl) => {
    const parser = new DOMParser();
    let query = 'https://www.google.com/search?q=' + encodeURIComponent(movieTitle).replace(/%20/g, "+"); // + "+movie";
    console.log(query);

    let response = await fetch(query);
    let data = await response.text();
    const doc = parser.parseFromString(data, "text/html");
    let processedMovieData = await processMovieData(doc, movieTitle, imageUrl);
    return processedMovieData;
  }

  let processMovieData = async (movieHTML, movieTitle, imageUrl) => {
    // TODO: dynamically retrieve rating type instead of hardcoding (e.g. imdb = 0th index)
    // TODO: error handling (e.g. entering invalid movie name)
    // if (!movieHTML.getElementsByClassName('srBp4 Vrkhme')[0]) {
    //   alert("movie not found: " + movieTitle);
    //   return null;
    // }
    // console.log(movieHTML);
    try {

      let googleUsersRating = movieHTML.getElementsByClassName('srBp4 Vrkhme').length > 0 ? movieHTML.getElementsByClassName('srBp4 Vrkhme')[0].childNodes[0].data : null; // not all movies have google user ratings
      let imdbRating = movieHTML.querySelectorAll('span.gsrt')[0].innerHTML;
      let rottenTomatoesRating = movieHTML.querySelectorAll('span.gsrt')[1].innerHTML;
      let metadata = (movieHTML.getElementsByClassName('wx62f PZPZlf x7XAkb')[0] || movieHTML.querySelectorAll('div.wwUB2c.PZPZlf span')[0]).outerText.split("‧");
      let title = (movieHTML.querySelectorAll('span.u9DLmf')[0] || movieHTML.querySelectorAll('h2.qrShPb.kno-ecr-pt.PZPZlf.mfMhoc span')[0]).innerHTML;
      imageUrl = imageUrl || (movieHTML.querySelectorAll('g-img.ivg-i.PZPZlf').length > 0 ? movieHTML.querySelectorAll('g-img.ivg-i.PZPZlf')[0].getAttribute("data-lpage") : null); // not all movies have image thumbnails
      let trailerUrl = movieHTML.querySelectorAll('a.WpKAof').length > 0 ? movieHTML.querySelectorAll('a.WpKAof')[0].getAttribute("href") : null;
      // console.log(Array.from(movieHTML.querySelectorAll('div.liYKde.g.VjDLd div.eA0Zlc.ivg-i.PtaMgb.PZPZlf img.rISBZc.M4dUYb')).map(e => e.getAttribute("src")));

      // backup image url option (alternate format)
      if (imageUrl == null) {
        let query = encodeURIComponent(movieTitle).replace(/%20/g, "+");
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=210fc31dd8bed65f0aaba2bf322a7627&language=en-US&query=${query}&page=1&include_adult=false`);
        let json = await response.json();
        if (json.results.length > 0) {
          imageUrl = `https://image.tmdb.org/t/p/w500/${json.results[0]['poster_path']}`;
        }
      }

      // console.log(trailerUrl);
      if (trailerUrl != null) {
        console.log(trailerUrl.split("v="));
        trailerUrl = 'https://www.youtube.com/embed/' + trailerUrl.split("v=")[1];
      }

      // console.log(imageUrl);

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
        trailerUrl
      };
    } catch (e) {
      console.error(e);
      setErrors(movieTitle);
      return null;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <ThemeProvider> */}
      <CssBaseline />
      <Container maxWidth="xl" >
        <Box width="85%" style={{ margin: 'auto' }}>
          <div className={classes.root}>
            <FormControlLabel
              control={<Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="primary"
                name="Dark Mode"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />}
              label="Dark Mode"
              style={{float:'right'}}
            />
            <Search addMovie={addMovie} />
            <div>
              <Filters
                filters={filters}
                setFilters={setFilters}
                sortingCriteria={sortingCriteria}
                sortBy={sortBy}
                setSortBy={setSortBy} />
            </div>
            <Menu useTrending={useTrending} setUseTrending={setUseTrending} />
          </div>
          {/* <Button variant="contained" onClick={getTrendingMovies} color="primary">Get Trending Movies</Button> */}
          <Grid container spacing={4}>
            {filteredMovies[0] && filteredMovies.map((movie) => {
              return (
                <Grid item sm={12} md={6} lg={4}>
                  <OutlinedCard movieData={movie} deleteMovie={deleteMovie} useTrending={useTrending} />
                </Grid>
              )
            })}
          </Grid>
          {useTrending && <Button onClick={getTrendingMovies} color="primary">Update Trending Movies</Button>}
          <Alert errors={errors} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
