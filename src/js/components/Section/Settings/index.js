import React, { Component } from 'react'

import { Header } from '../../UIkit'
import { Form, Footer, Button } from '../../Form'

import SettingsContext from "../../Context/UserContext";

class Settings extends Component {

    render() {
        return (
            <>
                <Header name='Settings' title='Settings section' desc={this.props.desc}/>


                <Form>

                    {this.props.children}
                    <Footer>
                        <SettingsContext.Consumer>
                            {({ resetSettings }) => <Button name='Reset all settings' className='primary' onClick={resetSettings}/>}
                        </SettingsContext.Consumer>
                    </Footer>
                </Form>


            </>
        )
    }
}

export default Settings