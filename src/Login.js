import React, { useState } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const getClasses = makeStyles({
    loginWrapper: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginCard: {
        width: '50%',
        minWidth: 300,
        maxWidth: 800,
        minHeight: 200,
        padding: 20,
    },
    loginForm: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    input: {
        width: '80%',
        margin: 10,
    },
    error: {
        color: 'red',
        fontSize: '1.25rem',
        margin: 0
    },
});

const Login = ({ firebase }) => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const cls = getClasses();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email.length > 0 && password.length > 0) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .catch(() => {
                    setLoginErr('Invalid Email or Password');
                })
        } else {
            setLoginErr('No empty fields allowed!');
        }
    };

    return (
        <div className={cls.loginWrapper}>
            <Card className={cls.loginCard}>
                <form className={cls.loginForm} onSubmit={handleLogin}>
                    <h1 style={{ textAlign: 'center' }}>Login to your Account</h1>
                    <p className={cls.error}>{loginErr}</p>
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        className={cls.input}
                        onChange={(e) => setEmail(e.target.value)}
                        error={loginErr.length > 0}
                        value={email}
                        variant="outlined"
                        color="primary"
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        className={cls.input}
                        onChange={(e) => setPassword(e.target.value)}
                        error={loginErr.length > 0}
                        value={password}
                        variant="outlined"
                        color="secondary"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={cls.input}
                    >Submit</Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
