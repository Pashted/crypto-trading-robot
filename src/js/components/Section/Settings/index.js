import React, { Component } from 'react'

import { Header } from '../../UIkit'
import { Form, Footer, Button } from '../../Form'

import { send } from '../../../ws'

class Settings extends Component {

    render() {
        return (
            <>
                <Header name='Settings' title='Settings section' desc={this.props.desc}/>


                <Form>

                    {this.props.children}
                    <Footer>
                        <Button name='Reset all settings' className='primary' onClick={() =>
                            send({ method: 'resetSettings' })
                                .catch(err => console.log(err))
                                .then(res => console.log(res))
                        }/>
                    </Footer>
                </Form>


            </>
        )
    }
}

export default Settings