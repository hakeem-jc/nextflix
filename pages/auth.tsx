import { useCallback, useState } from 'react';
import axios from 'axios';
import Input from '@/components/Input';
import Image from 'next/image';
import logo from '@/public/pages/images/logo.png';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import Head from 'next/head';
import Loading from '@/components/Loading';
import bcrypt from 'bcryptjs';

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [variant, setVariant] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);


  const login = useCallback(async () => {
    setIsLoading(true);

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      }).then(_res => {
        router.push('/profiles');
      });

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    setIsLoading(true);
    let hashedPassword = await bcrypt.hashSync(password, 12);
    
    try {
      await axios.post('/api/register', {
        email,
        name,
        password: hashedPassword
      }).then(_res=> {
        login();
      });
    } catch (error) {
        console.log(error);
        setIsLoading(false);
    }
  }, [email, name, password, login]);

  

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
          <nav className="px-12 py-5">
            <Image  src={logo} className="h-12" alt="Logo" width="200" height="12"/>
          </nav>
          <div className="flex justify-center">
            <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
              <h2 className="text-white text-4xl mb-8 font-semibold">
                {variant === 'login' ? 'Sign in' : 'Register'}
              </h2>
              <div className="flex flex-col gap-4">
                {variant === 'register' && (
                  <Input
                    id="name"
                    type="text"
                    label="Username"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)} 
                  />
                )}
                <Input
                  id="email"
                  type="email"
                  label="Email address or phone number"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)} 
                />
                <Input
                  type="password" 
                  id="password" 
                  label="Password" 
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)} 
                />
              </div>
              <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                {variant === 'login' ? 'Login' : 'Sign up'}
              </button>
              <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                <div onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                  <FcGoogle size={32} />
                </div>
              </div>
              <p className="text-neutral-500 mt-12">
                {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
                <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                  {variant === 'login' ? 'Create an account' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
