import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Trailer from './Trailer';

const useStyles = makeStyles({
  root: {
    minWidth: 400,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

let getColor = (rating, isIMDB) => {
  if (isIMDB == true && rating == 10 || rating == 100) {
    return 'blue';
  } else if (isIMDB == true && rating > 7.5 || rating > 85) {
    return 'green';
  } else if (isIMDB == true && rating > 6 || rating > 75) {
    return 'orange';
  } else {
    return 'red';
  }
}

export default function OutlinedCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const imgSrc = props.movieData['imageUrl'] || 'https://popcornusa.s3.amazonaws.com/placeholder-movieimage.png';
  const guColor = getColor(props.movieData['googleUsersPercent'], false);
  const imdbColor = getColor(props.movieData['imdbRating'], true);
  const rtColor = getColor(props.movieData['rottenTomatoesRating'], false);

  // const ratings = getRatings();

  // let getRatings = () => {
  //   []
  // }

  return (
    <Card className={classes.root} variant="outlined" style={{maxWidth:"450px", margin:'auto'}}>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
          Word of the Day
        </Typography> */}
            <Typography variant="h6" component="h2">
              {props.movieData['title']}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {Object.values(props.movieData['metadata']).join(" ‧ ")}
            </Typography>
            <Grid container spacing={2} style={{marginTop: '1.5em'}}>
              <Grid item xs={4} style={{textAlign:'center'}}>
                <span style={{color:guColor}}>
                  {props.movieData['googleUsersPercent']}%<br/>
                Google Users
                </span>
              </Grid>
              <Grid item xs={4} style={{textAlign:'center'}}>
                <span style={{color:imdbColor}}>
                  {props.movieData['imdbRating']}/10<br/>
                IMDb
                </span>
              </Grid>
              <Grid item xs={4} style={{textAlign:'center'}}>
                <span style={{color:rtColor}}>
                  {props.movieData['rottenTomatoesRating']}%<br/>
                Rotten Tomatoes
                </span>
              </Grid>
            </Grid>
            {/* <Typography variant="body1" component="p">
              {props.movieData['googleUsersRating']}
            </Typography>
            <Typography variant="body1" component="p">
              IMBD rating: {props.movieData['imdbRating']}/10
            </Typography>
            <Typography variant="body1" component="p">
              Rotten Tomatoes score: {props.movieData['rottenTomatoesRating']}%
            </Typography> */}
            {/* <Trailer url={props.movieData['trailerUrl']}/> */}
          </Grid>
          <Grid item xs={4}>
            <Trailer imgSrc={imgSrc} url={props.movieData['trailerUrl']} />
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}