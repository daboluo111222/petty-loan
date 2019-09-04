#!/usr/bin/env node

// const os = require('os')
const spawn = require('child_process').spawn
const chalk = require('chalk')
const program = require('commander')
const pkg = require('./package.json')
let ctrl = init()
program
  .version(pkg.version)
  .usage('<command> [options]')

program
  .command('help')
  .description('Print this help')
  .action(program.help)

program
  .command('ls')
  .description('服务器列表!')
  .action(ctrl.list)

program
  .command('login')
  .arguments('[serverName]')
  .description('登录到服务器!')
  .action(ctrl.login)

program
  .command('upload')
  .arguments('[serverName]')
  .description('上传server 或 server/dist 到服务器!')
  .option('-S, --isServer', '是否上传server目录')
  .action(ctrl.upload)

// Display help if wrong cmd
program.action(function (cmd, options) {
  program.help()
})

program.parse(process.argv)

// Display help if 0 arguments passed to nssh
if (process.argv.length == 2 || process.argv[2].indexOf('-') >= 0) {
  program.parse(process.argv)
  program.help()
  // Check if it does not forget to close fds from RPC
  process.exit(1)
}

function init () {
  const vpsList = {
    test: {
      ip: '47.96.27.148',
      webDir: '/mnt/nodeweb'
    },
    prod: {
      ip: '10.253.125.186',
      webDir: '/web'
    }
  }

  return {
    list () {
      console.log(chalk.yellow('服务器列表:'))
      Object.keys(vpsList).forEach(function (key) {
        let value = vpsList[key].ip
        console.log(chalk.blue(`${key}:${value}`))
      })
    },
    login (server, cmd) {
      let login = function (ip = vpsList.test.ip, dir = vpsList.test.webDir) {
        spawn(`ssh root@${ip} -t "cd ${dir}; ls;bash;"`, {
          stdio: 'inherit',
          shell: true
        })
      }
      if (!server || !vpsList[server]) {
        login()
        return
      }
      login(vpsList[server].ip, vpsList[server].webDir)
    },
    upload (server, cmd) {
      let upload = function (ip = vpsList.test.ip, dir = vpsList.test.webDir) {
        let ls = spawn(`scp -r ./dist root@${ip}:${dir}/${pkg.name}`, {
          stdio: 'inherit',
          shell: true
        })

        ls.on('close', (code) => {
          if (code === 0) {
            console.log(chalk.blue(`sever: http://${ip}:8091`))
          }
        })
      }
      console.log(cmd.isServer)
      if (!server) {
        upload()
        return
      }
      upload(vpsList[server].ip, vpsList[server].webDir)
    }
  }
}
