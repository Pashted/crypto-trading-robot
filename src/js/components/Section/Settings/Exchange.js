import React, { Component } from 'react'

import Settings from './index'
import { Row, Select, Input, Button, Textarea } from '../../form'

import { setTitle } from "../../../helpers"

import { send } from '../../../ws'

import AppContext from '../../Context/AppContext'
import ExchangeContext from '../../Context/ExchangeContext'


class Exchange extends Component {

    constructor(props) {
        super(props);

        setTitle('Exchange settings');

        this.state = {
            list: []
        };

    }


    async componentDidMount() {
        console.log('## Exchange componentDidMount');

        try {
            let list = await send({ method: 'getExchangesList' });
            this.setState({ list });

        } catch (err) {
            console.log(err);
        }
    }


    componentDidUpdate() {
        console.log('## Exchange componentDidUpdate');
    }


    render() {
        return (
            <Settings desc='Exchange parameters'>

                <AppContext.Consumer>
                    {({ exchange, setParam }) => (
                        <Row name='exchange' label='Exchange'>
                            <Select name='exchange' options={this.state.list} value={exchange} onChange={setParam}/>
                        </Row>
                    )}
                </AppContext.Consumer>

                <ExchangeContext.Consumer>
                    {({ apiKey, fee, timeframes, setParam, resetExchange }) => (
                        <>
                            {apiKey !== undefined && <Row name='apiKey' label='Api-Key'>
                                <Input name='apiKey' value={apiKey} onBlur={setParam} width='medium'/>
                            </Row>}

                            {fee !== undefined && <Row name='fee' label='Exchange maker fee, %'>
                                <Input name='fee' value={fee} onBlur={setParam}/>
                            </Row>}

                            {timeframes !== undefined && <Row name='timeframes' label='Timeframes' tooltip='One value on each line'>
                                <Textarea name='timeframes' array={timeframes} onBlur={setParam}/>
                            </Row>}

                            <Row>
                                <Button name='Reset this exchange' style='secondary' onClick={resetExchange}/>
                            </Row>
                        </>
                    )}
                </ExchangeContext.Consumer>

            </Settings>
        )
    }
}


export default Exchange