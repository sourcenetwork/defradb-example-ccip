import hre from "hardhat";
import { ethers } from "ethers";

const url = `http://127.0.0.1:9181/api/v0`

const schema = `type Todo {
  description: String
  completed: Boolean
}`;

async function main() {
  const res = await fetch(url+"/schema", { method: 'POST', body: schema });
  if (res.status != 200) throw new Error("failed to create schema");

  const contract = await hre.ethers.deployContract("GraphQL", [url+"/graphql"]);
  await contract.waitForDeployment();

  const contractArtifact = await hre.artifacts.readArtifact("GraphQL");
  const contractAddress = await contract.getAddress();

  const provider = new ethers.BrowserProvider(hre.network.provider);
  const client = new ethers.Contract(contractAddress, contractArtifact.abi, provider);

  ////////////////////////
  /// Mutation Example ///
  ////////////////////////

  const mutationData = JSON.stringify({ 
    description: 'buy milk', 
    completed: false,
  });

  const mutationRequest = JSON.stringify({
    query: `mutation {
      create_Todo(data: ${mutationData}) {
        _key
      }
    }`
  });

  // IMPORTANT: you must enable CCIP reads in ethers
  const mutationResult = await client.query(mutationRequest, { enableCcipRead: true });
  console.log('mutationResult:', mutationResult);

  //////////////////////
  /// Query Example ///
  /////////////////////

  const queryRequest = JSON.stringify({
    query: `query {
      Todo {
        _key
        description
        completed
      }
    }`
  });

  // IMPORTANT: you must enable CCIP reads in ethers
  const queryResult = await client.query(queryRequest, { enableCcipRead: true });
  console.log('queryResult:', queryResult);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
