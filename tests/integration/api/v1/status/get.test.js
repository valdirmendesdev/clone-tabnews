test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.update_at).toBeDefined();

  const parsedUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parsedUpdateAt);
  expect(responseBody.dependencies).toBeDefined();
  expect(responseBody.dependencies).toMatchObject({
    database: {
      version: expect.any(String),
      max_connections: expect.any(Number),
      current_connections: expect.any(Number),
    },
  });
  const { version, max_connections, current_connections } =
    responseBody.dependencies.database;
  expect(version).toEqual("16.0");
  expect(max_connections).not.toEqual(0);
  expect(max_connections).toEqual(100);
  expect(current_connections).not.toEqual(0);
  expect(current_connections).toEqual(1);
});
