import { User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import { Link } from 'react-router-dom';
import { doSignOut } from '@/auth/auth';

const Navbar = () => {
    const { currentUser, userLoggedIn } = useAuth()
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 ">
                        <Link to={"/"} className='flex-row flex justify-center items-center gap-2 '>
                            <img src="./icon.png" alt="logo" className='w-5 h-5' />
                            <span className="text-xl font-bold text-gray-800">Cal Events</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {userLoggedIn ? (
                            <>
                                {/* Authenticated State */}
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">{currentUser?.displayName}</span>
                                </div>

                                <Link to={"/profile"}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Profile
                                    </Button>
                                </Link>

                                <Button variant="destructive" className="flex items-center gap-2" onClick={() => doSignOut()}>
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Unauthenticated State */}
                                <Link to={"/login"}>
                                    <Button variant="ghost" className="flex items-center flex-row w-fit gap-2">
                                        <LogIn className="w-5 h-5" />
                                        Login
                                    </Button>
                                </Link>

                                <Link to={"/register"}>
                                    <Button variant="default" className="flex flex-row items-center gap-2">
                                        <UserPlus className="w-5 h-5" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;