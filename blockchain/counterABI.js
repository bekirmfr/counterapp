const Abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"decreasedBy","type":"address"},{"indexed":false,"internalType":"int256","name":"value","type":"int256"}],"name":"Decreased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"increasedBy","type":"address"},{"indexed":false,"internalType":"int256","name":"value","type":"int256"}],"name":"Increased","type":"event"},{"inputs":[],"name":"decrease","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCounter","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"increase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"_counter","type":"int256"}],"name":"setCounter","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export default Abi