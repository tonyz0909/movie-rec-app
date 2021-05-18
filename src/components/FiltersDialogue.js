import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Menu from '@material-ui/core/Menu';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FiltersDialogue(props) {

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

    const [filters, setFilters] = useState(props.filters);

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

    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={props.close}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {/* <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit">
                            Filter Settings
                        </Typography>
                    </Toolbar>
                </AppBar> */}
                <DialogTitle id="alert-dialog-slide-title">
                    Filter Settings
                </DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        {/* <FormLabel component="legend">Sort By</FormLabel> */}
                        <Typography gutterBottom>
                            Sort By
                    </Typography>
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
                    <Typography id="discrete-slider-always0" style={{ marginTop: '1em', marginBottom: '1em' }} gutterBottom>
                        Filter By
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography id="discrete-slider-always2" color="textSecondary" gutterBottom>
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
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography id="discrete-slider-always" color="textSecondary" gutterBottom>
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
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography id="discrete-slider-always1" color="textSecondary" gutterBottom>
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
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography id="discrete-slider-always1" color="textSecondary" gutterBottom>
                                Duration {'<'} (mins)
                    </Typography>
                            <Slider
                                value={filters['duration']}
                                aria-labelledby="discrete-slider-always1"
                                min={0}
                                max={300}
                                step={10}
                                marks={marks}
                                style={{ maxWidth: '200px' }}
                                valueLabelDisplay="auto"
                                onChange={(e, newValue) => setFilters({ ...filters, duration: newValue })}
                            />
                        </Grid>
                    </Grid>
                    <br />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.close}>Close</Button>
                    <Button onClick={resetFilters}>Reset</Button>
                    <Button onClick={applyFilters}>Apply</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}