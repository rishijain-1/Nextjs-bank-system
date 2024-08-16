// components/Header.tsx
import {useRouter} from 'next/navigation'
import Link from 'next/link';


const Header = () => {
  const router = useRouter();
  return (
    <header className="bg-gray-700 text-balck p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('userId');
                router.push('/login');
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;
