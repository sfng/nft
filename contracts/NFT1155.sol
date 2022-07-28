// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155Supply, Ownable {
    using SafeERC20 for IERC20;
    string public name = 'NFT';
    IERC20 public USDC;
    uint256 public start;
    bool public initialized = false;
    struct Meta {
        string uri;
        uint256 amount;
        uint256 maxSupply;
        uint256 supply;
    }

    mapping(uint256 => Meta) public meta;

    modifier isUninitialized() {
        require(!initialized, "Initializer: initialized");
        _;
        initialized = true;
    }

    modifier isInitialized() {
        require(initialized, "Initializer: uninitialized");
        _;
    }

    modifier isMintStarted() {
        require(block.timestamp >= start, "Initializer: mint not start");
        _;
    }

    constructor(
        address owner,
        IERC20 _USDC
    ) ERC1155 ('') {
        transferOwnership(owner);
        USDC = _USDC;
    }

    function initialize(
        uint256 _start,
        string[] memory uris,
        uint256[] memory amounts,
        uint256[] memory supply
        ) external onlyOwner isUninitialized {
        start = _start;
        require(amounts.length == supply.length, 'NFT: Invalid parameter length.');
		require(amounts.length == uris.length, 'NFT: Invalid parameter length.');
        for (uint256 i = 0; i < amounts.length; i++) {
            _setMeta(i, uris[i], amounts[i], supply[i]);
        }
    }

    function _setMeta(uint256 _tokenId, string memory _uri, uint256 _amount, uint256 _supply) internal {
        meta[_tokenId] = Meta(_uri, _amount, _supply, 0);
    }


    function mint(uint256 tokenId, uint256 amount) external isInitialized isMintStarted {
        require(meta[tokenId].maxSupply > 0, "unknown tokenId");
        require(meta[tokenId].supply < meta[tokenId].maxSupply, "reach maximum supply");
        require(amount >= meta[tokenId].amount, "error amount");
        
        if (amount > meta[tokenId].amount) {
            amount = meta[tokenId].amount;
        }
        USDC.safeTransferFrom(_msgSender(), address(this), amount);
        _mint(_msgSender(), tokenId, 1, "");
        meta[tokenId].supply += 1;

    }

    function maxSupply(uint256 tokenId) public view returns(uint256) {
        return meta[tokenId].maxSupply;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return meta[tokenId].uri;
    }

    function balance() public view returns(uint256){
        return USDC.balanceOf(address(this));
    }

    function withdraw() external onlyOwner isInitialized {
        USDC.safeTransfer(owner(), balance());
    }
}
