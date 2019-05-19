import React, { Component } from 'react';

import AppContext, { defaultAppSettings } from "./AppContext";
import ExchangeProvider from "./ExchangeProvider";

import { send } from "../../ws";
import { getParam } from '../../helpers'

class AppProvider extends Component {

    /**
     * Methods used by children components for changing states
     * @type {{resetSettings: AppProvider.UIMethods.resetSettings, setParam: AppProvider.UIMethods.setParam}}
     */
    UIMethods = {
        /**
         * Saves single user choice into db
         * @param event
         */
        setParam: event => {
            this.setState(getParam(event), this.saveSettings)
        },

        /**
         * Removes all user params (includes exchange settings) from db
         * @returns {Promise<void>}
         */
        resetSettings: async () => {
            // TODO: prevent spam settings reset, when it's already cleared

            try {
                let res = await send({ method: 'resetSettings' });
                console.log('~~ resetSettings', res);

                this.setState(this.defaultState);

            } catch (err) {
                console.log(err);
            }
        }
    };


    /**
     * Saves user settings state into db
     * @returns {Promise<void>}
     */
    async saveSettings() {
        try {
            let res = await send({ method: 'setUserSettings', data: this.state });
            console.log('~~ saveSettings', res)

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * First getting of user and selected exchange settings
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        console.log('## AppProvider componentDidMount');

        try {
            let _settings = await send({ method: 'getUserSettings' }); // get settings, stored in db

            if (_settings)
                this.setState(Object.assign({}, _settings, this.UIMethods)); // if there are saved settings, apply them

        } catch (err) {
            console.log(err);
        }
    }


    componentDidUpdate() {
        console.log('## AppProvider componentDidUpdate', this.state);
    }


    defaultState = Object.assign({}, defaultAppSettings, this.UIMethods);

    state = this.defaultState;


    render() {
        return (
            <AppContext.Provider value={this.state}>
                <ExchangeProvider exchange={this.state.exchange}>
                    {this.props.children}
                </ExchangeProvider>
            </AppContext.Provider>
        );
    }
}

export default AppProvider;