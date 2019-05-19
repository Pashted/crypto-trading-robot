import React, { Component } from 'react'
import { Header } from '../../uikit'
import { setTitle } from "../../../helpers";

class Help extends Component {


    render() {
        setTitle('Help');

        return (
            <>
                <Header name='Help' title='Help section' desc='FAQ'/>
            </>
        )
    }
}

export default Help