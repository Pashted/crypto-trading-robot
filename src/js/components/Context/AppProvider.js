import React, { Component } from 'react'
import SettingsContext, { defaultUserSettings } from "./UserContext"
import ExchangeContext, { defaultExSettings } from "./ExchangeContext"
import { send } from "../../ws"

class AppProvider extends Component {

    constructor(props) {
        super(props);

        this.state = this.defaultState;
    }

    /**
     * Makes {name:value} object from html element, that needs in update
     * @param event
     */
    getParam = ({ target: { name, value } }) => {
        let param = {};
        param[name] = value;
        return param;
    };


    /**
     * Saves single user choice in db
     * @type {{setParam: App.UserUIMethods.setParam, switchExchange: App.UserUIMethods.switchExchange}}
     */
    UserUIMethods = {
        setParam: event => {
            this.setState({
                user: Object.assign({}, this.state.user, this.getParam(event))
            }, this.saveUser)
        },

        resetSettings: async () => {
            try {
                let res = await send({ method: 'resetSettings'});
                console.log('resetExchange', res);

                this.setState(this.defaultState);

            } catch (err) {
                console.log(err);
            }
        },

        switchExchange: async event => {
            try {
                let new_state = { user: Object.assign({}, this.state.user, this.getParam(event)) },

                    _exchange = await send({ method: 'getExchangeSettings', exchange: event.target.value });

                new_state.exchange = Object.assign({}, _exchange || defaultExSettings, this.ExchangeUIMethods);

                this.setState(new_state, this.saveUser)

            } catch (err) {
                console.log(err);
            }
        }
    };


    /**
     * Saves user params state into db
     * @returns {Promise<void>}
     */
    async saveUser() {
        try {
            let res = await send({ method: 'setUserSettings', data: this.state.user });
            console.log('setSettings', res)

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * Saves single exchange param
     * @type {{setParam: App.ExchangeUIMethods.setParam}}
     */
    ExchangeUIMethods = {
        setParam: event => {
            this.setState({
                exchange: Object.assign({ exchange: this.state.user.exchange }, this.state.exchange, this.getParam(event))
            }, this.saveExchange)
        },

        resetExchange: async () => {
            try {
                let res = await send({ method: 'resetExchange', exchange: this.state.user.exchange });
                console.log('resetExchange', res);

                this.setState({ exchange: this.defaultState.exchange });

            } catch (err) {
                console.log(err);
            }
        }
    };


    /**
     * Saves exchange state into db
     * @returns {Promise<void>}
     */
    async saveExchange() {
        try {
            let res = await send({ method: 'setExchangeSettings', data: this.state.exchange });
            console.log('setExchange', res)

        } catch (err) {
            console.log(err);
        }
    }


    defaultState = {
        user:     Object.assign({}, defaultUserSettings, this.UserUIMethods),
        exchange: Object.assign({}, defaultExSettings, this.ExchangeUIMethods)
    };

    /**
     * First getting of user and selected exchange settings
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        console.log('## AppProvider componentDidMount');
        try {
            let state = {},
                _user = await send({ method: 'getUserSettings' }); // get settings, stored in db

            if (_user)
                state.user = Object.assign({}, _user, this.UserUIMethods); // if there are saved settings, prepare to apply them

            let name = _user && _user.exchange ? _user.exchange : defaultUserSettings.exchange, // target name - either saved or default
                _exchange = await send({ method: 'getExchangeSettings', exchange: name }); // get exchange settings, stored in db

            if (_exchange)
                state.exchange = Object.assign({}, _exchange, this.ExchangeUIMethods); // if there is saved exchange, prepare to apply it

            if (_user || _exchange)
                this.setState(state);

        } catch (err) {
            console.log(err);
        }
    }


    render() {
        return (
            <SettingsContext.Provider value={this.state.user}>
                <ExchangeContext.Provider value={this.state.exchange}>
                    {this.props.children}
                </ExchangeContext.Provider>
            </SettingsContext.Provider>
        )
    }
}


export default AppProvider