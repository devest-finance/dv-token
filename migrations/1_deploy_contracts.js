const DvToken = artifacts.require("DvToken");
const DvTokenFactory = artifacts.require("DvTokenFactory");

module.exports = function(deployer) {
  if (deployer.network === 'development') {
      deployer.deploy(DvTokenFactory)
          .then(() => DvTokenFactory.deployed())
          .then(async _instance => {
                await _instance.setFee(10000000, 1000000000);
          });
  } else {
      deployer.deploy(DvTokenFactory)
          .then(() => DvTokenFactory.deployed())
          .then(async _instance => {
              await _instance.setFee(10000000, 10000000);
          });
  }
};
