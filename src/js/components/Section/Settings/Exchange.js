import React, { Component } from 'react'

import Settings from './index'
import { Row, Select, Input, Button, Textarea } from '../../Form'

import { setTitle } from "../../../helpers"

import { send } from '../../../ws'

import SettingsContext from '../../Context/UserContext'
import ExchangeContext from '../../Context/ExchangeContext'


class Exchange extends Component {

    constructor(props) {
        super(props);

        setTitle('Exchange settings');

        this.state = {
            list: []
        };

        this.getExList();
    }

    getExList() {
        send({ method: 'getExchangesList' })
            .catch(err => console.log(err))
            .then(list => this.setState({ list }));
    };

    componentDidUpdate() {
        console.log('## Exchange Component Did Update');
    }


    render() {
        return (
            <Settings desc='Exchange parameters'>

                <SettingsContext.Consumer>
                    {({ exchange, switchExchange }) => (
                        <>
                            <Row name='exchange' label='Exchange'>
                                <Select name='exchange' options={this.state.list} value={exchange} onChange={switchExchange}/>
                            </Row>

                            <ExchangeContext.Consumer>
                                {({ apiKey, fee, timeframes, setParam, resetExchange }) => (
                                    <>
                                        <Row name='apiKey' label='Api-Key'>
                                            <Input name='apiKey' value={apiKey} onBlur={setParam}/>
                                        </Row>

                                        <Row name='fee' label='Exchange maker fee'>
                                            <Input name='fee' value={fee} onBlur={setParam}/>
                                        </Row>

                                        <Row name='timeframes' label='Timeframes' tooltip='One value on each line'>
                                            <Textarea name='timeframes' array={timeframes} onBlur={setParam}/>
                                        </Row>

                                        <Row>
                                            <Button name='Reset this exchange' onClick={resetExchange}/>
                                        </Row>
                                    </>
                                )}
                            </ExchangeContext.Consumer>

                        </>
                    )}
                </SettingsContext.Consumer>


            </Settings>
        )
    }
}


export default Exchange