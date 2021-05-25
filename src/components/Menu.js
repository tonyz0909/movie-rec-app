import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function DisabledTabs(props) {
    return (
        <Tabs
            value={props.browsing ? 1 : 0}
            indicatorColor="primary"
            textColor="primary"
            centered
            onChange={(e, newValue) => props.setBrowsing(!props.browsing)}
            aria-label="disabled tabs example"
        >
            <Tab label="Search" />
            <Tab label="Browse" />
        </Tabs>
    );
}