import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const user = useAuth().currentUser;
    const { userLoggedIn } = useAuth();

    const InfoRow = ({ icon: Icon, label, value }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: React.ComponentType<any>,
        label: string,
        value: string | null
    }) => (
        <div className="flex items-center space-x-4 py-2">
            <div className="w-8">
                <Icon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col justify-center items-center w-full h-full gap-16 '>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            <h1 className='text-3xl font-black '>Profile</h1>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-col items-center space-y-4 pb-6">
                    <Avatar className="h-24 w-24">
                        {user?.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                            <AvatarFallback className="text-lg">
                                {getInitials(user?.displayName || "")}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">
                            {user?.displayName || 'Anonymous User'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {user?.email || 'No email provided'}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="divide-y divide-gray-200">
                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={user?.email || ""}
                        />
                        <InfoRow
                            icon={Phone}
                            label="Phone"
                            value={user?.phoneNumber || ""}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default UserProfile;