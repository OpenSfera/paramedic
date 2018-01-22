const moment = require('moment');
/*
  Perform a check and try to repair
 */

var SferaChecker = {
  't1Alert': false,
  'h1Alert': false,
  'monitorK': 20,

  //SENSOR's handler
  't1': (current, wanted, cb)=>{
    if( wanted ){
      SferaChecker.doubleRangeCheck(current, wanted, 't1', (status, command)=>{
        if(command){
          if( command === 'go_high'){
            command = 'fan_on'; //technician doesnt have this command
          } else {
            command = 'heater_on';//technician doesnt have this command
          }
        }
        return cb(status, command);
      })
    } else {
      return cb('normal', null);
    }
  },

  'h1': (current, wanted, cb)=>{
    if( wanted ){
      SferaChecker.doubleRangeCheck(current, wanted, 't1', (status, command)=>{
        if(command){
          if( command === 'go_high'){
            command = 'humidifier_on'; //technician doesnt have this command
          } else {
            command = 'fan_on'; //technician doesnt have this command
          }
        }
        return cb(status, command);
      })
    } else {
      return cb('normal', null);
    }
  },

  'lights': (current, wanted, cb)=>{
    if( wanted && wanted.length > 0){
      let inRange = wanted.some( SferaChecker.checkTime );
      if( current === 'on' && !inRange){
        return cb('warning', 'lights_off');
      }
      if( current === 'off' && inRange){
        return cb('warning', 'lights_on');
      }
    }
    return cb('normal', null);
  },

  //Helpers
  'checkTime': (timerange) => {
      let times = timerange.split("-");
      return moment().isBetween(moment(times[0], 'HH:mm'), moment(times[1], 'HH:mm'));
  },

  'calculateK': (a, b)=>{
    let range = b-a;
    let p = SferaChecker["monitorK"]; //this is the p% of the range
    return parseInt( (range * p) / 100 );
  },

  // current is 'min_danger|min_warning|max_warning|max_danger'
  // to get back in normal status current values should return
  // in the green zone for p% of the value (p defined in this.calculateK)
  'doubleRangeCheck': (current, wanted, sensor, cb)=>{
    current = parseFloat(current);
    let data = wanted.split("|");
    let min_danger = parseFloat(data[0]);
    let min_warning = parseFloat(data[1]);
    let max_warning = parseFloat(data[2]);
    let max_danger = parseFloat(data[3]);
    let isLow = (current < ((max_warning+min_warning)/2))?true:false;
    let command = null;
    if (current >= min_warning && current <= max_warning){
      let status = 'normal';
      if( SferaChecker[sensor+'Alert'] === true ){
        //should send 'monitoring' until we are sure the warning is off
        let monitorK = SferaChecker.calculateK(min_warning, max_warning);
        let min_warning_adjusted = min_warning + monitorK;
        let max_warning_adjusted = max_warning - monitorK;
        if (current <= min_warning_adjusted || current >= max_warning_adjusted){
          status = 'monitoring'
          command = (isLow)?'go_high':'go_low';
        } else {
          //shuld turn off the medication
          SferaChecker[sensor+'Alert'] = false;
        }
      }
      return cb(status, command);
    } else if (current <= min_danger || current >= max_danger){
      status = 'danger';
      SferaChecker[sensor+'Alert'] = true;
      command = (isLow)?'go_high':'go_low';
      // should ask for medication
      return cb(status, command);
    } else {
      status = 'warning';
      SferaChecker[sensor+'Alert'] = true;
      command = (isLow)?'go_high':'go_low';
      // should ask for medication
      return cb(status, command);
    }
  }
}

module.exports = SferaChecker;
