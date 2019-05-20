import React, { Component } from 'react'
import Settings from './index'
import { setTitle, setTheme } from "../../../helpers";

import AppContext from '../../Context/AppContext'
import { Row, Select } from "../../form";


let Interface = () => {
    setTitle('Interface settings');

    return (
        <Settings desc='Interface tuning'>
            <AppContext.Consumer>
                {({ theme, setParam }) => (
                    <Row name='theme' label='Theme'>
                        <Select name='theme' options={[ 'light', 'dark' ]} value={theme} onChange={event => {
                            setTheme(event.target.value);
                            setParam(event);
                        }}/>
                    </Row>
                )}
            </AppContext.Consumer>
        </Settings>

    )
};

export default Interface