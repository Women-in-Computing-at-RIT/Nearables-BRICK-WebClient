import React from 'react';
import PropTypes from 'prop-types';

import { AppBar } from 'material-ui';
import App from './App';

class Landing extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <App>
                <AppBar/>
            </App>
        );
    }
    
}

export default Landing;