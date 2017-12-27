
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, upstreamHash = '') {
        this.index = index,
        this.timestamp = timestamp,
        this.data = data,
        this.upstreamHash = upstreamHash,
        this.hash = this.calculateHash(),
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.upstreamHash, + this.nonce).toString();
    }

    mineBlock(difficultyLevel){
        // loop until beginning of hash matches difficultyLevel (string begins with n zeros)
        while( this.hash.substring(0, difficultyLevel) !== Array(difficultyLevel + 1).join("0") ){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [ this.createSourceBlock() ];
        this.difficultyLevel = 2;
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
        newBlock.mineBlock(this.difficultyLevel);
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

console.log("mining block 1...");
K2coin.addBlock( new Block(1, "12/26/2017", {id:1,amount:2000}) );
console.log("mining block 2...");
K2coin.addBlock( new Block(2, "12/26/2017", {id:2,amount:3000}) );

//console.log( JSON.stringify(K2coin, null, 4) );
//console.log("is chain valid? ", K2coin.isChainValid());