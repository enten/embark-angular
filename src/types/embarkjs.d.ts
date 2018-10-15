// https://github.com/embark-framework/EmbarkJS/blob/master/src/index.js
declare interface EmbarkJS {
  Blockchain: EmbarkJS.Blockchain;
  Storage: EmbarkJS.Storage;
  Names: EmbarkJS.Names;
  Messages: EmbarkJS.Messages;
  Utils: EmbarkJS.Utils;
  onReady: EmbarkJS.Blockchain['execWhenReady'];
  isNewWeb3: EmbarkJS.ContractStatic['isNewWeb3'];
}

declare namespace EmbarkJS {
  // https://github.com/embark-framework/EmbarkJS/blob/master/src/blockchain.js
  interface Blockchain {
    connect(
      connectionList: string[],
      opts: { warnAboutMetamask?: boolean },
      doneCb: (err?: Error) => void,
    ): void;
    execWhenReady(cb: (err?: Error) => void): void;
    doFirst(todo: (err?: Error) => void): void;
    Contract: ContractStatic;
  }

  interface ContractStatic {
    checkWeb3(): void;
    isNewWeb3(web3Obj?: Web3): boolean;
    new(options: { abi: any[], web3: Web3 }): Contract;
  }

  interface ContractOptions {
    abi: any[];
    code: string;
    address: string;
    gas: number | string | Web3.BigNumber;
    data: string;
    web3: Web3;
  }

  interface Contract {
    web3: Web3;
    ['new']: Contract['deploy'];
    deploy(args?: any[], options?: { gas?: number }): Promise<Contract>;
    at(address: string): Contract;
    send(
      value: string | number | Web3.BigNumber,
      unitOrOptions: Web3.Unit | Web3.Transaction,
      options?: Web3.Transaction,
    ): void;
    methods: {
      [fnName: string]: (...args: any[]) => Web3.TransactionObject<any>;
    };
  }


  // https://github.com/embark-framework/EmbarkJS/blob/master/src/names.js
  // https://github.com/embark-framework/embark/blob/master/lib/modules/ens/embarkjs.js
  interface Names extends NamesProviderAPI {
    Providers: { [providerName: string]: NamesProvider };
    currentProviderName: string;
    currentNameSystems: NamesProvider;
    registerProvider(providerName: string, obj: NamesProvider): void;
    setProvider(providerName: string, options: NamesProviderOptions): void;
  }

  interface NamesProvider extends NamesProviderAPI {
    setProvider(config: NamesProviderOptions): void;
  }

  interface NamesProviderAPI {
    resolve(
      name: string,
      callback?: (err: Error | null, address: string) => void,
    ): Promise<string>;
    lookup(
      address: string,
      callback?: (err: Error | null, name: string) => void,
    ): Promise<string>;
    registerSubDomain(
      name: string,
      address: string,
      callback: (err: Error | null, transaction: Web3.Transaction) => void,
    ): void;
    isAvailable(): boolean;
  }

  // https://embark.status.im/docs/naming_configuration.html
  interface NamesProviderOptions {
    [key: string]: any;
  }


  // https://github.com/embark-framework/EmbarkJS/blob/master/src/messages.js
  // https://github.com/embark-framework/embark/blob/master/lib/modules/whisper/js/embarkjs.js
  interface Messages extends MessagesProviderAPI {
    Providers: {
      [providerName: string]: MessagesProvider;
      whisper: WhisperProvider;
    };
    currentProviderName: string;
    currentMessages: MessagesProvider;
    registerProvider(providerName: string, obj: MessagesProvider): void;
    setProvider(providerName: string, options: MessagesProviderOptions): void;
  }

  interface MessagesProvider extends MessagesProviderAPI {
    setProvider(options?: MessagesProviderOptions): Promise<this>;
  }

  interface WhisperProvider extends MessagesProvider {
    getWhisperVersion(callback: (err: Error | null, version: string) => void): void;
  }

  interface MessagesProviderAPI {
    isAvailable(): Promise<boolean>;
    sendMessage(options: SendMessageOptions): void;
    listenTo(
      options: ListenToOptions,
      callback: (err: Error | null, data: ListenData) => void,
    ): MessageEvents;
  }

  // https://embark.status.im/docs/messages_configuration.html
  interface MessagesProviderOptions {
    [key: string]: any;
  }

  interface MessageEvents {
    cb: (...args: any[]) => void;
    then(): void;
    error(err: Error): void;
    stop(): void;
  }

  interface SendMessageOptions {
    topic: string | string[];
    data?: any;
    payload?: any;
    ttl?: number;
    pubKey?: any;
    symKeyID?: any;
  }

  interface ListenToOptions {
    topic: string | string[];
    minPow?: any;
    usePrivateKey?: boolean;
    privateKeyID?: any;
    symKeyID?: any;
  }

  interface ListenData {
    topic: string;
    data: any;
    timestamp: any;
  }


  // https://github.com/embark-framework/EmbarkJS/blob/master/src/storage.js
  // https://github.com/embark-framework/embark/blob/master/lib/modules/ipfs/embarkjs.js
  // https://github.com/embark-framework/embark/blob/master/lib/modules/swarm/embarkjs.js
  interface Storage extends StorageAPI {
    Providers: { [providerName: string]: StorageProvider };
    currentProviderName: string;
    currentStorage: StorageProvider;
    registerProvider(providerName: string, obj: StorageProvider): void;
    setProvider(
      providerName: string,
      options: StorageProviderOptions,
    ): Promise<StorageProvider>
    setProviders(dappConnOptions: any): Promise<void>;
  }

  interface StorageProvider extends StorageAPI {
    setProvider(options?: StorageProviderOptions): Promise<this>;
  }

  interface StorageAPI {
    isAvailable(): Promise<boolean>;
    saveText(text: string): Promise<string>;
    get(hash: string): Promise<string>;
    uploadFile(inputSelector: HTMLInputElement[]): Promise<string>;
    getUrl(hash: string): string;
    resolve(name: string, callback: (err: Error | null, resPath: string) => void): void;
    register(addr: string, callback?: (err: Error | null, resPath: string) => void): void;
  }

  // https://embark.status.im/docs/storage_configuration.html
  interface StorageProviderOptions {
    [key: string]: any;
  }


  // https://github.com/embark-framework/EmbarkJS/blob/master/src/utils.js
  interface Utils {
    fromAscii(str: string): string;
    toAscii(str: string): string;
    secureSend(
      web3: Web3,
      toSend: ToSend,
      params: any,
      isContractDeploy?: boolean,
      cb?: (err: Error | null, receipt: any) => void,
    ): void;
  }

  interface ToSend {
    send(params: any, cb: (err: Error | null, transactionHash: string) => void): {
      on(event: string, cb: (...args: any[]) => void): Promise<any>;
    };
  }
}
