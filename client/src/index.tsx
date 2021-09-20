import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { Provider } from 'react-redux'
import store from './store'
import * as serviceWorker from './serviceWorker'
//https://githdub.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
    )

serviceWorker.register();