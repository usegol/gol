import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import app, { db } from '../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';



export default function SignUp() {
    const [step, setStep] = useState(0);

    function handleNextStep() {
      setStep((prevStep) => prevStep + 1);
    }

    switch (step) {
        case 0:
            return <SignUpEmailPassword onNextStep={handleNextStep} />;
        case 1:
            return <MotivationForm onNextStep={handleNextStep} />;
        default:
            return <SignUpEmailPassword onNextStep={handleNextStep} />;
    }
} 

function SignUpEmailPassword(props) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

    const handleGoogleSignIn = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // Display the user's name and profile picture
        console.log('Signed in as ' + user.displayName);
        console.log('Profile picture: ' + user.photoURL);
          // Redirect to the dashboard page
          navigate('/dashboard');
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

  function submitForm() {
      // submit form data to server
      // navigate to next page
      props.onNextStep();
  }
  
  async function handleSubmit(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      props.onNextStep();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      console.error(errorCode, errorMessage);
    }
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
                <div>
                  <button
                    className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    Sign up
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
  
                <div className="mt-6">
                  <div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="inline-flex items-center w-full justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                    <span>Sign up with Google</span>
                    </button>
                  </div>
                {errorMessage && <p>{errorMessage}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

function MotivationForm(props) {
  const [name, setName] = useState('');
  const [motivators, setMotivators] = useState([]);
  const [currentMotivator, setCurrentMotivator] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function addToFirestore(name, motivators) {
    try {
      await addDoc(collection(db, 'motivationForms'), {
        name,
        motivators,
        timestamp: serverTimestamp(),
      });
      console.log('Form data successfully saved to Firestore!');
    } catch (error) {
      console.error('Error saving form data to Firestore: ', error);
    }
  }
  

  async function submitForm() {
    await addToFirestore(name, motivators);
    navigate('/dashboard');
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

  function handleMotivatorsKeyPress(event) {
    if (event.key === ',') {
      event.preventDefault();
      const newMotivator = currentMotivator.trim();
      if (newMotivator) {
        setMotivators([...motivators, newMotivator]);
        setCurrentMotivator('');
      }
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
                <input
                  id="motivators"
                  name="motivators"
                  type="text"
                  autoComplete="off"
                  value={currentMotivator}
                  onChange={handleMotivatorsChange}
                  onKeyPress={handleMotivatorsKeyPress}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 resize-none"
                />
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
