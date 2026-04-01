const fs = require('fs');
const file = 'client/src/contexts/CartContext.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `// Don't show toast on every mount failure (silent fail for guest usually)
    }
  }, []);`,
  `// Don't show toast on every mount failure (silent fail for guest usually)
    }
  }, [isAuthenticated]);`
);

fs.writeFileSync(file, code);
