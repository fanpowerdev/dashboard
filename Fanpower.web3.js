





let fanpower;
let privateKey;
let web3;

// contractAddress and abi are setted after contract deploy
var contractAddress = '0xBA397c994FC9828Ff94e0E797b1D4D685d28560C';
var abi = JSON.parse(`
[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "contestId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "contests", "outputs": [ { "internalType": "string", "name": "contestData", "type": "string" }, { "internalType": "uint256", "name": "betSize", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_contestData", "type": "string" }, { "internalType": "uint256", "name": "_betSize", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" } ], "name": "createContest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "getContest", "outputs": [ { "components": [ { "internalType": "string", "name": "contestData", "type": "string" }, { "internalType": "uint256", "name": "betSize", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "internalType": "struct Fanpowerv0_7.Contest", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContests", "outputs": [ { "components": [ { "internalType": "string", "name": "contestData", "type": "string" }, { "internalType": "uint256", "name": "betSize", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "internalType": "struct Fanpowerv0_7.Contest[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "getTeam", "outputs": [ { "components": [ { "internalType": "uint256", "name": "contestId", "type": "uint256" }, { "internalType": "string", "name": "team", "type": "string" }, { "internalType": "address", "name": "player", "type": "address" }, { "internalType": "uint256", "name": "betAmount", "type": "uint256" }, { "internalType": "uint256", "name": "registerTime", "type": "uint256" } ], "internalType": "struct Fanpowerv0_7.Team", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTeams", "outputs": [ { "components": [ { "internalType": "uint256", "name": "contestId", "type": "uint256" }, { "internalType": "string", "name": "team", "type": "string" }, { "internalType": "address", "name": "player", "type": "address" }, { "internalType": "uint256", "name": "betAmount", "type": "uint256" }, { "internalType": "uint256", "name": "registerTime", "type": "uint256" } ], "internalType": "struct Fanpowerv0_7.Team[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_contestId", "type": "uint256" }, { "internalType": "string", "name": "_team", "type": "string" }, { "internalType": "uint256", "name": "_betAmount", "type": "uint256" } ], "name": "registerTeam", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teams", "outputs": [ { "internalType": "uint256", "name": "contestId", "type": "uint256" }, { "internalType": "string", "name": "team", "type": "string" }, { "internalType": "address", "name": "player", "type": "address" }, { "internalType": "uint256", "name": "betAmount", "type": "uint256" }, { "internalType": "uint256", "name": "registerTime", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]
`);

function initWeb3(pKey, callback){
    //var web3 = new Web3(new Web3.providers.HttpProvider('https://speedy-nodes-nyc.moralis.io/7fd6aa70ddae9f99b10f6221/polygon/mumbai'));
    web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/3aI4P00hA2ghUdqiiZfaDFydirGBTPGf');
    console.log(web3.currentProvider);

    //Initiate Account

    privateKey = pKey;
    var account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log("account",account);

    //Set it as default account
    web3.eth.defaultAccount = account.address;
    console.log("web3.eth.defaultAccount",web3.eth.defaultAccount);



    //contract instance
    fanpower = new web3.eth.Contract(abi, contractAddress);
    fanpower.defaultAccount = web3.eth.defaultAccount;

    callback(account.address);

}


async function getAllContests(callback){

    //Get all the contests
    fanpower.methods.getContests().call( function(error,result){
        console.log(result);
        callback(result);
    });
}

async function  getAllTeams(callback){

        //Get all the teams
        fanpower.methods.getTeams().call( function(error,result){
            console.log(result);
            callback(result);
        });
}


async function getMaticBalance(callback){
    web3.eth.getBalance(fanpower.defaultAccount)
.then( function(balance){
    console.log(balance);    
    callback(web3.utils.fromWei(balance, 'ether'));
});
}


//register a team
async function createContest(contestData, betSize, deadline, success, error){

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await fanpower.methods.createContest(contestData,betSize,deadline).estimateGas({ from: fanpower.defaultAccount });


    const tx = {
        'from': fanpower.defaultAccount,
        'to': contractAddress, // faucet address to return eth
        'data': fanpower.methods.createContest(contestData,betSize,deadline).encodeABI(),
        'gas': gasEstimate,
        'gasPrice': gasPrice
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

    signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          //when receipt comes back
          console.log('receipt',receipt);
          success(receipt);
        });
        sentTx.on("error", err => {
          //  on transaction error
          console.log('error',err);
          error(err);
        });
      }).catch((err) => {
        //when promise fails
        console.log('catch error',err);
        error(err);
      });

}


async function createTeam(contestId, teamData, betAmount,success,error){


    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await fanpower.methods.registerTeam(contestId, teamData, betAmount).estimateGas({ from: fanpower.defaultAccount });


    const tx = {
        'from': fanpower.defaultAccount,
        'to': contractAddress, // faucet address to return eth
        'data': fanpower.methods.registerTeam(contestId, teamData, betAmount).encodeABI(),
        'gas': gasEstimate,
        'gasPrice': gasPrice
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

    signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          //when receipt comes back
          console.log('receipt',receipt);
          success(receipt);
        });
        sentTx.on("error", err => {
          //  on transaction error
          console.log('error',err);
          error(err);
        });
      }).catch((err) => {
        //when promise fails
        console.log('catch error',err);
        error(err);
      });

}


async function fundMatic(success,error){

    var contractAddressMaticFaucet = '0x7F092e65C688a509737FcD8D0998dD12208f5297';
    var abiMaticFaucet = JSON.parse(`
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"ReceivedMatic","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newAirdropAmount","type":"uint256"}],"name":"changeAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiveMatic","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"addresses","type":"address[]"}],"name":"transferMaticBulk","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawMatic","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    `);

    //contract instance
    maticFaucet = new web3.eth.Contract(abiMaticFaucet, contractAddressMaticFaucet);


    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await maticFaucet.methods.receiveMatic().estimateGas({ from: fanpower.defaultAccount });


    const tx = {
        'from': fanpower.defaultAccount,
        'to': contractAddressMaticFaucet, // faucet address to return eth
        'data': maticFaucet.methods.receiveMatic().encodeABI(),
        'gas': gasEstimate,
        'gasPrice': gasPrice
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

    signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          //when receipt comes back
          console.log('receipt',receipt);
          success(receipt);
        });
        sentTx.on("error", err => {
          //  on transaction error
          console.log('error',err);
          error(err);
        });
      }).catch((err) => {
        //when promise fails
        console.log('catch error',err);
        error(err);
      });

}

async function sendMatic(toAddress, amount,success,error){

    const gasPrice = await web3.eth.getGasPrice();


    const tx = {
        'to': toAddress, // faucet address to return eth
        'value': amount,
        'gas': 30000,
        'gasPrice': gasPrice
        // optional data field to send message or execute smart contract
       };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

    signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          //when receipt comes back
          console.log('receipt',receipt);
          success(receipt);
        });
        sentTx.on("error", err => {
          //  on transaction error
          console.log('error',err);
          error(err);
        });
      }).catch((err) => {
        //when promise fails
        console.log('catch error',err);
        error(err);
      });   
}
