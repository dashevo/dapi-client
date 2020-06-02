function getSecondMNListDiffFixture() {
  return {
    baseBlockHash: '000000000b0339e07bce8b3186a6a57a3c45d10e16c4bce18ef81b667bc822b2',
    blockHash: '0000000005b3f97e0af8c72f9a96eca720237e374ca860938ba0d7a68471c4d6',
    cbTxMerkleTree: '0200000002c9802d02435cfe09e4253bc1ba4875e9a2f920d5d6adf005d5b9306e5322e6f476d885273422c2fe18e8c420d09484f89eaeee7bb7f4e1ff54bddeb94e099a910103',
    cbTx: '03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff4b02204e047867335c08fabe6d6d8b2b76b7000000000470393f63424273736170747365743a7265737574736574010000000000000010000015770000000d2f6e6f64655374726174756d2f000000000336c8a119010000001976a914cb594917ad4e5849688ec63f29a0f7f3badb5da688ac6c62c216010000001976a914a3c5284d3cd896815ac815f2dd76a3a71cb3d8e688acba65df02000000001976a9146d649e1c05e89d30809ef39cc8ee1002c0c8c84b88ac00000000260100204e0000b301c3d88e4072305bec5d09e2ed6b836b23af640bcdefd7b8ae7e2ca182dc17',
    deletedMNs: [
      '5bd32dd06449e0e3b8dbb80966d7fd85dc17fdaa20564bd48e8a326083e7bd0d',
    ],
    mnList: [
      {
        proRegTxHash: 'f487b2b02c554816bb44cfc35fed083951ff94a3ecb5ccacb578986615cbfdd8',
        confirmedHash: '00000000041f86bfb8c2e5c4f166686f73f4930e4b6f1b9a8feb8480890ba724',
        service: '173.61.30.231:19007',
        pubKeyOperator: '07f818e5c2330ac4e7f0ef820f337addf8ab28b07c9d451304d807feda1d764c7074bccbbd941284b0d0276a96cf5e7f',
        votingAddress: 'ySXL8BpEMVjFR6sNEbR1LGPuHfCbaWYmBJ',
        isValid: true,
      },
      {
        proRegTxHash: 'fef106ff6420f9c6638c9676988a8fc655750caafb506c98cb5ff3d4fea99a41',
        confirmedHash: '0000000005d5635228f113b50fb5ad66995a7476ed20374e6e159f1f9e62347b',
        service: '45.48.177.222:19999',
        pubKeyOperator: '842476e8d82327adfb9b617a7ac3f62868946c0c4b6b0e365747cfb8825b8b79ba0eb1fa62e8583ae7102f59bf70c7c7',
        votingAddress: 'yf7QHemCfbmKEncwZxroTj8JtShXsC28V6',
        isValid: false,
      },
      {
        proRegTxHash: '682b3e58e283081c51f2e8e7a7de5c7312a2e8074affaf389fafcc39c4805404',
        confirmedHash: '00000018c824355520c6a850076c041b533d05cbe481f8187e541d7e2f856def',
        service: '64.193.62.206:19999',
        pubKeyOperator: '05f2269374676476f00068b7cb168d124b7b780a92e8564e18edf45d77497abd9debf186ee98001a0c9a6dfccbab7a0a',
        votingAddress: 'yid7uAsVJzvSLrEekHuGNuY3KWCqJopyJ8',
        isValid: false,
      },
      {
        proRegTxHash: 'dcf13b43b5bbb0b4600e513af574da87f2e923c91e1afc017b1ae954e82f84c4',
        confirmedHash: '0000001ffaa9dcfa755922d7715dc62dab33950dca2d62781b9d8f27bfa141dd',
        service: '159.65.233.52:19999',
        pubKeyOperator: '15e97fb8029420a71f7125cbf963696c3fbf9636f6d2fa8997d35d37416e2c837182f2e7b7623498736253e5469eb894',
        votingAddress: 'ycd2G5zUax8hSkCJ136SGw1WCy6V3jrgEB',
        isValid: false,
      },
      {
        proRegTxHash: '05f876be752ae6461ff137383280810a4f2f1a6c28c70316b4723d1db0ea3367',
        confirmedHash: '000000000d8fafe0cb68fd608a02c0cbf25518aa5ebd3956183d457a9f398ce9',
        service: '173.61.30.231:19024',
        pubKeyOperator: '89d9a3588ad0e5c40d8b1349e0e14aa74caf107f396208be015aa7d489db50f7e029b721350dbf480271580d293dbedc',
        votingAddress: 'yeMCt9pipuFNULnn6vVXURK3iSiF6LsDVH',
        isValid: true,
      },
      {
        proRegTxHash: 'a4d877cee62f82868034fb678436d87afbb13330d2b66a24ae1d357f0de55c68',
        confirmedHash: '00000000069c41d7444a7da5d67f222224e9e37590c474f102ee1ae0da998f39',
        service: '83.80.229.213:19999',
        pubKeyOperator: '16415af54406658be9ea44d82b6b502bb90d93e32997484533a8a71a4ed98d12cea3709d84a5835b6ad8ed48d3101633',
        votingAddress: 'yfKNLE5v4QTnMvj7y3JVoWEfQanD4qHWGk',
        isValid: true,
      },
      {
        proRegTxHash: 'e6218b98482d5533f37cb384b9403ad482163bc76c783ac290d78a5fb54573e8',
        confirmedHash: '000000001a4cfc8b64b92e78b3c3145ba9003dffdc0beadd36d1d4b45184800d',
        service: '173.61.30.231:19020',
        pubKeyOperator: '18f5940d64ab6139b8294268b11d21389ce73ece968df32f681905bb37b154c8a6a678aae4fbeac06e7182319650436d',
        votingAddress: 'yMXa6jvp56ExjgKgs2tQm8Dm4LcppzPtvG',
        isValid: true,
      },
      {
        proRegTxHash: 'ee870538e2c265e7c53af7f94934fdef16cc8016c2f36a1f266541cba96a1049',
        confirmedHash: '000000000ca732b4a97c3ef8a8d567c96d0385e2f80b9f2268e8a0bd271b84f9',
        service: '43.229.77.46:19999',
        pubKeyOperator: '8de69524dd60930aacf252a19e34e5928dbb20144d1f336a45dd4248acdcbcafa929619913980156defa1113d1481139',
        votingAddress: 'yUVxd8VafRftExWmz12oHUxrfB1kmZuaMe',
        isValid: false,
      },
      {
        proRegTxHash: '41d50ce2fd17b88cad6d84b757772b41f0d52600b941baf171ff18caf67f2989',
        confirmedHash: '00000000128fdb86bafb841c97fb21b7db7e61e53d14f168b1b88de65273b608',
        service: '217.61.221.9:20002',
        pubKeyOperator: '05e4d38cc8f31076eef71fe3bdbcf5bc8e956188603e53a12943476fba7a40d6909b75510cff435314a39e3605ed1082',
        votingAddress: 'yMxcAcHc1yZVo5sjWDcZEmMV311TzFEG9E',
        isValid: false,
      },
      {
        proRegTxHash: 'e157a38e02aad5da99fa7792d07eb8b773ccfef9084d892580b5a920741d72ea',
        confirmedHash: '0000000bf6f060f5ad57947c355f8ffc9df1563ac2698a5ddea6c2c605cef576',
        service: '173.61.30.231:19014',
        pubKeyOperator: '983ca9ab507b3eb4e7b0d31ccef3f4553493ee5334116a3f79689f9b808a201ead332a26f7052fd17123cf142f96d85f',
        votingAddress: 'yeLNezEUhMaBEp4Y3qiGwhphJbz244UQsT',
        isValid: true,
      },
      {
        proRegTxHash: '1659e06c825212c9b11325760a18f6ea06194ec4efd603f03d8704f23d818a6f',
        confirmedHash: '000000000ca93e850827b361743c25c8508e6e42efaaa331cc1b54326d9fd179',
        service: '[0:0:0:0:0:0:0:0]:0',
        pubKeyOperator: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        votingAddress: 'yUTy9Fb2ULXdgyqYtMMbuUWpFLaDgUqT3f',
        isValid: false,
      },
      {
        proRegTxHash: '1a3b5e4d4e06cc89b26ef6e4b962831ede8e3e6c7ceb0ea5de58f6c392aff3cf',
        confirmedHash: '000000000be653cd1fbc213239cfec83ca68da657f24cc05305d0be75d34e392',
        service: '173.61.30.231:19022',
        pubKeyOperator: '18da04cb7eea7cb37741ac7c104ba757a2c23fce5903559685747e7a709451ed6bf71f5cc7a3f97a2c25d70c6e7f7cfe',
        votingAddress: 'yViWUmv32CiYmf4CG8oY5PymnvhL4tJ9H3',
        isValid: true,
      },
      {
        proRegTxHash: '5d40e68f65e7263d91e114b644ff7f8c9c376db63550d5ef9bc4228870c4f053',
        confirmedHash: '00000000077bd01073605cc5956a9ee883f8c47c8c7a337ecbd14ec5aa91e294',
        service: '173.61.30.231:19002',
        pubKeyOperator: '98b26368c5f73198500cae0d7e1108833489e7f8bc5d7fa507014fdd0ad2b6a082012883a8acdbcf688423419bff7e24',
        votingAddress: 'yecoEzHhCDtFmqFx6UTbAk8kTWZDGxmXBb',
        isValid: true,
      },
      {
        proRegTxHash: 'e6986bb24b729ab531ba778bc7292a0a8abbf66b5996f45ca6a1dcbd5e46e0b3',
        confirmedHash: '0000000004995804891a4c2c54dad4f684135f6b626979777839de454c8610bb',
        service: '173.61.30.231:19021',
        pubKeyOperator: '0e9df826d2152e0ceffbab634e6f7daf62ec82f6764ed792ecb94272917d321590f6c1224590b77c04bd836217623ca1',
        votingAddress: 'yeBTHcCumHPMSMKCtYE6qLNf8Ca3ssVSui',
        isValid: true,
      },
      {
        proRegTxHash: '27a6ff2f188c6190d44b657f54bd831f57228f918cbb7fd6026f5cf5c443d496',
        confirmedHash: '00000000077bd01073605cc5956a9ee883f8c47c8c7a337ecbd14ec5aa91e294',
        service: '173.61.30.231:19003',
        pubKeyOperator: '110bdff9037c3e3926082ff9e9e9de9cd0a0dd416ac6d60a61781f1b3832a4bd068e92343be400fc31db6eb4404d0701',
        votingAddress: 'yjW7bQrKBsMV8Wh19LgT8Z1uLkWY8P2EBd',
        isValid: true,
      },
      {
        proRegTxHash: '08e238ac320bc472aa664b99280663cb39073f189b0ce290a2cb11bbd80c41d6',
        confirmedHash: '0000004c7bba7e46b583731f0930c9a3b0033e268f87bccf9a5e44793d634a5a',
        service: '52.50.208.53:20029',
        pubKeyOperator: '10c0a1cc322597069f80ea22c04c4e5a442fff97ae4ec952a91eff9d8d9787760f20a227b1ada2025a6e9d74146e4467',
        votingAddress: 'yTr8Ti4Gh16DHPfGNztzZ9Vhxu7tPnk7oM',
        isValid: true,
      },
      {
        proRegTxHash: '3a8738860323ed3868f0e4a26d852bbea4feb3850674e5ca1c27fa15d0b707b6',
        confirmedHash: '00000024f9d5cd5a0b26d87d0eb18d41801e08d2676a2c07ce833c35fa9dc084',
        service: '95.183.51.146:60000',
        pubKeyOperator: '8851d988149766aaaafca285ded50de031ce42036033e3239f4f903abda26740ba235e22d26a693136a5ac27555f3de8',
        votingAddress: 'yjUGNWwa87BKPy7nztcpcZkxRaT4xt6Xzo',
        isValid: true,
      },
      {
        proRegTxHash: '76476a2678d5c1e9ea4951cdd00babd50f6c53f91427ba8dc8fe49f5dc1f5c97',
        confirmedHash: '000000001087611a48b9237c0db4a849c5afcdc3aa7009a1cbc6058a1b4520bc',
        service: '52.220.61.88:19999',
        pubKeyOperator: '10142d44041c90621d111283fe46fd8b2450d4b9bebad194290fce09ba080679c748b1ba70e3959623f127af0d2bc9c4',
        votingAddress: 'yWLN8dwGS8SxndBEW7Hwvn2yAD7hULTojP',
        isValid: true,
      },
      {
        proRegTxHash: '7504ff244e65de04c91640380c0c996f1f5b09073a8eb387ceba1a3c1ba18ff7',
        confirmedHash: '00000000061771e19a1adc5b3f48507cc92b65257c0f6fb6e918c0336b261456',
        service: '173.61.30.231:19004',
        pubKeyOperator: '1249d9527e8ccf8d237e828500cf7f8946963d45264460586ffd8fb1b76e16a541c54695089fbcf4b1b8e1ec79e93a70',
        votingAddress: 'yYaSqRGYcWdkv2UCBAE4W4wV4rTFTmwz7p',
        isValid: true,
      },
      {
        proRegTxHash: '67491f0cb0874d179d8ece6f3ff25f721b2eb016ab5768bfabdc5e6ca614aaf9',
        confirmedHash: '000000001f25c0f6c1535ab47211b21185409c6af85df7a82e798e1ca00ed742',
        service: '91.190.125.133:19999',
        pubKeyOperator: '91e633b72726091f58e3bd1ede3a21de66abb2456c2f669be8bdcf76f3ab76aa2d75f7d03cf2f7d5761ab15e62e00613',
        votingAddress: 'ygbXcRv8sqYJ3DcEkyRwTmZuFaKwmHTTEo',
        isValid: true,
      },
      {
        proRegTxHash: 'be32ec53dbbfb64e5ba29e25e3716f6f4024291914ce4c858cd69f0b4e371dda',
        confirmedHash: '0000000015717296254a7c6139a50c34ad481dc8fdf7b0ea4c8320dc3fff2759',
        service: '173.61.30.231:19025',
        pubKeyOperator: '00e38851ac0f784f3ec5cf15e00276bb541918596a657a4f67568a5c33361a655e5baefe0fb22e0affe37e95987670b9',
        votingAddress: 'ySBU7oXuuTSJqtmUArMRFsKefJPtEDkESG',
        isValid: true,
      },
      {
        proRegTxHash: 'b470614a1a43f69910fb26429d1e4f2465f28bad7a5e409987ee748ac35e3f1a',
        confirmedHash: '0000000ae0cd2a094068ba7ffb6ef20242b08b748ffbb517ebd56fc77680ef78',
        service: '52.50.208.53:20049',
        pubKeyOperator: '93fcd68988f82faf350938dd57cc7449a669eb9b0d5095c24b0c6e61a04dc7408acc1909d79809da0a909f7f15d24411',
        votingAddress: 'yPTb1MFjyb5tryAoKdCjZgFd6rCapfYMGg',
        isValid: true,
      },
      {
        proRegTxHash: '400c7f8990e6f8a3993b7d5900ea0b58e18bf86ba9b147bdefcd0df4cda1887b',
        confirmedHash: '000000000613ea19d2c5a0d6bbf861eebcba6c56b2e32c25306c30589906e8f3',
        service: '89.17.41.106:19999',
        pubKeyOperator: '848bfbe1bf50debe1322e14c9115adb3b96e5b8a3ae96beb7e2161281d9e56c30e43478d6f39835e3533a1c54377258b',
        votingAddress: 'yWjnrJQzvgfVPPQJkRu4NUPue2CiKe8kSD',
        isValid: true,
      },
      {
        proRegTxHash: '3667fe83d6c334eae930252ca9bdd22d3eed1aee1c3b5b40d7244b98bea2c77b',
        confirmedHash: '000000000882cafe55ba050f6d84cb7095ceea8056d5dc0c004b2997cc02d605',
        service: '173.61.30.231:19006',
        pubKeyOperator: '8b6159beec3c3c1ba223fa988b5806a02edebcd16869a2e053b41b7db3e28f12136636974f5333317fc67a22d2b9b3db',
        votingAddress: 'yYmWHHP4i812Lyj8PWT6FsuL6yikkH7hYC',
        isValid: true,
      },
      {
        proRegTxHash: '95e048c6e09dd0367006df0dfe9737d69800526869590dc8acbc96fb94332c9c',
        confirmedHash: '000000000882cafe55ba050f6d84cb7095ceea8056d5dc0c004b2997cc02d605',
        service: '173.61.30.231:19005',
        pubKeyOperator: '182ece65d7aef6b0d0a92c0e3451609607717f9cdb6d11cc6e31a2d625c7f40a8cace522b036481daf4e4425c41880a5',
        votingAddress: 'ySfnordUG2758rcRfMz1328rmvzSUStEbe',
        isValid: true,
      },
      {
        proRegTxHash: 'fb770587665b18dfb3fc196bf6f9d628a298f8b40a588e2ea9d56fc3760567dc',
        confirmedHash: '0000004c7bba7e46b583731f0930c9a3b0033e268f87bccf9a5e44793d634a5a',
        service: '18.202.52.170:20040',
        pubKeyOperator: '80f5458a1d7ae69cb8dbc6b7d69ac112e008bf34a985eb86cd973824023d8705cd02e2392f3c7682c3a9fac2a6c4ef48',
        votingAddress: 'ySUfzAHxS8NAhCQFwd745zzWC31UTYUBmF',
        isValid: true,
      },
      {
        proRegTxHash: '2523dc6e034911b9004862e87b4d23a32ed6198aec177915df7893f51cd645bd',
        confirmedHash: '000000000af78a45a0f04dec1b921497c682440927d76f9129fd29412f4d7815',
        service: '140.82.59.51:10006',
        pubKeyOperator: '8ce516fa5d72f29e08d842812ef5cf72de3672c23d6dc88f4b13f0a50c2b8050d0cee348b6d542ceb569a45504e73499',
        votingAddress: 'yXiktt3kkmpfSvPGkKvAy4Qpjm8aJKea6D',
        isValid: true,
      },
      {
        proRegTxHash: '50a5733b8430461139765ed886b998258bcca5a9df528e069d313e289df6a05e',
        confirmedHash: '00000000077bd01073605cc5956a9ee883f8c47c8c7a337ecbd14ec5aa91e294',
        service: '173.61.30.231:19001',
        pubKeyOperator: '0418bfc9d8225bae5a889f1f74d47d539e9e7a8d441cb2b743b176e9d3a7ea4915fb40844cdb53a6faebdb4e826f9f78',
        votingAddress: 'yPJh4D1sLdbXZG6Qu1X66FdNsu2qoBQ7Mz',
        isValid: true,
      },
      {
        proRegTxHash: '6f0bdd7034ce8d3a6976a15e4b4442c274b5c1739fb63fc0a50f01425580e17e',
        confirmedHash: '000000000be653cd1fbc213239cfec83ca68da657f24cc05305d0be75d34e392',
        service: '173.61.30.231:19023',
        pubKeyOperator: '8da7ee1a40750868badef2c17d5385480cae7543f8d4d6e5f3c85b37fdd00a6b4f47726b96e7e7c7a3ea68b5d5cb2196',
        votingAddress: 'ybGQ7a6e7dkJY2jxdbDwdBtyjKZJ8VB7YC',
        isValid: true,
      },
      {
        proRegTxHash: '14d924611e20307338c0937ad746226c0b50b01d47824c9ef08e141cc4635c9f',
        confirmedHash: '000000000a1f3feaedf99baf968948ca14a153c010f7c9ff81540e74d1cbd214',
        service: '178.62.203.249:29999',
        pubKeyOperator: '12e0312b6ee98f2ef8b3ceceacb9af3ca00346d2f6bf5b710ee06f51a0bce5b7caf5f76bd867b95c10b4279dff9aa74e',
        votingAddress: 'yMMe9BPZ711sSqW5CdK8VRTW1RWqcmS7K6',
        isValid: false,
      },
    ],
    merkleRootMNList: '17dc82a12c7eaeb8d7efcd0b64af236b836bede2095dec5b3072408ed8c301b3',
  };
}

module.exports = getSecondMNListDiffFixture;