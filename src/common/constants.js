export const ERROR_MESSAGES = {
  MANDATORY_FIELD:
    'We think you missed sharing something important. Can you re-check?',
  FIRST_NAME_REQUIRED: 'Please enter your first name',
  LAST_NAME_REQUIRED: 'Please enter your last name',
  INVALID_NAME: 'Please enter valid name (Only alphabets)',
  maxNCharacters: (num) =>
    `All the coolest names fit within ${num} characters. Surely yours does too`,
  INVALID_NAME_NUMBER: `What’s not in a name? Numbers!`,
  INVALID_NAME_SPECIAL_CHAR: `You don’t need special characters in your name. Your name’s perfect as is.`,
  INVALID_EMAIL:
    'Please ensure that your email address follows the potato@chips.yum format. Otherwise we’ll have to keep reminding you about it. Don’t blame us for the extra  kilos then',
  EMAIL_EXISTS: 'This email is being used. Please use another one',
  INVALID_DATE: 'Please enter a valid date',
  AGE_NOT_ALLOWED:
    'Driving, voting, and using TCP require you to be at least 18. Age is a bar here',
  ANNIVERSARY_FUTURE_DATE:
    'We are excited if you got a big day coming up. But let’s cross that bridge when we get to it? ',
  ANNIVERSARY_BEFORE_DOB:
    'Only time travellers can have anniversary dates before their birth dates. Please check yours. Or come over with your time machine'
};
