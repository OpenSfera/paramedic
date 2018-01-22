const exec =  require("child_process").exec;
let services = ["mongodb", "apache2", "inventato"]
services.forEach( (p)=>{
  exec('systemctl -q is-active '+p+'.service', (error) => {
    if( error ){
      console.log("error on "+p)
      console.log(error)
    }
  });
});
