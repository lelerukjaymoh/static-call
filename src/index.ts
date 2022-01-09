import { ethers, providers } from "ethers";
import smartContractABI from "../abi/swapperAbi.json";

if (
  !process.env.PRIVATE_KEY ||
  !process.env.RPC_URL ||
  !process.env.CONTRACT_ADDRESS
) {
  throw new Error(
    "You should provide PRIVATE_KEY or RPC_URL or CONTRACT_ADDRESS in the .env file"
  );
}

const provider = new providers.JsonRpcProvider(process.env.RPC_URL, {
  name: "rinkeby",
  chainId: 4,
});

const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = signer.connect(provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  smartContractABI,
  account
);

const main = async () => {
  const tx = await generateTxndata();

  console.log(tx);

  const callResult = await contract.provider.call(tx!);

  console.log("Returned txn data :", callResult);

  try {
    const result = contract.interface.decodeFunctionResult(
      "destroySmartContract",
      callResult
    );

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const generateTxndata = async () => {
  try {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

    const buyTxData = await contract.populateTransaction.nunuaNaAnwaniTofauti(
      ethers.utils.hexlify(0),
      ethers.utils.hexlify(0),
      ["0xc778417E063141139Fce010982780140Aa0cD5Ab", ""],
      deadline,
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      ["", ""]
    );

    return buyTxData;
  } catch (error) {
    console.log("Error generating txn data : ", error);
  }
};

main();
