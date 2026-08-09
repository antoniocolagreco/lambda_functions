// src/template/index.ts
var handler = async (event) => {
  console.log("Received Event:", JSON.stringify(event));
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!")
  };
  return response;
};
export {
  handler
};
