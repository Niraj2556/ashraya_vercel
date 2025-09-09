import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAlert } from '../contexts/AlertContext'


const MyProfile = () => {

    const [user, setuser] = useState({})
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    
    useEffect(()=>{
        const url = 'http://localhost:4000/my-profile/' + localStorage.getItem('userId');
        axios
          .get(url)
          .then((res) => {
            if (res.data.user) {
                setuser(res.data.user)
            }
          })
          .catch((err) => {
            showAlert('Server Error', 'error');
          });
      
    }, [showAlert])
    

    
  return (
    <div className='super-main' style={{minHeight: '100vh'}}>
      <Header />
      <div className='main-body' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '20px'}}>
        <div style={{maxWidth: '700px', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'}}>
              <span style={{fontSize: '32px', color: 'white', fontWeight: 'bold'}}>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <h1 style={{fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px 0'}}>My Profile</h1>
            <p style={{color: '#374151', fontSize: '16px', margin: '0', fontWeight: '500'}}>Manage your account information</p>
          </div>
          
          <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '32px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.4)'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div style={{padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '600', color: '#667eea', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Username</label>
                <div style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>{user.username || 'Loading...'}</div>
              </div>
              
              <div style={{padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '600', color: '#667eea', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email Address</label>
                <div style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>{user.email || 'Loading...'}</div>
              </div>
            </div>
            
            <div style={{padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
              <label style={{display: 'block', fontSize: '12px', fontWeight: '600', color: '#667eea', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Phone Number</label>
              <div style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>{user.mobile || 'Loading...'}</div>
            </div>
            
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button 
                onClick={() => navigate('/my-product')}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s ease',
                  marginRight: '16px'
                }}
              >
                My Rooms
              </button>
              <button 
                onClick={() => navigate('/liked-product')}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile