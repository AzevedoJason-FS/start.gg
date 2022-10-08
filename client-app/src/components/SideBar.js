import axios from 'axios'
import {AuthContext} from '../context/AuthContext'
import { useContext } from 'react'

const SideBar = () => {
    const {dispatch} = useContext(AuthContext)

    const handleClick = async (e) => {
        e.preventDefault()
        try{
            await axios.get('/api/auth/signout')
            localStorage.removeItem('_appSignin')
            dispatch({type: 'SIGNOUT'})
        } catch (err) {
            console.log(err.response.data)
        }
    }
    return(
        <div>
            <ul>
                <li><p>Feed</p></li>
                <li><p>Profile</p></li>
                <li onClick={handleClick}>Logout</li>
            </ul>
        </div>
    )
}

export default SideBar;