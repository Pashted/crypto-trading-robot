import React, { Component } from 'react'
import Item from "./Item";


class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSection: window.location.pathname
        };

        window.onpopstate = e => this.changeSection(e.target.location.pathname);
    }

    changeSection = nextSection => {

        if (this.state.activeSection !== nextSection)
            this.setState({ activeSection: nextSection });
    };

    render() {

        const sections = this.props.children;

        return (
            <ul className="uk-nav uk-nav-default uk-nav-parent-icon">
                {sections.map(item =>
                    <Item key={item.name} link={item} changeSection={this.changeSection} isActive={
                        item.url === this.state.activeSection ||
                        (item.url !== '/' && new RegExp(`${item.url}.+/`).test(this.state.activeSection))
                    }>

                        {item.subSections && (
                            <ul className='uk-tab-right uk-margin-left uk-tab'>
                                {item.subSections.map(sub =>
                                    <Item key={sub.name} link={sub} changeSection={this.changeSection} isActive={sub.url === this.state.activeSection}/>
                                )}
                            </ul>
                        )}

                    </Item>
                )}
            </ul>
        )
    }
}

export default Menu