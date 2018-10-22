var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'kid matter resist enrich stool moment drip job carpet then brisk shy';

module.exports = {
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/f9127b3c7dd749d298279befc12c4f41') 
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};