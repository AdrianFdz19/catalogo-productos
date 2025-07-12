import { Routes, Route } from 'react-router-dom'
import './App.css'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import AdminProducts from './admin/AdminProducts'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Products />} ></Route>
        <Route path='/product/:id' element={<ProductDetail />} ></Route>
        <Route path='/admin/products/add' element={<AddProduct />} ></Route>
        <Route path='/admin/products/edit' element={<EditProduct />} ></Route>
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </div>
  )
}

export default App
