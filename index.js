const { decode, encode } = require('simpleproto');

const noop = () => {};
module.exports = (server) => {
  server.on('connect', (req, socket) => {
    socket.on('error', noop);
    let curSeq;
    decode(socket, (data) => {
      try {
        data = JSON.parse(data) || '';
        if (data.seq != null) {
          if (curSeq === data.seq) {
            return;
          }
          curSeq = data.seq;
          socket.write(encode(curSeq));
        }
        if (data.req) {
          req.emit('clientFrame', data.req);
        }
        if (data.res) {
          req.emit('serverFrame', data.res);
        }
      } catch (e) {}
    });
    req.sendEstablished();
  });
};
