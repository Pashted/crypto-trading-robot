import React, { Component } from 'react'

import { Header } from '../../uikit'
import { Form, Footer, Button } from '../../form'

import AppContext from "../../Context/AppContext";

class Settings extends Component {

    static contextType = AppContext;


    render() {
        return (
            <>
                <Header name='Settings' title='Settings section' desc={this.props.desc}/>

                <Form>
                    {this.props.children}
                    <Footer>
                        <Button name='Reset all settings' onClick={this.context.resetSettings}/>
                    </Footer>
                </Form>
            </>
        )
    }
}

export default Settings