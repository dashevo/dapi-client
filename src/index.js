const jsutil = require('@dashevo/dashcore-lib').util.js;
const preconditionsUtil = require('@dashevo/dashcore-lib').util.preconditions;
const {
  CorePromiseClient,
  LastUserStateTransitionHashRequest,
  TransactionsFilterStreamPromiseClient,
  TransactionsWithProofsRequest,
  BloomFilter: BloomFilterMessage,
  StateTransition,
} = require('@dashevo/dapi-grpc');
const MNDiscovery = require('./MNDiscovery/index');
const rpcClient = require('./RPCClient');
const config = require('./config');

class DAPIClient {
  /**
   * @param options
   * @param {Array<Object>} [options.seeds] - seeds. If no seeds provided
   * default seed will be used.
   * @param {number} [options.port=3000] - default port for connection to the DAPI
   * @param {number} [options.nativeGrpcPort=3010] - Native GRPC port for connection to the DAPI
   * @param {number} [options.timeout=2000] - timeout for connection to the DAPI
   * @param {number} [options.retries=3] - num of retries if there is no response from DAPI node
   */
  constructor(options = {}) {
    this.MNDiscovery = new MNDiscovery(options.seeds, options.port);
    this.DAPIPort = options.port || config.Api.port;
    this.nativeGrpcPort = options.nativeGrpcPort || config.grpc.nativePort;
    this.timeout = options.timeout || 2000;
    preconditionsUtil.checkArgument(jsutil.isUnsignedInteger(this.timeout),
      'Expect timeout to be an unsigned integer');
    this.retries = options.retries ? options.retries : 3;
    preconditionsUtil.checkArgument(jsutil.isUnsignedInteger(this.retries),
      'Expect retries to be an unsigned integer');
  }

  /**
   * @private
   * @param {string} method
   * @param {Object} params
   * @param {string[]} [excludedIps]
   * @returns {Promise<*>}
   */
  async makeRequestToRandomDAPINode(method, params, excludedIps = []) {
    this.makeRequest.callCount = 0;

    return this.makeRequestWithRetries(method, params, this.retries, excludedIps);
  }

  async makeRequest(method, params, excludedIps) {
    this.makeRequest.callCount += 1;
    const randomMasternode = await this.MNDiscovery.getRandomMasternode(excludedIps);
    return rpcClient.request({
      host: randomMasternode.service.split(':')[0],
      port: this.DAPIPort,
    }, method, params, { timeout: this.timeout });
  }

  async makeRequestWithRetries(method, params, retriesCount = 0, excludedIps) {
    try {
      return await this.makeRequest(method, params, excludedIps);
    } catch (err) {
      if (err.code !== 'ECONNABORTED' && err.code !== 'ECONNREFUSED') {
        throw err;
      }
      if (retriesCount > 0) {
        let excludedOnNextTry = [];
        if (err.address) {
          excludedOnNextTry = Array.isArray(excludedIps)
            ? excludedIps.slice().push(err.address) : excludedOnNextTry.push(err.address);
        }
        return this.makeRequestWithRetries(method, params, retriesCount - 1, excludedOnNextTry);
      }
      throw new Error('max retries to connect to DAPI node reached');
    }
  }

  /* Layer 1 commands */

  /**
   * Estimate fee
   * @param {number} numberOfBlocksToWait
   * @return {Promise<number>} - duffs per byte
   */
  estimateFee(numberOfBlocksToWait) { return this.makeRequestToRandomDAPINode('estimateFee', { blocks: numberOfBlocksToWait }); }

  /**
   * ONLY FOR TESTING PURPOSES WITH REGTEST. WILL NOT WORK ON TESTNET/LIVENET.
   * @param {number} amount - Number of blocks to generate
   * @returns {Promise<string[]>} - block hashes
   */
  generate(amount) { return this.makeRequestToRandomDAPINode('generate', { amount }); }

