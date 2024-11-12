import { ethers } from "ethers";

const main = async () => {
  // 利用Infura的rpc节点连接以太坊网络
  // 准备Infura API Key, 教程：https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md
  const INFURA_ID = "2278af60b01d4ec9af97024e8cb17e45";
  // 连接以太坊主网
  const provider = new ethers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );
  // 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
  // 人类可读abi，以ERC20合约为例
  const abiERC20 = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
  ];
  const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Contract
  const contractDAI = new ethers.Contract(addressDAI, abiERC20, provider);
  // 第1种输入abi的方式: 复制abi全文
  // WETH的abi可以在这里复制：https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
  const abiWETH =
    '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view",...太长后面省略...';
  const addressWETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH Contract
  const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider);

  // 1. 读取WETH合约的链上信息（WETH abi）
  const nameWETH = await contractWETH.name();
  const symbolWETH = await contractWETH.symbol();
  const totalSupplyWETH = await contractWETH.totalSupply();
  console.log("\n1. 读取WETH合约信息");
  console.log(`合约地址: ${addressWETH}`);
  console.log(`名称: ${nameWETH}`);
  console.log(`代号: ${symbolWETH}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplyWETH)}`);
  const balanceWETH = await contractWETH.balanceOf("vitalik.eth");
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceWETH)}\n`);

  // 2. 读取DAI合约的链上信息（IERC20接口合约）
  const nameDAI = await contractDAI.name();
  const symbolDAI = await contractDAI.symbol();
  const totalSupplDAI = await contractDAI.totalSupply();
  console.log("\n2. 读取DAI合约信息");
  console.log(`合约地址: ${addressDAI}`);
  console.log(`名称: ${nameDAI}`);
  console.log(`代号: ${symbolDAI}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplDAI)}`);
  const balanceDAI = await contractDAI.balanceOf("vitalik.eth");
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceDAI)}\n`);
  // 创建交易请求，参数：to为接收地址，value为ETH数额
  const tx = {
    to: address1,
    value: ethers.parseEther("0.001"),
  };
  // 利用私钥和provider创建wallet对象
  const privateKey =
    "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b";
  const wallet2 = new ethers.Wallet(privateKey, provider);
  //发送交易，获得收据
  const txRes = await wallet2.sendTransaction(tx);
  const receipt = await txRes.wait(); // 等待链上确认交易
  console.log(receipt); // 打印交易的收据
};

// main();

const transcation = async () => {
  // 利用Alchemy的rpc节点连接以太坊网络
  const ALCHEMY_GOERLI_URL =
    "https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l";
  const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

  // 利用私钥和provider创建wallet对象
  const privateKey =
    "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b";
  const wallet = new ethers.Wallet(privateKey, provider);

  // WETH的ABI
  const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns (bool)",
    "function withdraw(uint) public",
  ];
  // WETH合约地址（Goerli测试网）
  const addressWETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"; // WETH Contract

  // 声明可写合约
  const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
  // 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
  // const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
  // contractWETH.connect(wallet)
  const address = await wallet.getAddress();
  // 读取WETH合约的链上信息（WETH abi）
  console.log("\n1. 读取WETH余额");
  const balanceWETH = await contractWETH.balanceOf(address);
  console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);

  console.log("\n2. 调用desposit()函数，存入0.001 ETH");
  // 发起交易
  const tx = await contractWETH.deposit({ value: ethers.parseEther("0.001") });
  // 等待交易上链
  await tx.wait();
  console.log(`交易详情：`);
  console.log(tx);
  const balanceWETH_deposit = await contractWETH.balanceOf(address);
  console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);

  console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH");
  // 发起交易
  const tx2 = await contractWETH.transfer(
    "vitalik.eth",
    ethers.parseEther("0.001")
  );
  // 等待交易上链
  await tx2.wait();
  const balanceWETH_transfer = await contractWETH.balanceOf(address);
  console.log(`转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`);
};

// transcation();

