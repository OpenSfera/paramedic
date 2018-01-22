const assert = require('assert');
const moment = require('moment');
const sferachecker = require('../sferachecker');

console.log("LIGHTS CHECKER");
//No configuration, should be ok for every current status
console.log(' - No configuration, when *on* it is normal');
sferachecker.lights('on', [], (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})

//No configuration, should be ok for every current status
console.log(' - No configuration, when *off* it is normal');
sferachecker.lights('off', [], (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})

let now = moment().hour();
let onRanges = ['00:00-11:00', '11:00-12:00'];
let offRanges = ['12:00-15:00', '15:00-23:59'];
if( now > 12 ){
  offRanges = ['00:00-11:00', '11:00-12:00'];
  onRanges = ['12:00-15:00', '15:00-23:59'];
}

//Range in time, should be ok for ON only
//No configuration, should be ok for every current status
console.log(' - Ranges in %s, when *on* it is normal', onRanges.toString());
sferachecker.lights('on', onRanges, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})

//Range in time, should be ok for ON only
console.log(' - Ranges in %s, when *off* it is warning', onRanges.toString());
sferachecker.lights('off', onRanges, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'lights_on');
})

//Range in time, should be ok for ON only
//No configuration, should be ok for every current status
console.log(' - Ranges in %s, when *on* it is warning', offRanges.toString());
sferachecker.lights('on', offRanges, (status, command)=>{
  assert.deepEqual(status, 'warning');
  assert.deepEqual(command, 'lights_off');
})

//Range in time, should be ok for ON only
console.log(' - Ranges in %s, when *off* it is normal', offRanges.toString());
sferachecker.lights('off', offRanges, (status, command)=>{
  assert.deepEqual(status, 'normal');
  assert.deepEqual(command, null);
})
