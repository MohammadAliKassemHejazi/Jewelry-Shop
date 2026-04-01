const fs = require('fs');
const file = 'client/src/contexts/CartContext.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { cartApi } from '@/services/api';`,
  `import { cartApi } from '@/services/api';\nimport { useAuth } from '@/contexts/AuthContext';`
);

code = code.replace(
  `export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {`,
  `export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {\n  const { isAuthenticated } = useAuth();`
);

code = code.replace(
  `const refreshCart = useCallback(async () => {
    try {
      // In a real app with auth, we should check if user is logged in
      // For now, we assume the API handles session/guest cart
      const cartData = await cartApi.get();`,
  `const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const cartData = await cartApi.get();`
);

fs.writeFileSync(file, code);
