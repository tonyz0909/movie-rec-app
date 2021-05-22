import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Menu from '@material-ui/core/Menu';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    customWidth: {
        '& div': {
            // this is just an example, you can use vw, etc.
            width: '300px',
            // paddingLeft: '2em'
            textAlign: 'center'
        }
    }
}));

export default function Filters(props) {
    const marksIMDb = [
        {
            value: 0,
            label: '0/10',
        },
        {
            value: 10,
            label: '10/10',
        },
    ];

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 100,
            label: '100',
        },
    ];

    const marksDuration = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 240,
            label: '240',
        },
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filters, setFilters] = useState(props.filters);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const applyFilters = () => {
        props.setFilters(filters);
    }

    const resetFilters = () => {
        setFilters({
            imdb: 0,
            rt: 0,
            gu: 0,
            duration: 240,
        });
        props.setFilters({
            imdb: 0,
            rt: 0,
            gu: 0,
            duration: 240,
        });
    }

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
                <Chip
                    label="Additional Filters"
                    onClick={handleClick}
                    variant="outlined"
                />
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    style={{ width: '100%' }}
                    className={classes.customWidth}
                >
                    <Typography id="discrete-slider-always2" gutterBottom>
                        Google Users Score {'>'}
                    </Typography>
                    <Slider
                        value={filters['gu']}
                        aria-labelledby="discrete-slider-always2"
                        min={0}
                        max={100}
                        step={1}
                        marks={marks}
                        style={{ maxWidth: '200px' }}
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setFilters({ ...filters, gu: newValue })}
                    />
                    <Typography id="discrete-slider-always" gutterBottom>
                        IMDb Score {'>'}
                    </Typography>
                    <Slider
                        value={filters['imdb']}
                        aria-labelledby="discrete-slider-always"
                        min={0}
                        max={10}
                        step={0.1}
                        marks={marksIMDb}
                        style={{ maxWidth: '200px' }}
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setFilters({ ...filters, imdb: newValue })}
                    />
                    <Typography id="discrete-slider-always1" gutterBottom>
                        Rotten Tomatoes Score {'>'}
                    </Typography>
                    <Slider
                        value={filters['rt']}
                        aria-labelledby="discrete-slider-always1"
                        min={0}
                        max={100}
                        step={1}
                        marks={marks}
                        style={{ maxWidth: '200px' }}
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setFilters({ ...filters, rt: newValue })}
                    />
                    <Typography id="discrete-slider-always1" gutterBottom>
                        Duration {'<'} (mins)
                    </Typography>
                    <Slider
                        value={filters['duration']}
                        aria-labelledby="discrete-slider-always1"
                        min={0}
                        max={300}
                        step={10}
                        marks={marksDuration}
                        style={{ maxWidth: '200px' }}
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setFilters({ ...filters, duration: newValue })}
                    />
                    <br />
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={resetFilters}>Reset</Button>
                    <Button onClick={applyFilters}>Apply</Button>
                </Menu>
            </div>
        </div>
    );
}