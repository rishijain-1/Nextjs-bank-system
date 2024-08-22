"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DeleteAccountFormData {
  email: string;
  password: string;
}

const DeleteAccountPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeleteAccountFormData>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const userToken = localStorage.getItem('token');

      if (!userToken) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to fetch user data');
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
        console.error('An error occurred:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);
  if (loading) {
    return <div className="items-center h-screen flex justify-center">Loading...</div>;
  }

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
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold mb-2 sm:mb-0 px-3 hover:underline">
              Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row">
              <Link href="/profile" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
                Profile
              </Link>
              <Link href="/transactionhistory" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
                Transaction
              </Link>
              <Link href="/transaction-analysis" className="text-xl mb-2 sm:mb-0 px-3 hover:underline">
                Analysis
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
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
