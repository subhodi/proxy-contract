// var web3 =
var Trade = artifacts.require("./Trade.sol");

contract('Trade', function (accounts) {
  it("should deploy contracts", function () {
    return Trade.deployed().then(function (instance) {
      return instance.owner.call();
    }).then(function (address) {
      assert.equal(address, accounts[0], "Owner account is different");
    });
  });

  it("Proxy function should add Trade", function () {
    return Trade.deployed().then(function (instance) {
      var address = web3.eth.accounts[0];
      var h = web3.sha3("250Chairs", 100)
      var sig = web3.eth.sign(address, h).slice(2)
      var r = `0x${sig.slice(0, 64)}`
      var s = `0x${sig.slice(64, 128)}`
      var v = web3.toDecimal(sig.slice(128, 130)) + 27
      console.log("Transaction signer: " + address);
      instance.proxySell("250Chairs", 100, v, r, s);
      return instance.trades("0x26ca91832468429eaf6181e7b5156aac3f4c645f");
    }).then(function (item) {
      assert.equal(web3.toAscii(item[0]).replace(/\u0000/g, ''), "250Chairs", "Trade name is different");
    });
  });
});
