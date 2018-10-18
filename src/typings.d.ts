declare const EmbarkJS: EmbarkJS;
declare const web3: Web3;

declare module 'Embark/contracts/SimpleStorage' {
  const SimpleStorage: EmbarkContracts.SimpleStorage

  export default SimpleStorage;
}

declare namespace EmbarkContracts {
  interface SimpleStorage {
    methods: {
      get(): Web3.TransactionObject<string>,
      set(x: number): Web3.TransactionObject<Web3.TransactionReceipt>,
      storedData(): Web3.TransactionObject<string>,
    }
  }
}
