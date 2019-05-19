import React, { Component } from 'react'
import Trading from './index'
import { setTitle } from "../../../helpers";

import ExchangeContext from '../../Context/ExchangeContext'

let Emulation = () => {
    setTitle('Emulation trading');

    return (

        <Trading desc='Emulate trading with exchange history'>

            <ExchangeContext.Consumer>
                {({ fee }) => (
                    fee
                )}
            </ExchangeContext.Consumer>


        </Trading>
    )
};

export default Emulation