  /**
   * Returns a summary (balance, txs) for a given address
   * @param {string|string[]} address or array of addresses
   * @param {boolean} [noTxList=false] - true if a list of all txs should NOT be included in result
   * @param {number} [from] - start of range for the tx to be included in the tx list
   * @param {number} [to] - end of range for the tx to be included in the tx list
   * @param {number} [fromHeight] - which height to start from (optional, overriding from/to)
   * @param {number} [toHeight] - on which height to end (optional, overriding from/to)
   * @returns {Promise<Object>} - an object with basic address info
   */
  getAddressSummary(address, noTxList, from, to, fromHeight, toHeight) {
    return this.makeRequestToRandomDAPINode('getAddressSummary',
      {
        address, noTxList, from, to, fromHeight, toHeight,
      });
  }

  /**
   * @param {string|string[]} address or array of addresses
   * @return {Promise<number>}
   */
  getAddressTotalSent(address) { return this.makeRequestToRandomDAPINode('getAddressTotalSent', { address }); }

  /**
   * @param {string|string[]} address or array of addresses
   * @return {Promise<number>}
   */
  getAddressUnconfirmedBalance(address) { return this.makeRequestToRandomDAPINode('getAddressUnconfirmedBalance', { address }); }

  /**
   * @param {string|string[]} address or array of addresses
   * @return {Promise<number>}
   */
  getAddressTotalReceived(address) { return this.makeRequestToRandomDAPINode('getAddressTotalReceived', { address }); }

  /**
   * Returns balance for a given address
   * @param {string|string[]} address or array of addresses
   * @returns {Promise<number>} - address balance
   */
  getBalance(address) { return this.makeRequestToRandomDAPINode('getBalance', { address }); }

  /**
   * Returns block hash of chaintip
   * @returns {Promise<string>}
   */
  getBestBlockHash() { return this.makeRequestToRandomDAPINode('getBestBlockHash', {}); }

  /**
   * Returns best block height
   * @returns {Promise<number>}
   */
  getBestBlockHeight() { return this.makeRequestToRandomDAPINode('getBestBlockHeight', {}); }

  /**
   * Returns block hash for the given height
   * @param {number} height
   * @returns {Promise<string>} - block hash
   */
  getBlockHash(height) { return this.makeRequestToRandomDAPINode('getBlockHash', { height }); }

  /**
   * Returns block header by hash
   * @param {string} blockHash
   * @returns {Promise<object[]>} - array of header objects
   */
  getBlockHeader(blockHash) { return this.makeRequestToRandomDAPINode('getBlockHeader', { blockHash }); }

  /**
   * Returns block headers from [offset] with length [limit], where limit is <= 2000
   * @param {number} offset
   * @param {number} [limit=1]
   * @param {boolean} [verbose=false]
   * @returns {Promise<object[]>} - array of header objects
   */
  getBlockHeaders(offset, limit = 1, verbose = false) { return this.makeRequestToRandomDAPINode('getBlockHeaders', { offset, limit, verbose }); }

  // TODO: Do we really need it this way?
  /**
   * Get block summaries for the day
   * @param {string} blockDate string in format 'YYYY-MM-DD'
   * @param {number} limit
   * @return {Promise<object>}
   */
  getBlocks(blockDate, limit) { return this.makeRequestToRandomDAPINode('getBlocks', { blockDate, limit }); }

  /**
   * @return {Promise<object>}
   */
  getHistoricBlockchainDataSyncStatus() { return this.makeRequestToRandomDAPINode('getHistoricBlockchainDataSyncStatus', {}); }

  /**
   * Retrieve user's last state transition hash
   *
   * @param {string} userId
   * @returns {Promise<string>}
   */
  async getLastUserStateTransitionHash(userId) {
    const request = new LastUserStateTransitionHashRequest();
    request.setUserId(Buffer.from(userId, 'hex'));

    const nodeToConnect = await this.MNDiscovery.getRandomMasternode();

    const client = new CorePromiseClient(`${nodeToConnect.getIp()}:${this.getGrpcPort()}`);

    const response = await client.getLastUserStateTransitionHash(request);

    const hashBuffer = response.getStateTransitionHash_asU8();

    if (hashBuffer.length > 0) {
      return Buffer.from(hashBuffer).toString('hex');
    }

    return null;
  }

