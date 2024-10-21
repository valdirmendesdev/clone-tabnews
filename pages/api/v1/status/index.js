import database from "infra/database.js";

async function status(request, response) {
  const databaseName = process.env.POSTGRES_DB;

  let result = await database.query({
    text:
      "SELECT max_connections, server_version, current_connections FROM" +
      "(SELECT setting::int max_connections from pg_settings where name='max_connections')," +
      "(SELECT setting::text server_version from pg_settings where name='server_version')," +
      "(SELECT COUNT(*)::int current_connections FROM pg_stat_activity WHERE datname = $1);",
    values: [databaseName],
  });

  const [dbInformation] = result.rows;

  const updateAt = new Date().toISOString();
  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: dbInformation.server_version,
        max_connections: dbInformation.max_connections,
        current_connections: dbInformation.current_connections,
      },
    },
  });
}

export default status;
