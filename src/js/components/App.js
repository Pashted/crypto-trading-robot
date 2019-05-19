import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"

import routes from './Section/routes'

import SettingsContext, { defaultSettings } from './Context/UserSettings'
import ExchangeContext, { defaultExSettings } from "./Context/Exchange";
import { send } from '../ws'

import { Container, Main } from './UIkit'

import Sidebar from './Sidebar'
import Menu from './Sidebar/Menu'


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user:     Object.assign({}, defaultSettings, this.UserUIMethods),
            exchange: Object.assign({}, defaultExSettings, this.ExchangeUIMethods)
        };

        this.getSettings();
    }


    /**
     * First getting of user and selected exchange settings
     * @returns {Promise<void>}
     */
    async getSettings() {

        try {
            let new_state = {},
                _user = await send({ method: 'getUserSettings' }); // get settings, stored in db

            if (_user)
                new_state.user = Object.assign({}, _user, this.UserUIMethods); // if there are saved settings, prepare to apply them

            let name = _user && _user.exchange ? _user.exchange : defaultSettings.exchange, // target name - either saved or default
                _exchange = await send({ method: 'getExchangeSettings', exchange: name }); // get exchange settings, stored in db

            if (_exchange)
                new_state.exchange = Object.assign({}, _exchange, this.ExchangeUIMethods); // if there is saved exchange, prepare to apply it

            if (_user || _exchange)
                this.setState(new_state)

        } catch (err) {
            console.log(err);
        }
    };


    /**
     * Makes {name:value} object from html element, that needs in update
     * @param event
     */
    getParam = ({ target }) => {
        let param = {};
        param[target.name] = target.value;
        console.log('PARAM', param);
        return param;
    };


    /**
     * Save single user choice in db
     * @type {{setParam: App.UserUIMethods.setParam, switchExchange: App.UserUIMethods.switchExchange}}
     */
    UserUIMethods = {
        setParam: event => {
            this.setState({
                user: Object.assign({}, this.state.user, this.getParam(event))
            }, this.saveUser)
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

    async saveUser() {
        try {
            let res = await send({ method: 'setUserSettings', data: this.state.user });
            console.log('setSettings', res)

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * Save single exchange param
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

                this.setState({ exchange: defaultExSettings });

            } catch (err) {
                console.log(err);
            }
        }
    };

    async saveExchange() {
        try {
            let res = await send({ method: 'setExchangeSettings', data: this.state.exchange });
            console.log('setExchange', res)

        } catch (err) {
            console.log(err);
        }
    }


    render() {

        return (
            <Router>
                <Container>
                    <Sidebar>
                        <Menu>{routes}</Menu>
                    </Sidebar>

                    <SettingsContext.Provider value={this.state.user}>

                        <ExchangeContext.Provider value={this.state.exchange}>
                            <Main>
                                {routes.map(route => {
                                    if (!route.subSections)
                                        return <Route exact key={route.name} path={route.url} component={route.com}/>;
                                    else
                                        return route.subSections.map(sub => <Route key={sub.name} path={sub.url} component={sub.com}/>)
                                })}
                            </Main>

                        </ExchangeContext.Provider>

                    </SettingsContext.Provider>

                </Container>
            </Router>
        )
    }

}

let init = () => render(<App/>, document.getElementById('app'));

export default init;