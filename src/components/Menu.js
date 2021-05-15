import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function DisabledTabs(props) {
    return (
        // <Paper square>
            <Tabs
                value={props.useTrending ? 1 : 0}
                indicatorColor="primary"
                textColor="primary"
                centered
                onChange={(e, newValue) => props.setUseTrending(!props.useTrending)}
                aria-label="disabled tabs example"
            >
                <Tab label="Search" />
                <Tab label="Trending Movies" />
            </Tabs>
        // </Paper>
    );
}