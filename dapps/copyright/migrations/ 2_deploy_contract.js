const copyright = artifacts.require("Copyright");

module.exports = function(deployer){
  deployer.deploy(copyright);
}