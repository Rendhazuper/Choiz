import React from 'react';
import ReactDOM from 'react-dom/client';
import {BroserRouter, createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css';
import App from './App';
import Home from './Pages/home';
import Login from './Pages/login';
import Forgot from './Pages/forgot';
import reportWebVitals from './reportWebVitals';
import Register from './Pages/register';
import Reset from './Pages/reset';
import ProductInput from './Pages/ProductInput';
import Shop from './Pages/shop';
import DetailProduk from './Pages/detailproduk'; 

const router =  createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path:"/forgot",
    element : <Forgot/>,
  },
  {
    path:"/register",
    element : <Register/>
  },
  {
    path:"/reset",
    element : <Reset/>
  },
  {
    path: "/ProductInput",
    element: <ProductInput/>,
  },
  {
  path: "/shop",
  element: <Shop/>,
},
{
  path : "/produk/:id",
  element : <DetailProduk/>
},
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<RouterProvider router={router}/> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
