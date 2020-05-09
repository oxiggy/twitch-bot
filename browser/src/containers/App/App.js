import React from 'react'

//import { makeStyles } from '@material-ui/core/styles'
//import styles from './App.styles'
//import clsx from 'clsx'

import { Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppAuth from '../AppAuth/AppAuth'

//const useStyles= makeStyles(styles, {
//    name: App.name
//})

export default function App(props) {
    //const classes= useStyles(props)

    const auth= useSelector(state => state.app.auth)
    const authChecked= useSelector(state => state.app.authChecked)

    console.log('auth', auth, authChecked)
    return (
        <Switch>
            <Route path="/auth">
                {!auth && authChecked && (
                    <AppAuth/>
                )}
            </Route>
            <Route path="/">
                <div>Hello</div>
            </Route>
        </Switch>
    )
}
