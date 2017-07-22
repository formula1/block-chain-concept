# Goals

## Definitions
- Relationship
  - Where a node has a pointer to another node
- LinkedList
  - Nodes have a relationship to a "next" and to a "previous"
  - Each nodes "next" will be the "next" nodes "previous"
  - Each nodes "previous" will be the "previous" nodes "next"
  - The two definitions above are redundant
  - A node cannot have a relationship with a node that already has a relationship
- Tree
  - Nodes have multiple relationships children and a single parent
  - A node cannot have a child which is another nodes child
  - A node cannot have the root node as a child
- Web
  - Nodes have any amount of relationships
  - These relationships may repeat
  - These relationships may be one way
  - These relationships may be circular

## Overall Flow
- App Does a function
- Create Entry to mutate state
- Broadcast to network
- Network shares it with each Person
- A block is eventually created with the Entry
- The block is shared with everyone
- Creator receives the new block
- Entries are retrieved from the block
- Entries update the Application State

## Handeling
- Bad Entries
- Bad Blocks
- Bad Signing
- Bad Announcement

## Network

### User Input
- Initial IP Address

### Further Data
- Tracker - List
- DHT - Web

### Actions
- Request full chain tree
- Request latest chain tree
- Request Blocks in the chain
- Announce yourself as a participant
- Announce an Entry
- Announce a block


## Block Control Barrier to Entry
### Proof of Work
- The creator of the last block is considered the delegator
- Request group of hashes

### Proof of stake
- Based off one of the Decentralized Application Economies


## Decentralized Application
- Actions
  - Mutates the state
- State compilation
  -
- Client
  -

## Verifying new Blocks
- Public Key works as expected
- Multiple users can sign the same Transaction
  - Person A encrypts Person B's public key along with the contents and date
  - Person B encrypts Person A's public key along with the contents and date
  - They give it to one another
    - They decrypt the other parties and
    - They then encrypt both again
