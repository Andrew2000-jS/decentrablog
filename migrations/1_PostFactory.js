const PostFactory = artifacts.require("PostFactory");

module.exports = function (deployer) {
  deployer.deploy(PostFactory);
};
