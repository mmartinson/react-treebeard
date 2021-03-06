'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Treebeard, decorators} from '../src/index';
import styled from '@emotion/styled';


import data from './data';
import styles from './styles';
import * as filters from './filter';

const Div = styled('Div', {
    shouldForwardProp: prop => ['className', 'children'].indexOf(prop) !== -1
})(({ style }) => style);

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <Div style={style.base}>
            <Div style={style.title}>
                <i className={iconClass} style={iconStyle}/>

                {node.name}
            </Div>
        </Div>
    );
};

class NodeViewer extends React.Component {
    render() {
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);

        if (!json) {
            json = HELP_MSG;
        }

        return <Div style={style.base}>{json}</Div>;
    }
}
NodeViewer.propTypes = {
    node: PropTypes.object
};

class DemoTree extends React.Component {
    constructor() {
        super();

        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        const {cursor} = this.state;

        if (cursor) {
            cursor.active = false;
        }

        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({cursor: node});
    }

    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState({data});
        }
        var filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }

    render() {
        const {data: stateData, cursor} = this.state;

        return (
            <Div>
                <Div style={styles.searchBox}>
                    <Div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </Div>
                </Div>
                <Div style={styles.component}>
                    <Treebeard data={stateData}
                               decorators={decorators}
                               onToggle={this.onToggle}/>
                </Div>
                <Div style={styles.component}>
                    <NodeViewer node={cursor}/>
                </Div>
            </Div>
        );
    }
}

const content = document.getElementById('content');
ReactDOM.render(<DemoTree/>, content);
