import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './store'
import theme from './theme'
import './index.css'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './containers/App/App'

render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <App/>
            </Router>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()
