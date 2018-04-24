pragma solidity ^0.4.15;

library Proxy {

    function recoverAddress(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _sig) internal returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, _hash);
        address addr = ecrecover(prefixedHash, _v, _r, _sig);
        return addr;
    }
}


