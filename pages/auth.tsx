import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import Input from '@/components/Input';
import Image from 'next/image';
import logo from '@/public/pages/images/logo.png';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/router';
// import { FcGoogle } from 'react-icons/fc';
import Head from 'next/head';
import Loading from '@/components/Loading';
import bcrypt from 'bcryptjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Auth = () => {
  const router = useRouter();
  const [variant, setVariant] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignInResponse | undefined>();
  const [registerError, setRegisterError] = useState<any>();

  useEffect(()=>{
    setError(undefined);
  },[]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    name: variant === 'register' ? Yup.string().required('Username is required') : Yup.string()
  });

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    setError(undefined);
  }, []);


  const login = useCallback(async (values:any) => {
    setIsLoading(true);
    const { email, password } = values;

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      }).then(res => {
        if  (res?.status === 200) {
          router.push('/profiles');
        }
        else {
          setIsLoading(false);
          setError(res);
        }         
      });

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (values:any) => {
    setIsLoading(true);
    const { email, password, name } = values;

    let hashedPassword = await bcrypt.hashSync(password, 12);
    
    try {
      await axios.post('/api/register', {
        email,
        name,
        password: hashedPassword
      }).then(_res=> {
        login({email, password});
      });
    } catch (error) {
        console.log(error);
        setIsLoading(false);
        setRegisterError(error);
    }
  }, [login]);

  const formik = useFormik({
    initialValues: { email: '', password: '', name: '' },
    validationSchema,
    onSubmit: (values) => {
      if (variant === 'login') {
        login(values);
      } else {
        register(values);
      }
    },
  });
  

  return (
    <>
      {isLoading && <Loading />}
      <Head>
        <title>Welcome to Nextflix</title>
        <meta property="og:title" content="Nextflix" key="title" />
        <meta property="og:description" content="Authentication page" key="auth" />
        <meta property="og:author" content="Hakeem Clarke" key="author" />
      </Head>
      
      <div className="relative h-full w-full bg-no-repeat bg-center bg-fixed bg-cover"
          style={{
              backgroundImage: "url('pages/images/hero.jpg')",
          }}
      >
        <div className="bg-black w-full h-full lg:bg-opacity-50">
          <nav className="px-12 py-5 flex items-center justify-center">
            <Image  src={logo} className="h-12" alt="Logo" width="200" height="12"/>
          </nav>
          <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} className="flex justify-center">
            <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
              <h2 className="text-white text-4xl mb-8 font-semibold">
                {variant === 'login' ? 'Sign in' : 'Register'}
              </h2>
              <div className="flex flex-col gap-4">
                {variant === 'register' && (
                  <div>
                    <Input
                      id="name"
                      type="text"
                      label="Username"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-500">{formik.errors.name}</div>
                    ) : null}
                  </div>
                )}
                <div>
                  <Input
                    id="email"
                    type="email"
                    label="Email address"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500">{formik.errors.email}</div>
                  ) : null}
                  
                  {error?.error === 'Email does not exist' && <p className="text-red-500">{error?.error}</p>}
                  {error && error?.error !== "Incorrect password" &&  error?.error !== 'Email does not exist' && <p className="text-red-500">Email taken</p>}
                </div>
                
                <div>
                  <Input
                    type="password" 
                    id="password" 
                    label="Password" 
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                   {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500">{formik.errors.password}</div>
                  ) : null}
                  {error?.error === "Incorrect password" && <p className="text-red-500">{error?.error}</p>}
                </div>
              </div>
              <button type="submit" className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                {variant === 'login' ? 'Login' : 'Sign up'}
              </button>

              {registerError && <p className="text-red-500 text-center pt-8">Something went wrong. Please Try Again</p>}

            {/* TODO - Switch for another sign in method that doesn't require manually adding test users */}
              {/* <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                <div onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                  <FcGoogle size={32} />
                </div>
              </div> */}
              <p className="text-neutral-500 mt-12">
                {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
                <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                  {variant === 'login' ? ' Create an account' : 'Login'}
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Auth;
