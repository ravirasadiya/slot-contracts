/**
 *Submitted for verification at mumbai.polygonscan.com on 2024-01-31
*/

//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
contract SecureWallet {

    address private admin;
    address private signer;

    mapping(address => uint256) UserNonce;

    event Deposit(address indexed user,uint256 amount);
    event Withdraw(address indexed user,uint256 amount);
    event OwnerChanged(address indexed newOwner, address oldOwner);
    event SignerChanged(address newSigner);

    constructor(address _signer){
        admin = msg.sender;
        signer = _signer;
    }

    function depositFunds()external payable{
        require(msg.value > 0,"Deposite amount can't be 0");
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _amount, bytes calldata _signature) external {
        address user = msg.sender;
        require(_amount > 0,"withdrawal amount can't be Zero");
        bytes32  data = keccak256(abi.encodeWithSignature("withdrawFunds(address,uint256,uint256)",user,_amount,UserNonce[user]));
        require(verify(signer, data, _signature),"signature failed.");
        UserNonce[user] +=1;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(user, _amount);
    }

    function changeOwnerShip(address _newOwner)external {
        require(msg.sender == admin, "you are not owner");
        address oldAdmin = admin;
        admin = _newOwner;
        emit OwnerChanged(_newOwner,oldAdmin);
    }

    function changeSignerAccount(address _signer) external {
        require(msg.sender == admin,"only admin can change signer");
        signer = _signer;
        emit SignerChanged(_signer);
    }

    function getOwner()external view returns(address){
        return admin;
    }

    function getSigner()external view returns(address){
        return signer;
    }

    function getUserNonce(address user)external view returns(uint256){
        return UserNonce[user];
    }

    function getTotalBalance()external view returns(uint256){
        return address(this).balance;
    }

    function verify(
        address _signer,
        bytes32  _message,
        bytes memory _sig
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getETHSignedMessageHash(messageHash);
        return recover(ethSignedMessageHash, _sig) == _signer;
    }

    function getMessageHash(
        bytes32  _message
    ) public pure returns (bytes32) {
        uint256 chainId;
        assembly{
            chainId := chainId
        }
        return keccak256(abi.encodePacked(_message,chainId));
    }

    function getETHSignedMessageHash(
        bytes32 _messageHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recover(
        bytes32 _getSignedMessageHash,
        bytes memory _sig
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _split(_sig);
        return ecrecover(_getSignedMessageHash, v, r, s);
    }

    function _split(
        bytes memory _sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "Invalid signature length");
        assembly {
            //first 32 bytes is data
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96))) // bcoz we need only 1st byte
        }
        //does not require return bcoz solidity takes it implicitly
    }

    receive() external payable { }
}