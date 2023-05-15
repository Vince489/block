// Define a function to send a message to a randomly selected subset of nodes in the network
function gossip(message) {
  const nodes = virtue.networkNodes.slice();
  const subsetSize = Math.floor(Math.sqrt(nodes.length));

  for (let i = 0; i < subsetSize; i++) {
    const randomIndex = Math.floor(Math.random() * nodes.length);
    const randomNode = nodes[randomIndex];
    const requestOptions = {
      uri: randomNode + '/receive-message',
      method: 'POST',
      body: message,
      json: true
    };

    rp(requestOptions);
    nodes.splice(randomIndex, 1);
  }
}

// Define an endpoint to receive messages from other nodes in the network
app.post('/receive-message', function(req, res) {
  const message = req.body;

  // Apply the received blockchain state to our local copy
  if (message.chain) {
    const currentChainLength = virtue.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    if (message.chain.length > maxChainLength && virtue.chainIsValid(message.chain)) {
      maxChainLength = message.chain.length;
      newLongestChain = message.chain;
      newPendingTransactions = message.pendingTransactions;
    }

    if (newLongestChain) {
      virtue.chain = newLongestChain;
      virtue.pendingTransactions = newPendingTransactions;
      gossip(message);
    }
  }

  res.send();
});

// Define the consensus endpoint to initiate the gossip protocol
app.get('/consensus', function(req, res) {
  const message = {
    chain: virtue.chain,
    pendingTransactions: virtue.pendingTransactions
  };

  gossip(message);
  res.send();
});
