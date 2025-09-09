// Home.jsx

import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import Categories from './Categories';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';

import {FaHeart } from "react-icons/fa";



const LikedProducts = () => {
  const [products, setProducts] = useState([]);
  const [cproducts, setcproducts] = useState([]);
  const [search, setSearch] = useState('');

  const [likedProducts, setLikedProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const url = 'http://localhost:4000/liked-products';

    let data = {userId : localStorage.getItem('userId')}

    axios
      .post(url,data)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        showAlert('Server Error', 'error');
      });

      const url2 = 'http://localhost:4000/liked-products';
      let datas = {userId: localStorage.getItem('userId')};
    axios
      .post(url2, datas)
      .then((res) => {
        if (res.data.products) {
          setLikedProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('Server Error', 'error');
      });
  }, [refresh]); // Empty dependency array to run the effect only once on component mount

  const handlesearch = (value) => {
    setSearch(value);
  };

  const handleclick = () => {
    let filteredproducts = products.filter((items) => {
      if (items.pname.includes(search) || items.pdesc.includes(search) || items.category.includes(search)) {
        return items;
      }
      return false;
    });
    setcproducts(filteredproducts);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  const handleCategory = (value) =>{
    console.log(value)
    let filteredproducts = products.filter((items) => {
      if (items.category === value) {
        return items;
      }
      return false;
    });
    setcproducts(filteredproducts);
  }

  // const handleLike = (productId) =>{
    
  //   let userId = localStorage.getItem('userId');

  //   const url = 'http://localhost:4000/like-product';
  //   const data = {userId, productId}  
  //   axios
  //     .post(url, data)
  //     .then((res) => {
  //       if (res.data.products) {
  //         setProducts(res.data.products);
  //       }
  //     })  
  //     .catch((err) => {
  //       console.log(err);
  //       alert('Server Error');
  //     });

  //     alert('Product already in wishlist')
  // }

  const handleLike = (productId, e) =>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      showAlert('Please Login First', 'warning');
      return;
    }

    const url = 'http://localhost:4000/like-product';
    const data = {userId, productId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          if(res.data.message.includes('already')) {
            showAlert(res.data.message, 'warning')
          } else {
            showAlert('Room added to wishlist', 'success')
          }
          setRefresh(!refresh);
        }
      })  
      .catch((err) => {
        showAlert('Server Error', 'error');
      });

  }
  const handleDislike = (productId, e) =>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      showAlert('Please Login First', 'warning');
      return;
    }

    const url = 'http://localhost:4000/dislike-product';
    const data = {userId, productId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          showAlert('Removed from wishlist', 'success')
          setRefresh(!refresh);
        }
      })  
      .catch((err) => {
        showAlert('Server Error', 'error');
      });

  }

  const navigate = useNavigate();
  const handleProduct = (id) => {
    navigate('/product/' + id);
  }

  return (
    <div className='super-main'>
      <div className='main-body'>
      <Header
        search={search}
        handlesearch={handlesearch}
        handleclick={handleclick}
        handleLogout={handleLogout}
      />

      <Categories handleCategory = {handleCategory} />

      <div className='home-back'>
        <div className='wishlist-header'>
          <h1 className='wishlist-title'>My Wishlist</h1>
        </div>
        
        <div className='products-grid'>
          {products && products.length > 0 ? 
            products.map((item) => (
              <div onClick={() => handleProduct(item._id)} key={item._id} className='box-design'>
                <div className='card-container'>
                  <div className='icon-con'>
                    {
                      likedProducts.find((likedItem) => likedItem._id === item._id) ? 
                      <FaHeart onClick={(e)=> handleDislike(item._id, e)} className='icons'/>:
                      <FaHeart onClick={(e)=> handleLike(item._id, e)} className='red-icons'/>
                    }
                  </div>
                  
                  <img
                    src={`http://localhost:4000/${item.pimage}`}
                    className='card-img-top'
                    alt='product'
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
                  />
                  <div className='card-body'>
                    <p className='price-txt'>₹{item.price}/month</p>
                    <h5 className='card-title'>{item.pname}</h5>
                    <p className='card-description'>{item.pdesc.slice(0, 80)}...</p>
                    <div className='card-meta'>
                      <span className='category-tag'>{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : 
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b'}}>
              <h3>No items in your wishlist yet</h3>
              <p>Start exploring and add rooms to your wishlist!</p>
            </div>
          }
        </div>
      </div>

      
    </div>
    </div>
  );
};

export default LikedProducts;
