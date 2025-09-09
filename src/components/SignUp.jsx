import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';


const SignUp = () => {

  const[username, setusername] = useState('');
  const[password, setpassword] = useState('');
  const[email, setemail] = useState('');
  const[mobile, setmobile] = useState('');

  let navigate = useNavigate();
  const { showAlert } = useAlert();

  const back = () => {
    navigate('/')
  }

  const handleApi = () => {

    if (!username || !email || !password || !mobile) {
      showAlert('Please fill in all fields', 'warning');
      return;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }
  
    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobile)) {
      showAlert('Please enter a valid phone number', 'error');
      return;
    }

    // Password validation
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long', 'error');
    return;
  }

  // Check for strong password criteria
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!strongPasswordRegex.test(password)) {
    showAlert('Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long', 'error');
    return;
  }


    const url = 'http://localhost:4000/signup';
    const data = {username, password, email, mobile}
    
    axios.post(url,data).then((res) => {
      console.log(res)
      if(res.data.message) {
        showAlert(res.data.message, 'success')
        navigate('/login')
      } else {
        showAlert('Registration failed. Please try again.', 'error')
      }
    }).catch((err) => {
      console.log(err)
      if(err.response && err.response.data && err.response.data.message) {
        showAlert(err.response.data.message, 'error')
      } else {
        showAlert('Registration failed. Please try again.', 'error')
      }
    })  



  }



  return (
    <div className='super-main' style={{minHeight: '100vh'}}>
      <div className='main-body'>
        <div className='signup-main' style={{position: 'relative'}}>
          <button onClick={back} className='contact-btn' style={{position: 'absolute', top: '20px', left: '20px'}}>← Go Back</button>
          <div className='signup-body'>
            <h1 style={{color: "#333", fontSize: "24px", marginBottom: "24px", fontWeight: "600", textAlign: "center"}}>Create Account</h1>
            
            <label>Username</label>
            <input
              className='form-control' 
              type='text' 
              value={username} 
              onChange={(e) => {setusername(e.target.value)}}
              placeholder='Enter your username' 
            />
            
            <label>Email</label>
            <input
              className='form-control' 
              type='email' 
              value={email} 
              onChange={(e) => {setemail(e.target.value)}}
              placeholder='Enter your email' 
            />
            
            <label>Phone Number</label>
            <input 
              className='form-control'
              type='tel' 
              value={mobile} 
              onChange={(e) => {setmobile(e.target.value)}}
              placeholder='Enter phone number' 
            />
            
            <label>Password</label>
            <input 
              className='form-control' 
              type='password' 
              value={password}
              onChange={(e) => {setpassword(e.target.value)}}
              placeholder='Create password' 
            />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px'}}>
              <button className='btn btn-primary' onClick={handleApi} style={{width: '100%'}}>Create Account</button>
              <Link className='btn btn-success' to="/login" style={{width: '100%', textAlign: 'center'}}>Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp