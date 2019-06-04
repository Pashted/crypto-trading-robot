import React, { Component } from 'react'
import Trading from './index'

import { setTitle } from "../../../helpers";
import { Button, Footer, FormComment, Input, Row, Select, Textarea } from "../../form";

import ExchangeContext from "../../Context/ExchangeContext";
import multiplies from "timeframesMultiplies";

import Chart from "../../Chart";


class Emulation extends Component {
    constructor(props) {
        super(props);

        setTitle('Emulation trading');
    }


    render() {

        return (

            <Trading desc='Emulate trading with exchange history'>


                <ExchangeContext.Consumer>
                    {({ setParam, getCandles, exchange, candles, symbol, pair, deposit, start, end, timeframes, timeframe }) => {

                        let dateEnd = end ? new Date(end) : new Date(),
                            endTs = dateEnd.getTime(),
                            startTs = new Date(start).getTime(),
                            diff = (endTs - startTs) / 1000 / 60; // range in minutes;

                        return <>
                            <Row name='deposit' label='Virtual deposit'>
                                <Textarea name='deposit' array={deposit} onBlur={setParam}/>
                                <FormComment>{symbol}<br/>{pair}</FormComment>
                            </Row>

                            <Row name='timeframe' label='Timeframes'>
                                <Select name='timeframe' options={timeframes} value={timeframe} onChange={setParam}/>
                            </Row>

                            <Row name='start' label='Period'>
                                <Input name='start' value={start} onBlur={setParam} width='medium'/>
                                <Input name='end' value={end || ''} width='medium' placeholder={end ? '' : dateEnd.toISOString()} disabled={true}/>
                                <FormComment>
                                    ~{Math.floor(diff / multiplies[timeframe])} candles, {Math.ceil(diff / multiplies[timeframe] / 5000)} requests
                                </FormComment>
                            </Row>

                            <Button name='Get candles' style='primary' onClick={getCandles}/>

                            {candles.ohlc && candles.ohlc.length &&
                            <Chart ohlc={candles.ohlc || []} volume={candles.volume || []} title={symbol + pair + ', ' + exchange}/>}

                            <Footer>
                                <Button name='Start' onClick={() => false}/>
                                <Button name='Stop'/>
                            </Footer>
                        </>

                    }}
                </ExchangeContext.Consumer>

            </Trading>


        )
    }
}

export default Emulation