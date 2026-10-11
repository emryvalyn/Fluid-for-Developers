# QSC-721 Non-Fungible Token (NFT) Standard Specification

The **QSC-721** standard defines the interface and lifecycle for non-fungible tokens, digital art, gaming assets, and tokenized real-world assets on XOLIX FLUID (equivalent to ERC-721 on Ethereum).

---

## 1. Interface Specification

```fluid
interface IQSC721 {
    public ownerOf(tokenId: uint256): address;
    public tokenURI(tokenId: uint256): string;
    public approve(to: address, tokenId: uint256);
    public getApproved(tokenId: uint256): address;
    public setApprovalForAll(operator: address, approved: bool);
    public isApprovedForAll(owner: address, operator: address): bool;
    public transferFrom(from: address, to: address, tokenId: uint256);
}
```

---

## 2. Standard Implementation (`QSC721.fls`)

```fluid
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
version 1.0;

contract QSC721 {
    state persistent {
        owner: address;
        name: string;
        symbol: string;
        tokenOwners: map<uint256, address>;
        tokenURIs: map<uint256, string>;
        tokenApprovals: map<uint256, address>;
        operatorApprovals: map<address, map<address, bool>>;
    }

    constructor(collectionName: string, collectionSymbol: string) {
        state.owner = msg.sender;
        state.name = collectionName;
        state.symbol = collectionSymbol;
    }

    public name(): string {
        return state.name;
    }

    public symbol(): string {
        return state.symbol;
    }

    public ownerOf(tokenId: uint256): address {
        require(state.tokenOwners[tokenId] != address(0), "QSC721: Token does not exist");
        return state.tokenOwners[tokenId];
    }

    public tokenURI(tokenId: uint256): string {
        require(state.tokenOwners[tokenId] != address(0), "QSC721: Nonexistent token URI query");
        return state.tokenURIs[tokenId];
    }

    public approve(to: address, tokenId: uint256) {
        let currentOwner = state.tokenOwners[tokenId];
        require(msg.sender == currentOwner || state.operatorApprovals[currentOwner][msg.sender], "QSC721: Not authorized to approve");
        state.tokenApprovals[tokenId] = to;
    }

    public getApproved(tokenId: uint256): address {
        return state.tokenApprovals[tokenId];
    }

    public setApprovalForAll(operator: address, approved: bool) {
        state.operatorApprovals[msg.sender][operator] = approved;
    }

    public isApprovedForAll(tokenOwner: address, operator: address): bool {
        return state.operatorApprovals[tokenOwner][operator];
    }

    public transferFrom(from: address, to: address, tokenId: uint256) {
        require(state.tokenOwners[tokenId] == from, "QSC721: Incorrect owner");
        require(msg.sender == from || state.tokenApprovals[tokenId] == msg.sender || state.operatorApprovals[from][msg.sender], "QSC721: Not authorized to transfer");
        require(to != address(0), "QSC721: Cannot transfer to zero address");
        
        state.tokenApprovals[tokenId] = address(0);
        state.tokenOwners[tokenId] = to;
    }

    @owner
    public mint(to: address, tokenId: uint256, uri: string) {
        require(state.tokenOwners[tokenId] == address(0), "QSC721: Token already minted");
        require(to != address(0), "QSC721: Cannot mint to zero address");
        state.tokenOwners[tokenId] = to;
        state.tokenURIs[tokenId] = uri;
    }

    public burn(tokenId: uint256) {
        let currentOwner = state.tokenOwners[tokenId];
        require(msg.sender == currentOwner || state.operatorApprovals[currentOwner][msg.sender], "QSC721: Not authorized to burn");
        
        state.tokenApprovals[tokenId] = address(0);
        state.tokenOwners[tokenId] = address(0);
        state.tokenURIs[tokenId] = "";
    }
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
