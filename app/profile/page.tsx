"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileFormData {
  email?: string;
  password: string;
  newPassword?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors },reset } = useForm<ProfileFormData>();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('user');

      if (!userId) {
        router.push('/login'); // Redirect to login if no user ID is found
        return;
      }

      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        ;
        console.error('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div  className=" items-center h-screen flex justify-center ">Loading...</div>;
  }
 

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setError(''); 
    setSuccess('');
    const userId = localStorage.getItem("user");

    if (!userId) {
      setError("User ID not found");
      return;
    }

    if (!data.password) {
      setError("Current password is required");
      return;
    }

    const updateData: Partial<ProfileFormData> = {};

    if (data.email) updateData.email = data.email;
    if (data.newPassword) updateData.newPassword = data.newPassword;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        reset()
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating the profile.");
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
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              newEmail or Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full p-2 text-black border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Current password is required" })}
              className="w-full text-black p-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500">{error}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword")}
              className="w-full text-black p-2 border rounded-md"
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Update
          </button>
          
        </form>
       <div className="flex justify-end">
       <Link href="/profile/deleteAccount" className=" text-red-600 " >Delete Account</Link>
       </div>
      </div>
    </div>
  );
};

export default ProfilePage;
