// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// GraphQL data oracle for onchain queries and mutations
contract GraphQL {
    /// required info to make an offchain query.
    error OffchainLookup(
        address sender,
        string[] urls,
        bytes callData,
        bytes4 callbackFunction,
        bytes extraData
    );

    /// list of DefraDB endpoints to query.
    string[] public urls;

    /// creates a GraphQL oracle using the given url.
    constructor(string memory url) {
        urls.push(url);
    }

    /// reverts with an offchain lookup containing the query data.
    function query(string memory data) 
        public
        view 
        returns(string memory) 
    {
        revert OffchainLookup(address(this), urls, bytes(data), this.queryResults.selector, "");
    }

    /// returns the results from the query as a string.
    function queryResults(bytes calldata response, bytes calldata extraData) 
        public
        view
        returns (string memory) 
    {
        return string(response);
    }
}
