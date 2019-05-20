import React, { Component } from 'react';

import ExchangeContext, { defaultExSettings } from "./ExchangeContext";

import { getParam } from '../../helpers'
import { send } from "../../ws";


class ExchangeProvider extends Component {

    /**
     * Methods used by children components for changing states
     * @type {{setParam: ExchangeProvider.UIMethods.setParam, resetExchange: ExchangeProvider.UIMethods.resetExchange}}
     */
    UIMethods = {
        /**
         * Saves single exchange param into db
         * @param event
         */
        setParam: event => {
            this.setState(getParam(event), this.saveExchange)
        },

        /**
         * Removes selected exchange settings from db
         * @returns {Promise<void>}
         */
        resetExchange: async () => {
            try {
                let res = await send({ method: 'resetExchange', exchange: this.props.exchange });
                console.log('~~ resetExchange', res);

                this.setState(this.defaultState);

            } catch (err) {
                console.log(err);
            }
        }
    };


    /**
     * Saves exchange's state into db
     * @returns {Promise<void>}
     */
    async saveExchange() {
        try {
            let res = await send({ method: 'setExchangeSettings', data: this.state });
            console.log('~~ saveExchange', res)

        } catch (err) {
            console.log(err);
        }
    }


    componentDidMount() {
        console.log('## ExchangeProvider componentDidMount', this.state);
    }


    /**
     * Getting selected exchange settings
     * @param nextProps
     * @param nextState
     * @returns {Promise<void>}
     */
    async componentWillReceiveProps(nextProps, nextState) {
        console.log('## ExchangeProvider componentWillReceiveProps',
            '\n _this.props', this.props,
            '\n _this.state', this.state,
            '\n _nextProps', nextProps,
            '\n _nextState', nextState
        );

        try {
            // get exchange settings, stored in db
            let _exchange = await send({ method: 'getExchangeSettings', exchange: nextProps.exchange });

            // if there is saved exchange, apply it
            this.setState(Object.assign({ exchange: nextProps.exchange }, _exchange || defaultExSettings, this.UIMethods));

        } catch (err) {
            console.log(err);
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        // don't update params if they are not up to date - fresh params will come later, after next getExchangeSettings promise resolve
        let willUpdate = !(
            this.props.exchange !== nextProps.exchange || // 1st try to view exchange - we don't know their params yet
            !nextState.exchange // try to load default exchange with default params
        );

        if (willUpdate && this.state === nextState) // if its ready to update but there is no changes between states
            willUpdate = false;


        console.log(
            '## ExchangeProvider shouldComponentUpdate', willUpdate,
            '\n _this.props', this.props,
            '\n _this.state', this.state,
            '\n _nextProps', nextProps,
            '\n _nextState', nextState
        );

        return willUpdate;
    }


    componentDidUpdate() {
        console.log('## ExchangeProvider componentDidUpdate', this.state);
    }


    defaultState = Object.assign({ exchange: this.props.exchange }, defaultExSettings, this.UIMethods);

    state = this.defaultState;


    render() {
        return (
            <ExchangeContext.Provider value={this.state}>
                {this.props.children}
            </ExchangeContext.Provider>
        );
    }
}

export default ExchangeProvider;