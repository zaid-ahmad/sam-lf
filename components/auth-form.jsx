"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import handleAuth from "@/server/actions/handle-auth";
import { useState } from "react";
import Spinner from "./spinner";
import { loginSchema, registerSchema } from "@/lib/validations/schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FormFields = ({
    form,
    isLogin,
    onSubmit,
    formError,
    isLoading,
    showPassword,
    setShowPassword,
}) => (
    <Form {...form}>
        <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, isLogin))}
            className='space-y-6'
        >
            <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                    <FormItem className='mt-3'>
                        <FormLabel>
                            Email<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type='email'
                                placeholder='example@example.com'
                                required
                                value={field.value || ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Password<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                            <div className='relative'>
                                <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter your password'
                                    value={field.value || ""}
                                    required
                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className='h-4 w-4 text-gray-500' />
                                    ) : (
                                        <Eye className='h-4 w-4 text-gray-500' />
                                    )}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {!isLogin && (
                <>
                    <div className='flex gap-4'>
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        First Name
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='text'
                                            placeholder='John'
                                            value={field.value || ""}
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='lastName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Last Name
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='text'
                                            placeholder='Doe'
                                            value={field.value || ""}
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name='branchCode'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Branch Code
                                    <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='text'
                                        placeholder='XXXX'
                                        className='uppercase'
                                        value={field.value || ""}
                                        maxLength={4}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Please select your role
                                    <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || ""}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='CANVASSER'>
                                                Canvasser
                                            </SelectItem>
                                            <SelectItem value='SALES_REP'>
                                                Sales Representative
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
            <div>
                {formError && (
                    <div className='text-red-500 text-sm mt-[-8px]'>
                        {formError}
                    </div>
                )}
                <Button
                    type='submit'
                    className={`w-full mt-3 ${
                        isLoading ? "cursor-not-allowed opacity-80" : ""
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <p>Redirecting you to the dashboard...</p>
                        </div>
                    ) : (
                        <p>{isLogin ? "Log In" : "Create Account"}</p>
                    )}
                </Button>
            </div>
            {isLogin && (
                <Link href='/forgot-password'>
                    <p className='text-left mt-3 text-sm text-gray-500'>
                        Forgot password?
                    </p>
                </Link>
            )}
        </form>
    </Form>
);

const loginDefaultValues = {
    email: "",
    password: "",
};

const registerDefaultValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    branchCode: "",
    role: "",
};

function AuthForm() {
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: isLogin ? loginDefaultValues : registerDefaultValues,
    });

    async function onSubmit(values, isLogin) {
        setIsLoading(true);
        setFormError("");
        try {
            const dataToSend = isLogin
                ? { email: values.email, password: values.password }
                : values;
            const result = await handleAuth(dataToSend, isLogin);
            if (result?.error) {
                setFormError(result.error);
                console.error("Error submitting form:", result.error);
            } else if (result?.success) {
                router.push(result.redirectUrl);
            }
        } catch (error) {
            setFormError("An unexpected error occurred.");
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleTabChange = (newValue) => {
        const isLoginTab = newValue === "login";
        setIsLogin(isLoginTab);
        form.reset(isLoginTab ? loginDefaultValues : registerDefaultValues);
        setShowPassword(false);
        setFormError("");
    };

    return (
        <div className='flex flex-col items-center shadow-lg p-7 rounded-lg bg-white'>
            <Tabs
                defaultValue={isLogin ? "login" : "account"}
                className='w-80 md:w-[400px] h-[590px]'
            >
                <TabsList className='grid w-full grid-cols-2 gap-4'>
                    <TabsTrigger
                        value='account'
                        onClick={() => handleTabChange("account")}
                    >
                        Create an Account
                    </TabsTrigger>
                    <TabsTrigger
                        value='login'
                        onClick={() => handleTabChange("login")}
                    >
                        Login
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                    <FormFields
                        form={form}
                        isLogin={false}
                        onSubmit={onSubmit}
                        formError={formError}
                        isLoading={isLoading}
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                    />
                </TabsContent>
                <TabsContent value='login'>
                    <FormFields
                        form={form}
                        isLogin={true}
                        onSubmit={onSubmit}
                        formError={formError}
                        isLoading={isLoading}
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthForm;
