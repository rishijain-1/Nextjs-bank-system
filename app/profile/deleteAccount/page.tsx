"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DeleteAccountFormData {
  email: string;
  password: string;
}

const DeleteAccountPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeleteAccountFormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
    setError(null); 
    setSuccess(null); 

    try {
      const response = await fetch('/api/users/delete', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Account deleted successfully!");
        // Redirect to login or home page after account deletion
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred while deleting the account.");
    }
  };

  return (
    <div>
        <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between">
        <Link href="/dashboard" className="items-center  text-2xl font-bold px-3 hover:underline">
          Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row overflow-hidden">
            <Link href="/profile" className="items-center text-xl px-3 hover:underline">
              Profile
            </Link>
            <Link href="/settings" className="text-xl px-3 hover:underline">
              Transaction
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="text-red-600 px-3 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
        </header>
        <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                className="w-full text-black p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                className="w-full text-black p-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md">
            Delete Account
            </button>
        </form>
        </div>
    </div>
    
  );
};

export default DeleteAccountPage;
