

const Login = () => {
  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <form className="space-y-4">
        
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-whit-500"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    
                    className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-whit-500"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                   
                    className="w-full p-2 mt-1 border text-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
           
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Login
                </button>
            </div>
        </form>
        </div>
    </div>
    );
}

export default Login;