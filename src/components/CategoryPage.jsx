// Home.jsx

import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';
import API_BASE_URL from '../config/api';
import './Home.css';
import { AiOutlineClear } from "react-icons/ai";
import {FaHeart } from "react-icons/fa";


const CategoryPage = () => {

    const navigate = useNavigate();
    const params = useParams();


  const [products, setProducts] = useState([]);
  const [cproducts, setcproducts] = useState([]);
  const [search, setSearch] = useState('');
  const[isSearch, setIsSearch] = useState(false);


  const [likedProducts, setLikedProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);


  

  useEffect(() => {
    const url = `${API_BASE_URL}/get-products?catName=${params.catName}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Server Error');
      });


      const url2 = `${API_BASE_URL}/liked-products`;
      let data = {userId: localStorage.getItem('userId')};
    axios
      .post(url2, data)
      .then((res) => {
        if (res.data.products) {
          setLikedProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Server Error');
      });
  }, [params, refresh]); // Empty dependency array to run the effect only once on component mount

  const handlesearch = (value) => {
    setSearch(value);
  };

  const handleclick = () => {


    // const lowercaseSearch = search.toLowerCase(); // Convert search term to lowercase

    // const url = 'http://localhost:4000/search?search=' + lowercaseSearch + '&loc=' + localStorage.getItem('userLoc');

    // console.log(localStorage.getItem('userLoc'))


    const url = `${API_BASE_URL}/search?search=${search}&loc=${localStorage.getItem('userLoc')}` ;
    axios
      .get(url)
      .then((res) => { 
        setcproducts(res.data.products);
        setIsSearch(true);
      })  
      .catch((err) => {
        console.log(err);
        alert('Server Error');
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

  // }

  


  const handleLike = (productId, e) =>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      alert('Please Login First');
      return;
    }

    const url = `${API_BASE_URL}/like-product`;
    const data = {userId, productId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert('Room added to wishlist')
          setRefresh(!refresh);
        }
      })  
      .catch((err) => {
        alert('Server Error');
      });

  }

  const handleDislike = (productId, e) =>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      alert('Please Login First');
      return;
    }

    const url = `${API_BASE_URL}/dislike-product`;
    const data = {userId, productId}  
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert('Removed from wishlist')
          setRefresh(!refresh);
        }
      })  
      .catch((err) => {
        alert('Server Error');
      });

  }

  
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



      <div className='home-back'>
        <Categories handleCategory = {handleCategory} />
        {isSearch && cproducts && <h5>
          Search Result
          <button className='clear-btn' onClick={()=> setIsSearch(false)}>Clear <AiOutlineClear /></button>
        </h5>}
      {isSearch && 
      <div className='products-grid'>
        {products && products.length>0 &&
        cproducts.map((item, index) => (
          <div onClick={() => handleProduct(item._id)} className='card m-3 box-design' key={index}>
            <div className='icon-con'>
            {
              likedProducts.find((likedItem) => likedItem._id === item._id) ? 
              <FaHeart onClick={(e)=> handleDislike(item._id, e)}  className='icons'/>:
              <FaHeart onClick={(e)=> handleLike(item._id, e)}  className='red-icons'/>
            }
            </div>
            <img
              src={`${API_BASE_URL}/${item.pimage}`}
              className='card-img-top'
              alt='product'
            />
            <div className='card-body'>
              <div className='category-tag'>{item.category}</div>
              <h5 className='card-title'>{item.pname}</h5>
              <p className='card-description'>{item.pdesc}</p>
              <div className='card-meta'>
                <p className='price-txt'>₹{item.price}/month</p>
                <p className='location-text'>{item.nearLoc || item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>}






      {!isSearch && <div className='products-grid'>
        {products && products.length>0 && 
        products.map((item, index) => (
          <div onClick={() => handleProduct(item._id)} key={item._id} className='card m-3 box-design'>
            <div className='icon-con'>
            {
              likedProducts.find((likedItem) => likedItem._id === item._id) ? 
              <FaHeart onClick={(e)=> handleDislike(item._id, e)}  className='icons'/>:
              <FaHeart onClick={(e)=> handleLike(item._id, e)}  className='red-icons'/>
            }
            </div>
            <img
              src={`${API_BASE_URL}/${item.pimage}`}
              className='card-img-top'
              alt='product'
            />
            <div className='card-body'>
              <div className='category-tag'>{item.category}</div>
              <h5 className='card-title'>{item.pname}</h5>
              <p className='card-description'>{item.pdesc}</p>
              <div className='card-meta'>
                <p className='price-txt'>₹{item.price}/month</p>
                <p className='location-text'>{item.nearLoc || item.location}</p>
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

export default CategoryPage;
