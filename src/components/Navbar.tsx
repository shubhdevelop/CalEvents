import { User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { currentUser, userLoggedIn } = useAuth()
    console.log(currentUser);
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-gray-800">Cal Events</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {userLoggedIn ? (
                            <>
                                {/* Authenticated State */}
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">{currentUser?.displayName}</span>
                                </div>

                                <Button variant="ghost" className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile
                                </Button>

                                <Button variant="destructive" className="flex items-center gap-2">
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Unauthenticated State */}
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Link to={"/login"}>
                                        <LogIn className="w-5 h-5" />
                                        Login
                                    </Link>
                                </Button>

                                <Button variant="default" className="flex items-center gap-2">
                                    <Link to={"/register"}>
                                        <UserPlus className="w-5 h-5" />
                                        Sign Up
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;