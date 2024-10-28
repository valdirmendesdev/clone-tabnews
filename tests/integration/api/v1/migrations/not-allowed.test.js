import database from "infra/database";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("NOT ALLOWED METHODS to /api/v1/migrations should return 405 and should not impact the status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(response.status).toBe(405);

  const response2 = await fetch("http://localhost:3000/api/v1/status");
  expect(response2.status).toBe(200);
  const response2Body = await response2.json();
  const { current_connections } = response2Body.dependencies.database;
  expect(current_connections).toEqual(1);
});
