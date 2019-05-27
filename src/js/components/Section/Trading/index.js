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
                              exchange, symbols, candles, symbol, pair, timeframes, timeframe, start, end
                          }) => {

                            let dateEnd = end ? new Date(end) : new Date(),
                                diff = ((dateEnd - new Date(start)) / 1000);

                            switch (timeframe) {
                                case '1m':
                                    diff /= 60;
                                    break;
                                case '5m':
                                    diff /= 60 * 5;
                                    break;
                                case '15m':
                                    diff /= 60 * 15;
                                    break;
                                case '30m':
                                    diff /= 60 * 30;
                                    break;
                                case '1h':
                                    diff /= 60 * 60;
                                    break;
                                case '3h':
                                    diff /= 60 * 60 * 3;
                                    break;
                                case '6h':
                                    diff /= 60 * 60 * 6;
                                    break;
                                case '12h':
                                    diff /= 60 * 60 * 12;
                                    break;
                                case '1D':
                                    diff /= 60 * 60 * 24;
                                    break;
                                case '7D':
                                    diff /= 60 * 60 * 24 * 7;
                                    break;
                                case '14D':
                                    diff /= 60 * 60 * 24 * 14;
                                    break;

                                default:
                                    diff /= 60 * 60 * 24 * 30.4;
                            }


                            return (
                                <>
                                    <Row name='money' label='Amount of money'>
                                        0
                                        {/*<Select name='symbol' options={Object.keys(symbols)} value={symbol} onChange={setParam}/>*/}
                                        {/*<Select name='pair' options={symbols[symbol]} value={pair} onChange={setParam}/>*/}
                                    </Row>

                                    <Row name='symbol' label='Trading pair'>
                                        <Select name='symbol' options={Object.keys(symbols)} value={symbol} onChange={setParam} width='small'/>
                                        <Select name='pair' options={symbols[symbol]} value={pair} onChange={setParam} width='small'/>
                                        <IconButton icon='refresh' tooltip='Sync list with exchange' onClick={getSymbols}/>
                                    </Row>

                                    <Row name='timeframe' label='Timeframes'>
                                        <Select name='timeframe' options={timeframes} value={timeframe} onChange={setParam}/>
                                    </Row>

                                    <Row name='start' label='Period'>
                                        <Input name='start' value={start} onBlur={setParam} width='medium'/>
                                        <Input name='end' value={end || ''} onBlur={setParam} width='medium' placeholder={end ? '' : dateEnd.toISOString()} disabled={true}/>
                                        <FormComment>~{Math.ceil(diff)} candles, {Math.ceil(diff / 5000)} req</FormComment>
                                    </Row>

                                    <Button name='Get candles' style='secondary' onClick={getCandles}/>

                                    {candles.ohlc && candles.ohlc.length && <Chart ohlc={candles.ohlc || []} volume={candles.volume || []} title={symbol + pair + ', ' + exchange}/>}


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