const fs = require('fs').promises;
const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");
const { AddressTranslator } = require('nervos-godwoken-integration');

const CompiledSudtProxyContractArtifact = require(`./build/contracts/ERC20.json`);

const SENDER = '0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8';
const RECEIVER = '0xE7320E016230f0E8AA3B5F22895FC49dc101c2cB';
const SENDER_PRIVATE_KEY = '0xd9bc30dc17023fbb68fe3002e0ff9107b241544fd6d60863081c55e383f1b5a3'; // Replace this with your Ethereum private key with funds on Layer 2.
const SUDT_ID = '30'; // ckETH SUDT ID on Layer 2
const SUDT_NAME = 'ckETH';
const SUDT_SYMBOL = 'ckETH';
const SUDT_TOTAL_SUPPLY = 9999999999;

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
};

const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
web3.eth.accounts.wallet.add(SENDER_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);


(async () => {
    // You need to use this exact bytecode for SUDT proxy otherwise it won't work
    const SudtProxyBytecode = (await (await fs.readFile('./contracts/SudtERC20Proxy.bin')).toString());

    console.log('Testing ckETH SUDT proxy transfer on Nervos Layer 2 Testnet');
    console.log(`Using Ethereum address: ${SENDER}`);

    const balance = BigInt(await web3.eth.getBalance(SENDER));

    if (balance === 0n) {
        console.log(`Insufficient CKB balance on Layer 2. Can't deploy contract. Please deposit funds to your Ethereum address: ${SENDER} on Layer 2.`);
        return;
    }

    console.log(`Deploying SUDT Proxy contract...`);

    const deployTx = new web3.eth.Contract(CompiledSudtProxyContractArtifact.abi).deploy({
        data: SudtProxyBytecode,
        arguments: [SUDT_NAME, SUDT_SYMBOL, SUDT_TOTAL_SUPPLY, SUDT_ID]
    }).send({
        from: SENDER,
        gas: 6000000,
    });

    deployTx.on('transactionHash', hash => console.log(`Deploy transaction hash: ${hash}`));

    const contract = await deployTx;

    console.log(`Deployed SUDT-ERC20 Proxy contract address: ${contract.options.address}`);

    const addressTranslator = new AddressTranslator();
    const senderPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(SENDER);

    const receiverPolyAddress = addressTranslator.ethAddressToGodwokenShortAddress(RECEIVER);

    console.log(`Corresponding Sender Polyjuice address: ${senderPolyAddress}`);

    console.log(`Checking ckETH balance...`);

    console.log('Sender ckETH balance before transfer: ', await contract.methods.balanceOf(senderPolyAddress).call({
        from: SENDER
    }));
    console.log('Receiver ckETH balance before transfer: ', await contract.methods.balanceOf(receiverPolyAddress).call({
        from: RECEIVER
    }));

    console.log('Try calling transfer before sending...');

    try {
        await contract.methods.transfer(receiverPolyAddress, 1000).call({
            from: SENDER,
            gasLimit: 6000000,
            gasPrice: '0'
        })
    } catch (error) {
        console.log(`Can't call transfer method. Error.`);
        console.error(error);
    }

    console.log('Try sending ckETH transfer...');

    await contract.methods.transfer(receiverPolyAddress, 1000).send({
        from: SENDER,
        gasLimit: 6000000,
        gasPrice: '0'
    })

    console.log('Sender ckETH balance after transfer: ', await contract.methods.balanceOf(senderPolyAddress).call({
        from: SENDER
    }));
    console.log('Receiver ckETH balance after transfer: ', await contract.methods.balanceOf(receiverPolyAddress).call({
        from: RECEIVER
    }));
})();