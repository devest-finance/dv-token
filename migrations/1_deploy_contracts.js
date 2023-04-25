const DvToken = artifacts.require("DvToken");
const DvTokenFactory = artifacts.require("DvTokenFactory");

module.exports = function(deployer) {
  if (deployer.network === 'development') {
      deployer.deploy(DvTokenFactory)
          .then(() => DvTokenFactory.deployed())
          .then(async _instance => {
                await _instance.setFee(1000000000);
          });
  } else if(deployer.network == "testnet") {
      deployer.deploy(DvTokenFactory)
          .then(() => DvTokenFactory.deployed())
          .then(async _instance => {
              await _instance.setFee(1000000000);
          });
  }
};
