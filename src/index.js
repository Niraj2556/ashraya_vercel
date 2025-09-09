// import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';



import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
//here   Route, Link are imported but now hided 
} from "react-router-dom";

import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddProduct from './components/AddProduct';
import LikedProducts from './components/LikedProduct';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import MyProducts from './components/MyProducts';
import MyProfile from './components/MyProfile';
import EditProduct from './components/EditProduct';
import { AlertProvider } from './contexts/AlertContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Home />),
  },
  {
    path: "/category/:catName",
    element: (<CategoryPage />),
  },
  
  {
    path: "/about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: (<Login />),
  },
  {
    path: "/signup",
    element: (<SignUp />),
  },
  {
    path: "/add-product",
    element: (<AddProduct />),
  },
  {
    path: "/edit-product/:productId",
    element: (<EditProduct />),
  },
  {
    path: "liked-product",
    element: (<LikedProducts />),
  },
  {
    path: "/my-profile",
    element: (<MyProfile />),
  },
  {
    path: "/my-product",
    element: (<MyProducts />),
  },
  {
    path: "/product/:productId",
    element: (<ProductDetail />),
  },
]);

createRoot(document.getElementById("root")).render(
  <AlertProvider>
    <RouterProvider router={router} />
  </AlertProvider>
);


reportWebVitals();
