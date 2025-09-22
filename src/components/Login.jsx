import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../contexts/AlertContext';
import API_BASE_URL from '../config/api';
import './Extra.css';


const Login = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert();

    const[username, setusername] = useState('');    
    const[password, setpassword] = useState('');


    const handleApi = () => {
        const url = `${API_BASE_URL}/login`;
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
        <div className='signup-main' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
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
              <button 
                onClick={back} 
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#667eea',
                  border: '1px solid #e2e8f0',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login