import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChangeAddress(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChangePrivateKey(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChangeAddress}></input>
      </label>

      <label>
        Private Key
        <input placeholder="Type a private key for your address" value={privateKey} onChange={onChangePrivateKey}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
