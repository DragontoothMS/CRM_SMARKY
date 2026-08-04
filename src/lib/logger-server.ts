import * as fs from 'fs'
import * as path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'app.log')

type LogData = Record<string, unknown> | unknown[] | string | number | boolean | null | undefined

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

function formatLog(level: string, context: string, message: string, data?: LogData) {
  const timestamp = new Date().toISOString()
  const dataStr = data ? ` ${JSON.stringify(data)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${dataStr}\n`
}

export function writeLog(level: string, context: string, message: string, data?: LogData) {
  try {
    ensureLogDir()
    const logLine = formatLog(level, context, message, data)
    fs.appendFileSync(LOG_FILE, logLine)
  } catch (e) {
    console.error('Failed to write log:', e)
  }
}

export const logger = {
  debug: (context: string, message: string, data?: LogData) => writeLog('debug', context, message, data),
  info: (context: string, message: string, data?: LogData) => writeLog('info', context, message, data),
  warn: (context: string, message: string, data?: LogData) => writeLog('warn', context, message, data),
  error: (context: string, message: string, data?: LogData) => writeLog('error', context, message, data),
}

export function readLogs(lines = 100): string {
  try {
    if (!fs.existsSync(LOG_FILE)) return 'No log file found'
    const content = fs.readFileSync(LOG_FILE, 'utf-8')
    const allLines = content.trim().split('\n')
    return allLines.slice(-lines).join('\n')
  } catch (e) {
    return `Error reading logs: ${e}`
  }
}

export function clearLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '')
    }
  } catch (e) {
    console.error('Failed to clear logs:', e)
  }
}