import React from 'react'

export let Grid = ({ children }) => (
        <div className="uk-grid">
            {children}
        </div>
    ),


    Container = ({ children }) => (
        <div className="uk-container uk-container-expand">
            <Grid>
                {children}
            </Grid>
        </div>
    ),


    Header = ({ title, desc }) => (
        <>
            <h1>{title}</h1>
            {desc && (<p className="uk-text-lead uk-margin-medium-top">{desc}</p>)}
            <hr/>
        </>
    ),


    Main = ({ children }) => (
        <div className="uk-width-expand">
            <section className="uk-section">
                {children}
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
let show = (text, style, icon, time, place) => {
    UIkit.notification({
        message: `<span uk-icon='${icon || 'nut'}'> </span> ${text}`,
        status:  style || 'primary',
        timeout: time || 5000,
        pos:     place || 'bottom-right',
    });
};

export let Notify = {
    message: text => show(text, 'success'),
    warning: text => show(text, 'warning', 'info', 9000),
    error:   text => show(text, 'danger', 'warning', 15000),
    buy:     order => show(`Buy ${order.pair}<br>P: ${order.price}, V: ${order.volume}`, 'success', 'bolt', null, 'bottom-left'),
    sell:    order => show(`Sell ${order.pair}<br>P: ${order.price}, V: ${order.volume}`, 'danger', 'bolt', null, 'bottom-left')
};