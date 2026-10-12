import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import prisma from '../src/lib/prisma.js'

function createRecoveryCode() {
  return randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .match(/.{1,4}/g)
    .join('-')
}

function readHidden(label) {
  if (!stdin.isTTY || !stdin.setRawMode) {
    throw new Error('Run this command in an interactive terminal.')
  }

  stdout.write(label)
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')

  return new Promise((resolve, reject) => {
    let value = ''

    function finish() {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
      stdout.write('\n')
      resolve(value)
    }

    function onData(character) {
      if (character === '\u0003') {
        stdin.setRawMode(false)
        stdin.pause()
        stdin.removeListener('data', onData)
        stdout.write('\n')
        reject(new Error('Password reset cancelled.'))
        return
      }

      if (character === '\r' || character === '\n') {
        finish()
        return
      }

      if (character === '\u007f') {
        value = value.slice(0, -1)
        return
      }

      value += character
    }

    stdin.on('data', onData)
  })
}

async function main() {
  const prompt = readline.createInterface({ input: stdin, output: stdout })
  const email = (await prompt.question('Account email: ')).trim().toLowerCase()
  prompt.close()

  if (!email || !email.includes('@')) {
    throw new Error('Enter a valid email address.')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('No account exists with that email address.')
  }

  const password = await readHidden('New password (hidden): ')
  const confirmation = await readHidden('Repeat new password (hidden): ')

  if (password.length < 8) {
    throw new Error('The password must contain at least 8 characters.')
  }

  if (password !== confirmation) {
    throw new Error('The passwords do not match.')
  }

  const recoveryCode = createRecoveryCode()
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: bcrypt.hashSync(password, 10),
      recoveryCodeHash: bcrypt.hashSync(recoveryCode, 10),
    },
  })

  stdout.write('\nPassword updated successfully.\n')
  stdout.write(`New recovery code: ${recoveryCode}\n`)
  stdout.write('Save this code somewhere private. It will not be shown again.\n')
}

main()
  .catch((error) => {
    console.error(`\n${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
