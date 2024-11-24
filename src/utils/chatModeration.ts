// Common profanity list and spam detection
const PROFANITY_LIST = new Set([
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy', 'cock', 'whore',
  'bastard', 'cunt', 'piss', 'slut', 'wanker', 'damn', 'hell'
]);

// Spam detection patterns
const SPAM_PATTERNS = [
  /(\S+\s+)\1{3,}/i, // Repeated phrases
  /(.)\1{4,}/i,      // Repeated characters
  /\b(BUY|SELL|PROFIT|GUARANTEED|WWW\.|\$\d+)\b/i, // Common spam words
  /https?:\/\/\S+/i  // URLs (optional - remove if you want to allow links)
];

// Rate limiting configuration
const RATE_LIMITS = {
  messageInterval: 1000,    // Minimum time between messages (1 second)
  maxMessages: 5,          // Maximum messages in timeWindow
  timeWindow: 10000,       // Time window for max messages (10 seconds)
  timeout: 30000,         // Timeout duration (30 seconds)
  warningThreshold: 3     // Number of violations before timeout
};

interface UserState {
  lastMessageTime: number;
  messageCount: number;
  windowStart: number;
  violations: number;
  timeoutUntil: number;
}

export class ChatModerator {
  private userStates: Map<string, UserState>;

  constructor() {
    this.userStates = new Map();
  }

  private cleanText(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  }

  private containsProfanity(text: string): boolean {
    const cleanedText = this.cleanText(text);
    const words = cleanedText.split(/\s+/);
    return words.some(word => PROFANITY_LIST.has(word));
  }

  private isSpam(text: string): boolean {
    return SPAM_PATTERNS.some(pattern => pattern.test(text));
  }

  private updateUserState(clientId: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    let state = this.userStates.get(clientId);

    if (!state) {
      state = {
        lastMessageTime: 0,
        messageCount: 0,
        windowStart: now,
        violations: 0,
        timeoutUntil: 0
      };
      this.userStates.set(clientId, state);
    }

    // Check if user is in timeout
    if (state.timeoutUntil > now) {
      return {
        allowed: false,
        reason: `You are in timeout for ${Math.ceil((state.timeoutUntil - now) / 1000)} seconds`
      };
    }

    // Reset message count if time window has passed
    if (now - state.windowStart > RATE_LIMITS.timeWindow) {
      state.messageCount = 0;
      state.windowStart = now;
    }

    // Check rate limiting
    if (now - state.lastMessageTime < RATE_LIMITS.messageInterval) {
      state.violations++;
      return {
        allowed: false,
        reason: 'You are sending messages too quickly'
      };
    }

    if (state.messageCount >= RATE_LIMITS.maxMessages) {
      state.violations++;
      return {
        allowed: false,
        reason: 'Too many messages in a short time'
      };
    }

    // Apply timeout if violation threshold reached
    if (state.violations >= RATE_LIMITS.warningThreshold) {
      state.timeoutUntil = now + RATE_LIMITS.timeout;
      state.violations = 0;
      return {
        allowed: false,
        reason: `You have been timed out for ${RATE_LIMITS.timeout / 1000} seconds`
      };
    }

    // Update state for allowed message
    state.lastMessageTime = now;
    state.messageCount++;
    return { allowed: true };
  }

  validateMessage(text: string, clientId: string): { isValid: boolean; reason?: string } {
    // Check user state and rate limiting first
    const stateCheck = this.updateUserState(clientId);
    if (!stateCheck.allowed) {
      return { isValid: false, reason: stateCheck.reason };
    }

    // Check message length
    if (text.length < 1) {
      return { isValid: false, reason: 'Message is too short' };
    }
    if (text.length > 500) {
      return { isValid: false, reason: 'Message is too long (max 500 characters)' };
    }

    // Check for profanity
    if (this.containsProfanity(text)) {
      return { isValid: false, reason: 'Message contains inappropriate language' };
    }

    // Check for spam patterns
    if (this.isSpam(text)) {
      return { isValid: false, reason: 'Message detected as spam' };
    }

    return { isValid: true };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [clientId, state] of this.userStates.entries()) {
      if (now - state.lastMessageTime > RATE_LIMITS.timeWindow * 2) {
        this.userStates.delete(clientId);
      }
    }
  }
}