import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

class Item extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isActive: this.props.isActive
        };

    }

    activate = e => this.props.changeSection(e.target.pathname);

    componentWillReceiveProps(nextProps) {
        this.setState({ isActive: nextProps.isActive });
    }

    render() {
        let { name, url, icon, subSections } = this.props.link,
            className = this.state.isActive ? 'uk-active' : '';

        if (subSections) {
            className += ' uk-parent';
            url = subSections[0].url;

            if (this.state.isActive)
                className += ' uk-open';
        }


        return (
            <li className={className}>
                <Link to={url} onClick={this.activate}>
                    {icon && <span uk-icon={icon}/>} {name}
                </Link>
                {this.props.children}
            </li>
        )
    }

}

export default Item;


