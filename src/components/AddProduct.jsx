import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import categories from './CategoriesList'
import { useAlert } from '../contexts/AlertContext'
import API_BASE_URL from '../config/api'
import "./Home.css"


const AddProduct = () => {

    const[pname, setpname] = useState('')
    const[pdesc, setdesc] = useState('')
    const[nearLoc, setnearLoc] = useState('')
    const[price, setprice] = useState('')
    const[category, setcategory] = useState('')
    const[pimage, setpimage] = useState('')
    const[pimage2, setpimage2] = useState('');

    const { showAlert } = useAlert();
    const navigate = useNavigate();


    useEffect(()=>{
        if(! localStorage.getItem('token')){
            navigate('/login')
        }
    },[navigate])


    const handleApi = ()=>{
        // Validation
        if(!pname){
            showAlert('Please enter room title', 'error');
            return;
        }
        if(!pdesc){
            showAlert('Please enter room description', 'error');
            return;
        }
        if(!nearLoc){
            showAlert('Please enter nearby colleges', 'error');
            return;
        }
        if(!price){
            showAlert('Please enter room price', 'error');
            return;
        }
        if(!category || category === 'Select Category'){
            showAlert('Please select a category', 'error');
            return;
        }
        if(!pimage){
            showAlert('Please select at least one image', 'error');
            return;
        }
        if(isNaN(price) || price <= 0){
            showAlert('Please enter a valid price', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            const formData = new FormData();

            formData.append('plat', position.coords.latitude)
            formData.append('plong', position.coords.longitude)
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('nearLoc', nearLoc);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('pimage', pimage);
            if(pimage2) formData.append('pimage2', pimage2);
            formData.append('userId', localStorage.getItem('userId'));
    
            const url = `${API_BASE_URL}/add-product`;
            axios.post(url, formData)
            .then((res) =>{
                if(res.data.message){
                    showAlert('Room added successfully', 'success')
                    navigate('/')
                }
            })
            .catch((err) =>{
                console.error('Upload error:', err);
                showAlert('Failed to add room. Please try again.', 'error');
            })
        }, (error) => {
            console.error('Location error:', error);
            showAlert('Please enable location access to add a room.', 'warning');
        })
    }


  return (
    <div className='super-main' style={{minHeight: '100vh'}}>
        <Header />
        <div className='add-main-body' style={{maxWidth: '800px', margin: '0 auto', padding: '40px'}}>

    <div className='p-3' style={{background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}>
        <h1 style={{fontSize: "32px", color:"#667eea", fontWeight: "700", marginBottom: "32px", textAlign: 'center'}}>Add New Accommodation</h1>

    <div style={{marginBottom: '20px'}}>
    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Room Title *</label>
    <input  
    className='form-control' 
    type='text' 
    value={pname}
    placeholder='Enter Room title'
    onChange={(e)=>{setpname(e.target.value)}}
    style={{padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px'}}
    />
    </div>

    <div style={{marginBottom: '20px'}}>
    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>Room Description *</label>
    <textarea  
    className='form-control' 
    value={pdesc}
    placeholder='Enter Room Description'
    onChange={(e)=>{setdesc(e.target.value)}}
    rows='3'
    style={{padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', resize: 'vertical'}}
    />
    </div>


    <div style={{marginBottom: '24px'}}>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Nearby Colleges *</label>
    <input  
    className='form-control' 
    type='text' 
    placeholder='e.g., Delhi University, JNU'
    value={nearLoc}
    onChange={(e)=>{setnearLoc(e.target.value)}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc'}}
    onFocus={(e) => e.target.style.borderColor = '#667eea'}
    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
    />
    </div>
    
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Room Price (₹/month) *</label>
    <input  
    className='form-control' 
    type='number' 
    value={price}
    placeholder='5000'
    onChange={(e)=>{setprice(e.target.value)}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc'}}
    onFocus={(e) => e.target.style.borderColor = '#667eea'}
    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
    />
    </div>

    

    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Category *</label>
        <select 
        className='form-control' 
        value={category}
        onChange={(e)=>{setcategory(e.target.value)}}
        style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', cursor: 'pointer'}}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        >
            <option>Select Category</option>
            {categories && categories.length > 0 && categories.map((item, index) => {
                return (
                    
                    <option key={'option' + index}>{item}</option>
                )
            })
            }

            
        </select>
    </div>
    </div>


    <div style={{marginBottom: '32px'}}>
    <h3 style={{color: '#374151', fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px'}}>Room Images</h3>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Main Image *</label>
    <input  
    className='form-control' 
    type='file' 
    accept='image/*'
    onChange={(e)=>{setpimage(e.target.files[0])}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px dashed #cbd5e1', fontSize: '16px', transition: 'all 0.2s ease', background: '#f8fafc', cursor: 'pointer'}}
    />
    </div>
    
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#64748b', fontSize: '15px'}}>Additional Image</label>
    <input  
    className='form-control' 
    type='file' 
    accept='image/*'
    onChange={(e)=>{setpimage2(e.target.files[0])}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px dashed #cbd5e1', fontSize: '16px', transition: 'all 0.2s ease', background: '#f8fafc', cursor: 'pointer'}}
    />
    </div>
    </div>
    </div>
    
        <button 
        onClick={handleApi} 
        style={{
          width: '100%',
          padding: '20px',
          fontSize: '18px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        >✨ Add Room ✨</button>
    </div>

    
    </div>
    </div>
  )
}

export default AddProduct