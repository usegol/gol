// make this a set of forms that are all hidden and then show the one that is needed in state
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { app, auth, db } from '../Firebase';



export default function SignUp() {
    const [step, setStep] = useState(0);

    function handleNextStep() {
      setStep((prevStep) => prevStep + 1);
    }

    switch (step) {
        case 0:
            return <SignUpEmailPassword onNextStep={handleNextStep} />;
        case 1:
            return <SignUpPhone onNextStep={handleNextStep} />;
        case 2:
            return <PhoneVerification onNextStep={handleNextStep} />;
        case 3:
            return <MotivationForm onNextStep={handleNextStep} />;
        default:
            return <SignUpEmailPassword onNextStep={handleNextStep} />;
    }
} 

function SignUpEmailPassword(props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  function submitForm() {
      // submit form data to server
      // navigate to next page
      props.onNextStep();
  }
  

  function handleSubmit(event) {

    event.preventDefault();
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Do something with the user object, e.g. navigate to next page
        props.onNextStep();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        // Handle error, e.g. display error message
        console.error(errorCode, errorMessage);
      });

      submitForm();
  }
  
    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <a href="/">
                <img
                    className="mx-auto h-12 w-auto"
                    src="./assets/logo.png"
                    alt="Gol"
                />
            </a>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a href="/signin" className="font-medium text-green-600 hover:text-green-500">
                Login to existing account
              </a>
              <t className="text-red">{errorMessage}</t>
            </p>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit} >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-green-600 hover:text-green-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>
  
                <div>
                  <button
                    className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    Sign up
                  </button>
                </div>
              </form>
  
              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
  
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div>
                    <a
                      href="#"
                      className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    >
                      <span className="sr-only">Sign in with Facebook</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
  
                  <div>
                    <a
                      href="#"
                      className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    >
                      <span className="sr-only">Sign in with Twitter</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
  
                  <div>
                    <a
                      href="#"
                      className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    >
                      <span className="sr-only">Sign in with GitHub</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </>
    )
}

// this is a form to sign up a phone number
function SignUpPhone(props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function submitForm() {
    // submit form data to server
    db.collection('users').doc(props.userId).set({
      phoneNumber: phoneNumber
    }, { merge: true })
    .then(() => {
      // navigate to next page
      props.onNextStep();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

  function handleSubmit(event) {
    event.preventDefault();
    // validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorMessage('Invalid phone number');
      return;
    }
    // submit form
    submitForm();
  }

  function handleChange(event) {
    setPhoneNumber(event.target.value);
  }

  function isValidPhoneNumber(phoneNumber) {
    // validate phone number using regular expression
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  }

//   function submitForm() {
//     // submit form data to server
//     // navigate to next page
//     navigate('/verification');
//   }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <a href="/">
            <img
              className="mx-auto h-12 w-auto"
              src="./assets/logo.png"
              alt="Gol"
            />
          </a>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/signin"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Login to existing account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>

              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// this is a form to verify the phone number
function PhoneVerification(props) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleCodeChange(event) {
    setCode(event.target.value);
  }

  function handlePaste(event) {
    const pastedText = event.clipboardData.getData('text');
    setCode(pastedText);
  }

  function submitForm() {
    // submit form data to server
    // navigate to next page
    props.onNextStep();
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Here you can validate the verification code and handle the next step in the signup process
    // For example, you can send the code to your server to validate it against the phone number

    // If the code is invalid, you can set an error message to display to the user
    setErrorMessage('Invalid code. Please try again.');

    // If the code is valid, you can submit the form
    submitForm();

  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/">
          <img
            className="mx-auto h-12 w-auto"
            src="./assets/logo.png"
            alt="Gol"
          />
        </a>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Phone Verification</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                Enter the verification code we sent to your phone number
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  name="code"
                  type="text"
                  autoComplete="off"
                  required
                  value={code}
                  onChange={handleCodeChange}
                  onPaste={handlePaste}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


function MotivationForm(props) {
  const [name, setName] = useState('');
  const [motivators, setMotivators] = useState([]);
  const [currentMotivator, setCurrentMotivator] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function submitForm() {
    // submit form data to server
    // navigate to next page
    props.onNextStep();
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleMotivatorsChange(event) {
    const value = event.target.value;
    if (value.endsWith(',')) {
      const newMotivator = value.slice(0, -1).trim();
      if (newMotivator) {
        setMotivators([...motivators, newMotivator]);
        setCurrentMotivator('');
      }
    } else {
      setCurrentMotivator(value);
    }
  }

  function removeMotivator(index) {
    setMotivators(motivators.filter((_, i) => i !== index));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validate the input values
    if (!name) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (motivators.length < 3) {
      setErrorMessage('Please enter at least 3 motivators.');
      return;
    }

    // Handle the next step in the form, such as submitting the data to a server
    console.log(`Name: ${name}`);
    console.log(`Motivators: ${motivators.join(', ')}`);
    submitForm();
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">What motivates you?</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motivators" className="block text-sm font-medium leading-6 text-gray-900">
                Motivators (separated by commas, at least 3)
              </label>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {motivators.map((motivator, index) => (
                    <span
                    key={index}
                    className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm cursor-pointer"
                    onClick={() => removeMotivator(index)}
                  >
                    {motivator}
                  </span>
                ))}
                <textarea
                  id="motivators"
                  name="motivators"
                  rows="1"
                  autoComplete="off"
                  required
                  value={currentMotivator}
                  onChange={handleMotivatorsChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-600">{errorMessage}</p>
          )}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