  /**
   * Returns mempool usage info
   * @returns {Promise<object>}
   */
  getMempoolInfo() { return this.makeRequestToRandomDAPINode('getMempoolInfo', {}); }

  /**
   * Get deterministic masternodelist diff
   * @param {string} baseBlockHash - hash or height of start block
   * @param {string} blockHash - hash or height of end block
   * @return {Promise<object>}
   */
  getMnListDiff(baseBlockHash, blockHash) { return this.makeRequestToRandomDAPINode('getMnListDiff', { baseBlockHash, blockHash }); }

  /**
   * @param {string} blockHash
   * @return {Promise<object>}
   */
  getRawBlock(blockHash) { return this.makeRequestToRandomDAPINode('getRawBlock', { blockHash }); }

  /**
   * Returns Transactions for a given address or multiple addresses
   * @param {string|string[]} address or array of addresses
   * @param {number} [from] - start of range in the ordered list of latest UTXO (optional)
   * @param {number} [to] - end of range in the ordered list of latest UTXO (optional)
   * @param {number} [fromHeight] - which height to start from (optional, overriding from/to)
   * @param {number} [toHeight] - on which height to end (optional, overriding from/to)
   * @returns {Promise<object>} - Object with pagination info and array of unspent outputs
   */
  getTransactionsByAddress(address, from, to, fromHeight, toHeight) {
    return this.makeRequestToRandomDAPINode('getTransactionsByAddress',
      {
        address, from, to, fromHeight, toHeight,
      });
  }

  /**
   * @param {string} txid - transaction hash
   * @return {Promise<object>}
   */
  getTransactionById(txid) { return this.makeRequestToRandomDAPINode('getTransactionById', { txid }); }

  /**
   * Returns UTXO for a given address or multiple addresses (max result 1000)
   * @param {string|string[]} address or array of addresses
   * @param {number} [from] - start of range in the ordered list of latest UTXO (optional)
   * @param {number} [to] - end of range in the ordered list of latest UTXO (optional)
   * @param {number} [fromHeight] - which height to start from (optional, overriding from/to)
   * @param {number} [toHeight] - on which height to end (optional, overriding from/to)
   * @returns {Promise<object>} - Object with pagination info and array of unspent outputs
   */
  getUTXO(address, from, to, fromHeight, toHeight) {
    return this.makeRequestToRandomDAPINode('getUTXO',
      {
        address, from, to, fromHeight, toHeight,
      });
  }

  /**
   * @param {string} rawIxTransaction - hex-serialized instasend transaction
   * @return {Promise<string>} - transaction id
   */
  sendRawIxTransaction(rawIxTransaction) { return this.makeRequestToRandomDAPINode('sendRawIxTransaction', { rawIxTransaction }); }

  /**
   * Sends serialized transaction to the network
   * @param {string} rawTransaction - hex string representing serialized transaction
   * @returns {Promise<string>} - transaction id
   */
  sendRawTransaction(rawTransaction) { return this.makeRequestToRandomDAPINode('sendRawTransaction', { rawTransaction }); }

  /* Layer 2 commands */

  fetchContract(contractId) { return this.makeRequestToRandomDAPINode('fetchContract', { contractId }); }

  /**
   * Fetch DAP Objects from DashDrive State View
   * @param {string} contractId
   * @param {string} type - Dap objects type to fetch
   * @param options
   * @param {Object} options.where - Mongo-like query
   * @param {Object} options.orderBy - Mongo-like sort field
   * @param {number} options.limit - how many objects to fetch
   * @param {number} options.startAt - number of objects to skip
   * @param {number} options.startAfter - exclusive skip
   * @return {Promise<Object[]>}
   */
  fetchDocuments(contractId, type, options) { return this.makeRequestToRandomDAPINode('fetchDocuments', { contractId, type, options }); }

