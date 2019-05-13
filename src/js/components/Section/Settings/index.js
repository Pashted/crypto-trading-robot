import React, { Component } from 'react'

import { Header } from '../../UIkit'
import { Form, Footer, Button } from '../../Form'


class Settings extends Component {
    constructor(props) {
        super(props);

    }

    saveForm() {

    }

    render() {
        return (
            <>
                <Header name='Settings' title='Settings section' desc={this.props.desc}/>

                <Form>
                    {this.props.children}

                    <Footer>
                        <Button name='Save' class='primary' onClick={this.saveForm}/>
                        <Button name='Reset'/>
                    </Footer>
                </Form>


            </>
        )
    }
}

export default Settings