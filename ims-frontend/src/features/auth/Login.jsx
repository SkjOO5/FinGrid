import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/axios';
import { mockLogin } from '../../api/mockAuth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });
    
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }) => {
        setLoading(true);
        setAuthError('');
        
        // Try real backend first
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                dispatch(loginSuccess(response.data.data));
                navigate('/dashboard');
                return;
            }
        } catch (error) {
            if (error.response) {
                // Backend online but returned an error (wrong credentials etc.)
                setAuthError(error.response?.data?.message || 'Invalid credentials');
                setLoading(false);
                return;
            }
            // Backend is offline — try mock auth
        }

        // Mock fallback
        const result = mockLogin(email, password);
        if (result.success) {
            dispatch(loginSuccess(result.data));
            navigate('/dashboard');
        } else {
            setAuthError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md mx-4 p-10 glass-panel rounded-2xl shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-5">
                        <Lock className="text-white h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-textPrimary">Welcome Back</h1>
                    <p className="text-sm text-textSecondary mt-2">Sign in to Code-B IMS</p>
                </div>
                
                {authError && (
                    <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-center gap-3 text-danger">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm font-medium">{authError}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-textSecondary mb-1.5 px-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-textSecondary group-focus-within:text-primary transition-colors pointer-events-none">
                                <Mail className="h-4 w-4" />
                            </span>
                            <input 
                                type="email"
                                autoComplete="email"
                                placeholder="name@codeb.com"
                                {...register('email')}
                                className={`w-full pl-11 pr-4 py-3 bg-surface border rounded-xl text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm ${errors.email ? 'border-danger' : 'border-border'}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-danger mt-1 px-1">{errors.email.message}</p>}
                    </div>
                    
                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5 px-1">
                            <label className="block text-sm font-semibold text-textSecondary">Password</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-textSecondary group-focus-within:text-primary transition-colors pointer-events-none">
                                <Lock className="h-4 w-4" />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={`w-full pl-11 pr-12 py-3 bg-surface border rounded-xl text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm ${errors.password ? 'border-danger' : 'border-border'}`}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-textPrimary transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-danger mt-1 px-1">{errors.password.message}</p>}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-primary to-blue-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-border text-center">
                    <span className="text-sm text-textSecondary">New to the system? </span>
                    <Link to="/register" className="text-sm font-extrabold text-secondary hover:underline">Create an account →</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
