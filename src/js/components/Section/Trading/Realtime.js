import React, { Component } from 'react'
import Trading from './index'
import { setTitle } from "../../../helpers";

let Realtime = () => {
    setTitle('Realtime trading');

    return (

        <Trading desc='Realtime trading with unknown future' context={{candles:[]}}>...</Trading>
    )
};

export default Realtime