import crypto from 'crypto'

export const genCryptoRandom=(ln)=>{
const randomBytes =  crypto.randomBytes(ln);

   const key =randomBytes.toString('hex');
   return key
}
export const genRandomString =(strln)=>{
const randArr="ABCDRSTUEFGHIJ36KLMNuvwOPQVWXY45Zabcdefghijklmnopqrstxyz127890";
let str="";

for(let i=0;i<strln;i++){
    const num= Math.floor(Math.random()*62)
    str=str+randArr.charAt(num);
}
  return str;
}