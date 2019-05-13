import React, { Component } from 'react'
import { Header } from '../../UIkit'
import { setTitle } from "../../../helpers";

class Homepage extends Component {


    render() {
        setTitle('Homepage');

        return (
            <>
                <Header name='Homepage' title='Crypto Trading Robot' desc='Welcome to the App'/>
            </>
        )
    }
}

export default Homepage