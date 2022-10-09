import { isEmpty, isEmail } from '../components/helper/validate'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useState } from 'react';

const Forgot = () => {
    const [email, setEmail] = useState('')

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleReset = () => {
        Array.from(document.querySelectorAll('input')).forEach(
            (input) => (input.value = '')
        )
        setEmail({email: ''})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isEmpty(email)){
            return toast('Please enter an email',{
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
        if(!isEmail(email)){
            return toast('Please enter a valid email address',{
                className: 'toast-failed',
                bodyClassName: 'toast-failed'
            })
        }
        try{
            await axios.post('/api/auth/forgot_password',{email})
            handleReset();
            return toast('Success, Please check your email', {
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
            <input type='text' style={styles.inputField} placeholder="email"name='email' onChange={handleChange}/>
            <div style={styles.login_btn}>
                <button style={styles.btn} type='submit'>send</button>
            </div>
        </form>
        </>
    )
}

export default Forgot

const styles = {
    form:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
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