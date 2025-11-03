import { Routes, Route } from 'react-router-dom'
import './App.css'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import AdminProducts from './admin/AdminProducts'
import SignUp from './auth/SignUp'
import SignIn from './auth/SignIn'
import ProtectedRoute from './admin/ProtectedRoute'
import LayoutWithHeader from './layouts/LayoutWithHeader'
import Favorites from './pages/Favorites'
import Tokens from './admin/Tokens'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/signup' element={<SignUp />} ></Route>
        <Route path='/signin' element={<SignIn />} ></Route>

        <Route element={<LayoutWithHeader />} >
          <Route path='/' element={<Products />} ></Route>
          <Route path='/product/:id' element={<ProductDetail />} ></Route>
          <Route path='/favoritos' element={<Favorites />} ></Route>
        </Route>

        <Route element={<ProtectedRoute />} >
          <Route element={<LayoutWithHeader />} >
            <Route path='/admin/products/add' element={<AddProduct />} ></Route>
            <Route path='/admin/products/edit/:product_id' element={<EditProduct />} ></Route>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/tokens" element={<Tokens />} />
          </Route>
        </Route>

      </Routes>
    </div>
  )
}

export default App
