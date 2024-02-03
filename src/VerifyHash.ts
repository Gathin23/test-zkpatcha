import { Field, SmartContract, state, State, method, Poseidon, Keccak } from 'o1js';

export class VerifyHash extends SmartContract {
  @state(Field) x = State<Field>();

  @method initState(captcha: Field, secret: Field) {
    this.x.set(Poseidon.hash([captcha, secret]));
  }

  @method verifyHash(userInput: Field, secret: Field) {
    const x = this.x.get();
    this.x.requireEquals(x);
    Poseidon.hash([userInput, secret]).assertEquals(x);

  }
}