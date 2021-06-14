const { exec } = require("child_process");

function gitUserEmail() {
  return new Promise((resolve, reject) => {
    exec("git config user.email", (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function gitUsername() {
  return new Promise((resolve, reject) => {
    exec("git config user.name", (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = { gitUserEmail, gitUsername };
