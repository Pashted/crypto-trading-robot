import React, { Component } from 'react'

export let Form = props => (
        <form action={props.action || '/'} method={props.method || 'POST'} className="uk-form-horizontal">
            {props.children}
        </form>
    ),

    Row = props => (
        <div className="uk-margin-small">
            <label className="uk-form-label" htmlFor={props.name}>{props.label}</label>

            <div className="uk-form-controls">
                {props.children}
            </div>
        </div>
    ),

    Button = props => (
        <button
            type="button"
            className={'uk-button uk-margin-small-right uk-button-' + (props.class || 'default')}
            onClick={props.onClick}>
            {props.name}
        </button>
    ),

    Footer = props => (
        <>
            <hr/>
            <p className="uk-margin-medium">{props.children}</p>
        </>
    );

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: props.value
        };
    }

    handleChange = selectedOption => this.setState({ selectedOption });

    render() {
        const { name, value, onChange, options } = this.props;
        return (
            <select name={name} id={name} className="uk-select uk-form-width-medium" value={this.state.selectedOption} onChange={this.handleChange}>
                {options && options.map(opt =>
                    <option key={opt} value={opt}>
                        {opt.substr(0, 1).toUpperCase() + opt.substr(1)}
                    </option>
                )}
            </select>
        );
    }
}

export { Select };