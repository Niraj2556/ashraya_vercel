import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../contexts/AlertContext';
import './Extra.css';


const Login = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert();

    const[username, setusername] = useState('');    
    const[password, setpassword] = useState('');


    const handleApi = () => {
        const url = 'http://localhost:4000/login';
        const data = {username, password}
        
        axios.post(url,data)
        .then((res) => {
          console.log(res.data)
          if(res.data.message){
            if(res.data.token){
                showAlert(res.data.message, 'success')
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('userId', res.data.userId)
                navigate('/')
            } else {
                showAlert(res.data.message, 'error')
            }
            
          }
        }).catch((err) => {
          console.log(err)
          showAlert("Server error", 'error')
        })  
      }


      const back = () => {
        navigate('/')
      }


  return (
    <div className='super-main'>
      <div className='main-body'>
        <button onClick={back} className='contact-btn' style={{margin: '20px'}}>← Go Back</button>
        
        <div className='signup-main'>
          <div className='signup-body'>
            <h1 style={{color: "#333", fontSize: "24px", marginBottom: "24px", fontWeight: "600", textAlign: "center"}}>Welcome Back</h1>
            
            <label>Email or Username</label>
            <input 
              className='form-control'
              type='text' 
              placeholder='Enter your email or username'
              value={username}  
              onChange={(e) => {setusername(e.target.value)}}
            />
            
            <label>Password</label>
            <input
              className='form-control'
              type='password' 
              placeholder='Enter your password' 
              value={password}
              onChange={(e) => {setpassword(e.target.value)}}
            />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px'}}>
              <button 
                className='btn btn-primary'
                onClick={handleApi}
                style={{width: '100%'}}>
                Sign In
              </button>
              <Link className='btn btn-success' to="/signup" style={{width: '100%', textAlign: 'center'}}>Don't have an account? Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login