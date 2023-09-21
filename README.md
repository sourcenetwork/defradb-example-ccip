# DefraDB CCIP Example

This example shows how DefraDB can be used as an offchain data oracle. It makes use of [ERC-3668: CCIP Read: Secure offchain data retrieval](https://eips.ethereum.org/EIPS/eip-3668) to execute GraphQL queries and mutations.

## Setup

Generate TLS certificates.

```
mkdir -p ~/.defradb/certs
openssl ecparam -genkey -name secp384r1 -out ~/.defradb/certs/server.key
openssl req -new -x509 -sha256 -key server.key -days 365 -out ~/.defradb/certs/server.crt
```

Start DefraDB with TLS and CORS enabled.

```
defradb start --allowed-origins="*" --tls
```

Run the hardhat deploy script.

```
npm run deploy
```
