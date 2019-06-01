import React, { Component } from 'react';

import AppContext, { defaultAppSettings } from "./AppContext";
import ExchangeProvider from "./ExchangeProvider";

import { send } from "../../ws";
import { getParam, setTheme } from '../../helpers'
import { Notify } from '../../components/uikit'

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
                setTheme(defaultAppSettings.theme);

                let res = await send({
                    action: 'storage.AppSettings.reset'
                });

                Notify.warning('Settings reset complete');
                console.log('~~ AppSettings reset', res);

                this.setState(this.defaultState);

            } catch (err) {
                Notify.error(err);
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
            let res = await send({
                action: 'storage.AppSettings.set',
                data:   this.state
            });

            // Notify.message('Settings saved');
            console.log('~~ AppSettings save', res)

        } catch (err) {
            Notify.error(err);
            console.log(err);
        }
    }


    /**
     * First getting of user and selected exchange settings
     */
    componentDidMount() {
        console.log('## AppProvider componentDidMount');

        try {
            Promise.all([
                send({ action: 'storage.ExchangesList.get' }),
                send({ action: 'storage.AppSettings.get' })
            ]).then(data => {

                this.defaultState._exchanges = data[0];

                if (data[1])
                    this.setState({ _exchanges: data[0], ...data[1], ...this.UIMethods }); // if there are saved settings, apply them
                else
                    this.setState(this.defaultState);
            })


        } catch (err) {
            Notify.error(err);
            console.log(err);
        }
    }


    componentDidUpdate() {
        console.log('## AppProvider componentDidUpdate', this.state);
    }


    defaultState = { ...defaultAppSettings, ...this.UIMethods };

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