const deployContract = async () => {
  // 利用Alchemy的rpc节点连接以太坊网络
  // 连接goerli测试网
  const ALCHEMY_GOERLI_URL =
    "https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l";
  const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

  // 利用私钥和provider创建wallet对象
  const privateKey =
    "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b";
  const wallet = new ethers.Wallet(privateKey, provider);
  // ERC20的人类可读abi
  const abiERC20 = [
    "constructor(string memory name_, string memory symbol_)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function mint(uint amount) external",
  ];
  // 填入合约字节码，在remix中，你可以在两个地方找到Bytecode
  // 1. 编译面板的Bytecode按钮
  // 2. 文件面板artifact文件夹下与合约同名的json文件中
  // 里面"bytecode"属性下的"object"字段对应的数据就是Bytecode，挺长的，608060起始
  // "object": "608060405260646000553480156100...
  const bytecodeERC20 =
    "60806040526012600560006101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b5060405162001166380380620011668339818101604052810190620000539190620001bb565b81600390805190602001906200006b9291906200008d565b508060049080519060200190620000849291906200008d565b505050620003c4565b8280546200009b90620002d5565b90600052602060002090601f016020900481019282620000bf57600085556200010b565b82601f10620000da57805160ff19168380011785556200010b565b828001600101855582156200010b579182015b828111156200010a578251825591602001919060010190620000ed565b5b5090506200011a91906200011e565b5090565b5b80821115620001395760008160009055506001016200011f565b5090565b6000620001546200014e8462000269565b62000240565b905082815260208101848484011115620001735762000172620003a4565b5b620001808482856200029f565b509392505050565b600082601f830112620001a0576200019f6200039f565b5b8151620001b28482602086016200013d565b91505092915050565b60008060408385031215620001d557620001d4620003ae565b5b600083015167ffffffffffffffff811115620001f657620001f5620003a9565b5b620002048582860162000188565b925050602083015167ffffffffffffffff811115620002285762000227620003a9565b5b620002368582860162000188565b9150509250929050565b60006200024c6200025f565b90506200025a82826200030b565b919050565b6000604051905090565b600067ffffffffffffffff82111562000287576200028662000370565b5b6200029282620003b3565b9050602081019050919050565b60005b83811015620002bf578082015181840152602081019050620002a2565b83811115620002cf576000848401525b50505050565b60006002820490506001821680620002ee57607f821691505b6020821081141562000305576200030462000341565b5b50919050565b6200031682620003b3565b810181811067ffffffffffffffff8211171562000338576200033762000370565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b610d9280620003d46000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c39190610b02565b60405180910390f35b6100e660048036038101906100e19190610a14565b6102dc565b6040516100f39190610ae7565b60405180910390f35b6101046103ce565b6040516101119190610b24565b60405180910390f35b610134600480360381019061012f91906109c1565b6103d4565b6040516101419190610ae7565b60405180910390f35b610152610583565b60405161015f9190610b3f565b60405180910390f35b610182600480360381019061017d9190610a54565b610596565b005b61019e60048036038101906101999190610954565b61066d565b6040516101ab9190610b24565b60405180910390f35b6101bc610685565b6040516101c99190610b02565b60405180910390f35b6101ec60048036038101906101e79190610a54565b610713565b005b61020860048036038101906102039190610a14565b6107ea565b6040516102159190610ae7565b60405180910390f35b61023860048036038101906102339190610981565b610905565b6040516102459190610b24565b60405180910390f35b6003805461025b90610c88565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c88565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610b24565b60405180910390a36001905092915050565b60025481565b600081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104629190610bcc565b92505081905550816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b79190610bcc565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461050c9190610b76565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105709190610b24565b60405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e49190610bcc565b9250508190555080600260008282546105fd9190610bcc565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106629190610b24565b60405180910390a350565b60006020528060005260406000206000915090505481565b6004805461069290610c88565b80601f01602080910402602001604051908101604052809291908181526020018280546106be90610c88565b801561070b5780601f106106e05761010080835404028352916020019161070b565b820191906000526020600020905b8154815290600101906020018083116106ee57829003601f168201915b505050505081565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107619190610b76565b92505081905550806002600082825461077a9190610b76565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516107df9190610b24565b60405180910390a350565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461083a9190610bcc565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461088f9190610b76565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f39190610b24565b60405180910390a36001905092915050565b6001602052816000526040600020602052806000526040600020600091509150505481565b60008135905061093981610d2e565b92915050565b60008135905061094e81610d45565b92915050565b60006020828403121561096a57610969610d18565b5b60006109788482850161092a565b91505092915050565b6000806040838503121561099857610997610d18565b5b60006109a68582860161092a565b92505060206109b78582860161092a565b9150509250929050565b6000806000606084860312156109da576109d9610d18565b5b60006109e88682870161092a565b93505060206109f98682870161092a565b9250506040610a0a8682870161093f565b9150509250925092565b60008060408385031215610a2b57610a2a610d18565b5b6000610a398582860161092a565b9250506020610a4a8582860161093f565b9150509250929050565b600060208284031215610a6a57610a69610d18565b5b6000610a788482850161093f565b91505092915050565b610a8a81610c12565b82525050565b6000610a9b82610b5a565b610aa58185610b65565b9350610ab5818560208601610c55565b610abe81610d1d565b840191505092915050565b610ad281610c3e565b82525050565b610ae181610c48565b82525050565b6000602082019050610afc6000830184610a81565b92915050565b60006020820190508181036000830152610b1c8184610a90565b905092915050565b6000602082019050610b396000830184610ac9565b92915050565b6000602082019050610b546000830184610ad8565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610b8182610c3e565b9150610b8c83610c3e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610bc157610bc0610cba565b5b828201905092915050565b6000610bd782610c3e565b9150610be283610c3e565b925082821015610bf557610bf4610cba565b5b828203905092915050565b6000610c0b82610c1e565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015610c73578082015181840152602081019050610c58565b83811115610c82576000848401525b50505050565b60006002820490506001821680610ca057607f821691505b60208210811415610cb457610cb3610ce9565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b610d3781610c00565b8114610d4257600080fd5b50565b610d4e81610c3e565b8114610d5957600080fd5b5056fea2646970667358221220f87d0662c51e3b4b5e034fe8e1e7a10185cda3c246a5ba78e0bafe683d67789764736f6c63430008070033";
  const factoryERC20 = new ethers.ContractFactory(
    abiERC20,
    bytecodeERC20,
    wallet
  );
  // 1. 利用contractFactory部署ERC20代币合约
  console.log("\n1. 利用contractFactory部署ERC20代币合约");
  // 部署合约，填入constructor的参数
  const contractERC20 = await factoryERC20.deploy("WTF Token", "WTF");
  console.log(`合约地址: ${contractERC20.target}`);
  console.log("部署合约的交易详情");
  console.log(contractERC20.deploymentTransaction());
  console.log("\n等待合约部署上链");
  await contractERC20.waitForDeployment();
  // 也可以用 contractERC20.deployTransaction.wait()
  console.log("合约已上链");
  // 打印合约的name()和symbol()，然后调用mint()函数，给自己地址mint 10,000代币
  console.log("\n2. 调用mint()函数，给自己地址mint 10,000代币");
  console.log(`合约名称: ${await contractERC20.name()}`);
  console.log(`合约代号: ${await contractERC20.symbol()}`);
  let tx = await contractERC20.mint("10000");
  console.log("等待交易上链");
  await tx.wait();
  console.log(`mint后地址中代币余额: ${await contractERC20.balanceOf(wallet)}`);
  console.log(`代币总供给: ${await contractERC20.totalSupply()}`);
  // 3. 调用transfer()函数，给Vitalik转账1000代币
  console.log("\n3. 调用transfer()函数，给Vitalik转账1,000代币");
  tx = await contractERC20.transfer("vitalik.eth", "1000");
  console.log("等待交易上链");
  await tx.wait();
  console.log(
    `Vitalik钱包中的代币余额: ${await contractERC20.balanceOf("vitalik.eth")}`
  );
};

