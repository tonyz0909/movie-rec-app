import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

export default function Search(props) {
    const [searchText, setSearchText] = useState('');
    const classes = useStyles();

    return (
        <form className={classes.root} onSubmit={(e) => props.addMovie(e, searchText)}>
            <TextField id="outlined-basic" label="Movie Title" variant="outlined" size="small" onChange={(e) => setSearchText(e.target.value)} />
            <Button variant="contained" type="submit" color="primary">Search</Button>
        </form>
    )
}