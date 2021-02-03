import bcrypt from "bcrypt";


// asynchronous
export function hashPassword(plainTextPassword) {
  const saltRounds = 10
  return bcrypt.hash(plainTextPassword, saltRounds)
}


export function matchPassword(plainTextPassword, hash) {
  return bcrypt.compare(plainTextPassword, hash)
}
