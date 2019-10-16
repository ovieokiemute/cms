const status = ['public', 'private', 'draft', 'none']


// let rand = Math.random();

// let statusLength = status.length;

// let statusFloor = Math.floor(rand * statusLength);

const randomStatus = status[Math.floor(Math.random() * status.length)];


console.log(randomStatus)