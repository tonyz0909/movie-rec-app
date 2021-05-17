import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Trailer, { SimpleDialog } from './Trailer';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

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
    return '#31b830'; // '#77DD76';
  } else if (isIMDB == true && rating > 6 || rating > 70) {
    return 'orange';
  } else {
    return '#FF6962'; // '#db3d00';
  }
}

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

export default function OutlinedCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const imgSrc = props.movieData['imageUrl'] || 'https://popcornusa.s3.amazonaws.com/placeholder-movieimage.png';
  const guColor = getColor(props.movieData['googleUsersPercent'], false);
  const imdbColor = getColor(props.movieData['imdbRating'], true);
  const rtColor = getColor(props.movieData['rottenTomatoesRating'], false);

  // menu config
  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

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
        {!props.useTrending &&
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
            {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
          Word of the Day
        </Typography> */}
            <Link href="#" onClick={(e) => { e.preventDefault(); handleClickOpen(); }} color="inherit">
              <Typography variant="h6" component="h2">
                {props.movieData['title']}
                {/* <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                      {option}
                    </MenuItem>
                  ))}
                </Menu> */}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {Object.values(props.movieData['metadata']).join(" ‧ ")}
              </Typography>
            </Link>
            <Grid container spacing={2} style={{ marginTop: '1.5em' }}>
              <Grid item xs={4} style={{ textAlign: 'center' }}>
                <span style={{ color: guColor }}>
                  {props.movieData['googleUsersPercent']}%<br />
                Google Users
                </span>
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
              <img
                src={imgSrc}
                alt="new"
                width={67 * 1.6}
                height={100 * 1.6}
                style={{ height: '100%' }}
              />
              {/* <IconButton color="primary" aria-label="upload picture" component="span" style={{ position: 'absolute', marginTop: '50px', marginLeft: '-80px' }} onClick={handleClickOpen}>
                <PlayCircleOutlineIcon fontSize="large" />
              </IconButton> */}
              <SimpleDialog open={open} onClose={handleClose} url={props.movieData['trailerUrl']} movieData={props.movieData} />
            </div>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}