## Run

```
yarn
yarn compile // docker required for compilation
node transfer.js
```

## Expected

Transfer goes through - Sender ckETH balance decreased and Receiver ckETH balance increased.

## Actual

Transfer call and send both fail.

```
➜ node transfer.js
Testing ckETH SUDT proxy transfer on Nervos Layer 2 Testnet
Using Ethereum address: 0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8
Deploying SUDT Proxy contract...
Deploy transaction hash: 0xb2f3d8a8ec6b9e8ac40a67fd0f7046dd2ef43caaf352f88e4a6376f2f4a474e6
Deployed SUDT-ERC20 Proxy contract address: 0x0Af214B26c6CF6af293B6378a6719d2f927DfD49
Corresponding Sender Polyjuice address: 0x56eaccaa2ce59c6c0400b1e0b2e70dfd2dddd166
Checking ckETH balance...
Sender ckETH balance before transfer:  776999000000000000
Receiver ckETH balance before transfer:  0
Try calling transfer before sending...
Can't call transfer method. Error.
Error: Returned error: {"jsonrpc":"2.0","id":8,"error":"invalid exit code 2"}
    at Object.ErrorResponse (/home/kuzi/projects/polyjuice-sudt-proxy-transfer/node_modules/web3-core-helpers/lib/errors.js:28:19)
    at /home/kuzi/projects/polyjuice-sudt-proxy-transfer/node_modules/web3-core-requestmanager/lib/index.js:303:36
    at PolyjuiceHttpProvider.send (/home/kuzi/projects/polyjuice-sudt-proxy-transfer/node_modules/@polyjuice-provider/web3/lib/providers.js:160:21)
    at processTicksAndRejections (internal/process/task_queues.js:93:5) {
  data: null
}
Try sending ckETH transfer...
# <STUCK - NEVER COMPLETES> <==========
```

## Notes

Make sure `ACCOUNT_PRIVATE_KEY` and `SENDER` correspond respectively to ckETH sender private key and sender address. Make sure Sender has CKB on Layer 2 and ckETH on Layer 2. Default accounts should already have some ckETH and CKB on Layer 2.

Make sure `RECEIVER` account exists on Nervos Layer 2 and it has 0 ckETH for testing purposes.