const assert = require('assert');
const sferachecker = require('../sferachecker');

sferachecker.monitorK = 20;
console.log("T1 CHECKER");
console.log(' - No configuration, when too low or too high it is normal');
sferachecker.t1('-15', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.t1('100', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.t1('20', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})

//Range in time, should be ok for ON only
//No configuration, should be ok for every current status
let config = '10|20|30|40'
console.log(' - with config, in range is normal');
sferachecker.t1(25, config, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
console.log(' - with config, too low is danger');
sferachecker.t1(5, config, (status, command)=>{
  assert.deepEqual(status, 'danger');
  assert.deepEqual(command, 'fan_on');
})
console.log(' - with config, low is warning');
sferachecker.t1(15, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'fan_on');
})
console.log(' - with config, high is warning');
sferachecker.t1(35, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'heater_on');
})
console.log(' - with config, too high is danger');
sferachecker.t1(45, config, (status, command)=>{
  assert.deepEqual(status, 'danger');
  assert.deepEqual(command, 'heater_on');
})
console.log(' - when warning or danger and came back to normal should be monitoring for a percentage');
sferachecker.t1(29, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'heater_on');
})
sferachecker.t1(28, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'heater_on');
})
sferachecker.t1(25, config, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.t1(15, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'fan_on');
})
sferachecker.t1(21, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'fan_on');
})
sferachecker.t1(25, config, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
// //Range in time, should be ok for ON only
// console.log(' - Ranges in %s, when *off* it is warning');
// sferachecker.lights('off', onRanges, (status, command)=>{
//   assert.deepEqual(status, 'warning');
//   assert.deepEqual(command, 'lights_on');
// })
//
// //Range in time, should be ok for ON only
// //No configuration, should be ok for every current status
// console.log(' - Ranges in %s, when *on* it is warning', offRanges.toString());
// sferachecker.lights('on', offRanges, (status, command)=>{
//   assert.deepEqual(status, 'warning');
//   assert.deepEqual(command, 'lights_off');
// })
//
// //Range in time, should be ok for ON only
// console.log(' - Ranges in %s, when *off* it is normal', offRanges.toString());
// sferachecker.lights('off', offRanges, (status, command)=>{
//   assert.deepEqual(status, 'normal');
//   assert.deepEqual(command, null);
// })
