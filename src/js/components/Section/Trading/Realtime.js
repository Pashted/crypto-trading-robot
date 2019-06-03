import React, { Component } from 'react'
import Trading from './index'

import { setTitle } from "../../../helpers"
import { Footer, Row, Button, Input, FormComment, Select, Textarea } from "../../form"

import ExchangeContext from "../../Context/ExchangeContext"

let Realtime = () => {
    setTitle('Realtime trading');

    return (

        <Trading desc='Realtime trading with unknown future'>

            <ExchangeContext.Consumer>
                {({ symbol, pair, deposit, }) =>

                    <Row name='deposit' label='Exchange deposit'>
                        <div className='uk-form-width-small uk-margin-small-left'>{deposit[0]} {symbol}</div>
                        <div className='uk-form-width-small'>{deposit[1]} {pair}</div>
                    </Row>
                }
            </ExchangeContext.Consumer>
        </Trading>


    )
};

export default Realtime