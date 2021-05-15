import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function Filters(props) {
    // let imdbRatings = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5];
    const classes = useStyles();
    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">Sort By</FormLabel>
                <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={(e) => props.setSortBy(e.target.value)}>
                    {props.sortingCriteria.map(criteria => {
                        return <FormControlLabel
                            value={criteria}
                            control={<Radio color="primary" />}
                            label={criteria}
                            labelPlacement="start"
                        />
                    })}
                </RadioGroup>
            </FormControl>
            <FormLabel component="legend">Filters</FormLabel>
            <div className={classes.root}>
                <TextField
                    id="standard-basic"
                    label="Google Users >"
                    type="number"
                    value={props.filters['gu']}
                    onChange={e => props.setFilters({ ...props.filters, gu: e.target.value })} />
                <TextField
                    id="standard-basic"
                    label="IMDB Score >"
                    type="number"
                    value={props.filters['imdb']}
                    onChange={e => props.setFilters({ ...props.filters, imdb: e.target.value })} />
                <TextField
                    id="standard-basic"
                    label="Rotten Tomatoes >"
                    type="number"
                    value={props.filters['rt']}
                    onChange={e => props.setFilters({ ...props.filters, rt: e.target.value })} />
                <TextField
                    id="standard-basic"
                    label="Duration < (mins)"
                    type="number"
                    value={props.filters['duration']}
                    onChange={e => props.setFilters({ ...props.filters, duration: e.target.value })} />
            </div>
        </div>
    );
}