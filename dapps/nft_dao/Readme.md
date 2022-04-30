# Dao

- The DAO helps in creating a new proposal (currently limited to buying an NFT from the market).
- 1 Vote = 1 NFT.
- Deadline provided is 5 min for the proposal to go through, i.e. you can execute the proposal after 5 mins.
- The proposal gets executes only if Yes votes is > No votes

# How it works

1. git pull < this repo >
2. npm install @openzeppelin/contracts
3. truffle deploy --reset #### to deploy to the ganache network
4. cd ui
5. npm run dev
6. go to localhost:3000
