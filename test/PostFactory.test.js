const PostFactory = artifacts.require("PostFactory");

contract("PostFactory", () => {
  before(async function () {
    this.postFactory = await PostFactory.deployed();
  });

  describe("Deployment", async () => {
    it("migrate deployed successfully", async function () {
      const address = this.postFactory.address;
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, undefined);
      assert.notEqual(address, "");
    });
  });

  describe("Actions", async () => {
    it("Should can create a post", async function () {
      const address = "0x9460F9fd096031C833e51f9632361eC606224169";

      const createPost = await this.postFactory.createPost("test description");
      const posts = await this.postFactory.posts(address);

      assert.equal(createPost.logs[0].event, "CreatedPost");
      assert.equal(createPost.logs[0].args[0], "test description");
      assert.equal(createPost.logs[0].args[1].toNumber(), 1);
      assert.equal(createPost.logs[0].args[2], address);

      //check posts mapping
      assert.equal(posts.description, "test description");
      assert.equal(posts.id.toNumber(), 1);
      assert.equal(posts.owner, address);
    });
  });
});
