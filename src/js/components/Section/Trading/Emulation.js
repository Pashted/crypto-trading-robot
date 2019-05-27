import React, { Component } from 'react'
import Trading from './index'
import { setTitle } from "../../../helpers";


import { Button, Footer } from "../../form";

let start = () => {
    console.log('start');
};

let Emulation = () => {
    setTitle('Emulation trading');

    return (


                <Trading desc='Emulate trading with exchange history'>

                    <Footer>
                        <Button name='Start' onClick={start}/>
                        <Button name='Stop'/>
                    </Footer>
                </Trading>


    )
};

export default Emulation