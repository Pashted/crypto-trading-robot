import React, { Component } from 'react'

import Settings from './index'
import { Row, Select } from '../../Form'

import { setTitle } from "../../../helpers"

import * as ws from '../../../ws'


class Exchange extends Component {

    constructor(props) {
        super(props);

        setTitle('Exchange settings');

        this.state = {
            exchangesList: []
        };

        ws.send({ method: 'getExchangesList' })
            .catch(err=> console.log(err))
            .then(res => {
                if (res && res.length)
                    this.setState({ exchangesList: res });
            });
    }


    render() {


        return (
            <Settings desc='Exchange parameters'>

                <Row name='exchange' label='Exchange'>
                    <Select name='exchange' options={this.state.exchangesList} value='bitfinex'/>
                </Row>

            </Settings>
        )
    }
}

export default Exchange