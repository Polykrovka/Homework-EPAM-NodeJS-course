const childProcess = require('child_process');
const fs = require('fs');

const isWindows = process.platform === "win32";
const command = isWindows 
  ? `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`
  : `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`;
let timeStart = Date.now();


const spawnProcess = (command, args) => {
  const process = childProcess.spawn(command, args);
  
  process.stdout.on('data', (data) => {
    console.clear()
    console.log(`${data}`);
    if (Date.now() >= timeStart + 60000) {
      fs.appendFile('activityMonitor.log', `${Math.floor(Date.now() / 1000)} : ${data}`, (err) => {
        if (err) throw err;
      });
      timeStart = Date.now();
    }
  });

  // Sometimes the console command may take more than 0.1 seconds to complete.
  // In a discussion in Teams, there were cases when a command was executed for more than 3 seconds.
  // So I decided to use setTimeout instead of setinterval to make sure that the command runs after the previous one has completed.
  setTimeout(() => {
    spawnProcess(command, { shell: true })
  }, 100);
}

spawnProcess(command, { shell: true })
