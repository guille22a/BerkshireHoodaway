const fs = require('fs');

const ierc20 = fs.readFileSync('contracts/interfaces/IERC20.sol', 'utf8');
const irouter = fs.readFileSync('contracts/interfaces/IUniswapV2Router02.sol', 'utf8');
let vault = fs.readFileSync('contracts/BerkshireVault.sol', 'utf8');

vault = vault.replace('// SPDX-License-Identifier: MIT', '')
             .replace('pragma solidity ^0.8.20;', '')
             .replace('import "./interfaces/IERC20.sol";', '')
             .replace('import "./interfaces/IUniswapV2Router02.sol";', '');

const cleanIerc20 = ierc20.replace('// SPDX-License-Identifier: MIT', '').replace('pragma solidity ^0.8.20;', '');
const cleanIrouter = irouter.replace('// SPDX-License-Identifier: MIT', '').replace('pragma solidity ^0.8.20;', '');

const singleFile = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${cleanIerc20.trim()}

${cleanIrouter.trim()}

${vault.trim()}
`;

fs.writeFileSync('contracts/BerkshireVault_Flat.sol', singleFile);
console.log('BerkshireVault_Flat.sol generated successfully!');
