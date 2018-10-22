pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
//import "github.com/Arachnid/solidity-stringutils/strings.sol";


contract StarNotary is ERC721 { 
    //using strings for *;

    struct Star { 
        string name; 
        string story;
        uint dec;
        uint mag;
        uint cent;
    }


    mapping(uint256 => Star) public tokenIdToStarInfoMapping; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => uint256) public starCoordsOwnership;

    function createStar(string _name, string _story, uint _dec, uint _mag, uint _cent, uint256 _tokenId) public { 
        
        require(_dec > 0);
        require(_mag > 0);
        require(_cent > 0);

        if(checkIfStarExist(_dec, _mag, _cent)) {
            //TODO log sth
            return;
        }


        Star memory newStar = Star(_name, _story, _dec, _mag, _cent);

        

        bytes32 memory coordsHash = keccak256(_dec, _mag, _cent);

        starCoordsOwnership[coordsHash] = _tokenId;

        tokenIdToStarInfoMapping[coordsHash] = _tokenId;

        mint(msg.sender, _tokenId);
    }

    function mint(address _to, uint256 _tokenId) internal {
        _mint(_to, _tokenId);
    }

    function tokenIdToStarInfo(uint256 _tokenId) public returns (struct) {
        Star memory currentStar = tokenIdToStarInfoMapping[_tokenId];

        return currentStar;

    }


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

    function checkIfStarExist(uint _dec, uint _mag, uint _cent) public returns (bool) {
        bytes32 memory coordsHash = keccak256(_dec, _mag, _cent);
        if(starCoordsOwnership[coordsHash] > 0) {
            return true;
        } else {
            return false;
        }

    }
}