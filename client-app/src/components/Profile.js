import { useContext, useRef, useState} from 'react';
import Avatar from './Avatar';
import axios from 'axios';
import { MdVisibility } from "react-icons/md";
import { isLength, isMatch } from '../components/helper/validate'
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Profile = () => {

    const initialState = {
      name: '',
      password: '',
      cf_password: '',
    }

    const inputFile = useRef(null)
    const [visible, setVisible ] = useState(false);
    const [ avatar, setAvatar ] = useState(false)
    const { user, token, dispatch } = useContext(AuthContext)
    const [data, setData] = useState(initialState);
    const { name, password, cf_password } = data

    const handleClick = () => {
        setVisible(!visible);
    }

    const handleChange = (e) => {
      setData({...data, [e.target.name] : e.target.value})
    }

    const handleInput = () => {
        inputFile.current.click();
    }

    const changeAvatar = async (e) => {
        e.preventDefault();
        try {
          // get file
          const file = e.target.files[0];
          let formData = new FormData();
          formData.append("avatar", file);
    
          // upload to cloudinary
          const res = await axios.post("/api/upload", formData, {
            headers: {
              'Content-Type': undefined,
              Authorization: token,
            },
            onUploadProgress: (x) => {
              if (x.total < 1024000)
                return toast("Uploading", {
                  className: "bg-upload",
                  bodyClassName: "bg-upload",
                  autoClose: 7000,
                });
            },
          });
          setAvatar(res.data.url);
        } catch (err) {
          toast(err.response.data.msg, {
            className: "toast-failed",
            bodyClassName: "toast-failed",
          });
        }
      };    

      const updateInfo = async () => {
        try{
          const res = await axios.patch('/api/auth/user_update',{
            name: name ? name : user.name,
            avatar: avatar ? avatar: user.avatar
          },{
            headers: { Authorization: token }
          })
          const updatedUser = await axios.get('/api/auth/user', {
            headers: { Authorization: token }
          })
          dispatch({type: 'GET_USER', payload: updatedUser.data})
          return toast(res.data.message,{
            className: 'toast-success',
            bodyClassName: 'toast-success'
          })
        } catch(err){
          toast(err.response.data.message, {
            className: 'toast-failed',
            bodyClassName: 'toast-failed'
          })
        }
      }

      const updatePassword = async () => {
        //check passwor length
        if(isLength(password)){
          return toast('Password must be atleast 6 characters', {
            className: 'toast-failed',
            bodyClassName: 'toast-failed'
          })
        }
        if(!isMatch(password, cf_password)){
          return toast('Passwords did not match',{
            className: 'toast-failed',
            bodyClassName: 'toast-failed'
          })
        }
        try{
          const res = await axios.post('/api/auth/reset_password',{password},{
            headers: {
              Authorization: token
            }
          })
          return toast(res.data.message, {
            className: 'toast-success',
            bodyClassName: 'toast-success'
          })
        } catch(err) {
          return toast(err.response.data.message, {
            className: 'toast-failed',
            bodyClassName: 'toast-failed'
          })
        }
      }

      const handleReset = () => {
        Array.from(document.querySelectorAll('input')).forEach(
            (input) => (input.value = '')
        )
        setData({ ...data, name: '', password: '', cf_password: '' })
    }

      const handleSubmit = (e) => {
        e.preventDefault()
        if(name || avatar){
          updateInfo();
        }
        if(password){
          updatePassword()
          handleReset()
        }
      }



    return(
        <>
        <ToastContainer />
        <div>
            <div onClick={handleInput}>
                <Avatar
                avatar = {avatar} 
                style={styles.avatarImg}
                />
            </div>
            <input type="file" ref={inputFile} style={styles.imgInput} onChange={changeAvatar}/>
            <form onSubmit={handleSubmit}>
                <div onClick={handleClick}>
                    <input type="text" placeholder='name' defaultValue={user.name} name='name' onChange={handleChange} />
                    <input type="text" placeholder='email' defaultValue={user.email} disabled email='email' onChange={handleChange} />
                    <MdVisibility/>
                    <input type={visible ? 'text' : 'password'} placeholder="password" autoComplete='off' name='password'onChange={handleChange} />
                    <MdVisibility/>
                    <input type={visible ? 'text' : 'password'} placeholder="confirm password" autoComplete='off' name='cf_password' onChange={handleChange} />
                    <button type='submit'>update</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Profile;

const styles = {

    imgInput: {
        visibility: 'hidden'
    }
}