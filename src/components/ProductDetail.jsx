import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Header from './Header'
import { useAlert } from '../contexts/AlertContext'
import API_BASE_URL from '../config/api'
import './Home.css';

const ProductDetail = () => {


    const[product, setProduct] = useState(null)
    const[user, setUser] = useState(null)
    const[loading, setLoading] = useState(true)
    const[showModal, setShowModal] = useState(false)
    const[modalImage, setModalImage] = useState('')
    const[isZoomed, setIsZoomed] = useState(false)

    const[contactLoading, setContactLoading] = useState(false)
    const[showContactAlert, setShowContactAlert] = useState(false)
    const[showDescriptionPopup, setShowDescriptionPopup] = useState(false)
    const { showAlert } = useAlert();

    const truncateText = (text, wordLimit) => {
        const words = text?.split(' ') || []
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
    }

    console.log("user", user)

    const p = useParams()
    console.log(p.productId)
     

    useEffect(() => {
        if (!p.productId) return;
        
        const url = `${API_BASE_URL}/get-product/${p.productId}`;
        axios
          .get(url)
          .then((res) => {
            console.log('Product data:', res.data);
            if(res.data.products){
              setProduct(res.data.products);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching product:', err);
            showAlert('Failed to load product details', 'error');
            setLoading(false);
          });
      }, [p.productId, showAlert]);
      

      const handleContact = (addedBy) => {
        setShowContactAlert(true)
        setContactLoading(true)
        
        setTimeout(() => {
          setShowContactAlert(false)
          const url = `${API_BASE_URL}/get-user/${addedBy}`;
          axios
            .get(url)
            .then((res) => {
              if(res.data.user){
                setUser(res.data.user)
              }
              setContactLoading(false)
            })
            .catch((err) => {
              console.log(err);
              showAlert('Server Error', 'error');
              setContactLoading(false)
            });
        }, 5000)
      }

      const openImageModal = (imageSrc) => {
        setModalImage(imageSrc);
        setShowModal(true);
        setIsZoomed(false);
      }

      const closeModal = () => {
        setShowModal(false);
        setIsZoomed(false);
      }

      const toggleZoom = () => {
        setIsZoomed(!isZoomed);
      }



  return (
    <div className='super-main'>
      <div className='main-body'>
        <Header />
        <div className='product-detail-modern'>
          {loading && (
            <div className='loading-state'>
              <div className='loading-spinner'></div>
              <h3>Loading product details...</h3>
            </div>
          )}
          {!loading && !product && (
            <div className='error-state'>
              <div className='error-icon'>🏠</div>
              <h3>Product not found</h3>
              <p>The product you're looking for doesn't exist or has been removed.</p>
            </div>
          )}
          {!loading && product && 
            <div className='product-container'>
              <div className='images-section'>
                <div className='image-gallery'>
                  <div className='main-image' onClick={() => openImageModal(`${API_BASE_URL}/${product.pimage}`)}>
                    <img src={`${API_BASE_URL}/${product.pimage}`} alt={product.pname} />
                    <div className='category-overlay'>{product.category}</div>
                  </div>
                  {product.pimage2 && (
                    <div className='secondary-image' onClick={() => openImageModal(`${API_BASE_URL}/${product.pimage2}`)}>
                      <img src={`${API_BASE_URL}/${product.pimage2}`} alt={`${product.pname} view 2`} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className='details-section'>
                <div className='property-header'>
                  <h1>{product.pname}</h1>
                  <div className='price-tag'>₹{product.price}/month</div>
                </div>
                
                <div className='property-info'>
                  <div className='info-row'>
                    <span className='icon'>📍</span>
                    <span>Near {product.nearLoc}</span>
                  </div>
                  <div className='info-row'>
                    <span className='icon'>🏠</span>
                    <span>{product.category}</span>
                  </div>
                </div>
                
                <div className='description-box'>
                  <h3>Description</h3>
                  <p>
                    {truncateText(product.pdesc, 15)}
                    {product.pdesc?.split(' ').length > 15 && (
                      <button 
                        className='read-more-btn' 
                        onClick={() => setShowDescriptionPopup(true)}
                      >
                        Read Full Description
                      </button>
                    )}
                  </p>
                </div>

                <div className='contact-section'>
                  {showContactAlert && (
                    <div className='alert-box'>
                      <div className='dots'>
                        <span></span><span></span><span></span>
                      </div>
                      <span>Verified info - use responsibly</span>
                    </div>
                  )}
                  
                  {product.addedBy && !user && (
                    <button 
                      className='contact-btn'
                      onClick={() => handleContact(product.addedBy)}
                      disabled={contactLoading}
                    >
                      {contactLoading && !showContactAlert ? (
                        <>
                          <div className='loader'></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>📞</span>
                          <span>Get Contact</span>
                        </>
                      )}
                    </button>
                  )}

                  {user && (
                    <div className='owner-info'>
                      <div className='info-row'>
                        <span className='label'>Name:</span>
                        <span className='value'>{user.username}</span>
                      </div>
                      <div className='info-row'>
                        <span className='label'>Email:</span>
                        <span className='value'>{user.email}</span>
                      </div>
                      <div className='info-row'>
                        <span className='label'>Phone:</span>
                        <span className='value'>{user.mobile}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        </div>
        {showModal && (
          <div className='image-modal' onClick={closeModal}>
            <button className='modal-close-btn' onClick={closeModal}>×</button>
            <img 
              className={`modal-display-image ${isZoomed ? 'zoomed' : ''}`}
              src={modalImage}
              alt='Property view'
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
            />
            <div className='modal-hint'>
              <span>Click image to {isZoomed ? 'zoom out' : 'zoom in'}</span>
            </div>
          </div>
        )}
        
        {showDescriptionPopup && (
          <div className='description-modal' onClick={() => setShowDescriptionPopup(false)}>
            <div className='description-popup' onClick={(e) => e.stopPropagation()}>
              <div className='popup-header'>
                <h3>Property Description</h3>
                <button className='popup-close' onClick={() => setShowDescriptionPopup(false)}>×</button>
              </div>
              <div className='popup-content'>
                <p>{product.pdesc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail