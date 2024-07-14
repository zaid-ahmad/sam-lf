"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import resendLogin from "@/server/actions/resend-login";
import { useEffect, useState } from "react";
import Spinner from "./spinner";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters." }),
    branchCode: z
        .string()
        .length(5, { message: "Branch code must be 5 characters." })
        .toUpperCase(),
    role: z.enum(["CANVASSER", "SALES_REP"], {
        required_error: "Please select a role.",
    }),
});

function AuthForm() {
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            branchCode: "",
            role: undefined,
        },
    });

    async function onSubmit(values, isLogin) {
        setIsLoading(true);
        setFormError("");
        try {
            console.log(values, isLogin);
            const result = await resendLogin(values, isLogin);
            if (result?.error) {
                setFormError(result.error.message);
                console.error("Error submitting form:", result.error);
            } else {
                setIsEmailSent(true);
            }
        } catch (error) {
            setFormError(error.message);
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isEmailSent) {
            toast({
                title: "Email sent",
                description: "Check your inbox for the login link.",
            });
        }
    }, [isEmailSent, toast]);

    const FormFields = () => (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) =>
                    onSubmit(values, isLogin)
                )}
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
                                    type='email'
                                    placeholder='firstname.lastname@leafhome.com'
                                    required
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage>
                                <span className='text-black font-base text-xs'>
                                    A secure login link will be sent to the
                                    provided email address.
                                </span>
                            </FormMessage>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!isLogin && (
                    <>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='mt-3'>
                                    <FormLabel>
                                        Email
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='firstname.lastname@leafhome.com'
                                            required
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-4'>
                            <FormField
                                control={form.control}
                                name='firstName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            First Name
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                placeholder='John'
                                                {...field}
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
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                placeholder='Doe'
                                                {...field}
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
                                            type='text'
                                            placeholder='XXXX'
                                            className='uppercase'
                                            {...field}
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
                                            defaultValue={field.value}
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
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <Spinner color='text-gray-100' />
                            </div>
                        ) : (
                            <p>
                                {isLogin ? "Send Login Link" : "Create Account"}
                            </p>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );

    return (
        <div className='flex flex-col items-center shadow-lg p-7 rounded-lg bg-white'>
            <Tabs defaultValue='login' className='w-[400px] h-[500px]'>
                <TabsList className='grid w-full grid-cols-2 gap-4'>
                    <TabsTrigger
                        value='account'
                        onClick={() => setIsLogin(false)}
                    >
                        Create an Account
                    </TabsTrigger>
                    <TabsTrigger value='login' onClick={() => setIsLogin(true)}>
                        Login
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                    <FormFields />
                </TabsContent>
                <TabsContent value='login'>
                    <FormFields />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthForm;
