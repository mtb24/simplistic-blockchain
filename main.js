
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, upstreamHash = '') {
        this.index = index,
        this.timestamp = timestamp,
        this.data = data,
        this.upstreamHash = upstreamHash,
        this.hash = this.calculateHash()
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.upstreamHash).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [ this.createSourceBlock() ];
    }

    createSourceBlock(){
        return new Block(0, "12/26/2017", {id:0}, "0");
    }

    getLatestBlock(){
        return this.chain[ this.chain.length - 1 ];
    }

    addBlock(newBlock){
        // new block points to upstream block's hash
        newBlock.upstreamHash = this.getLatestBlock().hash;
        // must rehash now...
        newBlock.hash = newBlock.calculateHash();
        // put the block on the chain
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i > this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //  has block changed?
            if( currentBlock.hash !== currentBlock.calculateHash() ){
                return false;
            }
            // block isn't pointed at out previous block
            if( currentBlock.upstreamHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let K2coin = new BlockChain();
K2coin.addBlock( new Block(1, "12/26/2017", {id:1,amount:2000}) );
K2coin.addBlock( new Block(2, "12/26/2017", {id:2,amount:3000}) );

console.log( JSON.stringify(K2coin, null, 4) );
console.log("is chain valid? ", K2coin.isChainValid());