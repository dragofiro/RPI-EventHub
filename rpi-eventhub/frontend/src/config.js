const config = {
    development: {
      apiUrl: 'http://localhost:5000'
    },
    production: {
      apiUrl: 'http://rpieventhub.cs.rpi.edu'
    }
  };
  
  export default config[process.env.NODE_ENV];
  