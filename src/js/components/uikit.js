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

