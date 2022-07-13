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
      const address = "0xb81CB1D7b001253F221dEbfC0bDDfb3A98895379";

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

    it("Should can update a post", async function () {
      const address = "0xb81CB1D7b001253F221dEbfC0bDDfb3A98895379";
      const createPost = await this.postFactory.createPost(
        "I want to be udpate"
      );

      assert.equal(createPost.logs[0].args[2], address);
      assert.equal(createPost.logs[0].args[0], "I want to be udpate");

      const updatePost = await this.postFactory.updatePost(1, "Updated task");
      assert.equal(updatePost.logs[0].event, "UpdatedPost");
      assert.equal(updatePost.logs[0].args[0], address);
      assert.equal(updatePost.logs[0].args[1], "Updated task");
    });

    it("Should can delete a post", async function () {
      const address = "0xb81CB1D7b001253F221dEbfC0bDDfb3A98895379";
      await this.postFactory.createPost("test description");

      const deletePost = await this.postFactory.deletePost(1);
      const posts = await this.postFactory.posts(address);

      assert.equal(deletePost.logs[0].event, "DeletedPost");
      assert.equal(deletePost.logs[0].args[1], "Deleted successfully");
      assert.equal(posts.description, "");
    });
  });
});
