import React from 'react'
import Navbar from '../features/navbar/Navbar'
import ProductDeatils from '../features/product/components/ProductDetails'
import Footer from '../features/common/Footer'
const ProductDetailPage = () => {
  return (
    <div>
      <Navbar>
        <ProductDeatils></ProductDeatils>
      </Navbar>
      <Footer></Footer>
    </div>
  )
}

export default ProductDetailPage