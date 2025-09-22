// Home.jsx

import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';

import ConfirmDialog from './ConfirmDialog';
import './Home.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {FaHeart } from "react-icons/fa";
import { useAlert } from '../contexts/AlertContext';
import API_BASE_URL from '../config/api';



const MyProducts = () => {
  const [products, setProducts] = useState([]);


  const [refresh, setRefresh] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const url = `${API_BASE_URL}/my-product`;

    let data = {userId : localStorage.getItem('userId')}

    axios
      .post(url,data)
      .then((res) => {
        console.log(res);
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('Server Error', 'error');
      });
  }, [refresh, showAlert]); // Empty dependency array to run the effect only once on component mount



  const handleLike = (productId) =>{
    
    let userId = localStorage.getItem('userId');

    const url = `${API_BASE_URL}/like-product`;
    const data = {userId, productId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })  
      .catch((err) => {
        console.log(err);
        showAlert('Server Error', 'error');
      });

      showAlert('Product already in wishlist', 'warning')
  }



  const handleDel = (pid) =>{
    let userId = localStorage.getItem('userId');
    if(!userId){
      showAlert('Please login first', 'warning');
      return;
    }
    setDeleteId(pid);
    setShowConfirm(true);
  }

  const confirmDelete = () => {
    const url = `${API_BASE_URL}/delete-product`;
    const data = {userId: localStorage.getItem('userId'), pid: deleteId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          showAlert("Deleted Successfully", 'success')
          setRefresh(!refresh);
        }
      })  
      .catch((err) => {
        showAlert('Server Error', 'error');
      })
      .finally(() => {
        setShowConfirm(false);
        setDeleteId(null);
      });
  }

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  }

  const navigate = useNavigate();




  return (
    <div className='super-main'>
      <div className='main-body'>
      <Header />

      <div className='my-products-container' style={{padding: '20px'}}>
        <div className='my-products-header' style={{marginTop: '0'}}>
          <h1 className='page-title'>My Rooms</h1>
          <div className='products-count'>{products.length} Room{products.length !== 1 ? 's' : ''}</div>
        </div>

        <div className='my-products-grid'>
          {products && products.length > 0 ? (
            products.map((item, index) => (
              <div className='my-product-card' key={index}>
                <div className='card-header'>
                  <div className='category-badge'>{item.category}</div>
                  <div onClick={() => handleLike(item._id)} className='like-btn'>
                    <FaHeart className='heart-icon'/>
                  </div>
                </div>
                
                <div className='images-container'>
                  <img
                    src={`${API_BASE_URL}/${item.pimage}`}
                    className='product-image main-image'
                    alt='Room view 1'
                  />
                  <img
                    src={`${API_BASE_URL}/${item.pimage2}`}
                    className='product-image secondary-image'
                    alt='Room view 2'
                  />
                </div>
                
                <div className='card-content'>
                  <h3 className='product-title'>{item.pname}</h3>
                  <p className='product-description'>{item.pdesc}</p>
                  
                  <div className='product-details'>
                    <div className='price-tag'>₹{item.price}/month</div>
                    <div className='location-info'>
                      <span className='location-label'>Near:</span>
                      <span className='location-value'>{item.nearLoc}</span>
                    </div>
                  </div>
                  
                  <div className='action-buttons'>
                    <Link className='edit-button' to={`/edit-product/${item._id}`}>
                      Edit Details
                    </Link>
                    <button className='delete-button' onClick={() => handleDel(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='empty-state' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
              <h3>No rooms posted yet</h3>
              <p>Start by adding your first room listing</p>
              <button 
                onClick={() => navigate('/add-product')} 
                style={{
                  marginTop: '8px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Add Your First Room
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirm}
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      
    </div>
    </div>
  );
};
 
export default MyProducts;
