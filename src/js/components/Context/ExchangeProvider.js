import React, { Component } from 'react';

import ExchangeContext, { defaultExSettings } from "./ExchangeContext";

import { getParam, filterObject } from '../../helpers'
import { Notify } from '../../components/uikit'
import { send } from "../../ws";


class ExchangeProvider extends Component {

    /**
     * Methods used by children components for changing states
     * @type {{getManyCandles: ExchangeProvider.UIMethods.getManyCandles, getSymbols: ExchangeProvider.UIMethods.getSymbols, setParam: ExchangeProvider.UIMethods.setParam, resetExchange: ExchangeProvider.UIMethods.resetExchange, getCandles: ExchangeProvider.UIMethods.getCandles}}
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
                let res = await send({
                    action:   'storage.ExchangeSettings.reset',
                    exchange: this.props.exchange
                });

                Notify.warning('Exchange data reset complete');
                console.log('~~ resetExchange', res);

                this.setState(this.defaultState);

            } catch (err) {
                Notify.error(err);
                console.log(err);
            }
        },

        getSymbols: async () => {

            try {
                let res = await send({
                    action:   'watcher.Symbols.get',
                    exchange: this.props.exchange
                });

                console.log('~~ getSymbols', res);

                if (typeof res === 'string') {
                    Notify.error(res);

                } else if (res.symbols) {

                    this.setState({ symbols: res.symbols }, this.saveExchange);

                    let symbolsArr = Object.keys(res.symbols);
                    Notify.message(
                        `Received ${symbolsArr.length} symbols<br>
                         with total ${symbolsArr.reduce((total, s) => total + res.symbols[s].length, 0)} pairs`
                    );

                } else {
                    Notify.warning('Symbols not found');
                }

            } catch (err) {
                Notify.error(err);
                console.log(err);
            }
        },

        getCandles: async target => {
            try {
                if (target)
                    target.setState({ progress: 0 });

                const candles = await send({
                    action: 'storage.Candles.get',
                    ...filterObject(this.state, [ 'exchange', 'pair', 'symbol', 'timeframe', 'start', 'end' ])
                }, data => {
                    const { progress } = data;
                    if (progress)
                        target.setState({ progress });
                });

                if (target)
                    target.setState({ progress: 100 });

                console.log('~~ getCandles', candles);

                if (typeof candles === 'string') {
                    Notify.error(candles);

                } else if (candles && candles.ohlc && candles.ohlc.length) {

                    this.setState({ candles });
                    Notify.message(`Received ${candles.ohlc.length} candles`);

                } else {
                    Notify.warning('Candles not found');
                }

            } catch (err) {
                Notify.error(err);
                console.log(err);
            }
        },

        getManyCandles: async () => {
            try {
                const candles = await send({
                    action: 'watcher.Candles.getMany',
                    ...filterObject(this.state, [ 'exchange', 'pair', 'symbol', 'timeframe', 'start', 'end' ])
                });

                console.log('~~ getCandles', candles);

                if (typeof candles === 'string') {
                    Notify.error(candles);

                } else if (candles && candles.ohlc && candles.ohlc.length) {

                    this.setState({ candles });
                    Notify.message(`Received ${candles.ohlc.length} candles`);

                } else {
                    Notify.warning('Candles not found');
                }

            } catch (err) {
                Notify.error(err);
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
            let data = { ...this.state };
            delete data.candles;

            let res = await send({
                action: 'storage.ExchangeSettings.set',
                data
            });
            // Notify.message('Exchange saved');
            console.log('~~ saveExchange', res)

        } catch (err) {
            Notify.error(err);
            console.log(err);
        }
    }


    /**
     * Get exchange settings, stored in db
     * @returns {Promise<void>}
     */
    async getExchange(exchange) {

        try {
            let _exchange = await send({
                action: 'storage.ExchangeSettings.get',
                exchange
            });

            console.log('~~ getExchange', _exchange);

            // if there is saved exchange, apply it
            this.setState({ exchange, ...defaultExSettings, ..._exchange, ...this.UIMethods });


        } catch (err) {
            Notify.error(err);
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
            // '\n _this.props', this.props,
            // '\n _this.state', this.state,
            // '\n _nextProps', nextProps,
            // '\n _nextState', nextState
        );

        this.getExchange(nextProps.exchange);
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
            // '\n _this.props', this.props,
            // '\n _this.state', this.state,
            // '\n _nextProps', nextProps,
            // '\n _nextState', nextState
        );

        return willUpdate;
    }


    componentDidUpdate() {
        console.log('## ExchangeProvider componentDidUpdate', this.state);
    }


    defaultState = ({
        exchange: this.props.exchange,
        candles:  {},
        ...defaultExSettings,
        ...this.UIMethods
    });

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