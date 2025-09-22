import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import categories from './CategoriesList'
import { useAlert } from '../contexts/AlertContext'
import API_BASE_URL from '../config/api'
import "./Home.css"

const EditProduct = () => {

    const[pname, setpname] = useState('')
    const[pdesc, setdesc] = useState('')
    const[price, setprice] = useState('')
    const[nearLoc, setnearLoc] = useState('')
    const[category, setcategory] = useState('')
    const[pimage, setpimage] = useState('')
    const[pimage2, setpimage2] = useState('');
    const[poldimage, setpoldimage] = useState('')
    const[poldimage2, setpoldimage2] = useState('');

    const { showAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(()=>{
        if(! localStorage.getItem('token')){
            navigate('/login')
        }
    },[navigate])

    const p = useParams();
    useEffect(() => {
        const url = `${API_BASE_URL}/get-product/${p.productId}`;
        axios
          .get(url)
          .then((res) => {
            if(res.data.products){
                let product = res.data.products;
                setpname(product.pname);
                setdesc(product.pdesc);
                setprice(product.price);
                setnearLoc(product.nearLoc);
                setcategory(product.category);
                setpoldimage(product.pimage);
                setpoldimage2(product.pimage2);

            }

          })
          .catch((err) => {
            console.log(err);
            showAlert('Server Error', 'error');
          });
      }, [p.productId, showAlert]);


    const handleApi = ()=>{
        navigator.geolocation.getCurrentPosition((position)=>{

            const formData = new FormData();

            formData.append('pid', p.productId);
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('nearLoc', nearLoc);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('pimage', pimage);
            formData.append('pimage2', pimage2);
            formData.append('userId', localStorage.getItem('userId'));
    
    
    
            const url = `${API_BASE_URL}/edit-product`;
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) =>{
                console.log(res)
                if(res.data.message === 'Saved successfully'){
                    showAlert('Updated successfully', 'success')
                    navigate('/my-product')
                } else {
                    showAlert('Update failed', 'error')
                }
            })
            .catch((err) =>{
                showAlert("Server Error", 'error')
            })
        })



       
    }


  return (
    <div className='super-main' style={{minHeight: '100vh'}}>
        <Header />
        <div className='add-main-body' style={{maxWidth: '900px', margin: '0 auto', padding: '20px'}}>

    <div className='p-3' style={{background: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: "24px", color:"#667eea", fontWeight: "700", marginBottom: "4px"}}>Update Room</h1>
        <p style={{color: '#64748b', fontSize: '14px', margin: '0'}}>Edit your room details</p>
        </div>

    <div style={{marginBottom: '24px'}}>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Room Title *</label>
    <input  
    className='form-control' 
    type='text' 
    value={pname}
    onChange={(e)=>{setpname(e.target.value)}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', width: '100%'}}
    />
    </div>

    <div style={{marginBottom: '24px'}}>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Room Description *</label>
    <textarea  
    className='form-control' 
    value={pdesc}
    onChange={(e)=>{setdesc(e.target.value)}}
    rows='4'
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', width: '100%', resize: 'vertical'}}
    />
    </div>
    
    <div style={{marginBottom: '24px'}}>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Nearby Colleges *</label>
    <input  
    className='form-control' 
    type='text' 
    value={nearLoc}
    onChange={(e)=>{setnearLoc(e.target.value)}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', width: '100%'}}
    />
    </div>
    
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Room Price (₹/month) *</label>
    <input  
    className='form-control' 
    type='number' 
    value={price}
    onChange={(e)=>{setprice(e.target.value)}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', width: '100%'}}
    />
    </div>
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Category *</label>
        <select 
        className='form-control' 
        value={category}
        onChange={(e)=>{setcategory(e.target.value)}}
        style={{padding: '16px 20px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '16px', transition: 'all 0.2s ease', background: '#fafbfc', cursor: 'pointer', width: '100%'}}
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
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '15px'}}>Main Image</label>
    <input  
    className='form-control' 
    type='file' 
    accept='image/*'
    onChange={(e)=>{setpimage(e.target.files[0])}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px dashed #cbd5e1', fontSize: '16px', background: '#f8fafc', cursor: 'pointer', width: '100%', marginBottom: '12px'}}
    />
    {poldimage && <img src={`${API_BASE_URL}/${poldimage}`} alt='Current' style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0'}}/>}
    </div>
    
    <div>
    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#64748b', fontSize: '15px'}}>Additional Image</label>
    <input  
    className='form-control' 
    type='file' 
    accept='image/*'
    onChange={(e)=>{setpimage2(e.target.files[0])}}
    style={{padding: '16px 20px', borderRadius: '16px', border: '2px dashed #cbd5e1', fontSize: '16px', background: '#f8fafc', cursor: 'pointer', width: '100%', marginBottom: '12px'}}
    />
    {poldimage2 && <img src={`${API_BASE_URL}/${poldimage2}`} alt='Current' style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0'}}/>}
    </div>
    </div>
    </div>
        <button 
        onClick={handleApi} 
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}
        >Update Room</button>
    </div>

    
    </div>
    </div>
  )
}

export default EditProduct