// deployContract();

const queryEvent = async () => {
  // 利用Alchemy的rpc节点连接以太坊网络
  // 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
  const ALCHEMY_GOERLI_URL =
    "https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l";
  const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
  // WETH ABI，只包含我们关心的Transfer事件
  const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];
  // 测试网WETH地址
  const addressWETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
  // 声明合约实例
  const contract = new ethers.Contract(addressWETH, abiWETH, provider);
  // 得到当前block
  const block = await provider.getBlockNumber();
  console.log(`当前区块高度: ${block}`);
  console.log(`打印事件详情:`);
  const transferEvents = await contract.queryFilter(
    "Transfer",
    block - 10,
    block
  );
  // 打印第1个Transfer事件
  console.log(transferEvents[0]);

  // 解析Transfer事件的数据（变量在args中）
  console.log("\n2. 解析事件：");
  const amount = ethers.formatUnits(
    ethers.getBigInt(transferEvents[0].args["amount"]),
    "ether"
  );
  console.log(
    `地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`
  );
};

const eventListener = () => {
  // 准备 alchemy API
  // 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
  const ALCHEMY_MAINNET_URL =
    "https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN";
  // 连接主网 provider
  const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
  // USDT的合约地址
  const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  // 构建USDT的Transfer的ABI
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
  ];
  // 生成USDT合约对象
  const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

  // 只监听一次
  console.log("\n1. 利用contract.once()，监听一次Transfer事件");
  contractUSDT.once("Transfer", (from, to, value) => {
    // 打印结果
    console.log(
      `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
    );
  });
  // 持续监听USDT合约
  console.log("\n2. 利用contract.on()，持续监听Transfer事件");
  contractUSDT.on("Transfer", (from, to, value) => {
    console.log(
      // 打印结果
      `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
    );
  });
};

