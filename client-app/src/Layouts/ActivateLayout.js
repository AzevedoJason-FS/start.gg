import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const ActivateLayout = () => {
    const { activation_token } = useParams()
    let navigate = useNavigate();

    useEffect( () => {
        //check token
        if(activation_token){
            const activateUser = async () => {
                try{
                    const res = await axios.post('/api/auth/activation',{
                        activation_token
                    })
                    toast(res.data.message, {className: 'toast-success', bodyClassName: 'toast-success'})
                } catch(err){
                    toast(err.response.data.message, {className: 'toast-failed', bodyClassName: 'toast-failed'})
                }
            }
            activateUser()
        }
    }, [activation_token])

    const handleClick = () => {
        return navigate("/");
    }
    return(
        <div>
            <ToastContainer />
            <p>ready to login <span onClick={handleClick}>here</span></p>
        </div>
    )
}

export default ActivateLayout;