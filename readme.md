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

## Network

### Input
- Initial IP Address

### Data
- Tracker - List
- DHT - Web

### Actions
- Request full chain tree
- Request latest chain tree
- Request Blocks in the chain
- Announce an Entry
- Announce a block


## Retaining Order
- Each individual can create blocks that point to the previous
- If multiple Blocks point to the same block, that is ok

- Blocks are sorted by
  - Point - Blocks come after the block they are pointing to
  - Date - Ascending
  - PublicKey - Ascending

## Verifying new Blocks
- Public Key works as expected
- Multiple users can sign the same Transaction
  - Person A encrypts Person B's public key along with the contents and date
  - Person B encrypts Person A's public key along with the contents and date
  - They give it to one another
    - THey decrypt the other parties and
    - They then encrypt both again
-
