const DAPIAddress = require('../../../lib/addressProvider/DAPIAddress');
const DAPIAddressHostMissingError = require(
  '../../../lib/addressProvider/errors/DAPIAddressHostMissingError',
);

describe('DAPIAddress', () => {
  let dapiAddress;

  describe('#constructor', () => {
    let host;

    beforeEach(() => {
      host = '127.0.0.1';
    });

    it('should construct DAPIAddress from host', () => {
      dapiAddress = new DAPIAddress(host);

      expect(dapiAddress).to.be.an.instanceOf(DAPIAddress);
      expect(dapiAddress.host).to.equal(host);
      expect(dapiAddress.httpPort).to.equal(DAPIAddress.DEFAULT_HTTP_PORT);
      expect(dapiAddress.grpcPort).to.equal(DAPIAddress.DEFAULT_GRPC_PORT);
      expect(dapiAddress.proRegTxHash).to.be.undefined();
      expect(dapiAddress.banCount).to.equal(0);
      expect(dapiAddress.banStartTime).to.be.undefined();
    });

    it('should construct DAPIAddress from DAPIAddress', () => {
      const address = new DAPIAddress(host);

      dapiAddress = new DAPIAddress(address);

      expect(dapiAddress).to.be.an.instanceOf(DAPIAddress);
      expect(dapiAddress.toJSON()).to.deep.equal(address.toJSON());
    });

    it('should construct DAPIAddress form RawDAPIAddress', () => {
      const rawDAPIAddress = new DAPIAddress(host).toJSON();

      dapiAddress = new DAPIAddress(rawDAPIAddress);

      expect(dapiAddress).to.be.an.instanceOf(DAPIAddress);
      expect(dapiAddress.host).to.equal(host);
      expect(dapiAddress.httpPort).to.equal(DAPIAddress.DEFAULT_HTTP_PORT);
      expect(dapiAddress.grpcPort).to.equal(DAPIAddress.DEFAULT_GRPC_PORT);
      expect(dapiAddress.proRegTxHash).to.be.undefined();
      expect(dapiAddress.banCount).to.equal(0);
      expect(dapiAddress.banStartTime).to.be.undefined();
    });

    it('should construct DAPIAddress with defined ports', () => {
      const httpPort = DAPIAddress.DEFAULT_HTTP_PORT + 1;
      const grpcPort = DAPIAddress.DEFAULT_GRPC_PORT + 1;
      const proRegTxHash = 'proRegTxHash';

      dapiAddress = new DAPIAddress({
        host,
        httpPort,
        grpcPort,
        proRegTxHash,
        banCount: 100,
        banStartTime: 1000,
      });

      expect(dapiAddress).to.be.an.instanceOf(DAPIAddress);
      expect(dapiAddress.host).to.equal(host);
      expect(dapiAddress.httpPort).to.equal(httpPort);
      expect(dapiAddress.grpcPort).to.equal(grpcPort);
      expect(dapiAddress.proRegTxHash).to.equal(proRegTxHash);
      expect(dapiAddress.banCount).to.equal(0);
      expect(dapiAddress.banStartTime).to.be.undefined();
      expect(dapiAddress.toJSON()).to.deep.equal({
        grpcPort,
        host,
        httpPort,
        proRegTxHash,
      });
    });

    it('should throw DAPIAddressHostMissingError if host is missed', () => {
      try {
        dapiAddress = new DAPIAddress('');

        expect.fail('should throw DAPIAddressHostMissingError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(DAPIAddressHostMissingError);
      }
    });
  });

  describe('#getHost', () => {
    it('should return host', () => {
      const host = '127.0.0.1';

      dapiAddress = new DAPIAddress(host);

      expect(dapiAddress.getHost()).to.equal(host);
    });
  });

  describe('#setHost', () => {
    it('should set host', () => {
      const host = '192.168.1.1';

      dapiAddress = new DAPIAddress('127.0.0.1');
      dapiAddress.setHost(host);

      expect(dapiAddress.host).to.equal(host);
    });
  });

  describe('#getHttpPort', () => {
    it('should get HTTP port', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');

      expect(dapiAddress.getHttpPort()).to.equal(dapiAddress.httpPort);
      expect(dapiAddress.getHttpPort()).to.equal(DAPIAddress.DEFAULT_HTTP_PORT);
    });
  });

  describe('#setHttpPort', () => {
    it('should set HTTP port', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');

      const port = dapiAddress.getHttpPort() + 1;
      dapiAddress.setHttpPort(port);

      expect(dapiAddress.getHttpPort()).to.equal(port);
      expect(dapiAddress.getGrpcPort()).to.equal(DAPIAddress.DEFAULT_GRPC_PORT);
    });
  });

  describe('#getGrpcPort', () => {
    it('should get GRPC port', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');

      expect(dapiAddress.getGrpcPort()).to.equal(DAPIAddress.DEFAULT_GRPC_PORT);
    });
  });

  describe('#setGrpcPort', () => {
    it('should set GRPC port', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');

      const port = dapiAddress.getGrpcPort() + 1;
      dapiAddress.setGrpcPort(port);

      expect(dapiAddress.getGrpcPort()).to.equal(port);
    });
  });

  describe('#getProRegTxHash', () => {
    it('should get ProRegTxHash', () => {
      const proRegTxHash = 'proRegTxHash';
      dapiAddress = new DAPIAddress({
        host: '127.0.0.1',
        proRegTxHash,
      });

      expect(dapiAddress.getProRegTxHash()).to.equal(proRegTxHash);
    });
  });

  describe('#getBanStartTime', () => {
    it('should get ban start time', () => {
      const now = Date.now();
      dapiAddress = new DAPIAddress('127.0.0.1');
      dapiAddress.banStartTime = now;

      const banStartTime = dapiAddress.getBanStartTime();
      expect(banStartTime).to.equal(now);
    });
  });

  describe('#getBanCount', () => {
    it('should get ban count', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');
      dapiAddress.banCount = 666;

      const banCount = dapiAddress.getBanCount();
      expect(banCount).to.equal(666);
    });
  });

  describe('#markAsBanned', () => {
    it('should mark address as banned', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');
      dapiAddress.markAsBanned();

      expect(dapiAddress.banCount).to.equal(1);
      expect(dapiAddress.banStartTime).to.be.greaterThan(0);
    });
  });

  describe('#markAsLive', () => {
    it('should mark address as live', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');
      dapiAddress.banCount = 1;
      dapiAddress.banStartTime = Date.now();

      dapiAddress.markAsLive();

      expect(dapiAddress.banCount).to.equal(0);
      expect(dapiAddress.banStartTime).to.be.undefined();
    });
  });

  describe('#isBanned', () => {
    beforeEach(() => {
      dapiAddress = new DAPIAddress('127.0.0.1');
    });

    it('should return true if address is banned', () => {
      dapiAddress.banCount = 1;

      const isBanned = dapiAddress.isBanned();
      expect(isBanned).to.be.true();
    });

    it('should return false if address is not banned', () => {
      const isBanned = dapiAddress.isBanned();
      expect(isBanned).to.be.false();
    });
  });

  describe('#toJSON', () => {
    it('should return RawDAPIAddress', () => {
      dapiAddress = new DAPIAddress('127.0.0.1');
      const rawDAPIAddress = dapiAddress.toJSON();

      expect(rawDAPIAddress.host).to.equal(dapiAddress.getHost());
      expect(rawDAPIAddress.httpPort).to.equal(dapiAddress.getHttpPort());
      expect(rawDAPIAddress.grpcPort).to.equal(dapiAddress.getGrpcPort());
      expect(rawDAPIAddress.proRegTxHash).to.equal(dapiAddress.getProRegTxHash());
    });
  });
});
