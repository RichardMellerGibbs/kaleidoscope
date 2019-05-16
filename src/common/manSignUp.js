import { Auth } from 'aws-amplify';
//Manual Signup

const username = 'user@email';
const email = 'user@email';
const password = 'pass';
const authCode = 'nnnn';

const signUp = () => {
  //console.log('now inside signUp user');

  Auth.signUp({
    username,
    password,
    attributes: {
      email
      //phone_number
    }
  })
    .then(() => console.log('Successful signup'))
    .catch(err => console.log('error signing up: ', err));
};

const verifySignUp = () => {
  //console.log('now inside verify');
  Auth.confirmSignUp(username, authCode)
    .then(console.log('successful confirm sign up!'))
    .catch(err => console.log('error confirming signing up: ', err));
};

export { signUp, verifySignUp };
