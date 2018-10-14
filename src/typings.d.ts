declare const EmbarkJS: EmbarkJS;
declare const web3: Web3;

declare module 'Embark/contracts/SimpleStorage' {
  interface SimpleStorage {
    methods: {
      get(): Web3.TransactionObject<string>,
      set(x: number): Web3.TransactionObject<Web3.TransactionReceipt>,
      storedData(): Web3.TransactionObject<string>,
    }
  }

  const SimpleStorage: SimpleStorage

  export default SimpleStorage;
}
