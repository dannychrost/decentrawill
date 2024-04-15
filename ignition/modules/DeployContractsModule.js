const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

// npx hardhat ignition deploy ignition/modules/DeployContractsModule.js --network localhost

module.exports = buildModule('DeployContractsModule', (m) => {
  const mockUSDC = m.contract('MockUSDC', []);
  const mockWETH = m.contract('MockWETH', []);
  const decentraWill = m.contract('DecentraWill', []);

  return { mockUSDC, mockWETH, decentraWill };
});
