# paramedic

check system status, alert on anomalies and try to fix it

### How it works

- Check `mqtt:local/status` against `mongodb/sfera.config.sfera_healt.sensors` for anomalies
- Every `sferacongig.paramedic_services_healt` seconds check `sferacongig.sfera_healt.services` status

If anomalies are detected
 - shout on `mqtt:local/alarm`
 - try to fix it on `local/technician`


### TODO

Currently only lights are implemented.
