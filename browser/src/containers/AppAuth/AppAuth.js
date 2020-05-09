import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import styles from './AppAuth.styles'
//import clsx from 'clsx'

import { useSelector, useDispatch } from 'react-redux'
import { authenticate } from '../../actions/appActions'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'

const useStyles= makeStyles(styles, {
    name: AppAuth.name
})

export default function AppAuth(props) {
    const classes= useStyles(props)

    const authenticating= useSelector(state => state.app.authenticating)
    const authenticatingError= useSelector(state => state.app.authenticatingError)
    const dispatch= useDispatch()

    const [ data, setData ]= React.useState({
        email: '',
        password: '',
    })

    return (
        <Dialog
            classes={{ paper:classes.paper }}
            maxWidth="sm"
            fullWidth
            open={true}
        >
            {/*<AppBar
                position="static"
            >
                <Toolbar>
                    <Typography variant="h6">Вход в систему</Typography>
                </Toolbar>
            </AppBar>*/}
            <form onSubmit={() => {}}>
                <DialogContent className={classes.content}>
                    <TextField
                        id="email"
                        label="Электронная почта"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={data.email}
                        disabled={authenticating}
                        onChange={({ target:{ value:email }}) => { setData({ ...data, email }) }}
                        error={!!authenticatingError}
                    />
                    <TextField
                        id="password"
                        type="password"
                        label="Пароль"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        value={data.password}
                        disabled={authenticating}
                        onChange={({ target:{ value:password }}) => { setData({ ...data, password }) }}
                        error={!!authenticatingError}
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button
                        form="app-auth"
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        disabled={authenticating}
                        onClick={() => dispatch(authenticate(data))}
                    >
                        Войти в систему
                    </Button>
                </DialogActions>
            </form>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={!!authenticatingError}
                message={(
                    <span>{authenticatingError && authenticatingError.message}</span>
                )}
            />

        </Dialog>
    )
}
