const SferaConf = require('./sferaconf');
const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost');
const SferaChecker  = require('./sferachecker');
const exec =  require('child_process').exec;
var CronJob = require('cron').CronJob;

var sfera_healt = {};

function update_conf(){
  SferaConf.getConf('sfera_healt', {}).then(
    (healt) => {
      client.publish('local/system', 'paramedic:healt_update');
      sfera_healt = healt
      console.log(sfera_healt)
    },
    (err)=>{
      console.log('Error on fetch sfera_healt', err)
    }
  )
}

function sendAlert(type, who, expected, heared, level){
  let packet = {
    'type': type,
    'who': who,
    'expected': expected,
    'heared': heared,
    'level': level
  }
  client.publish('local/alert', JSON.stringify(packet));
}

SferaConf.getConf('paramedic_services_healt', 60).then(
    (tick) => {
      var job = new CronJob('*/'+tick+' * * * * *',
        () => { //every tick
            let services = sfera_healt.services
            services.forEach( (p)=>{
              exec('systemctl -q is-active '+p+'.service', (error) => {
                if( error ){
                  sendAlert('service_alert', p, 'active', 'not-running', 'danger')
                }
              });
            });

            //TODO
            // check other services
        },
        () => { //On cron stop
          console.log('Cron Stopped');
        },
        true
      );
    },
    (err) => {
      console.log(err);
    }
);

client.on('connect', function () {
  client.subscribe(['local/status', 'local/system']);
})

client.on('message', function (topic, message) {
  if( topic === 'local/status'){
      let m = JSON.parse(message);
      if( m.event === 'sfera_status'){
        let sensors = sfera_healt.sensors;
        //for each data receive from sfera_status
        Object.getOwnPropertyNames(sensors).forEach(
          (key) => {
            //if is defined a check function
            if (typeof SferaChecker[key] === 'function') {
                SferaChecker[key](m.data[key], sensors[key], (level, command) =>{
                  if( level !== 'normal' ){
                    sendAlert('sensor_alert', key, sensors[key], m.data[key].toString(), level);
                  }
                  if( command ){
                    client.publish('local/technician', command);
                  }
                });
            }
          }
        );
      }
  } else if (topic === 'local/system' && message.toString() === 'manager:healt_update') {
    update_conf();
  }
});

update_conf();
