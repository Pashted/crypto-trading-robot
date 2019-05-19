import React, { Component } from 'react'

import { Header } from '../../uikit'
import { Form, Footer, Button } from '../../form'


class Trading extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <>
                <Header name='Trading' title='Trading section' desc={this.props.desc}/>

                <Form>
                    {this.props.children}

                    <Footer>
                        <Button name='Start' className='primary' onClick={this.saveForm}/>
                        <Button name='Stop'/>
                    </Footer>
                </Form>


            </>
        )
    }
}

export default Trading