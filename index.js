#! /usr/bin/env node
const { Command, Option } = require('commander')
const fs = require('fs')
const path = require('path')

const program = new Command()

//declare default extension
let ext = 'txt'

program
    .version('1.0.0')
    .description('Simple tools to copy file via CLI')

program
    .argument('<file>')
    .addOption(new Option('-t, --type <type>', 'Copy file to specific extension').default('text').choices(['text', 'json']))
    .option('-o, --output <output>', 'Copy file to specific location')
    .action((file, options) => {

        let output = path.dirname(file) + '/'
        //check file extension
        if (options.type == 'text') ext = 'txt'
        if (options.type == 'json') ext = 'json'

        //validate output location
        if (options.output) {
            let arr = options.output.split('.')
            if (arr[arr.length - 1] != ext) {
                return console.log('Invalid file extension')
            } else {
                //remove extension
                output = path.parse(options.output).dir + path.parse(options.output).name
            }
        } else {
            output += path.parse(path.basename(file, '.*')).name
        }

        try {
            fs.copyFile(file, output + '.' + ext, err => {
                if (err) return console.log(err)

                console.log(`copied success (${output.replace(/\\/g, '/')}.${ext})`)
            })
        } catch (error) {
            console.error(error)
        }
    })

program.showHelpAfterError('(add --help for additional information)')
program.parse(process.argv)