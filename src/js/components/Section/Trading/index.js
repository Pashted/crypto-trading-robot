import React, { Component } from 'react'

import { Header } from '../../uikit'
import { Form, Row, Select, Input, FormComment, Button, IconButton } from '../../form'

import Chart from '../../Chart'
import AppContext from "../../Context/AppContext";
import ExchangeContext from "../../Context/ExchangeContext";


class Trading extends Component {

    componentDidMount() {
        console.log('## Trading componentDidMount', this.state);
    }


    componentDidUpdate() {
        console.log('## Trading componentDidUpdate');
    }

    render() {
        return (
            <>
                <Header name='Trading' title='Trading section' desc={this.props.desc}/>

                <Form>

                    <AppContext.Consumer>
                        {({ exchange, _exchanges, setParam }) => <>
                            <Row name='exchange' label='Exchange'>
                                <Select name='exchange' options={_exchanges} value={exchange} onChange={setParam}/>
                            </Row>
                        </>}
                    </AppContext.Consumer>


                    <ExchangeContext.Consumer>
                        {({
                              setParam, getSymbols, getCandles,
                              exchange, symbols, candles, symbol, pair, timeframes, timeframe, start, end,
                              deposit
                          }) => {

                            let dateEnd = end ? new Date(end) : new Date(),
                                endTs = dateEnd.getTime(),
                                startTs = new Date(start).getTime();

                            let diff = (endTs - startTs) / 1000 / 60, // range in minutes
                                multiplies = {
                                    '1m':  1,
                                    '5m':  5,
                                    '15m': 15,
                                    '30m': 30,
                                    '1h':  60,
                                    '3h':  60 * 3,
                                    '6h':  60 * 6,
                                    '12h': 60 * 12,
                                    '1D':  60 * 24,
                                    '7D':  60 * 24 * 7,
                                    '14D': 60 * 24 * 14,
                                    '1M':  60 * 24 * 28,
                                },
                                counter = Math.ceil(diff / multiplies[timeframe] / 5000); // num of requests

                            let symbolsArr = Object.keys(symbols);

                            return (
                                <>
                                    <Row name='money' label='Amount of money'>
                                        {deposit}
                                    </Row>

                                    <Row name='symbol' label='Trading pair'>
                                        <Select name='symbol' options={symbolsArr} value={symbol} onChange={setParam} width='small'/>
                                        <Select name='pair' options={symbols[symbol]} value={pair} onChange={setParam} width='small'/>
                                        <IconButton icon='refresh' tooltip='Sync list with exchange' onClick={getSymbols}/>
                                    </Row>

                                    <Row name='timeframe' label='Timeframes'>
                                        <Select name='timeframe' options={timeframes} value={timeframe} onChange={setParam}/>
                                    </Row>

                                    <Row name='start' label='Period'>
                                        <Input name='start' value={start} onBlur={setParam} width='medium'/>
                                        <Input name='end' value={end || ''} width='medium' placeholder={end ? '' : dateEnd.toISOString()} disabled={true}/>
                                        <FormComment>~{Math.ceil(diff / multiplies[timeframe])} candles, {counter} {counter > 1 ? 'requests' : 'request'}</FormComment>
                                    </Row>


                                    {!symbolsArr.length && <Button name='Get symbols' style='secondary' onClick={getSymbols}/>}
                                    {!!symbolsArr.length && <Button name='Get candles' style='primary' onClick={getCandles}/>}

                                    {candles.ohlc && candles.ohlc.length &&
                                    <Chart ohlc={candles.ohlc || []} volume={candles.volume || []} title={symbol + pair + ', ' + exchange}/>}


                                </>
                            )
                        }}
                    </ExchangeContext.Consumer>

                    {this.props.children}
                </Form>

            </>
        )
    }
}

export default Trading