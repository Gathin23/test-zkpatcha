import { Field, SmartContract, state, State, method, Poseidon, MerkleMapWitness, Provable } from 'o1js';

export class VerifyHash extends SmartContract {
  @state(Field) x = State<Field>();
  @state(Field) mapRoot = State<Field>();

  @method initState(captcha: Field, secret: Field, initialRoot: Field) {
    this.x.set(Poseidon.hash([captcha, secret]));
    this.mapRoot.set(initialRoot);
  }

  @method verifyHash(userInput: Field, secret: Field) {
    const x = this.x.get();
    this.x.requireEquals(x);
    Poseidon.hash([userInput, secret]).assertEquals(x);

  }

  // @method update(
  //   keyWitness: MerkleMapWitness,
  //   keyToChange: Field,
  //   valueBefore: Field,
  //   incrementAmount: Field,
  // ) {
  //   const initialRoot = this.mapRoot.get();
  //   this.mapRoot.requireEquals(initialRoot);

  //   incrementAmount.assertLt(Field(10));

  //   // check the initial state matches what we expect
  //   const [ rootBefore, key ] = keyWitness.computeRootAndKey(valueBefore);
  //   rootBefore.assertEquals(initialRoot);

  //   key.assertEquals(keyToChange);

  //   // compute the root after incrementing
  //   const [ rootAfter, _ ] = keyWitness.computeRootAndKey(valueBefore.add(incrementAmount));

  //   // set the new root
  //   this.treeRoot.set(rootAfter);
  // }

  @method checkMap(
    keyWitness: MerkleMapWitness,
    keyToChange: Field,
    valueBefore: Field,
  ) {
    const initialRoot = this.mapRoot.get();
    this.mapRoot.requireEquals(initialRoot);
    

    // check the initial state matches what we expect
    const [ rootBefore, key ] = keyWitness.computeRootAndKey(valueBefore);
    Provable.log(rootBefore);
    Provable.log(key);
    Provable.log(keyToChange);

    rootBefore.assertEquals(initialRoot);
    key.assertEquals(keyToChange);
  }
}