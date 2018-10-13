// Type definitions for web3 1.0
// Project: https://github.com/ethereum/web3.js
// Definitions by: Simon Jentzsch <https://github.com/simon-jentzsch>
//                 Nitzan Tomer <https://github.com/nitzantomer>
//                 Zurbo <https://github.com/zurbo>
//                 Xiao Liang <https://github.com/yxliang01>
//                 Francesco Soncina <https://github.com/phra>
//                 Nick Addison <https://github.com/naddison36>
//                 Ícaro Harry <https://github.com/icaroharry>
//                 Linus Norton <https://github.com/linusnorton>
//                 Javier Peletier <https://github.com/jpeletier>
//                 HIKARU KOBORI <https://github.com/anneau>
//                 Baris Gumustas <https://github.com/matrushka>
//                 André Vitor de Lima Matos <https://github.com/andrevmatos>
//                 Levin Keller <https://github.com/levino>
//                 Dmitry Radkovskiy <https://github.com/zlumer>
//                 Konstantin Melnikov <https://github.com/archangel-irk>
//                 Asgeir Sognefest <https://github.com/sogasg>
//                 Donam Kim <https://github.com/donamk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

declare class Web3 {
  static providers: Web3.Providers;
  static givenProvider: Web3.Provider;
  static modules: {
    Eth: new (provider: Web3.Provider) => Web3.Eth;
    Net: new (provider: Web3.Provider) => Web3.Net;
    Personal: new (provider: Web3.Provider) => Web3.Personal;
    Shh: new (provider: Web3.Provider) => Web3.Shh;
    Bzz: new (provider: Web3.Provider) => Web3.Bzz;
  };
  static utils: Web3.Utils;
  constructor(provider?: Web3.Provider | string);
  version: string;
  BatchRequest: new () => Web3.BatchRequest;
  extend(methods: any): any; // TODO
  bzz: Web3.Bzz;
  currentProvider: Web3.Provider;
  eth: Web3.Eth;
  shh: Web3.Shh;
  givenProvider: Web3.Provider;
  providers: Web3.Providers;
  setProvider(provider: Web3.Provider): void;
  utils: Web3.Utils;
}

declare namespace Web3 {
  type BigNumber = BN;


  // promitEvent.d.ts

  type PromiEventType = "transactionHash" | "receipt" | "confirmation" | "error";

