function getProofFixture() {
  return {
    signatureLLMQHash: Buffer.from('AQEBAQEBAQEBAQEB', 'base64'),
    signature: Buffer.from('AgICAgICAgICAgIC', 'base64'),
    rootTreeProof: Buffer.from('0100000001f0faf5f55674905a68eba1be2f946e667c1cb5010101', 'hex'),
    storeTreeProof: Buffer.from('03046b657931060076616c75653103046b657932060076616c75653210', 'hex'),
  };
}

module.exports = getProofFixture;
