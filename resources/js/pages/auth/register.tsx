import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Car, LoaderCircle, Truck } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Customer */}
                                <label className="relative flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all duration-300
                                                hover:shadow-md">
                                <input
                                type="radio"
                                name="role"
                                value="customer"
                                className="peer hidden"
                                defaultChecked
                                />
                                    {/* This div changes style based on peer-checked */}
                                    <div className="flex p-2 flex-col items-center justify-center w-full h-full rounded-xl border border-gray-300
                                                    peer-checked:border-blue-500
                                                    peer-checked:bg-blue-100
                                                    peer-checked:shadow-lg
                                                    transition-all duration-300">
                                    <Car className="w-10 h-10 text-blue-500 peer-checked:text-blue-700" />
                                    <span className="mt-2 font-semibold text-sm">Customer</span>
                                    <p className="text-xs text-muted-foreground text-center mt-1">
                                        Rent vehicles from trusted owners
                                    </p>
                                    </div>
                                </label>

                                {/* Owner */}
                                <label className="relative flex flex-col items-center justify-center border rounded-xl  cursor-pointer transition-all duration-300
                                                    hover:shadow-md">
                                    <input
                                    type="radio"
                                    name="role"
                                    value="owner"
                                    className="peer hidden"
                                    />
                                    <div className="flex p-2 flex-col items-center justify-center w-full h-full rounded-xl border border-gray-300
                                                    peer-checked:border-green-500
                                                    peer-checked:bg-green-100
                                                    peer-checked:shadow-lg
                                                    transition-all duration-300">
                                    <Truck className="w-10 h-10 text-green-500 peer-checked:text-green-700" />
                                    <span className="mt-2 font-semibold text-sm">Vehicle Owner</span>
                                    <p className="text-xs text-muted-foreground text-center mt-1">
                                        List your vehicles for rent
                                    </p>
                                    </div>
                                </label>
                            </div>


                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
