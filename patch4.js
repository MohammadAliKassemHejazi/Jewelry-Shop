const fs = require('fs');
const file = 'client/src/components/Header.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const fetchCartCount = async () => {
      if (!isAuthenticated) return;
      try {
        const count = await cartApi.getItemCount();
        setItemCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`,
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const fetchCartCount = async () => {
      if (!isAuthenticated) return;
      try {
        const count = await cartApi.getItemCount();
        setItemCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);`
);

fs.writeFileSync(file, code);
