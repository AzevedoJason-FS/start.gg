import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ActivateLayout from './Layouts/ActivateLayout';
import AuthLayout from './Layouts/AuthLayout';
import ProfileLayout from './Layouts/ProfileLayout'; 
import ResetLayout from './Layouts/ResetLayout';
import {AuthContext} from './context/AuthContext'
import { useContext, useEffect } from 'react';
import axios from 'axios';

function App() {
  const {dispatch, token, isLoggedIn} = useContext(AuthContext)

  //get access token
  useEffect(() => {
    const _appSignin = localStorage.getItem("_appSignin")
    if(_appSignin){
      const getToken = async () => {
        const res = await axios.post('/api/auth/access', null)
        dispatch({type: "GET_TOKEN", payload: res.data.access_token})
      }
      getToken()
    }
  }, [dispatch, isLoggedIn])

  //get User data
  useEffect(() => {
    if(token){
      const getUser = async () => {
        dispatch({type: 'SIGNIN'})
        const res = await axios.get('/api/auth/user', {
          headers: {Authorization: token}
        })
        dispatch({type: 'GET_USER', payload: res.data})
      }
      getUser()
    }
  },[dispatch, token])

  const checkLogin = () => {
    if(isLoggedIn){
      return <ProfileLayout />
    }else if(!isLoggedIn){
      return <AuthLayout />
    }
  }
  
  return (
   <Router>
    <Routes>
      <Route path="/" exact element={checkLogin()} />
      <Route path="/auth/reset-password/:token" exact element={<ResetLayout />} />
      <Route path="/api/auth/activate/:activation_token" exact element={<ActivateLayout />} />
    </Routes>
   </Router>
  );
}

export default App;
