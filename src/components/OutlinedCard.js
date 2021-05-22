import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Trailer, { SimpleDialog } from './Trailer';

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
    return '#3a5ad1';
  } else if (isIMDB == true && rating > 7.5 || rating > 85) {
    return '#31b830'; // '#77DD76';
  } else if (isIMDB == true && rating > 6 || rating > 70) {
    return 'orange';
  } else {
    return '#FF6962'; // '#db3d00';
  }
}


export default function OutlinedCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const imgSrc = props.movieData['imageUrl'] || 'https://popcornusa.s3.amazonaws.com/placeholder-movieimage.png';
  const guColor = getColor(props.movieData['googleUsersPercent'], false);
  const imdbColor = getColor(props.movieData['imdbRating'], true);
  const rtColor = getColor(props.movieData['rottenTomatoesRating'], false);

  const [showClose, setClose] = useState('none');

  // dialog handler
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <Card className={classes.root} variant="outlined" style={{ maxWidth: "450px", margin: 'auto' }}>
      <CardContent
        style={{ position: 'relative' }}
        onMouseEnter={() => setClose('block')}
        onMouseLeave={() => setClose('none')}>
        {!props.browsing &&
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            style={{ position: 'absolute', top: -5, right: -5, display: showClose }}
            onClick={() => props.deleteMovie(props.movieData['title'])}
          >
            <CancelIcon />
          </IconButton>}
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Link href="#" onClick={(e) => { e.preventDefault(); handleClickOpen(); }} color="inherit">
              <Typography variant="h6" component="h2">
                {props.movieData['title']}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {Object.values(props.movieData['metadata']).join(" ‧ ")}
              </Typography>
            </Link>
            <Grid container spacing={2} style={{ marginTop: '1.5em' }}>
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                {props.movieData['googleUsersPercent'] > 0 ?
                  <span style={{ color: guColor }}>
                    {props.movieData['googleUsersPercent']}%<br />
                Google Users
                </span>
                  :
                  <span>N/A <br /> Google Users</span>
                }
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <span style={{ color: imdbColor }}>
                  {props.movieData['imdbRating']}/10<br />
                IMDb
                </span>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <span style={{ color: rtColor }}>
                  {props.movieData['rottenTomatoesRating']}%<br />
                Rotten Tomatoes
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} >
            <div>
              <Link href="#" onClick={(e) => { e.preventDefault(); handleClickOpen(); }} color="inherit">
                <img
                  src={imgSrc}
                  alt="new"
                  width={67 * 1.6}
                  height={100 * 1.6}
                  style={{ height: '100%' }}
                />
              </Link>
              <SimpleDialog open={open} onClose={handleClose} movieData={props.movieData} />
            </div>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}