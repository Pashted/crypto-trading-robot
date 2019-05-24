import React, { Component } from "react";


export let

    Form = ({ action, method, onSubmit, children }) =>
        <form action={action} method={method} onSubmit={onSubmit} className="uk-form-horizontal">{children}</form>,


    Row = ({ name, label, children, tooltip }) =>
        <div className="uk-margin-small">
            {label && <label className="uk-form-label" htmlFor={name} uk-tooltip={tooltip}>{label}</label>}

            <div className="uk-form-controls">{children}</div>
        </div>,


    Button = ({ name, style, onClick, disabled }) =>
        <button
            type="button"
            className={'uk-button uk-margin-small-right uk-button-' + (style || 'default')}
            onClick={onClick}
            disabled={disabled}>
            {name}
        </button>,


    Footer = ({ children }) => (
        <>
            <hr/>
            <p className="uk-margin-medium">{children}</p>
        </>
    ),


    Select = ({ name, value, defaultValue, options, optionsAssoc, onChange }) =>
        <select
            name={name}
            id={name}
            className="uk-select uk-form-width-medium"
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}>
            {options && options.map(opt =>
                <option key={opt} value={opt}>{opt.substr(0, 1).toUpperCase() + opt.substr(1)}</option>
            )}
            {optionsAssoc && Object.keys(optionsAssoc).map(key =>
                <option key={key} value={key}>{optionsAssoc[key]}</option>
            )}
        </select>;


class Input extends Component {
    state = { value: this.props.value || '' };

    change = ({ target: { value } }) => this.setState({ value });

    blur = event => {
        if (!this.props.onBlur)
            return;

        // fire blur event only when values not equal
        if (this.props.value !== event.target.value)
            this.props.onBlur(event);
    };

    componentWillReceiveProps({ value }) {
        this.setState({ value })
    }

    render() {
        const { name, type, disabled, width } = this.props;
        return (
            <input
                className={'uk-input uk-form-width-' + (width || 'small')}
                name={name}
                id={name}
                type={type || 'text'}
                value={this.state.value}
                onBlur={this.blur}
                onChange={this.change}
                disabled={disabled}
            />
        )
    }
}


class Textarea extends Component {
    state = { value: this.props.array ? this.props.array.join("\n") : '' };

    change = ({ target: { value } }) => this.setState({ value });

    blur = ({ target: { value } }) => {
        if (!this.props.onBlur)
            return;


        // fire blur event only when values not equal
        if (this.props.array.join("\n") !== value)
            this.props.onBlur({
                target: { // emulate dom event for App.getParam method
                    name:  this.props.name,
                    value: value.trim().split("\n")
                }
            });
    };

    componentWillReceiveProps({ array }) {
        if (array)
            this.setState({ value: array.join("\n") })
    }


    render() {
        const { name, disabled } = this.props;
        return (
            <textarea
                className="uk-textarea uk-form-width-medium"
                name={name}
                id={name}
                rows={this.props.array && this.props.array.length}
                onBlur={this.blur}
                onChange={this.change}
                disabled={disabled}
                value={this.state.value}
            />
        )
    }
}


export { Input, Textarea };