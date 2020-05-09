import React from 'react'

//import { makeStyles } from '@material-ui/core/styles'
//import styles from './App.styles'
//import clsx from 'clsx'

import { Switch, Route } from 'react-router-dom'

//const useStyles= makeStyles(styles, {
//    name: App.name
//})

export default function App(props) {
    //const classes= useStyles(props)

    return (
        <Switch>
            <Route path="/">
                <div>Hello</div>
            </Route>
        </Switch>
    )
}
