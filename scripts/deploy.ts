import { ethers } from "hardhat";

// DefraDB api endpoint
const url = `https://127.0.0.1:9181/api/v0`

const schema = `type Todo {
  description: String
  completed: Boolean
}`;

async function main() {
  const res = await fetch(url+"/schema", { method: 'POST', body: schema });
  if (res.status != 200) throw new Error("failed to create schema");

  const contract = await ethers.deployContract("GraphQL", [url+"/graphql"]);
  await contract.waitForDeployment();

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

  // IMPORTANT: you must enabled CCIP reads when using ethers
  const mutationResult = await contract.query(mutationRequest, { enableCcipRead: true });
  console.log('mutationResult:', mutationResult);

  const queryRequest = JSON.stringify({
    query: `query {
      Todo {
        _key
        description
        completed
      }
    }`
  });

  // IMPORTANT: you must enabled CCIP reads when using ethers
  const queryResult = await contract.query(queryRequest, { enableCcipRead: true });
  console.log('queryResult:', queryResult);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
