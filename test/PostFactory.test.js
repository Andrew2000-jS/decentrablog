const PostFactory = artifacts.require("PostFactory");
const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

contract("PostFactory", (accounts) => {
  let [alice, bob] = accounts;
  before(async function () {
    this.postFactory = await PostFactory.deployed();
  });

  describe("Deployment", async () => {
    xit("migrate deployed successfully", async function () {
      const address = this.postFactory.address;
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(0x0);
      expect(address).to.not.equal(undefined);
      expect(address).to.not.equal("");
    });
  });

  describe("Features", async () => {
    xit("Should can get all posts", async function () {
      await this.postFactory.createPost("test description");
      await this.postFactory.createPost("test description 2");
      await this.postFactory.createPost("test description 3");

      const postArr = await this.postFactory.getPostAll();

      expect(postArr.length).to.equal(3);
      expect(postArr[0].description).to.equal("test description");
      expect(postArr[1].description).to.equal("test description 2");
      expect(postArr[2].description).to.equal("test description 3");
    });

    xit("Should can create a post", async function () {
      const createPost = await this.postFactory.createPost("test description", {
        from: alice,
      });
      const posts = await this.postFactory.posts(1);

      expect(createPost.logs[0].event).to.equal("CreatedPost");
      expect(createPost.logs[0].args[0]).to.equal("test description");
      expect(createPost.logs[0].args[1].toNumber()).to.equal(1);
      expect(createPost.logs[0].args[2]).to.equal(alice);

      //check posts mapping
      expect(posts.description).to.equal("test description");
      expect(posts.id.toNumber()).to.equal(1);
      expect(posts.owner).to.equal(alice);
    });

    xit("Should can update a post", async function () {
      const createPost = await this.postFactory.createPost(
        "I want to be udpate",
        { from: bob }
      );

      expect(createPost.logs[0].args[0]).to.equal("I want to be udpate");

      const updatePost = await this.postFactory.updatePost(1, "Updated task");
      expect(updatePost.logs[0].event).to.equal("UpdatedPost");
      expect(updatePost.logs[0].args[1]).to.equal("Updated task");
    });

    xit("Should can delete a post", async function () {
      await this.postFactory.createPost("test description");

      const deletePost = await this.postFactory.deletePost(1);

      expect(deletePost.logs[0].event).to.equal("DeletedPost");
      expect(deletePost.logs[0].args[1]).to.equal("Deleted successfully");
    });

    xit("Should can mint a nft", async function () {
      await this.postFactory.mint("SampleURI", 5, { from: bob });

      const tokenCount = await this.postFactory.tokenCount();
      const postOwnersBob = await this.postFactory.postOwners(bob);
      const postOwnersAlice = await this.postFactory.postOwners(alice);
      const profile = await this.postFactory.profile(1);

      expect(tokenCount.toNumber()).to.equal(1);
      expect(postOwnersBob.toNumber()).to.equal(1);
      expect(profile.owner).to.equal(bob);
      expect(profile.id.toNumber()).to.equal(1);
      expect(profile.price.toNumber()).to.equal(5);

      expect(postOwnersAlice.toNumber()).to.equal(0);
    });

    xit("Should can get all nfts", async function () {
      await this.postFactory.mint("SampleURI", 20, { from: bob });
      await this.postFactory.mint("SampleURI", 15, { from: alice });

      const getNFTS = await this.postFactory.getAllNfts();
      const [nft1, nft2] = getNFTS;

      expect(getNFTS.length).to.equal(2);

      expect(Number(nft1.id)).to.equal(1);
      expect(nft1.owner).to.equal(bob);
      expect(Number(nft1.price)).to.equal(20);

      expect(Number(nft2.id)).to.equal(2);
      expect(nft2.owner).to.equal(alice);
      expect(Number(nft2.price)).to.equal(15);
    });
  });

  describe("failure cases", async () => {
    xit("Should not be able to create a post", async function () {
      await expect(this.postFactory.createPost("")).to.be.revertedWith(
        "Please enter a valid description"
      );
    });

    it("Should not be able to update a post", async function () {
      const post = await this.postFactory.createPost("Test");

      await expect(this.postFactory.updatePost(1, "")).to.be.revertedWith(
        "Please enter a valid description"
      );
      // should keep the same title
      expect(post.logs[0].args[0]).to.equal("Test");
    });
  });
});
