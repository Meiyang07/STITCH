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
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import Story from './pages/Story';
import Wedding from './pages/Wedding';
import Wishlist from './pages/Wishlist';

export default function App(){
  return <><ScrollToTop/><Routes><Route element={<Layout/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/bespoke" element={<Bespoke/>}/>
    <Route path="/collections" element={<Collections/>}/>
    <Route path="/collections/suits" element={<Collections forcedType="Suits"/>}/>
    <Route path="/collections/shirts" element={<Collections forcedType="Shirts"/>}/>
    <Route path="/collections/tuxedos" element={<Collections forcedType="Tuxedos"/>}/>
    <Route path="/collections/trousers" element={<Collections forcedType="Trousers"/>}/>
    <Route path="/style/:slug" element={<ProductDetail/>}/>
    <Route path="/wedding" element={<Wedding/>}/>
    <Route path="/fabrics" element={<Fabrics/>}/>
    <Route path="/craftsmanship" element={<Craftsmanship/>}/>
    <Route path="/story" element={<Story/>}/>
    <Route path="/appointment" element={<Appointment/>}/>
    <Route path="/accessories" element={<Accessories/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/measurements" element={<Measurements/>}/>
    <Route path="/wishlist" element={<Wishlist/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/faq" element={<FAQ/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route></Routes></>;
}
