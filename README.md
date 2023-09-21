# DefraDB CCIP Example

This example shows how DefraDB can be used as an offchain data oracle. It makes use of [ERC-3668: CCIP Read: Secure offchain data retrieval](https://eips.ethereum.org/EIPS/eip-3668) to execute GraphQL queries and mutations.

## Requirements

- [DefraDB](https://github.com/sourcenetwork/defradb)

## Setup

Start DefraDB with CORS enabled.

```
defradb start --allowed-origins="*"
```

Run the hardhat script.

```
npm run viem-example

# or

npm run ethers-example
```
