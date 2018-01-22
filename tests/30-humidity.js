const assert = require('assert');
const sferachecker = require('../sferachecker');

sferachecker.monitorK = 20;
console.log("H1 CHECKER");
console.log(' - No configuration, when too low or too high it is normal');
sferachecker.h1('0', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.h1('100', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.h1('50', null, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})

//Range in time, should be ok for ON only
//No configuration, should be ok for every current status
let config = '10|20|90|98'
console.log(' - with config, in range is normal');
sferachecker.h1(30, config, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
console.log(' - with config, too low is danger');
sferachecker.h1(5, config, (status, command)=>{
  assert.deepEqual(status, 'danger');
  assert.deepEqual(command, 'humidifier_on');
})
console.log(' - with config, low is warning');
sferachecker.h1(15, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'humidifier_on');
})
console.log(' - with config, high is warning');
sferachecker.h1(95, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'fan_on');
})
console.log(' - with config, too high is danger');
sferachecker.h1(99, config, (status, command)=>{
  assert.deepEqual(status, 'danger');
  assert.deepEqual(command, 'fan_on');
})
console.log(' - when warning or danger and came back to normal should be monitoring for a percentage');
sferachecker.h1(80, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'fan_on');
})
sferachecker.h1(76, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'fan_on');
})
sferachecker.h1(50, config, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
sferachecker.h1(15, config, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'humidifier_on');
})
sferachecker.h1(34, config, (status, command)=>{
  assert.deepEqual(status, 'monitoring');
  assert.deepEqual(command, 'humidifier_on');
})
sferachecker.h1(35, config, (status, command)=>{
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
