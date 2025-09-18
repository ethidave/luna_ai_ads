// Centralized console utilities to manage logging levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

class ConsoleManager {
  private logLevel: LogLevel = LogLevel.WARN;
  private isDevelopment: boolean = process.env.NODE_ENV === 'development';

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) return false;
    
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    
    return messageIndex <= currentIndex;
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(message, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(message, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(message, ...args);
    }
  }

  // Silent logging for errors that should not appear in console
  silentError(message: string, ...args: any[]) {
    // Only log to external services in production
    if (!this.isDevelopment) {
      // Send to error tracking service
      // Example: Sentry.captureMessage(message, { level: 'error', extra: args });
    }
  }
}

export const logger = new ConsoleManager();

// Set default log level to WARN to reduce console noise
logger.setLogLevel(LogLevel.WARN);