  interface PromiEvent<T> extends Promise<T> {
    once(
      type: "transactionHash",
      handler: (receipt: string) => void
    ): PromiEvent<T>;
    once(
      type: "receipt",
      handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    once(
      type: "confirmation",
      handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    once(type: "error", handler: (error: Error) => void): PromiEvent<T>;
    once(
      type: PromiEventType,
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
    on(
      type: "transactionHash",
      handler: (receipt: string) => void
    ): PromiEvent<T>;
    on(
      type: "receipt",
      handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    on(
      type: "confirmation",
      handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    on(type: "error", handler: (error: Error) => void): PromiEvent<T>;
    on(
      type: "error" | "confirmation" | "receipt" | "transactionHash",
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
  }


  // providers.d.ts

  class Provider {
    send(
      payload: JsonRPCRequest,
      callback: (e: Error, val: JsonRPCResponse) => void
    ): any;
  }

  class WebsocketProvider extends Provider {
    responseCallbacks: object;
    notificationCallbacks: [() => any];
    connection: {
      onclose(e: any): void;
      onmessage(e: any): void;
      onerror(e?: any): void;
    };
    addDefaultEvents: () => void;
    on(type: string, callback: () => any): void;
    removeListener(type: string, callback: () => any): void;
    removeAllListeners(type: string): void;
    reset(): void;
  }

  class HttpProvider extends Provider {
    responseCallbacks: undefined;
    notificationCallbacks: undefined;
    connection: undefined;
    addDefaultEvents: undefined;
    on(type: string, callback: () => any): undefined;
    removeListener(type: string, callback: () => any): undefined;
    removeAllListeners(type: string): undefined;
    reset(): undefined;
  }

  class IpcProvider extends Provider {
    responseCallbacks: undefined;
    notificationCallbacks: undefined;
    connection: undefined;
    addDefaultEvents: undefined;
    on(type: string, callback: () => any): undefined;
    removeListener(type: string, callback: () => any): undefined;
    removeAllListeners(type: string): undefined;
    reset(): undefined;
  }

  interface JsonRPCRequest {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
  }

  interface JsonRPCResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
  }

  interface Providers {
    WebsocketProvider: new (
      host: string,
      timeout?: number
    ) => WebsocketProvider;
    HttpProvider: new (host: string, timeout?: number) => HttpProvider;
    IpcProvider: new (path: string, net: any) => IpcProvider;
  }


  // types.d.ts

  type Callback<T> = (error: Error, result: T) => void;

  interface EventEmitter {
    on(type: "data", handler: (event: EventLog) => void): EventEmitter;
    on(type: "changed", handler: (receipt: EventLog) => void): EventEmitter;
    on(type: "error", handler: (error: Error) => void): EventEmitter;
    on(
      type: "error" | "data" | "changed",
      handler: (error: Error | TransactionReceipt | string) => void
    ): EventEmitter;
  }

  interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: { data: string; topics: string[] };
  }

  interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs?: Log[];
    events?: {
      [eventName: string]: EventLog;
    };
    status: string;
  }

  interface EncodedTransaction {
    raw: string;
    tx: {
      nonce: string;
      gasPrice: string;
      gas: string;
      to: string;
      value: string;
      input: string;
      v: string;
      r: string;
      s: string;
      hash: string;
    };
  }

  interface Logs {
    fromBlock?: number;
    address?: string;
    topics?: Array<string | string[]>;
  }
  interface Log {
    address: string;
    data: string;
    topics: string[];
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
  }
  interface Subscribe<T> {
    subscription: {
        id: string;
        subscribe(callback?: Callback<Subscribe<T>>): Subscribe<T>;
        unsubscribe(callback?: Callback<boolean>): void | boolean;
        arguments: object;
    };
    on(type: "data" | "changed", handler: (data: T) => void): void;
    on(type: "error", handler: (data: Error) => void): void;
  }

  interface Shh {
    generateSymKeyFromPassword(password: string): Promise<string>;
    generateSymKeyFromPassword(
        password: string,
        callback: Callback<string>
    ): void;
    // TODO: type every method
  }
  class Bzz {} // TODO: Type


  // utils.d.ts

  type Unit =
    | "noether"
    | "wei"
    | "kwei"
    | "Kwei"
    | "babbage"
    | "femtoether"
    | "mwei"
    | "Mwei"
    | "lovelace"
    | "picoether"
    | "gwei"
    | "Gwei"
    | "shannon"
    | "nanoether"
    | "nano"
    | "szabo"
    | "microether"
    | "micro"
    | "finney"
    | "milliether"
    | "milli"
    | "ether"
    | "kether"
    | "grand"
    | "mether"
    | "gether"
    | "tether";

  type Mixed =
    | string
    | number
    | BigNumber
    | {
        type: string;
        value: string;
      }
    | {
        t: string;
        v: string;
      };

  type UnderscoreStatic = any;

  interface Utils {
    BN: BigNumber; // TODO only static-definition
    isBN(any: any): boolean;
    isBigNumber(any: any): boolean;
    isAddress(any: any): boolean;
    isHex(any: any): boolean;
    _: UnderscoreStatic;
    asciiToHex(val: string): string;
    hexToAscii(val: string): string;
    bytesToHex(val: number[]): string;
    numberToHex(val: number | BigNumber): string;
    checkAddressChecksum(address: string): boolean;
    fromAscii(val: string): string;
    fromDecimal(val: string | number | BigNumber): string;
    fromUtf8(val: string): string;
    fromWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
    hexToBytes(val: string): number[];
    hexToNumber(val: string | number | BigNumber): number;
    hexToNumberString(val: string | number | BigNumber): string;
    hexToString(val: string): string;
    hexToUtf8(val: string): string;
    keccak256(val: string): string;
    leftPad(string: string, chars: number, sign: string): string;
    padLeft(string: string, chars: number, sign: string): string;
    rightPad(string: string, chars: number, sign: string): string;
    padRight(string: string, chars: number, sign: string): string;
    sha3(
      val: string,
      val2?: string,
      val3?: string,
      val4?: string,
      val5?: string
    ): string;
    soliditySha3(...val: Mixed[]): string;
    randomHex(bytes: number): string;
    stringToHex(val: string): string;
    toAscii(hex: string): string;
    toBN(any: any): BigNumber;
    toChecksumAddress(val: string): string;
    toDecimal(val: any): number;
    toHex(val: any): string;
    toUtf8(val: any): string;
    toWei(val: string | number, unit?: Unit): string;
    toWei(val: BigNumber, unit?: Unit): BigNumber;
    unitMap: any;
  }


  // eth/index.d.ts
  interface Eth {
    defaultAccount: string;
    defaultBlock: BlockType;
    BatchRequest: new () => BatchRequest;
    Iban: Iban;
    Contract: new (
      jsonInterface: any[],
      address?: string,
      options?: CustomOptions
    ) => Contract;
    abi: ABI;
    setProvider: (provider: Provider) => void;
    accounts: Accounts;
    call(
      callObject: Tx,
      defaultBloc?: BlockType,
      callBack?: Callback<string>
    ): Promise<string>;
    clearSubscriptions(): boolean;
    subscribe(
      type: "logs",
      options?: Logs,
      callback?: Callback<Subscribe<Log>>
    ): Promise<Subscribe<Log>>;
    subscribe(
      type: "syncing",
      callback?: Callback<Subscribe<any>>
    ): Promise<Subscribe<any>>;
    subscribe(
      type: "newBlockHeaders",
      callback?: Callback<Subscribe<BlockHeader>>
    ): Promise<Subscribe<BlockHeader>>;
    subscribe(
      type: "pendingTransactions",
      callback?: Callback<Subscribe<Transaction>>
    ): Promise<Subscribe<Transaction>>;
    subscribe(
      type: "pendingTransactions" | "newBlockHeaders" | "syncing" | "logs",
      options?: Logs,
      callback?: Callback<Subscribe<any>>
    ): Promise<Subscribe<any>>;

    unsubscribe(callBack: Callback<boolean>): void | boolean;
    compile: {
      solidity(
        source: string,
        callback?: Callback<CompileResult>
      ): Promise<CompileResult>;
      lll(
        source: string,
        callback?: Callback<CompileResult>
      ): Promise<CompileResult>;
      serpent(
        source: string,
        callback?: Callback<CompileResult>
      ): Promise<CompileResult>;
    };
    currentProvider: Provider;
    estimateGas(tx: Tx, callback?: Callback<number>): Promise<number>;
    getAccounts(cb?: Callback<string[]>): Promise<string[]>;
    getBalance(
      address: string,
      defaultBlock?: BlockType,
      cb?: Callback<number>
    ): Promise<number>;
    getBlock(
      number: BlockType,
      returnTransactionObjects?: boolean,
      cb?: Callback<Block>
    ): Promise<Block>;
    getBlockNumber(callback?: Callback<number>): Promise<number>;
    getBlockTransactionCount(
      number: BlockType | string,
      cb?: Callback<number>
    ): Promise<number>;
    getBlockUncleCount(
      number: BlockType | string,
      cb?: Callback<number>
    ): Promise<number>;
    getCode(
      address: string,
      defaultBlock?: BlockType,
      cb?: Callback<string>
    ): Promise<string>;
    getCoinbase(cb?: Callback<string>): Promise<string>;
    getCompilers(cb?: Callback<string[]>): Promise<string[]>;
    getGasPrice(cb?: Callback<number>): Promise<number>;
    getHashrate(cb?: Callback<number>): Promise<number>;
    getPastLogs(
      options: {
          fromBlock?: BlockType;
          toBlock?: BlockType;
          address?: string;
          topics?: Array<string | string[]>;
      },
        cb?: Callback<Log[]>
    ): Promise<Log[]>;
    getProtocolVersion(cb?: Callback<string>): Promise<string>;
    getStorageAt(
      address: string,
      position: number | BigNumber,
      defaultBlock?: BlockType,
      cb?: Callback<string>
    ): Promise<string>;
    getTransactionReceipt(
        hash: string,
        cb?: Callback<TransactionReceipt>
    ): Promise<TransactionReceipt>;
    getTransaction(
      hash: string,
      cb?: Callback<Transaction>
    ): Promise<Transaction>;
    getTransactionCount(
      address: string,
      defaultBlock?: BlockType,
      cb?: Callback<number>
    ): Promise<number>;
    getTransactionFromBlock(
      block: BlockType,
      index: number,
      cb?: Callback<Transaction>
    ): Promise<Transaction>;
    getUncle(
      blockHashOrBlockNumber: BlockType | string,
      uncleIndex: number,
      returnTransactionObjects?: boolean,
      cb?: Callback<Block>
    ): Promise<Block>;
    getWork(cb?: Callback<string[]>): Promise<string[]>;
    givenProvider: Provider;
    isMining(cb?: Callback<boolean>): Promise<boolean>;
    isSyncing(cb?: Callback<boolean>): Promise<boolean>;
    net: Net;
    personal: Personal;
    signTransaction(
      tx: Tx,
      address?: string,
      cb?: Callback<string>
    ): Promise<EncodedTransaction>;
    sendSignedTransaction(
      data: string,
      cb?: Callback<string>
    ): PromiEvent<TransactionReceipt>;
    sendTransaction(
      tx: Tx,
      cb?: Callback<string>
    ): PromiEvent<TransactionReceipt>;
    submitWork(
      nonce: string,
      powHash: string,
      digest: string,
      cb?: Callback<boolean>
    ): Promise<boolean>;
    sign(
      address: string,
      dataToSign: string,
      cb?: Callback<string>
    ): Promise<string>;
  }


  // eth/abi.d.ts

  interface ABIDefinition {
    constant?: boolean;
    payable?: boolean;
    anonymous?: boolean;
    inputs?: Array<{ name: string; type: ABIDataTypes; indexed?: boolean }>;
    name?: string;
    outputs?: Array<{ name: string; type: ABIDataTypes }>;
    type: "function" | "constructor" | "event" | "fallback";
  }

  type ABIDataTypes = "uint256" | "boolean" | "string" | "bytes" | string; // TODO complete list

  interface ABI {
    decodeLog(inputs: object, hexString: string, topics: string[]): object;
    encodeParameter(type: string, parameter: any): string;
    encodeParameters(types: string[], paramaters: any[]): string;
    encodeEventSignature(name: string | object): string;
    encodeFunctionCall(jsonInterface: object, parameters: any[]): string;
    encodeFunctionSignature(name: string | object): string;
    decodeParameter(type: string, hex: string): any;
    decodeParameters(
      types: string[],
      hex: string
    ): EthAbiDecodeParametersResultArray;
    decodeParameters(
      types: EthAbiDecodeParametersType[],
      hex: string
    ): EthAbiDecodeParametersResultObject;
  }

  interface EthAbiDecodeParametersType {
    name: string;
    type: string;
  }
  interface EthAbiDecodeParametersResultArray {
    [index: number]: any;
  }
  type EthAbiDecodeParametersResultObject = EthAbiDecodeParametersResultArray & {
    [key: string]: any;
  };


  // eth/accounts.d.ts

  interface Account {
    address: string;
    privateKey: string;
    sign(data: string): MessageSignature;
    signTransaction(
      tx: Tx,
      cb?: (err: Error, result: TxSignature) => void
    ): Promise<TxSignature>;
    encrypt(password: string, options?: any): PrivateKey;
  }

  interface Signature {
    messageHash: string;
    r: string;
    s: string;
    v: string;
  }
  interface MessageSignature extends Signature {
    message: string;
    signature: string;
  }
  interface TxSignature extends Signature {
    rawTransaction: string;
  }

  interface PrivateKey {
    address: string;
    crypto: {
      cipher: string;
      ciphertext: string;
      cipherparams: {
        iv: string;
      };
      kdf: string;
      kdfparams: {
        dklen: number;
        n: number;
        p: number;
        r: number;
        salt: string;
      };
      mac: string;
    };
    id: string;
    version: number;
  }

  interface Accounts {
    create(entropy?: string): Account;
    privateKeyToAccount(privKey: string): Account;
    publicToAddress(key: string): string;
    signTransaction(
      tx: Tx,
      privateKey: string,
      cb?: (err: Error, result: TxSignature) => void
    ): Promise<TxSignature>;
    recoverTransaction(signature: string): string;
    sign(
      data: string,
      privateKey: string
    ): MessageSignature;
    recover(
      sigOrHash: string | Signature,
      sigOrV?: string,
      r?: string,
      s?: string
    ): string;
    encrypt(privateKey: string, password: string): PrivateKey;
    decrypt(privateKey: PrivateKey, password: string): Account;
    wallet: {
      create(numberOfAccounts: number, entropy: string): Account[];
      add(account: string | Account): any;
      remove(account: string | number): any;
      save(password: string, keyname?: string): string;
      load(password: string, keyname: string): any;
      clear(): any;
    };
  }


  // contract.d.ts

  interface CustomOptions {
    address?: string;
    jsonInterface?: ABIDefinition[];
    data?: string;
    from?: string;
    gasPrice?: string;
    gas?: number;
  }

  interface contractOptions {
    address: string;
    jsonInterface: ABIDefinition[];
    data: string;
    from: string;
    gasPrice: string;
    gas: number;
  }

  class Contract {
    constructor(
      jsonInterface: any[],
      address?: string,
      options?: CustomOptions
    );
    options: contractOptions;
    methods: {
      [fnName: string]: (...args: any[]) => TransactionObject<any>;
    };
    deploy(options: {
      data: string;
      arguments: any[];
    }): TransactionObject<Contract>;
    events: {
      [eventName: string]: (
        options?: {
          filter?: object;
          fromBlock?: BlockType;
          topics?: string[];
        },
        cb?: Callback<EventLog>
      ) => EventEmitter;
      allEvents: (
        options?: {
          filter?: object;
          fromBlock?: BlockType;
          topics?: string[];
        },
        cb?: Callback<EventLog>
      ) => EventEmitter;
    };
    getPastEvents(
      event: string,
      options?: {
        filter?: object;
        fromBlock?: BlockType;
        toBlock?: BlockType;
        topics?: string[];
      },
      cb?: Callback<EventLog[]>
    ): Promise<EventLog[]>;
    setProvider(provider: Provider): void;
  }


  // eth/types.d.ts

  interface Tx {
    nonce?: string | number;
    chainId?: string | number;
    from?: string;
    to?: string;
    data?: string;
    value?: string | number;
    gas?: string | number;
    gasPrice?: string | number;
  }

  class BatchRequest {
    constructor();
    add(request: object): void; //
    execute(): void;
  }
  class Iban {
    constructor(address: string);
    static toAddress(iban: Iban): string;
    isValid(): boolean;
  }
  type BlockType = "latest" | "pending" | "genesis" | number;

  interface BlockHeader {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionRoot: string;
    stateRoot: string;
    receiptRoot: string;
    miner: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
  }
  interface Block extends BlockHeader {
    transactions: Transaction[];
    size: number;
    difficulty: number;
    totalDifficulty: number;
    uncles: string[];
  }

  class Net {
    getId(cb?: Callback<number>): Promise<number>;
    isListening(cb?: Callback<boolean>): Promise<boolean>;
    getPeerCount(cb?: Callback<number>): Promise<number>;
  }
  class Personal {
    newAccount(password: string, cb?: Callback<boolean>): Promise<string>;
    importRawKey(): Promise<string>;
    lockAccount(): Promise<boolean>;
    unlockAccount(address: string, password: string, unlockDuration: number): void;
    sign(): Promise<string>;
    ecRecover(message: string, sig: string): void;
    sendTransaction(tx: Tx, passphrase: string): Promise<string>;
  }

  interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string;
    blockNumber: number;
    transactionIndex: number;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gas: number;
    input: string;
    v?: string;
    r?: string;
    s?: string;
  }
  interface TransactionObject<T> {
    arguments: any[];
    call(tx?: Tx): Promise<T>;
    send(tx?: Tx): PromiEvent<T>;
    estimateGas(tx?: Tx): Promise<number>;
    encodeABI(): string;
  }
  interface CompileResult {
    code: string;
    info: {
      source: string;
      language: string;
      languageVersion: string;
      compilerVersion: string;
      abiDefinition: ABIDefinition[];
    };
    userDoc: { methods: object };
    developerDoc: { methods: object };
  }


  // Type definitions for bn.js 4.11
  // Project: https://github.com/indutny/bn.js
  // Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
  //         Henry Nguyen <https://github.com/HenryNguyen5>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  type Endianness = 'le' | 'be';
  type IPrimeName = 'k256' | 'p224' | 'p192' | 'p25519';

  class RedBN {
    redAdd(b: RedBN): RedBN;
    redIAdd(b: RedBN): RedBN;
    redSub(b: RedBN): RedBN;
    redISub(b: RedBN): RedBN;
    redShl(num: number): RedBN;
    redMul(b: RedBN): RedBN;
    redIMul(b: RedBN): RedBN;
    redSqr(): RedBN;
    redISqr(): RedBN;
    redSqrt(): RedBN;
    redInvm(): RedBN;
    redNeg(): RedBN;
    redPow(b: RedBN): RedBN;
    fromRed(): BN;
  }

  interface ReductionContext {
    m: number;
    prime: any;
    [key: string]: any;
  }

  class BN {
    constructor(
      number: number | string | number[] | Buffer | BN,
      base?: number,
      endian?: Endianness
    );
    constructor(
      number: number | string | number[] | Buffer | BN,
      endian?: Endianness
    )

    static red(reductionContext: BN | IPrimeName): ReductionContext;
    static mont(num: BN): ReductionContext;
    static isBN(b: any): b is BN;
    static max(left: BN, right: BN): BN;
    static min(left: BN, right: BN): BN;

    toRed(reductionContext: ReductionContext): RedBN;
    clone(): BN;
    toString(base?: number | 'hex', length?: number): string;
    toNumber(): number;
    toJSON(): string;
    toArray(endian?: Endianness, length?: number): number[];
    toArrayLike(
      ArrayType: typeof Buffer,
      endian?: Endianness,
      length?: number
    ): Buffer;
    toArrayLike(
      ArrayType: any[],
      endian?: Endianness,
      length?: number
    ): any[];
    toBuffer(endian?: Endianness, length?: number): Buffer;
    bitLength(): number;
    zeroBits(): number;
    byteLength(): number;
    isNeg(): boolean;
    isEven(): boolean;
    isOdd(): boolean;
    isZero(): boolean;
    cmp(b: BN): -1 | 0 | 1;
    ucmp(b: BN): -1 | 0 | 1;
    cmpn(b: number): -1 | 0 | 1;
    lt(b: BN): boolean;
    ltn(b: number): boolean;
    lte(b: BN): boolean;
    lten(b: number): boolean;
    gt(b: BN): boolean;
    gtn(b: number): boolean;
    gte(b: BN): boolean;
    gten(b: number): boolean;
    eq(b: BN): boolean;
    eqn(b: number): boolean;
    toTwos(width: number): BN;
    fromTwos(width: number): BN;
    neg(): BN;
    ineg(): BN;
    abs(): BN;
    iabs(): BN;
    add(b: BN): BN;
    iadd(b: BN): BN;
    addn(b: number): BN;
    iaddn(b: number): BN;
    sub(b: BN): BN;
    isub(b: BN): BN;
    subn(b: number): BN;
    isubn(b: number): BN;
    mul(b: BN): BN;
    imul(b: BN): BN;
    muln(b: number): BN;
    imuln(b: number): BN;
    sqr(): BN;
    isqr(): BN;
    pow(b: BN): BN;
    div(b: BN): BN;
    divn(b: number): BN;
    idivn(b: number): BN;
    mod(b: BN): BN;
    umod(b: BN): BN;
    modn(b: number): number;
    divRound(b: BN): BN;
    or(b: BN): BN;
    ior(b: BN): BN;
    uor(b: BN): BN;
    iuor(b: BN): BN;
    and(b: BN): BN;
    iand(b: BN): BN;
    uand(b: BN): BN;
    iuand(b: BN): BN;
    andln(b: number): BN;
    xor(b: BN): BN;
    ixor(b: BN): BN;
    uxor(b: BN): BN;
    iuxor(b: BN): BN;
    setn(b: number): BN;
    shln(b: number): BN;
    ishln(b: number): BN;
    ushln(b: number): BN;
    iushln(b: number): BN;
    shrn(b: number): BN;
    ishrn(b: number): BN;
    ushrn(b: number): BN;
    iushrn(b: number): BN;
    testn(b: number): boolean;
    maskn(b: number): BN;
    imaskn(b: number): BN;
    bincn(b: number): BN;
    notn(w: number): BN;
    inotn(w: number): BN;
    gcd(b: BN): BN;
    egcd(b: BN): { a: BN; b: BN; gcd: BN };
    invm(b: BN): BN;
  }
}
