export class NegativeNumberException extends Error {
  constructor(message: string) {
    super();
    this.name = 'NegativeNumberException';
    this.message = message;
  }
}
