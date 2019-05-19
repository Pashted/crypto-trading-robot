import React from 'react'
import { render } from 'react-dom'

import { BrowserRouter as Router, Route } from "react-router-dom"
import routes from './Section/routes'

import { Container, Main } from './uikit'
import Sidebar from './Sidebar'
import Menu from './Sidebar/Menu'

import AppProvider from './Context/AppProvider' // react context api provider


const App = () => (
    <Router>
        <Container>
            <Sidebar>
                <Menu>{routes}</Menu>
            </Sidebar>

            <Main>
                <AppProvider>
                    {routes.map(route => {
                        if (!route.subSections)
                            return <Route exact key={route.name} path={route.url} component={route.com}/>;
                        else
                            return route.subSections.map(sub => <Route key={sub.name} path={sub.url} component={sub.com}/>)
                    })}
                </AppProvider>
            </Main>
        </Container>
    </Router>
);

let init = () => render(<App/>, document.getElementById('app'));

export default init;