import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"

import { Container, Main } from './UIkit'

import Sidebar from './Sidebar'
import Menu from './Sidebar/Menu'

import routes from './Section/routes'

let App = () => (
    <Router>
        <Container>
            <Sidebar>
                <Menu>{routes}</Menu>
            </Sidebar>

            <Main>
                {routes.map(route => {
                    if (!route.subSections)
                        return <Route exact key={route.name} path={route.url} component={route.com}/>;
                    else
                        return route.subSections.map(sub => <Route key={sub.name} path={sub.url} component={sub.com}/>)
                })}
            </Main>
        </Container>
    </Router>
);


let init = settings => {

    console.log('App settings:', settings);

    render(<App/>, document.getElementById('app'))
};

export default init;