const connect = {
  host: 'localhost',
  port: 1884,
  endpoint: '/mqtt',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'team-10-dentistimo-bookingmanager',
  username: 'team_10',
  password: 'team_10'
}

const connectUrl = `mqtt://${connect.host}:${connect.port}${connect.endpoint}`
// export connection details
module.exports = { connect, connectUrl }
