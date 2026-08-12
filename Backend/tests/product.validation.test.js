const { productschemaValidator } = require("../validations/product/product");

describe("productschemaValidator", () => {
  const validProduct = {
    name: "Wireless Mouse",
    price: 999,
    Image: "https://example.com/mouse.jpg",
    description: "A smooth wireless mouse",
    category: "Electronics",
    brand: "Logitech",
    stock: 10,
  };

  it("passes for a valid product", () => {
    const { error } = productschemaValidator.validate(validProduct);
    expect(error).toBeUndefined();
  });

  it("fails when name is missing", () => {
    const { name, ...withoutName } = validProduct;
    const { error } = productschemaValidator.validate(withoutName);
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Product name is required/);
  });

  it("fails when price is negative", () => {
    const { error } = productschemaValidator.validate({
      ...validProduct,
      price: -50,
    });
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Price cannot be negative/);
  });

  it("fails when category is not in the allowed list", () => {
    const { error } = productschemaValidator.validate({
      ...validProduct,
      category: "Furniture",
    });
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Category must be one of/);
  });

  it("fails when Image is not a valid URL", () => {
    const { error } = productschemaValidator.validate({
      ...validProduct,
      Image: "not-a-url",
    });
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Image must be a valid URL/);
  });
});