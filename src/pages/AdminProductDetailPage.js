import React from 'react'
import Navbar from '../features/navbar/Navbar'

import AdminProductDeatils from '../features/admin/components/AdminProductDetails'
import Footer from '../features/common/Footer'
const AdminProductDetailPage = () => {
  return (
    <div>
      <Navbar>
        <AdminProductDeatils></AdminProductDeatils>
      </Navbar>
      <Footer></Footer>
    </div>
  )
}

export default AdminProductDetailPage