const eventFilter = async () => {
  // 准备 alchemy API
  // 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
  const ALCHEMY_MAINNET_URL =
    "https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN";
  // 连接主网 provider
  const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
  // 合约地址
  const addressUSDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  // 交易所地址
  const accountBinance = "0x28C6c06298d514Db089934071355E5743bf21d60";
  // 构建ABI
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    "function balanceOf(address) public view returns(uint)",
  ];
  // 构建合约对象
  const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);
  const balanceUSDT = await contractUSDT.balanceOf(accountBinance);
  console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT, 6)}\n`);
  // 2. 创建过滤器，监听转移USDT进交易所
  console.log("\n2. 创建过滤器，监听USDT转进交易所");
  let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
  console.log("过滤器详情：");
  console.log(filterBinanceIn);
  contractUSDT.on(filterBinanceIn, (res) => {
    console.log("---------监听USDT进入交易所--------");
    console.log(
      `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
    );
  });
  // 3. 创建过滤器，监听交易所转出USDT
  let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
  console.log("\n3. 创建过滤器，监听USDT转出交易所");
  console.log("过滤器详情：");
  console.log(filterToBinanceOut);
  contractUSDT.on(filterToBinanceOut, (res) => {
    console.log("---------监听USDT转出交易所--------");
    console.log(
      `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
    );
  });
};

const bigIntHandler = () => {
  const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
  console.log(oneGwei);
  console.log(ethers.getBigInt("0x3b9aca00")); // 从hex字符串生成
  console.log(ethers.getBigInt(1000000000)); // 从数字生成
  // 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
  // ethers.getBigInt(Number.MAX_SAFE_INTEGER);
  console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER);

  // 运算
  console.log("加法：", oneGwei + 1n);
  console.log("减法：", oneGwei - 1n);
  console.log("乘法：", oneGwei * 2n);
  console.log("除法：", oneGwei / 2n);
  // 比较
  console.log("是否相等：", oneGwei == 1000000000n);

  //代码参考：https://docs.ethers.org/v6/api/utils/#about-units
  console.group("\n2. 格式化：小单位转大单位，formatUnits");
  console.log(ethers.formatUnits(oneGwei, 0));
  // '1000000000'
  console.log(ethers.formatUnits(oneGwei, "gwei"));
  // '1.0'
  console.log(ethers.formatUnits(oneGwei, 9));
  // '1.0'
  console.log(ethers.formatUnits(oneGwei, "ether"));
  // `0.000000001`
  console.log(ethers.formatUnits(1000000000, "gwei"));
  // '1.0'
  console.log(ethers.formatEther(oneGwei));
  // `0.000000001` 等同于formatUnits(value, "ether")
  console.groupEnd();

  // 3. 解析：大单位转小单位
  // 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
  // 代码参考：https://docs.ethers.org/v6/api/utils/#about-units
  console.group("\n3. 解析：大单位转小单位，parseUnits");
  console.log(ethers.parseUnits("1.0").toString());
  // { BigNumber: "1000000000000000000" }
  console.log(ethers.parseUnits("1.0", "ether").toString());
  // { BigNumber: "1000000000000000000" }
  console.log(ethers.parseUnits("1.0", 18).toString());
  // { BigNumber: "1000000000000000000" }
  console.log(ethers.parseUnits("1.0", "gwei").toString());
  // { BigNumber: "1000000000" }
  console.log(ethers.parseUnits("1.0", 9).toString());
  // { BigNumber: "1000000000" }
  console.log(ethers.parseEther("1.0").toString());
  // { BigNumber: "1000000000000000000" } 等同于parseUnits(value, "ether")
  console.groupEnd();
};
