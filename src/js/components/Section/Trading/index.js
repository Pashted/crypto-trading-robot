import React, { Component } from 'react'

import { Header } from '../../uikit'
import { Form, Row, Select, IconButton } from '../../form'

import AppContext from "../../Context/AppContext";
import ExchangeContext from "../../Context/ExchangeContext";


class Trading extends Component {

    componentDidMount() {
        console.log('## Trading componentDidMount');
    }


    componentDidUpdate() {
        console.log('## Trading componentDidUpdate');
    }

    render() {
        return (
            <>
                <Header name='Trading' title='Trading section' desc={this.props.desc}/>

                <Form>

                    <ExchangeContext.Consumer>
                        {({ setParam, getSymbols, resetExchange, symbols, symbol, pair }) => <>

                            <AppContext.Consumer>
                                {({ exchange, _exchanges, setParam }) =>

                                    <Row name='exchange' label='Exchange'>
                                        <Select name='exchange' options={_exchanges} value={exchange} onChange={setParam}/>
                                        <IconButton tooltip='Reset exchange settings and data' icon='trash' onClick={resetExchange}/>
                                    </Row>
                                }
                            </AppContext.Consumer>



                            <Row name='symbol' label='Trading pair'>
                                <Select name='symbol' options={Object.keys(symbols)} value={symbol} onChange={setParam} width='small'/>
                                <Select name='pair' options={symbols[symbol]} value={pair} onChange={setParam} width='small'/>
                                <IconButton icon='refresh' tooltip='Sync list with exchange' onClick={getSymbols}/>
                            </Row>
                        </>}
                    </ExchangeContext.Consumer>

                    {this.props.children}
                </Form>

            </>
        )
    }
}

export default Trading