  /**
   * Returns blockchain user by its username or regtx id
   * @param {string} userId - user reg tx id
   * @returns {Promise<Object>} - blockchain user
   */
  getUserById(userId) { return this.makeRequestToRandomDAPINode('getUser', { userId }); }

  /**
   * Returns blockchain user by its username or regtx id
   * @param {string} username
   * @returns {Promise<Object>} - blockchain user
   */
  getUserByName(username) { return this.makeRequestToRandomDAPINode('getUser', { username }); }

  /**
   * Send State Transition to machine
   *
   * @param {Transaction} stHeader
   * @param {STPacket} stPacket
   * @returns {Promise<!UpdateStateTransitionResponse>}
   */
  async updateState(stHeader, stPacket) {
    const stateTransition = new StateTransition();
    stateTransition.setHeader(stHeader);
    stateTransition.setPacket(stPacket);

    const nodeToConnect = await this.MNDiscovery.getRandomMasternode();

    const client = new CorePromiseClient(`${nodeToConnect.getIp()}:${this.getGrpcPort()}`);

    return client.updateState(stateTransition);
  }

  // Here go methods that used in VMN. Most of this methods will work only in regtest mode
  searchUsers(pattern, limit = 10, offset = 0) { return this.makeRequestToRandomDAPINode('searchUsers', { pattern, limit, offset }); }

  /**
   * @param {BloomFilter} bloomFilter
   * @param {Uint8Array|Array} bloomFilter.vData - The filter itself is simply a bit
   * field of arbitrary byte-aligned size. The maximum size is 36,000 bytes.
   * @param {number} bloomFilter.nHashFuncs - The number of hash functions to use in this filter.
   * The maximum value allowed in this field is 50.
   * @param {number} bloomFilter.nTweak - A random value to add to the seed value in the
   * hash function used by the bloom filter.
   * @param {number} bloomFilter.nFlags - A set of flags that control how matched items
   * are added to the filter.
   * @param {Object} [options]
   * @param {string} [options.fromBlockHash] - Specifies block hash to start syncing from
   * @param {number} [options.fromBlockHeight] - Specifies block height to start syncing from
   * @param {number} [options.count=0] - Number of blocks to sync,
   * if set to 0 syncing is continuously sends new data as well
   * @returns {
   *    Promise<EventEmitter>|!grpc.web.ClientReadableStream<!TransactionsWithProofsResponse>
   * }
   */
  async subscribeToTransactionsWithProofs(bloomFilter, options = { count: 0 }) {
    const bloomFilterObject = bloomFilter.toObject();

    const bloomFilterMessage = new BloomFilterMessage();
    bloomFilterMessage.setVData(new Uint8Array(bloomFilterObject.vData));
    bloomFilterMessage.setNHashFuncs(bloomFilterObject.nHashFuncs);
    bloomFilterMessage.setNTweak(bloomFilterObject.nTweak);
    bloomFilterMessage.setNFlags(bloomFilterObject.nFlags);

    const request = new TransactionsWithProofsRequest();
    request.setBloomFilter(bloomFilterMessage);

    if (options.fromBlockHeight) {
      request.setFromBlockHeight(options.fromBlockHeight);
    }

    if (options.fromBlockHash) {
      request.setFromBlockHash(
        Buffer.from(options.fromBlockHash, 'hex'),
      );
    }

    request.setCount(options.count);

    const nodeToConnect = await this.MNDiscovery.getRandomMasternode();

    const client = new TransactionsFilterStreamPromiseClient(`${nodeToConnect.getIp()}:${this.getGrpcPort()}`);

    return client.subscribeToTransactionsWithProofs(request);
  }

  /**
   * @private
   * @return {number}
   */
  getGrpcPort() {
    if (typeof process !== 'undefined'
      && process.versions != null
      && process.versions.node != null) {
      return this.nativeGrpcPort;
    }

    return this.DAPIPort;
  }
}

module.exports = DAPIClient;
