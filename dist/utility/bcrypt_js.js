import bcrypt from 'bcrypt';
const bcrypt_text = text => {
  const salt = bcrypt.genSaltSync(10);
  const becrpted_text = bcrypt.hashSync(text, salt);
  return becrpted_text;
};
const compare_bcrypt = (text, hash) => {
  const result = bcrypt.compareSync(text, hash);
  return result;
};
export { bcrypt_text, compare_bcrypt };