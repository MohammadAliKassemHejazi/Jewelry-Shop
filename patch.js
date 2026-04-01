const fs = require('fs');
const file = 'server/src/models/productimage.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /imageUrl!: string;/,
  `imageUrl!: string;\n    isPrimary!: boolean;`
);

code = code.replace(
  /imageUrl: \{\n\s*type: DataTypes\.STRING,\n\s*allowNull: false,\n\s*\},/m,
  `imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },`
);

fs.writeFileSync(file, code);
