var MongoClient = require('mongodb').MongoClient;

var SferaConf = {
  'connect': ()=>{
    return MongoClient.connect('mongodb://localhost:27017/sfera');
  },

  'addDefaultConfig': ()=> {
    let conn = SferaConf.connect();
    conn.then(
      (db)=>{
        let defaultConfig = [
          { 'key': 'paramedic_services_healt', 'value': 60}
        ];
        defaultConfig.forEach((doc)=>{
          db.collection('config').update({'key': doc.key}, doc, {upsert:true}).then(
            (ok)=>{ return },
            (err)=>{ console.log(err);
            }
          )
        });
        db.close();
        return 0;
      },
      (err)=>{
        console.log('[KO] connection error');
        console.log(err);
      }
    )
  },

  'getConf': (key, defaultValue)=>{
    let conn = SferaConf.connect();
    return conn.then(
      (db)=>{
        return db.collection('config').findOne({'key': key}).then(
            (doc)=>{
              return (doc && doc.value) ? doc.value : defaultValue; },
            (err)=>{ return err; }
        );
      },
      (err) => {
        console.log('[KO] connection error');
        return err;
      }
    )
  }

}

module.exports = SferaConf;
