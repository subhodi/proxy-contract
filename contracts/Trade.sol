pragma solidity ^0.4.15;
import "./Proxy.sol";

contract Trade {
    address public owner;
    struct Item {
        bytes32 name;
        uint price;
        address buyer;
    }
    mapping(address => Item) public trades;

    event LogSell(address _seller);

    function Trade() public{
        owner = msg.sender;
    }
    function addTrade(address _addr, bytes32 _name, uint _price) internal {
        trades[_addr] = Item({
            name: _name,
            price:_price,
            buyer: 0x0
        });
        LogSell(_addr);
    }

    function increasePrice(uint _newPrice) public {
        trades[msg.sender].price = _newPrice;
    }

    function sell(bytes32 _name, uint _price) public {
        addTrade(msg.sender, _name, _price);
    }

    function proxySell(bytes32 _name, uint _price, uint8 _v, bytes32 _r, bytes32 _sig) public {
        bytes32 _hash = keccak256(_name, _price);
        address sender = ecrecover(_hash, _v, _r, _sig);
        addTrade(sender, _name, _price);
    }

    function buy(address _seller) public payable{
        Item memory sellerItem = trades[_seller];
        addTrade(msg.sender, sellerItem.name, msg.value);
        delete trades[_seller];
    }

    function proxyBuy(address _seller, uint8 _v, bytes32 _r, bytes32 _sig) public payable{
        bytes32 _hash = keccak256(_seller);
        address sender = ecrecover(_hash, _v, _r, _sig);
        Item memory sellerItem = trades[_seller];
        addTrade(sender, sellerItem.name, msg.value);
        delete trades[_seller];
    }
}
