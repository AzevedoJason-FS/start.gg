import { MdVisibility } from "react-icons/md";
import { isEmpty, isLength, isMatch } from '../components/helper/validate';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useState } from 'react';

const Reset = () => {

    const initialState = {
        password: '',
        cf_password: ''
    }

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(initialState);
    const {password, cf_password} = data;
    const {token} = useParams()

    const handleClick = () => {
        setVisible(!visible);
        console.log(visible)
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name] : e.target.value })
    }

    const handleReset = () => {
        Array.from(document.querySelectorAll('input')).forEach(
            (input) => (input.value = '')
        )
        setData({ ...data, password: '', cf_password: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(isEmpty(password) || isEmpty(cf_password)){
            return toast('Please fill in all fields', {
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
        if(isLength(password)){
            return toast('Password must be atleast 6 characters',{
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
        if(!isMatch(password, cf_password)){
            return toast('Password did not match', {
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
        try{
            await axios.post('/api/auth/reset_password',{password},{
                headers: {
                    Authorization: token
                }
            })
            handleReset();
            return toast('Password was successfully reset',{
                className: 'toast-success',
                bodyClassName: 'toast-success'
            })
        } catch(err){
            return toast(err.response.data.message,{
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
    }

    return(
    <>
    <ToastContainer />
    <form style={styles.form} onSubmit={handleSubmit}>
    <h2 style={styles.formTitle}>password reset</h2>
        <div style={styles.inputBox}>
            <MdVisibility onClick={handleClick} style={styles.icon}/>
            <input type={visible ? 'text' : 'password'} style={styles.inputField} placeholder="Password" autoComplete='off' name="password" onChange={handleChange}/>
            <input type={visible ? 'text' : 'password'} style={styles.inputField} placeholder="Confirm Password" autoComplete='off' name="cf_password" onChange={handleChange}/>
        </div>
        <div style={styles.login_btn}>
                <button type="submit">reset</button>
        </div>
    </form>
    </>
    )
}

export default Reset

const styles = {
    form:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        padding: '120px',
        background: 'white',
        borderRadius: '15px'
    },
    formTitle:{
        fontSize: '40px',
        textTransform: 'uppercase',
        marginTop: 0
    },
    inputField:{
        padding:'10px',
        fontSize: '24px',
        width: '200px',
        fontFamily: 'League Gothic, sans-serif',
        letterSpacing: '1px',
        marginBottom: '2rem',
        fontWeight: '400'
    },
    inputBox:{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '2rem',
    },
    btn:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#273fe3',
        border: 0,
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'League Gothic, sans-serif',
        color: 'white',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        width: '80px',
        marginRight: '10px',
        borderRadius: '4px'
    },
}