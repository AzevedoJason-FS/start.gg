import { useState } from "react";
import { MdVisibility } from "react-icons/md";
import { isEmpty, isEmail, isLength, isMatch } from '../components/helper/validate'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { FcGoogle } from "react-icons/fc";

const Register = () => {

    const initialState = {
        name: '',
        email: '',
        password: '',
        cf_password: '',
    }

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(initialState)
    const { name, email, password, cf_password } = data

    const handleClick = () => {
        setVisible(!visible);
        console.log(visible)
    }
    
    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const register = async (e) => {
        e.preventDefault()

        //check fields
        if(isEmpty(name) || isEmpty(email)){
            return toast("Please fill in all fields", {className: 'toast-failed', bodyClassName: 'toast-failed'})
        }

        //check email
        if(!isEmail(email)){
            return toast("Please enter a valid email address", {className: 'toast-failed', bodyClassName: 'toast-failed'})
        }

        //check password
        if(isLength(password)){
            return toast("Password must be atleast 6 characters", {className: 'toast-failed', bodyClassName: 'toast-failed'})
        }

        //check match
        if(!isMatch(password, cf_password)){
            return toast("Passwords do not match", {className: 'toast-failed', bodyClassName: 'toast-failed'})
        }
        try{
            const res = await axios.post('/api/auth/register',{
                name, email, password
            })
            toast(res.data.message, {className: 'toast-success', bodyClassName: 'toast-success'})
        } catch(err){
            toast(err.response.data.message, {className: 'toast-failed', bodyClassName: 'toast-failed'})
        }
        handleReset();
    }

    const handleReset = () => {
        Array.from(document.querySelectorAll('input')).forEach(
            (input) => (input.value = '')
        )
        setData({ ...data, name: '', email: '', password: '', cf_password: '' })
    }

    return(
        <>
        <ToastContainer />
        <form onSubmit={register} style={styles.form}>
          <h2 style={styles.formTitle}>Register</h2>
                    <div style={styles.inputBox}>
                        <input type='text' placeholder="name" autoComplete='off' name="name" onChange={handleChange} style={styles.inputField}/>
                        <input type='text' placeholder="email"  autoComplete='off' name="email" onChange={handleChange} style={styles.inputField}/>
                        <div style={styles.visible}>
                        <MdVisibility style={styles.icon} onClick={handleClick} />
                        <input type={visible ? 'text' : 'password'} placeholder="password" autoComplete='off' name="password" onChange={handleChange} style={styles.inputField}/>
                        </div> 
                        <input type={visible ? 'text' : 'password'} placeholder="confirm password" autoComplete='off' name="cf_password" onChange={handleChange} style={styles.inputField}/>
                        
                    </div>
            <div style={styles.login_btn}>
                <button type="submit" style={styles.btn}>Register</button>
                <button type="submit" style={styles.btn}><FcGoogle style={styles.btnIcon}/></button>
            </div>
        </form>
        </>
    )
}

export default Register;

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
    inputBox:{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '2rem',
    },
    icon:{
       position: 'absolute',
       paddingRight: '10px'
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
    inputFieldPass:{
        padding:'10px',
        fontSize: '24px',
        width: '200px',
        fontFamily: 'League Gothic, sans-serif',
        letterSpacing: '1px',
        fontWeight: '400'
    },
    visible:{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
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
    btnIcon:{
        fontSize:'22px'
    },
    login_btn:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnIcon:{
        fontSize:'22px'
    },
}