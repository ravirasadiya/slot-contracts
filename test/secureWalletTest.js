const {ethers} = require('hardhat');
const {expect} = require('chai');
const {Web3} = require('web3');

const web3 = new Web3("http://127.0.0.1:8545/"); 

const secureAccountAbi = require("../abi.json") 
let secureWallet;
let owner;
let signer;
let user1

describe("uint test case for secureWallet contract",function(){
    before(async()=>{
        [owner, signer, user1] = await ethers.getSigners();

        const SecureWallet = ethers.getContractFactory("SecureWallet");
        secureWallet = await (await SecureWallet).connect(owner).deploy(signer.address);
        await secureWallet.waitForDeployment();
    
    })

    async function encodeFunctionSignatureAndSign(signer,functionSignatureString, param){
       
        const functionSignature = web3.eth.abi.encodeFunctionSignature(functionSignatureString);
        let req_signature = [];

        const functionParameters = web3.eth.abi.encodeParameters(
            param[0],
            param[1]
        );
        const data = functionSignature + functionParameters.replace('0x', '');

        const keccakHash = web3.utils.soliditySha3({ t: 'bytes', v: data });
        const hash = await secureWallet.getMessageHash(keccakHash);
        for(var i = 0; i < signer.length;i++){
            req_signature[i] = await signer[i].signMessage(new Uint8Array(Buffer.from(hash.slice(2),"hex")));
        }
        
        return req_signature;

    }

    it("Should deployed with correct owner",async function(){
        expect(await secureWallet.getOwner()).to.equal(owner.address);
    })

    it("Should deployed with correct signer", async function(){
        expect(await secureWallet.getSigner()).to.equal(signer.address);
    })

   
    it("Deposit Funds in account",async function() {
        const tx = await secureWallet.depositFunds({ value: 1e8 });
        await tx.wait();
        expect(await secureWallet.getTotalBalance()).to.equal(1e8);
    })

    it("withdraw funds", async function (){
        const fnSignature = "withdrawFunds(address,uint256,uint256)";
        const nonce = await secureWallet.getNonce();
        const transferAmount = BigInt(1000000);

        const [signerSignature] = await encodeFunctionSignatureAndSign(
            [signer],
            fnSignature,
            [['address','uint256','uint256'],[user1.address,transferAmount,nonce]]

        )

        let tx = await secureWallet.withdrawFunds(user1.address, transferAmount,signerSignature)
        tx.wait();
        
        //console.log("#########",tx);
       
    })

    it("Generate signature for test in remix", async function(){
        let signer1 = new ethers.Wallet("Paste your private key");
        const fnSignature = "withdrawFunds(address,uint256,uint256)";
        const nonce = await secureWallet.getNonce();
        const transferAmount = BigInt(1000000);

        const [signerSignature] = await encodeFunctionSignatureAndSign(
            [signer1],
            fnSignature,
            [['address','uint256','uint256'],["0xE56F4D4C1F23f7436A82ed2cb089BFEeDf3f12e5",BigInt(1000000000000000000),1]]

        )

        console.log("######################",signerSignature);

    })
    
});
