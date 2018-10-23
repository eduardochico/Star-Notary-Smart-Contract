pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
//import "github.com/Arachnid/solidity-stringutils/strings.sol";


contract StarNotary is ERC721 { 
    //using strings for *;

    struct Star { 
        string name; 
        string story;
        string dec;
        string mag;
        string cent;
    }


    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => uint256) public starCoordsOwnership;

    function createStar(string _name, string _story, string _dec, string _mag, string _cent, uint256 _tokenId) public { 
        
       
        require(checkIfStarExist(_dec, _mag, _cent) == false);


        Star memory newStar = Star(_name, _story, _dec, _mag, _cent);

        

        bytes32 coordsHash = keccak256(abi.encode(_dec, _mag, _cent));

        starCoordsOwnership[coordsHash] = _tokenId;

        tokenIdToStarInfo[_tokenId] = newStar;

        mint(msg.sender, _tokenId);
    }

    function mint(address _to, uint256 _tokenId) public {
        _mint(_to, _tokenId);
    }

/*    function tokenIdToStarInfo(uint256 _tokenId) public returns (struct) {
        Star memory currentStar = tokenIdToStarInfoMapping[_tokenId];

        return currentStar;

    }*/


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _dec, string _mag, string _cent) public view returns (bool) {
        bytes32 coordsHash = keccak256(abi.encode(_dec, _mag, _cent));
        if(starCoordsOwnership[coordsHash] > 0) {
            return true;
        } else {
            return false;
        }

    }
}