
// Home.jsx

import React, { useEffect, useState } from 'react';
import Header from './Header';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';
import { useAlert } from '../contexts/AlertContext';
import './Home.css';


import { AiOutlineClear } from "react-icons/ai";
import {FaHeart } from "react-icons/fa";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [cproducts, setcproducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const[isSearch, setIsSearch] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const { showAlert } = useAlert();


  useEffect(() => {
    const url = 'http://localhost:4000/get-products';
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('Server Error', 'error');
      });


      const userId = localStorage.getItem('userId');
      if (userId) {
        const url2 = 'http://localhost:4000/liked-products';
        let data = {userId};
        axios
          .post(url2, data)
          .then((res) => {
            if (res.data.products) {
              setLikedProducts(res.data.products);
            }
          })
          .catch((err) => {
            console.log(err);
            showAlert('Server Error', 'error');
          });
      }
  }, [refresh, showAlert]); // Empty dependency array to run the effect only once on component mount
  const handlesearch = (value) => {
    setSearch(value);
  };
  const handleclick = () => {
    const userLoc = localStorage.getItem('userLoc');
    if (!userLoc) {
      showAlert('Please select a location first', 'warning');
      return;
    }

    const url = 'http://localhost:4000/search?search=' + encodeURIComponent(search.trim()) + '&loc=' + userLoc;
    axios
      .get(url)
      .then((res) => {
        setcproducts(res.data.products || []);
        setSearchMessage(res.data.message || '');
        setIsSearch(true);
      })  
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          showAlert(err.response.data.message, 'warning');
        } else {
          showAlert('Search failed. Please try again.', 'error');
        }
      });



    //To search locally from frontend
   // let filteredproducts = products.filter((items) => {
     // if (items.pname.includes(search) || items.pdesc.includes(search) || items.category.includes(search)) {
    //    return items;
      //}
    //});
    // setcproducts(filteredproducts);
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
      {isSearch && cproducts && 
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0'}}>
        <h2 style={{color: 'gray', fontFamily: "'Inter', sans-serif", fontWeight: '600', fontSize: '24px'}}>
          Search Results
        </h2>
        <button className='clear-btn' onClick={()=> {setIsSearch(false); setSearchMessage('');}}>Clear <AiOutlineClear /></button>
      </div>}
      {isSearch && searchMessage && searchMessage !== 'success' && 
      <div style={{backgroundColor: '#e3f2fd', padding: '10px 15px', borderRadius: '8px', margin: '10px 0', color: '#1976d2', fontSize: '14px', fontFamily: "'Inter', sans-serif"}}>
        {searchMessage}
      </div>}
      {isSearch && cproducts && cproducts.length === 0 && 
      <h3 style={{color: 'gray', fontSize: '24px', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontWeight: '500', margin: '40px 0'}}>No Results Found</h3>}

      
      
      {isSearch && 
      <div className='products-grid'>
        {cproducts && cproducts.length>0 &&
        cproducts.map((item, index) => (
        <div onClick={() => handleProduct(item._id)} key={item._id} className='box-design'>
          <div className='card-container'>



          <div className='icon-con'>
          {
            likedProducts.find((likedItem) => likedItem._id === item._id) ? 
            <FaHeart onClick={(e)=> handleDislike(item._id, e)}  className='icons'/>:
            <FaHeart onClick={(e)=> handleLike(item._id, e)}  className='red-icons'/>
          }
          </div>
            <img
              src={`http://localhost:4000/${item.pimage}`}
              className='card-img-top'
              alt='product'
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }}
            />
            <div key={item._id} className='card-body'>
            <p className='card-text price-txt'>{item.price}₹ /- Month</p>
              <h5 className='card-title'>{item.pname}</h5>
              <p className='card-description'>{item.pdesc.slice(0, 80)}...</p>
              <div className='card-meta'>
                <span className='category-tag'>{item.category}</span>
                <p className='location-text'><strong>Near:</strong> {item.nearLoc}</p>
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>}




       {! isSearch && <div className='products-grid'>
        {products && products.length>0 && 
        products.map((item) => (
          <div onClick={() => handleProduct(item._id)} key={item._id} className='box-design'>
          <div className='card-container'>
          
          <div className='icon-con'>
          {
            likedProducts.find((likedItem) => likedItem._id === item._id) ? 
            <FaHeart onClick={(e)=> handleDislike(item._id, e)}  className='icons'/>:
            <FaHeart onClick={(e)=> handleLike(item._id, e)}  className='red-icons'/>
          }
          </div>

           
            <img
              src={`http://localhost:4000/${item.pimage}`}
              className='card-img-top'
              alt='product'
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }}
            />
            <div key={item._id} className='card-body'>
            <p className='card-text price-txt'>{item.price}₹ /- Month</p>
              <h5 className='card-title'>{item.pname}</h5>
              <p className='card-description'>{item.pdesc.slice(0, 80)}...</p>
              <div className='card-meta'>
                <span className='category-tag'>{item.category}</span>
                <p className='location-text'><strong>Near:</strong> {item.nearLoc}</p>
              </div>

            </div>
          </div>
          </div>
        ))}
      </div>} 
      </div>

      
    </div>
    </div>
  );
};

export default Home;
