const fs = require('fs');
const file = 'client/src/components/Header.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const fetchCartCount = async () => {
      try {
        const count = await cartApi.getItemCount();`,
  `const fetchCartCount = async () => {
      if (!isAuthenticated) return;
      try {
        const count = await cartApi.getItemCount();`
);

fs.writeFileSync(file, code);
