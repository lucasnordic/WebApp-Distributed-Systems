const mqtt = require('mqtt')
const connect = {
  host: 'localhost',
  port: 1884,
  endpoint: '/mqtt',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'team-10-dentistimo-availabilitychecker',
  username: 'team_10',
  password: 'team_10'
}

const connectUrl = `mqtt://${connect.host}:${connect.port}${connect.endpoint}`
const mqttClient = mqtt.connect(connectUrl, connect);
// export connection to mqtt
module.exports = mqttClient
