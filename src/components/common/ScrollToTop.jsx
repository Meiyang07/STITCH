import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Intentionally return nothing. React effects may only return
    // a cleanup function or undefined.
  }, [pathname]);

  return null;
}
