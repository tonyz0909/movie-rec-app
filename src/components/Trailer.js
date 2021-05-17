import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    root: {
        maxWidth: 853,
        overflowY: 'scroll'
    },
});

let getColor = (rating, isIMDB) => {
    if (isIMDB == true && rating == 10 || rating == 100) {
        return 'blue';
    } else if (isIMDB == true && rating > 7.5 || rating > 85) {
        return '#31b830';
    } else if (isIMDB == true && rating > 6 || rating > 70) {
        return 'orange';
    } else {
        return '#FF6962';
    }
}

export function SimpleDialog(props) {
    const guColor = getColor(props.movieData['googleUsersPercent'], false);
    const imdbColor = getColor(props.movieData['imdbRating'], true);
    const rtColor = getColor(props.movieData['rottenTomatoesRating'], false);

    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    let getSummary = async () => {
        if (open == true) {
            let url = `https://api.themoviedb.org/3/search/movie?api_key=210fc31dd8bed65f0aaba2bf322a7627&language=en-US&query=${props.movieData['title']}&page=1`
            let response = await fetch(url);
            let movieInfo = await response.json();
            console.log(movieInfo);
            if (movieInfo.results[0]) setSummary(movieInfo.results[0].overview);
        }
    }

    useEffect(getSummary, [open]);

    const [summary, setSummary] = useState(null);

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}
            maxWidth="lg">
            <iframe width="853" height="480" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
                src={props.url}>
            </iframe>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Summary
                    </Typography>
                    <hr />
                    <Typography variant="body1" component="p" color="textSecondary">
                        {summary}
                    </Typography>
                    <Container maxWidth="sm">
                        <Grid container spacing={2} style={{ marginTop: '1em', marginBottom: '1em' }}>
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
                    </Container>
                    <hr/>
                    <Typography variant="h6" component="h2">
                        Other Information
                    </Typography>
                    <Grid container spacing={2} style={{ marginTop: '1em', marginBottom: '1em' }}>
                        <Grid item xs={6}>
                            <Typography className={classes.pos} color="textSecondary">
                                Rating: {props.movieData['metadata']['rating']}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Release Date: {props.movieData['metadata']['year']}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.pos} color="textSecondary">
                                Genre: {props.movieData['metadata']['genre']}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Duration: {props.movieData['metadata']['duration']}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function Trailer(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            <img
                src={props.imgSrc}
                alt="new"
                width={67 * 1.6}
                height={100 * 1.6}
                style={{ height: '100%' }}
            />
            <IconButton color="primary" aria-label="upload picture" component="span" style={{ position: 'absolute', marginTop: '50px', marginLeft: '-80px' }} onClick={handleClickOpen}>
                <PlayCircleOutlineIcon fontSize="large" />
            </IconButton>
            <SimpleDialog open={open} onClose={handleClose} url={props.url} movieData={props.movieData} />
        </div>
    );
}