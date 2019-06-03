import React from 'react'

import Settings from './index'
import { Row, Select, Input, IconButton, Textarea } from '../../form'

import { setTitle } from "../../../helpers"

import AppContext from '../../Context/AppContext'
import ExchangeContext from '../../Context/ExchangeContext'


let Exchange = () => {

    setTitle('Exchange settings');

    return (
        <Settings desc='Exchange parameters'>

            <ExchangeContext.Consumer>
                {({ apiKey, fee, timeframes, setParam, resetExchange }) => (
                    <>
                        <AppContext.Consumer>
                            {({ exchange, _exchanges, setParam }) => (
                                <Row name='exchange' label='Exchange'>
                                    <Select name='exchange' options={_exchanges} value={exchange} onChange={setParam}/>
                                    <IconButton tooltip='Reset exchange settings and data' icon='trash' onClick={resetExchange}/>
                                </Row>
                            )}
                        </AppContext.Consumer>


                        {apiKey !== undefined && <Row name='apiKey' label='Api-Key'>
                            <Input type='password' name='apiKey' value={apiKey} onBlur={setParam} width='medium'/>
                        </Row>}

                        {fee !== undefined && <Row name='fee' label='Exchange maker fee, %'>
                            <Input name='fee' value={fee} onBlur={setParam}/>
                        </Row>}

                        {timeframes !== undefined && <Row name='timeframes' label='Timeframes' tooltip='One value on each line'>
                            <Textarea name='timeframes' array={timeframes} onBlur={setParam}/>
                        </Row>}
                    </>

                )}
            </ExchangeContext.Consumer>
        </Settings>
    )

};


export default Exchange