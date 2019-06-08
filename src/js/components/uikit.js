import React from 'react'

export let Grid = props => (
        <div className="uk-grid">
            {props.children}
        </div>
    ),


    Container = props => (
        <div className="uk-container uk-container-expand">
            <Grid>
                {props.children}
            </Grid>
        </div>
    ),


    Header = props => (
        <>
            <h1>{props.title}</h1>
            {props.desc && (<p className="uk-text-lead uk-margin-medium-top">{props.desc}</p>)}
            <hr/>
        </>
    ),


    Main = props => (
        <div className="uk-width-expand">
            <section className="uk-section">
                {props.children}
            </section>
        </div>
    );


/**
 * Fires UIKit notifications
 * @param text
 * @param icon
 * @param style
 * @param time
 * @param place
 */
let show = ({ text, style, icon, time, place }) => {
    UIkit.notification({
        message: `<span uk-icon='${icon || 'nut'}'> </span> ${text}`,
        status:  style || 'primary',
        timeout: time || 5000,
        pos:     place || 'bottom-right',
    });
};

export let Notify = {
    message: text => show({ text, style: 'success' }),

    warning: text => show({ text, style: 'warning', icon: 'info', time: 9000 }),

    error: text => show({ text, style: 'danger', icon: 'warning', time: 15000 }),

    buy: ({ pair, price, volume }) => show({
        text:  `Buy ${pair}<br>P: ${price}, V: ${volume}`,
        style: 'success',
        icon:  'bolt',
        place: 'bottom-left'
    }),

    sell: ({ pair, price, volume }) => show({
        text:  `Sell ${pair}<br>P: ${price}, V: ${volume}`,
        style: 'danger',
        icon:  'bolt',
        place: 'bottom-left'
    })
};