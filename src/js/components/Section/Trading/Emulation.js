import React, { Component } from 'react'
import Trading from './index'

import { setTitle } from "../../../helpers";
import { Button, ProgressButton, Footer, FormComment, Input, Row, Select, Textarea } from "../../form";

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
                    {({
                          setParam, getCandles, startEmulation, stopEmulation,
                          exchange, candles, symbol, pair, deposit, start, end, timeframes, timeframe
                      }) => {

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

                            <ProgressButton name='Get candles' style='secondary' onClick={getCandles}/>

                            {candles.ohlc && candles.ohlc.length &&
                            <Chart data={candles || []} title={symbol + pair + ', ' + exchange} timeframe={timeframe}/>}

                            <Footer>
                                <ProgressButton name='Start' onClick={startEmulation}/>
                                <Button name='Stop' onClick={stopEmulation}/>
                            </Footer>
                        </>

                    }}
                </ExchangeContext.Consumer>

            </Trading>


        )
    }
}

export default Emulation