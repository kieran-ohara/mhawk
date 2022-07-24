export default class Transaction {
  constructor(data) {
    this.data = data.data;
  }

  get amount() {
    return this.data.local_amount / 100;
  }

  get created() {
    return new Date(this.data.created);
  }

  get declined() {
    return Object.prototype.hasOwnProperty.call(this.data, "decline_reason");
  }

  get dedupeId() {
    return this.data.dedupe_id;
  }

  get reference() {
    return this.data.description;
  }
}
