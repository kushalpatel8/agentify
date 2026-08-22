const axios = require('axios');
axios.post('http://localhost:3000/api/generate-agent-tool-config', {
  jsonConfig: {
    nodes: [{ id: "start", type: "StartNode", data: { label: "start" } }],
    edges: []
  }
}).then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err.response?.data || err.message));
