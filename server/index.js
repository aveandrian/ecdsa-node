const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

const address_1 = '0x9883551e7e6459a7c7e4eadc4c0f526fe43e4820';
const address_2 = '0xa10b77d7b1eeb4ea065dfa68a8406ba010c7ddf4';
const address_3 = '0x00faf94a2a7863c86234860e398bd64b9e5933d4';

const PRIVATE_KEY_X1 = "0x14ca99ca0acf5276d6b48fc486488b9e3d78c351ee39e46a130a3046574faeef";
const PRIVATE_KEY_X2 = "0xea862fb92ebcb989a9797fba58e353da07feba1405546c855659929351ea94e8";
const PRIVATE_KEY_X3 = "0x4c71673533108b71ad47fb9b29966a68e1e56dcccd69ab55600eb0621410a8e4";


function getAddress(publicKey) {
  key = publicKey.slice(1)
  pubKeyHash = keccak256(key)
  return pubKeyHash.slice(pubKeyHash.length-20)
}

app.use(cors());
app.use(express.json());

const balances = {
  address_1: 100,
  address_2: 50,
  address_3: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, privateKey } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  let publicKey,addressFromPublicKey
  try{
    publicKey = secp.getPublicKey(privateKey.slice(privateKey.length-64));
  }catch(e){
    res.status(400).send({ message: "Unable to verify address from privateKey" });
    return
  }
  try {
    addressFromPublicKey = toHex(getAddress(publicKey));
  }catch(e){
    res.status(400).send({ message: "Unable to verify address from privateKey" });
    return
  }

  if(sender!='0x'+addressFromPublicKey)
    res.status(400).send({ message: "You are not the owner of the address" });
  else if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
      }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
