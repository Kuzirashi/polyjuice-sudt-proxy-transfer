## Run

```
yarn
yarn compile // docker required for compilation
node transfer.js
```

## Example

```
➜ node transfer.js
Testing ckETH SUDT proxy transfer on Nervos Layer 2 Testnet
Using Ethereum address: 0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8
Deploying SUDT Proxy contract...
Deploy transaction hash: 0x9254a0ed95352cc90309c24dc176b9262b903646e814bd0382b5b0e3a23eabcd
Deployed SUDT-ERC20 Proxy contract address: 0x84220609e42b51c9aEf056Da0A06983746974291
Corresponding Sender Polyjuice address: 0x56eaccaa2ce59c6c0400b1e0b2e70dfd2dddd166
Checking ckETH balance...
Sender ckETH balance before transfer:  776999000000000000
Receiver ckETH balance before transfer:  0
Try calling transfer before sending...
Try sending ckETH transfer...
Sender ckETH balance after transfer:  776998999999999000
Receiver ckETH balance after transfer:  1000
```

## Notes

**Important**: Make sure you use provided bytecode in SudtERC20Proxy.bin - it is whitelisted in Nervos Layer 2 and using different bytecode won't work. This is compiled using: solidity0.8.2 using solcjs.

Make sure `ACCOUNT_PRIVATE_KEY` and `SENDER` correspond respectively to ckETH sender private key and sender address. Make sure Sender has CKB on Layer 2 and ckETH on Layer 2. Default accounts should already have some ckETH and CKB on Layer 2.

Make sure `RECEIVER` account exists on Nervos Layer 2 and it has 0 ckETH for testing purposes.