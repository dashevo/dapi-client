require('../../bootstrap');

const path = require('path');
const dotenvSafe = require('dotenv-safe');

const sinon = require('sinon');

const MNDiscovery = require('../../../src/MNDiscovery/index');
const { startDapi } = require('@dashevo/dp-services-ctl');
const DAPIClient = require('../../../src/index');

const DashPlatformProtocol = require('@dashevo/dpp');
const entropy = require('@dashevo/dpp/lib/util/entropy');

const {
  Transaction,
  PrivateKey,
  PublicKey,
  Address,
} = require('@dashevo/dashcore-lib');

const wait = require('../../utils/wait');

process.env.NODE_ENV = 'test';

dotenvSafe.config({
  sample: path.resolve(__dirname, '../.env'),
  path: path.resolve(__dirname, '../.env'),
});


describe('features', () => {
  let masterNode;
  let seeds;

  let spy;
  let spy2;

  let transactionIdSendToAddress;
  let insightURL;

  let dapiClient;
  let dpp;

  let faucetPrivateKey;
  let faucetAddress;

  let bobUserName;

  before(async () => {
    dpp = new DashPlatformProtocol();
    const privKey = 'cVwyvFt95dzwEqYCLd8pv9CzktajP4tWH2w9RQNPeHYA7pH35wcJ';
    faucetPrivateKey = new PrivateKey(privKey);

    const faucetPublicKey = PublicKey.fromPrivateKey(faucetPrivateKey);

    faucetAddress = Address
      .fromPublicKey(faucetPublicKey, 'testnet')
      .toString();

    bobUserName = Math.random()
      .toString(36)
      .substring(7);
    aliceUserName = Math.random()
      .toString(36)
      .substring(7);

    const contract = dpp.contract.create(entropy.generate(), {
      user: {
        properties: {
          avatarUrl: {
            type: 'string',
            format: 'url',
          },
          about: {
            type: 'string',
          },
        },
        required: ['avatarUrl', 'about'],
        additionalProperties: false,
      },
      contact: {
        properties: {
          toUserId: {
            type: 'string',
          },
          publicKey: {
            type: 'string',
          },
        },
        required: ['toUserId', 'publicKey'],
        additionalProperties: false,
      },
    });

    dpp.setContract(contract);

    sinon.stub(MNDiscovery.prototype, 'getRandomMasternode')
      .returns(Promise.resolve({ service: '127.0.0.1' }));

    [masterNode] = await startDapi.many(1);

    const seeds = [{ service: masterNode.dapi.container.getIp() }];
    await masterNode.dashCore.getApi()
      .generate(1500);

    dapiClient = new DAPIClient({
      seeds,
      port: masterNode.dapi.options.getRpcPort(),
    });

    insightURL = `http://127.0.0.1:${masterNode.insight.options.getApiPort()}/insight-api-dash`;

    transactionIdSendToAddress = await masterNode.dashCore.getApi()
      .sendToAddress(faucetAddress, 100);
    await dapiClient.generate(20);
    let result = await masterNode.dashCore.getApi()
      .getAddressUtxos({ 'addresses': ['ygPcCwVy7Fxg7ruxZzqVYdPLtvw7auHAFh'] });
    await wait(20000);
    // spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
    // spy2 = sinon.spy(dapiClient, 'makeRequest');

  });

  after('cleanup alone services', async () => {
    const instances = [
      masterNode,
    ];

    await Promise.all(instances.filter(i => i)
      .map(i => i.remove()));

    MNDiscovery.prototype.getRandomMasternode.restore();
  });


  xdescribe('retry policy: dapi unavailable', () => {
    before(async () => {
      await masterNode.dapi.container.stop();
    });

    after(async () => {
      await masterNode.dapi.container.start();
      await wait(20000);
    });

    it('should makeRequestWithRetries be called 4 times with default settings', async function it() {
      let err = '';
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(4);

    });

    it('should makeRequestToRandomDAPINode be called 1 time with default settings', async function it() {
      let err = '';
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'makeRequestToRandomDAPINode');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(1);

    });

    it('should rpc method be called 1 time with default settings', async function it() {
      let err = '';
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'getBestBlockHeight');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(1);

    });

    it('should makeRequestWithRetries be called 11 times with retries=10', async function it() {
      let err = '';
      const retries = 10;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(11);

    });

    it('should makeRequestWithRetries be called 1 times with retries=0', async function it() {
      let err = '';
      const retries = 0;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(4);

    });

    it('should makeRequestWithRetries be called 1 times with retries=true', async function it() {
      const retries = true;
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect retries to be an unsigned integer');
    });

    it('should makeRequestWithRetries be called 1 times with retries=1', async function it() {
      let err = '';
      const retries = 1;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(2);

    });

    it('should makeRequestWithRetries be called 1 times with retries=-10', async function it() {
      const retries = -10;
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect retries to be an unsigned integer');
    });

    it('should makeRequestWithRetries be called 1 times with retries=str', async function it() {
      const retries = 'str';
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect retries to be an unsigned integer');
    });

    it('should DAPIClient throw error when timeout=str', async function it() {
      const timeout = 'str';
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect timeout to be an unsigned integer');
    });

    it('should be able to use integer as string for timeout parameter', async function it() {
      const timeout = '100';
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect timeout to be an unsigned integer');
    });

    it('should be able to use integer for timeout parameter', async function it() {
      let err = '';
      const timeout = 100000;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');

      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(4);
    });

    it('should be able to use timeout parameter with min value=1', async function it() {
      let err = '';
      const timeout = 1;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');

      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(4);
    });

    it('should DAPIClient throw error when timeout=-1', async function it() {
      const timeout = -1;
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect timeout to be an unsigned integer');
    });

    it('should DAPIClient throw error when timeout=true', async function it() {
      const timeout = true;
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect timeout to be an unsigned integer');
    });

    it('should DAPIClient throw error when timeout="100"', async function it() {
      const timeout = '100';
      return expect(() => new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      }))
        .to
        .throw(Error, 'Invalid Argument: Expect timeout to be an unsigned integer');
    });
  });
  xdescribe('retry policy: dapi started', () => {
    it('should makeRequestWithRetries be called 1 times with default settings', async function it() {
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      await dapiClient.getBestBlockHeight();
      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should makeRequestToRandomDAPINode be called 0 times with default settings', async function it() {
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'makeRequestToRandomDAPINode');
      expect(spy.callCount)
        .to
        .be
        .equal(0);
    });

    it('should getBestBlockHeight be called 1 times with default settings', async function it() {
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      let spy = sinon.spy(dapiClient, 'getBestBlockHeight');
      await dapiClient.getBestBlockHeight();
      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should makeRequestWithRetries be called 1 times with retries=10', async function it() {
      const retries = 10;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      await dapiClient.getBestBlockHeight();
      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should makeRequestWithRetries be called 1 times with retries=0', async function it() {
      const retries = 0;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      await dapiClient.getBestBlockHeight();

      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should makeRequestWithRetries be called 1 times with retries=1', async function it() {
      const retries = 1;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        retries: retries
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      await dapiClient.getBestBlockHeight();
      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should makeRequestWithRetries be called 1 times with timeout=10000', async function it() {
      const timeout = 10000;
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');
      await dapiClient.getBestBlockHeight();

      expect(spy.callCount)
        .to
        .be
        .equal(1);
    });

    it('should DAPIClient throw error when timeout too small', async function it() {
      const timeout = 1;
      let err = '';
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
        timeout: timeout
      });
      let spy = sinon.spy(dapiClient, 'makeRequestWithRetries');

      try {
        await dapiClient.getBestBlockHeight();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('max retries to connect to DAPI node reached');
      expect(spy.callCount)
        .to
        .be
        .equal(4);
    });
  });

  describe('getUTXO', () => {
    var spy;
    var spyGetTransactionsByAddress;

    before(async () => {
      dapiClient = new DAPIClient({
        seeds,
        port: masterNode.dapi.options.getRpcPort(),
      });
      spy = sinon.spy(dapiClient, 'getUTXO');
      spyGetTransactionsByAddress = sinon.spy(dapiClient, 'getTransactionsByAddress');
    });

    // beforeEach(function() {
    //   // spy = sinon.spy(dapiClient, 'getUTXO');
    // });

    afterEach(function() {
      spy.resetHistory();
      spyGetTransactionsByAddress.resetHistory();
    });

    it('should throw error when call getUTXO without params', async function it() {
      let err = '';
      try {
        await dapiClient.getUTXO();
      } catch (e) {
        err = e;
      }
      expect(err.message)
        .to
        .equal('DAPI RPC error: getUTXO: Error: DAPI RPC error: getUTXO: params should have required property \'address\'');
      expect(spy.callCount).to.be.equal(1);
    });

    it('should throw error when call getUTXO with non-valid address', async function it() {
      let err = '';
      try {
        await dapiClient.getUTXO("faucetAddress");
      } catch (e) {
        err = e;
      }
      expect(err.message).to.equal('DAPI RPC error: getUTXO: Error: DAPI RPC error: getUTXO: params.address should NOT be shorter than 26 characters');
      expect(spy.callCount).to.be.equal(1);

    });

    it('should throw error when call getUTXO with empty address', async function it() {
      let err = '';
      try {
        await dapiClient.getUTXO("");
      } catch (e) {
        err = e;
      }
      expect(err.message).to.equal('DAPI RPC error: getUTXO: Error: DAPI RPC error: getUTXO: params.address should NOT be shorter than 26 characters');
      expect(spy.callCount).to.be.equal(1);

    });

    it('should getUTXO by address', async function it() {
      const utxo = await dapiClient.getUTXO(faucetAddress);
      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(1);
      expect(utxo).to.be.deep.equal(
          {
            'totalItems': 1,
            'from': 0,
            'to': 1,
            'items': [
              {
                'address': faucetAddress,
                'txid': utxo.items[0].txid,
                'outputIndex': 0,
                'script': utxo.items[0].script,
                'satoshis': 10000000000,
                'height': utxo.items[0].height
              }
            ]
          });
    });


    it('should getUTXO by array of addresses', async function it() {
      const utxo = await dapiClient.getUTXO([faucetAddress]);
      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(1);
      expect(utxo).to.be.deep.equal(
        {
          'totalItems': 1,
          'from': 0,
          'to': 1,
          'items': [
            {
              'address': faucetAddress,
              'txid': utxo.items[0].txid,
              'outputIndex': 0,
              'script': utxo.items[0].script,
              'satoshis': 10000000000,
              'height': utxo.items[0].height
            }
          ]
        });
    });

    it('should getUTXO by address with params: 0 1', async function it() {
      const from = 0;
      const to = 1;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(1);
      expect(utxo).to.be.deep.equal(
        {
          'totalItems': 1,
          'from': 0,
          'to': 1,
          'items': [
            {
              'address': faucetAddress,
              'txid': utxo.items[0].txid,
              'outputIndex': 0,
              'script': utxo.items[0].script,
              'satoshis': 10000000000,
              'height': utxo.items[0].height
            }
          ]
        });
    });

    it('should getUTXO by address with params: 0 0', async function it() {
      const from = 0;
      const to = 0;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(1);
      expect(utxo).to.be.deep.equal(
        {
          'totalItems': 1,
          'from': from,
          'to': 1,
          'items': [
            {
              'address': faucetAddress,
              'txid': utxo.items[0].txid,
              'outputIndex': 0,
              'script': utxo.items[0].script,
              'satoshis': 10000000000,
              'height': utxo.items[0].height
            }
          ]
        });
    });

    it('should throw error when getUTXO with negative params: 0 -1', async function it() {
      const from = 0;
      const to = -1;
      let err = '';
      try {
        await dapiClient.getUTXO(faucetAddress, from, to);
      } catch (e) {
        err = e;
      }
      expect(err.message).to.equal('DAPI RPC error: getUTXO: Error: DAPI RPC error: getUTXO: params.to should be >= 0');
      expect(spy.callCount).to.be.equal(1);
    });


    it('should throw error for getUTXO with range > 1000: 0 1002', async function it() {
      const from = 0;
      const to = 1002;
      let err = '';
      try {
        await dapiClient.getUTXO(faucetAddress, from, to);
      } catch (e) {
        err = e;
      }
      expect(err.message).to.equal('DAPI RPC error: getUTXO: Error: DAPI RPC error: getUTXO: Internal error'); //TODO: post ticket
      expect(spy.callCount).to.be.equal(1);
    });

    it('should getUTXO by address with params: 1 0', async function it() {
      const from = 1;
      const to = 0;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": 1,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });

    it('should getUTXO by address with params: 1 0 1', async function it() {
      const from = 1;
      const to = 0;
      fromHeight = 1;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": 1,
        "fromHeight": fromHeight,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });

    it('should getUTXO by address with params: 1 0 100000', async function it() {
      const from = 1;
      const to = 0;
      fromHeight = 100000;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": from,
        "fromHeight": fromHeight,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });

    it('should getUTXO by address with params: 1 0 100', async function it() {
      const from = 1;
      const to = 0;
      fromHeight = 100;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": from,
        "fromHeight": fromHeight,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });

    it('should getUTXO by address with params: 1 0 100 99', async function it() {
      const from = 1;
      const to = 0;
      fromHeight = 100;
      toHeight = 99;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": from,
        "fromHeight": fromHeight,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });

    it('should getUTXO by address with params: 0 0 100 2000', async function it() {
      const from = 0;
      const to = 0;
      fromHeight = 100;
      toHeight = 2000;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(1);
      expect(utxo).to.be.deep.equal(
        {
          'totalItems': 1,
          'from': 0,
          "fromHeight": fromHeight,
          'to': 1,
          'items': [
            {
              'address': faucetAddress,
              'txid': utxo.items[0].txid,
              'outputIndex': 0,
              'script': utxo.items[0].script,
              'satoshis': 10000000000,
              'height': utxo.items[0].height
            }
          ]
        });
    });

    it('should getUTXO by address 1 0 100 2000', async function it() {
      const from = 1;
      const to = 0;
      fromHeight = 100;
      toHeight = 2000;
      const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

      expect(spy.callCount).to.be.equal(1);
      expect(utxo.items).to.have.lengthOf(0);
      expect(utxo).to.be.deep.equal({
        "from": from,
        "fromHeight": fromHeight,
        "items": [],
        "to": 1,
        "totalItems": 1
      });
    });


      it('should throw error when call getTransactionsByAddress without params', async function it() {
        let err = '';
        try {
          await dapiClient.getTransactionsByAddress();
        } catch (e) {
          err = e;
        }
        expect(err.message)
          .to
          .equal('DAPI RPC error: getTransactionsByAddress: Error: DAPI RPC error: getTransactionsByAddress: params should have required property \'address\'');
        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
      });

      it('should throw error when call getTransactionsByAddress with non-valid address', async function it() {
        let err = '';
        try {
          await dapiClient.getTransactionsByAddress("faucetAddress");
        } catch (e) {
          err = e;
        }
        expect(err.message).to.equal('DAPI RPC error: getTransactionsByAddress: Error: DAPI RPC error: getTransactionsByAddress: params.address should NOT be shorter than 26 characters');
        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);

      });

        it('should throw error when call getTransactionsByAddress with empty address', async function it() {
          let err = '';
          try {
            await dapiClient.getTransactionsByAddress("");
          } catch (e) {
            err = e;
          }
          expect(err.message).to.equal('DAPI RPC error: getTransactionsByAddress: Error: DAPI RPC error: getTransactionsByAddress: params.address should NOT be shorter than 26 characters');
          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);

        });

        it('should getTransactionsByAddress by address', async function it() {
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress);
          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(1);
          expect(transactionsByAddress.from).to.be.equal(0);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);

        });

    it('should getTransactionsByAddress by addresses as array', async function it() {
      const transactionsByAddress = await dapiClient.getTransactionsByAddress([faucetAddress]);
      expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
      expect(transactionsByAddress.items).to.have.lengthOf(1);
      expect(transactionsByAddress.from).to.be.equal(0);
      expect(transactionsByAddress.to).to.be.equal(1);
      expect(transactionsByAddress.totalItems).to.be.equal(1);

    });

        it('should getTransactionsByAddress by address with params: 0 1', async function it() {
          const from = 0;
          const to = 1;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(1);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(to);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 0 0', async function it() {
          const from = 0;
          const to = 0;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(1);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should throw exception with negative params: 0 -1', async function it() {
          const from = 0;
          const to = -1;
          let err = '';
          try {
            await dapiClient.getTransactionsByAddress(faucetAddress, from , to);
          } catch (e) {
            err = e;
          }
          expect(err.message).to.equal('DAPI RPC error: getTransactionsByAddress: Error: DAPI RPC error: getTransactionsByAddress: params.to should be >= 0');
          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 1 0', async function it() {
          const from = 1;
          const to = 0;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress by address with params: 1 0 1', async function it() {
          const from = 1;
          const to = 0;
          fromHeight = 1;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 1 0 100000', async function it() {
          const from = 1;
          const to = 0;
          fromHeight = 100000;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 1 0 100', async function it() {
          const from = 1;
          const to = 0;
          fromHeight = 100;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 1 0 100 99', async function it() {
          const from = 1;
          const to = 0;
          fromHeight = 100;
          toHeight = 99;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 0 0 100 2000', async function it() {
          const from = 0;
          const to = 0;
          fromHeight = 100;
          toHeight = 2000;
          const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

        it('should getTransactionsByAddress with params: 1 0 100 2000', async function it() {
          const from = 1;
          const to = 0;
          fromHeight = 100;
          toHeight = 2000;
          const transactionsByAddress = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

          expect(spyGetTransactionsByAddress.callCount).to.be.equal(0);
          expect(transactionsByAddress.items).to.have.lengthOf(0);
          expect(transactionsByAddress.from).to.be.equal(from);
          expect(transactionsByAddress.to).to.be.equal(1);
          expect(transactionsByAddress.totalItems).to.be.equal(1);
        });

    describe('many transactions', () => {
      it('should generate many inputs', async function it() {
        this.timeout(1600000);
        var privateKey = new PrivateKey("b9de6e778fe92aa7edb69395556f843f1dce0448350112e14906efc2a80fa61a", 'testnet');
        let inputs = await dapiClient.getUTXO(faucetAddress);
        const address = Address
          .fromPublicKey(PublicKey.fromPrivateKey(privateKey), 'testnet')
          .toString();
        var transaction = new Transaction()
          .from(inputs.items)          // Feed information about what unspent outputs one can use
          .to(address, 1000000000)  // Add an output with the given amount of satoshis
          .change(faucetAddress)      // Sets up a change address where the rest of the funds will go
          .fee(10000)
          .sign("cVwyvFt95dzwEqYCLd8pv9CzktajP4tWH2w9RQNPeHYA7pH35wcJ");
        const result = await dapiClient.sendRawTransaction(transaction.serialize());
        await dapiClient.generate(20);

        for (let i = 0; i < 990; i++) {
          console.log(i);
          let inputs = await dapiClient.getUTXO(faucetAddress);
          let inputTo = await dapiClient.getUTXO(address);
          // await dapiClient.generate(1);
          var transaction = new Transaction()
            .from(inputTo.items.slice(-1)[0])          // Feed information about what unspent outputs one can use
            .to(faucetAddress, 1000000)  // Add an output with the given amount of satoshis
            .change(address)      // Sets up a change address where the rest of the funds will go
            .fee(10000)
            .sign(privateKey.toString());
          const result = await dapiClient.sendRawTransaction(transaction.serialize());
          await dapiClient.generate(1);
          await wait(1000);

        }
        const utxo = await dapiClient.getUTXO(faucetAddress);
        expect(utxo.items).to.have.lengthOf(991);
      });

      it('should sendRawTransaction with array of inputs', async function it() {
        this.timeout(50000);
        const bobUserName = Math.random().toString(36).substring(7);
        const bobPrivateKey = new PrivateKey();
        const validPayload = new Transaction.Payload.SubTxRegisterPayload()
          .setUserName(bobUserName)
          .setPubKeyIdFromPrivateKey(bobPrivateKey).sign(bobPrivateKey);

        let inputs = await dapiClient.getUTXO(faucetAddress);

        var transaction = Transaction()
          .setType(Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
          .setExtraPayload(validPayload)
          .from(inputs.items.slice(-15))
          .addFundingOutput(1000000)
          .change(faucetAddress)
          .sign(faucetPrivateKey);
        // we can't send trxs with last 15 inputs
        await expect(dapiClient.sendRawTransaction(transaction.serialize())).to.be.rejectedWith('rate limited free transaction');

        var transaction = Transaction()
          .setType(Transaction.TYPES.TRANSACTION_SUBTX_REGISTER)
          .setExtraPayload(validPayload)
          .from(inputs.items.slice(-10))
          .addFundingOutput(1000000)
          .change(faucetAddress)
          .sign(faucetPrivateKey);
        // and everything is fine with 10 last trxs
        const result = await dapiClient.sendRawTransaction(transaction.serialize());

        expect(result).to.be.a('string');
        expect(result).to.be.not.empty();
        bobRegTxId = result;

        bobPreviousST = result;

        //now we verify that getUTXO.items not empty when no new block generated
        const utxo = await dapiClient.getUTXO(faucetAddress);
        console.log(utxo);
        expect(utxo).to.have.property('items');
        expect(utxo.items).to.have.lengthOf(991);

      });

      it('should getUTXO by address 0', async function it() {
        // when we generate new block getUTXO is not empty again!
        await dapiClient.generate(1);
        const from = 0;
        const utxo = await dapiClient.getUTXO(faucetAddress, from);

        expect(spy.callCount).to.be.equal(1);

        expect(utxo.items).to.have.lengthOf(991);
      });

      it('should getUTXO by address 1000', async function it() {
        const from = 1000;
        const utxo = await dapiClient.getUTXO(faucetAddress, from);

        expect(spy.callCount).to.be.equal(1);
        expect(utxo.items).to.have.lengthOf(0);
      });

      it('should getUTXO with params: 1 0 2000 2000', async function it() {
        const from = 1;
        const to = 0;
        fromHeight = 2000;
        toHeight = 2000;
        const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

        expect(spy.callCount).to.be.equal(1);
        expect(utxo.items).to.have.lengthOf(530);
      });

      it('should getUTXO with params: 0 100 1 3000', async function it() {
        const from = 0;
        const to = 100;
        fromHeight = 1;
        toHeight = 3000;
        const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

        expect(spy.callCount).to.be.equal(1);
        expect(utxo.items).to.have.lengthOf(100);
      });

      it('should getUTXO with params: 500 1000 1500 3000', async function it() {
        const from = 500;
        const to = 1000;
        fromHeight = 1500;
        toHeight = 3000;
        const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

        expect(spy.callCount).to.be.equal(1);
        expect(utxo.items).to.have.lengthOf(491);
      });

      it('should getUTXO with params: 0 0 2000 3000', async function it() {
        const from = 0;
        const to = 0;
        fromHeight = 2000;
        toHeight = 3000;
        const utxo = await dapiClient.getUTXO(faucetAddress, from, to, fromHeight, toHeight);

        expect(spy.callCount).to.be.equal(1);
        expect(utxo.items).to.have.lengthOf(531);
      });

      it('should getTransactionsByAddress with params: 0', async function it() {
        const from = 0;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(10);
      });

      it('should getTransactionsByAddress with params: 1000', async function it() {
        const from = 1000;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(0);
      });

      it('should getTransactionsByAddress with params: 1 0 2000 2000', async function it() {
        const from = 1;
        const to = 0;
        fromHeight = 2000;
        toHeight = 2000;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(0);
      });

      it('should getTransactionsByAddress with params: 0 100 1 3000', async function it() {//TODO: internal error
        const from = 0;
        const to = 100;
        fromHeight = 1;
        toHeight = 3000;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(100);
      });

      it('should getTransactionsByAddress with params: 500 1000 1500 3000', async function it() {//TODO: internal error
        const from = 500;
        const to = 1000;
        fromHeight = 1500;
        toHeight = 3000;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(491);
      });

      it('should getTransactionsByAddress with params: 0 0 2000 3000', async function it() {
        const from = 0;
        const to = 0;
        fromHeight = 2000;
        toHeight = 3000;
        const transactionsByAddress = await dapiClient.getTransactionsByAddress(faucetAddress, from, to, fromHeight, toHeight);

        expect(spyGetTransactionsByAddress.callCount).to.be.equal(1);
        expect(transactionsByAddress.items).to.have.lengthOf(0);
      });

    });

  });

});
