import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// toast removed as it was unused here (handled in AuthContext)

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginValues) => {
    try {
      await login({ username: values.username, password: values.password }, values.rememberMe);
      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch (error) {
      setErrorCount((prev) => prev + 1);
      // Backend error is handled by AuthContext toast
    }
  };

  // shakeAnimation removed as it was unused

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Admin Panel Login
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Enter your credentials to access the management dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit) as any} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Username</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            placeholder="admin"
                            className="pl-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between py-2">
                  <FormField
                    control={form.control as any}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium leading-none text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <AnimatePresence>
                  {errorCount >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-3 rounded-xl flex items-start space-x-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Multiple failed attempts. Please ensure your credentials are correct or contact the system administrator.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 p-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest font-semibold">
              Trusted by TIM GROUP
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
