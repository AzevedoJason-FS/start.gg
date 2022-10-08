import { useContext, useRef, useState} from 'react';
import Avatar from './Avatar';
import axios from 'axios';
import { MdVisibility } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Profile = () => {
    const inputFile = useRef(null)
    const [visible, setVisible ] = useState(false);
    const [ avatar, setAvatar ] = useState(false)
    const { user, token } = useContext(AuthContext)

    const handleClick = () => {
        setVisible(!visible);
        console.log(visible)
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
            <form>
                <div onClick={handleClick}>
                    <input type="text" placeholder='name' defaultValue={user.name}/>
                    <input type="text" placeholder='email' defaultValue={user.email} disabled/>
                    <MdVisibility/>
                    <input type={visible ? 'text' : 'password'} placeholder="password" autoComplete='off'/>
                    <MdVisibility/>
                    <input type={visible ? 'text' : 'password'} placeholder="confirm password" autoComplete='off'/>
                    <button>update</button>
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