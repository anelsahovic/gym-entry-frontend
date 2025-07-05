import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoginSchema } from '@/schemas/zod.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import SubmitButton from '@/components/SubmitButton';
import { MdErrorOutline, MdInfoOutline } from 'react-icons/md';
import axios from 'axios';
import { mutate } from 'swr';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const { isAuthenticated, isLoading } = useAuth();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading && isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate, isLoading]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      console.log(values);
      // const response = await login(values.username, values.password);

      // if (response.status === 200) {
      //   await mutate('/auth');
      //   navigate('/dashboard');
      // }

      await mutate('/auth');
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data.error;
        if (backendMessage) {
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } else {
        setErrorMessage('Something went wrong. Try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 via-green-50 to-green-100 p-4">
      <div className="flex w-full max-w-4xl h-[30rem] bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-neutral-200">
        {/* Left side */}
        <div className="hidden sm:flex flex-col w-1/2 h-full bg-gradient-to-br from-primary via-green-400 to-emerald-500 items-center justify-between gap-6 p-8 text-white ">
          <div className=" flex justify-center items-center gap-2 text-2xl">
            <img src="/logo_white.png" className="w-20" />
            <span className="font-bold">Gym Entry</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <h3 className="text-2xl font-semibold">Nice to see you again</h3>
            <h2 className="text-4xl font-bold uppercase tracking-wide">
              Welcome Back
            </h2>
            <div className="bg-white w-12 h-1 rounded-full" />
            <p className="text-center max-w-xs text-sm">
              Manage your gym memberships, members and scan members cards — all
              in one place.
            </p>
          </div>
          <a href="https://www.anelsahovic.com">@anelsahovic</a>
        </div>

        {/* Right side */}
        <div className="flex flex-col w-full sm:w-1/2 h-full justify-center p-10 gap-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-500 mt-2">Access your account</p>
            <div className="bg-sky-100 text-sky-600 p-1 pl-6 rounded flex justify-start items-start gap-2 mt-2 relative">
              <MdInfoOutline size={20} className="absolute left-1 top-1" />
              <p className="italic text-sm">
                Authentication has been temporarily disabled for demo purposes
                and recruiters flow. In production, full auth is enabled. Enter
                any username and password.
              </p>
            </div>
          </div>
          {errorMessage && (
            <div className="flex  items-center justify-center gap-2 text-red-600 bg-red-100 rounded-md p-2 text-sm ">
              <MdErrorOutline className="text-xl" />

              <p> {errorMessage}</p>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="@johndoe"
                        {...field}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <SubmitButton text="Login" loading={isSubmitting} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
