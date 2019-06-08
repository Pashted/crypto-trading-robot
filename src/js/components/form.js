import React, { Component } from "react";


export let

    Form = ({ action, method, onSubmit, children }) =>
        <form action={action} method={method} onSubmit={onSubmit} className="uk-form-horizontal">{children}</form>,


    Row = ({ name, label, children, tooltip }) =>
        <div className="uk-margin-small">
            {label && <label className="uk-form-label" htmlFor={name} uk-tooltip={tooltip}>{label}</label>}

            <div className="uk-form-controls uk-flex uk-flex-wrap uk-flex-middle">{children}</div>
        </div>,


    Button = ({ name, style, onClick, disabled }) =>
        <button type="button"
                className={'uk-button uk-margin-small-right uk-button-' + (style || 'default')}
                onClick={onClick}
                disabled={disabled}>
            {name}
        </button>,

    IconButton = ({ icon, tooltip, onClick }) =>
        <button type="button"
                uk-icon={icon}
                className='uk-icon-button'
                onClick={onClick}
                uk-tooltip={tooltip}/>,


    Footer = ({ children }) => (
        <>
            <hr/>
            <p className="uk-margin-medium">{children}</p>
        </>
    ),


    Select = ({ name, value, defaultValue, options, optionsAssoc, onChange, width }) =>
        <select name={name}
                id={name}
                className={'uk-select uk-form-width-' + (width || 'medium')}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}>
            {options && options.map(opt =>
                <option key={opt} value={opt}>{opt.substr(0, 1).toUpperCase() + opt.substr(1)}</option>
            )}
            {optionsAssoc && Object.keys(optionsAssoc).map(key =>
                <option key={key} value={key}>{optionsAssoc[key]}</option>
            )}
        </select>,

    FormComment = ({ children }) => <span className="uk-margin-small-left uk-text-muted">{children}</span>;


class ProgressButton extends Component {

    state = {
        progress: 0,
        disabled: this.props.disabled
    };

    onProgress = async () => {

        if (this.state.progress > 0 && this.state.progress < 100)
            return false;

        this.setState({ progress: 0, disabled: true });

        await this.props.onClick(this.tick);

        await new Promise(res => setTimeout(res, 600));

        this.setState({ progress: 100, disabled: this.props.disabled });

    };

    tick = ({ progress }) => {
        if (progress >= 0)
            this.setState({ progress });
    };

    render() {
        const { name, style } = this.props;

        return (
            <button type="button"
                    className={'button-progress uk-panel uk-button uk-margin-small-right uk-button-' + (style || 'default')}
                    onClick={this.onProgress}
                    disabled={this.state.disabled}>
                {name}
                <progress className="uk-position-absolute uk-progress" value={this.state.progress} max="100"/>
            </button>
        );
    }
}


class Input extends Component {
    state = {
        value: this.props.value || '',
        type:  this.props.type || 'text'
    };

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
        const { name, disabled, width, placeholder, tooltip } = this.props;
        return (
            <input name={name}
                   id={name}
                   type={this.state.type}
                   className={'uk-input uk-form-width-' + (width || 'small')}
                   value={this.state.value}
                   onBlur={this.blur}
                   onChange={this.change}
                   disabled={disabled}
                   placeholder={placeholder}
                   uk-tooltip={tooltip}
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
            <textarea name={name}
                      id={name}
                      className="uk-textarea uk-form-width-medium"
                      rows={this.props.array && this.props.array.length}
                      onBlur={this.blur}
                      onChange={this.change}
                      disabled={disabled}
                      value={this.state.value}
            />
        )
    }
}


export { ProgressButton, Input, Textarea };