import Login from '../components/Login';
import Register from '../components/Register';
import Forgot from '../components/Forgot';
import { useState } from 'react';

const AuthLayout = () => {
    const [login, setLogin] = useState(true)
    const [register, setRegister] = useState(false)
    const [forgot, setForgot] = useState(false)

    const handleLogin = () => {
        setLogin(true)
        setRegister(false)
        setForgot(false)
    }

    const handleRegister = () => {
        setLogin(false)
        setRegister(true)
        setForgot(false)
    }

    const handleForgot = () => {
        setLogin(false)
        setRegister(false)
        setForgot(true)
    }

    return(
        <div className='main' style={styles.main}>
           {login && <Login />}
           {register && <Register />}
           {forgot && <Forgot />}
           <div style={styles.linkBox}>
            <p style={styles.action_l} onClick={login ? handleRegister : handleLogin}>{login ? "Register" : "Login"}</p>
            <p style={styles.action_l} onClick={handleForgot}>forgot</p>
           </div>
        </div>
    )
}

export default AuthLayout;

const styles = {
    main: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    action_l:{
        color: '#273fe3',
        fontSize: '24px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginRight: '2rem',
        cursor: 'pointer',
        textAlign: 'center',
        background: 'white',
        padding: '12px',
        borderRadius: '4px'
    },
    linkBox:{
        display: 'flex',
        marginLeft: '2rem',
    }
}