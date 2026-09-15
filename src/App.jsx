import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import Appointment from './pages/Appointment';
import Accessories from './pages/Accessories';
import Bespoke from './pages/Bespoke';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import Craftsmanship from './pages/Craftsmanship';
import Fabrics from './pages/Fabrics';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import Measurements from './pages/Measurements';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import MyActivity from './pages/MyActivity';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import ReadyMade from './pages/ReadyMade';
import ReadyMadeDetail from './pages/ReadyMadeDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Story from './pages/Story';
import Wedding from './pages/Wedding';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/admin/AdminGuard';

export default function App(){
  return <><ScrollToTop/><Routes>
    <Route path="/admin" element={<AdminGuard><AdminDashboard/></AdminGuard>}/>
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/bespoke" element={<Bespoke/>}/>
      <Route path="/collections" element={<Collections/>}/>
      <Route path="/collections/suits" element={<Collections forcedType="Suits"/>}/>
      <Route path="/collections/shirts" element={<Collections forcedType="Shirts"/>}/>
      <Route path="/collections/tuxedos" element={<Collections forcedType="Tuxedos"/>}/>
      <Route path="/collections/trousers" element={<Collections forcedType="Trousers"/>}/>
      <Route path="/style/:slug" element={<ProductDetail/>}/>
      <Route path="/readymade" element={<ReadyMade/>}/>
      <Route path="/readymade/:slug" element={<ReadyMadeDetail/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/wedding" element={<Wedding/>}/>
      <Route path="/fabrics" element={<Fabrics/>}/>
      <Route path="/craftsmanship" element={<Craftsmanship/>}/>
      <Route path="/story" element={<Story/>}/>
      <Route path="/appointment" element={<Appointment/>}/>
      <Route path="/accessories" element={<Accessories/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/my-activity" element={<MyActivity/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/measurements" element={<Measurements/>}/>
      <Route path="/wishlist" element={<Wishlist/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/faq" element={<FAQ/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  </Routes></>;
}
