import hre from "hardhat";
import { createPublicClient, custom } from "viem";
import { hardhat } from "viem/chains";

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

  const client = createPublicClient({ 
    chain: hardhat,
    transport: custom(hre.network.provider),
  });

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

  const mutationResult = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi: contractArtifact.abi,
    functionName: 'query',
    args: [mutationRequest],
  });
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

  const queryResult = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi: contractArtifact.abi,
    functionName: 'query',
    args: [queryRequest],
  });
  console.log('queryResult:', queryResult);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
