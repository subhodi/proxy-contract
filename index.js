const keyStore = require('eth-lightwallet').keystore;
const signing = require('eth-lightwallet').signing;
var Web3 = require('web3');
var web3 = new Web3();

var trade = require('./build/contracts/Trade.json');

web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
contractABI = trade.abi;
contractAddress = "0x2ad89a1aad5f1d3b40f6311ce4bbff520a884d08";
contract = web3.eth.contract(contractABI).at(contractAddress);
// the seed is stored encrypted by a user-defined password
var password = 'password';
//var seedPhrase = keyStore.generateRandomSeed();
var seedPhrase = "order retreat oblige dentist limit custom lift tree guilt hundred surge border";

keyStore.createVault({
    password: password,
    seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
    // salt: fixture.salt,     // Optionally provide a salt.
    // A unique salt will be generated otherwise.
    hdPathString: "m/0'/0'/0"    // Optional custom HD Path String
}, function (err, ks) {
    // Some methods will require providing the `pwDerivedKey`,
    // Allowing you to only decrypt private keys on an as-needed basis.
    // You can generate that value with convenient method:
    ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) throw err;
        // generate five new address/private key pairs
        // the corresponding private keys are also encrypted
        ks.generateNewAddress(pwDerivedKey, 5);
        var addr = ks.getAddresses();
        var hash = web3.sha3("250Chairs", 100);
        web3.eth.defaultAccount= web3.eth.accounts[0];
        var signedMsg = signing.signMsgHash(ks, pwDerivedKey, hash, addr[0], "m/0'/0'/0");
        console.log(addr[0]);
        console.log(signedMsg.s.toString('hex'), signedMsg.r.toString('hex'));
        if(signing.recoverAddress(hash, signedMsg.v, signedMsg.r, signedMsg.s).toString() == addr[0])
        {
            console.log("true")
        } else {
            console.log("false");
        }

        contract.LogSell({ from: 0, to: 'latest' }, function (err, res) {
            console.log(err, res);
        })
        contract.proxySell("250Chairs", 100, signedMsg.v, signedMsg.r.toString('hex'), signedMsg.s.toString('hex'),(err,res)=>{
        });
    });
});


