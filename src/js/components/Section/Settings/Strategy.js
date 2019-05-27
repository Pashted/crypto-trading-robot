import React from 'react'
import Settings from './index'
import { setTitle } from "../../../helpers";

import AppContext from '../../Context/AppContext'
import ExchangeContext from '../../Context/ExchangeContext'
import { Row, Select, Input, FormComment } from "../../form";


let Strategy = () => {
    setTitle('Strategy settings');

    return (
        <Settings desc='Strategy adjustment'>
            <AppContext.Consumer>
                {({ strategy, minStep, setParam }) => (
                    <>
                        <Row name='strategy' label='Strategy' tooltip='Sets the approximate frequency of transactions'>
                            <Select name='strategy' options={['daily', 'hourly']} value={strategy} onChange={setParam}/>
                        </Row>

                        {minStep !== undefined &&
                        <Row name='minStep' label='Minimum transaction step, %'
                             tooltip='Sets the minimum difference between buying and selling and vice versa. Real profit decreases by the fee.'>

                            <Input name='minStep' value={minStep} onBlur={setParam}/>
                            <ExchangeContext.Consumer>
                                {({ fee }) => <FormComment>Profit {(minStep - fee * 2).toFixed(2)}%</FormComment>}
                            </ExchangeContext.Consumer>
                        </Row>}
                    </>
                )}
            </AppContext.Consumer>
        </Settings>

    )
};

export default Strategy