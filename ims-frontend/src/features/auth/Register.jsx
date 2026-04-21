import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api/axios';
import { mockRegister } from '../../api/mockAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['ADMIN', 'SALESPERSON']),
});

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'SALESPERSON' }
    });
    
    const [loading, setLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async ({ fullName, email, password, role }) => {
        setLoading(true);
        setApiMessage({ type: '', text: '' });
        
        // Try real backend first, fallback to mock
        try {
            const response = await api.post('/auth/register', { fullName, email, password, role });
            if (response.data.success) {
                setApiMessage({ type: 'success', text: 'Account created! Redirecting to login...' });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            // Backend unreachable — use mock
            const result = mockRegister(fullName, email, password, role);
            if (result.success) {
                setApiMessage({ type: 'success', text: '✓ Account created (offline mode). Redirecting...' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setApiMessage({ type: 'error', text: result.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md mx-4 p-10 glass-panel rounded-2xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="h-14 w-14 bg-gradient-to-br from-secondary to-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-secondary/30 mb-5">
                        <ShieldCheck className="text-white h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-textPrimary">Create Account</h1>
                    <p className="text-sm text-textSecondary mt-2">Join the Code-B IMS platform</p>
                </div>
                
                {apiMessage.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                        apiMessage.type === 'success' 
                        ? 'bg-success/10 border-success/30 text-success' 
                        : 'bg-danger/10 border-danger/30 text-danger'
                    }`}>
                        {apiMessage.type === 'success' 
                            ? <CheckCircle2 className="h-5 w-5 shrink-0" /> 
                            : <AlertCircle className="h-5 w-5 shrink-0" />}
                        <p className="text-sm font-medium">{apiMessage.text}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-textSecondary mb-1.5 px-1">Full Name</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-textSecondary group-focus-within:text-primary transition-colors pointer-events-none">
                                <User className="h-4 w-4" />
                            </span>
                            <input 
                                type="text" 
                                placeholder="John Doe"
                                {...register('fullName')}
                                className={`w-full pl-11 pr-4 py-3 bg-surface border rounded-xl text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm ${errors.fullName ? 'border-danger' : 'border-border'}`}
                            />
                        </div>
                        {errors.fullName && <p className="text-xs text-danger mt-1 px-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-textSecondary mb-1.5 px-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-textSecondary group-focus-within:text-primary transition-colors pointer-events-none">
                                <Mail className="h-4 w-4" />
                            </span>
                            <input 
                                type="email" 
                                placeholder="name@codeb.com"
                                {...register('email')}
                                className={`w-full pl-11 pr-4 py-3 bg-surface border rounded-xl text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm ${errors.email ? 'border-danger' : 'border-border'}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-danger mt-1 px-1">{errors.email.message}</p>}
                    </div>
                    
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-textSecondary mb-1.5 px-1">Password</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-textSecondary group-focus-within:text-primary transition-colors pointer-events-none">
                                <Lock className="h-4 w-4" />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Min. 6 characters"
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

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-textSecondary mb-1.5 px-1">Role</label>
                        <select 
                            {...register('role')}
                            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm appearance-none cursor-pointer"
                        >
                            <option value="ADMIN">Admin — Full Access</option>
                            <option value="SALESPERSON">Salesperson — Restricted</option>
                        </select>
                        {errors.role && <p className="text-xs text-danger mt-1 px-1">{errors.role.message}</p>}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-xl hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-border text-center">
                    <span className="text-sm text-textSecondary">Already have an account? </span>
                    <Link to="/login" className="text-sm font-extrabold text-primary hover:underline">Sign in →</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
