import ChangeUserPassword from '@/components/ChangeUserPassword';
import EditUserDialog from '@/components/EditUserDialog';
import Loading from '@/components/Loading';
import ResetUserPassword from '@/components/ResetUserPassword';
import useAuth from '@/hooks/useAuth';
import { getUserById } from '@/services/users.service';
import { User } from '@/types/index.types';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { role, userId } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await getUserById(id as string);

        if (response.status === 200) {
          setUser(response.data);
        } else {
          toast.error('Uh oh! Something went wrong');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data.error;
          if (backendMessage) {
            setErrorMessage(backendMessage);
          } else {
            setErrorMessage('An unexpected error occurred.');
          }
        } else {
          setErrorMessage('Something went wrong. Try again later.');
        }
        toast.error('Uh oh! Something went wrong!');
      } finally {
        setIsLoading(false);
      }
    };

    const isAdmin = role === 'ADMIN';
    const isSelf = userId === id;

    if (!isAdmin && !isSelf) {
      setErrorMessage('You need admin role to edit other users!');
      return;
    }

    fetchUser();
  }, [id, role, userId]);

  return (
    <div>
      {isLoading && <Loading />}

      {errorMessage && (
        <div className="p-2 bg-rose-200 text-rose-600">
          Error occurred: {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && user && (
        <div className="max-w-2xl mx-auto mt-10 px-4">
          <div className="bg-white border shadow-xl rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-primary via-primary/80 to-primary/50 text-white">
              {/* Avatar */}
              <div className="size-20 rounded-full bg-white/20 flex items-center justify-center text-4xl shadow-inner">
                <FaRegUser />
              </div>

              {/* User Info */}
              <div className="flex flex-col justify-start items-start">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm capi">Employed as: {user.role}</p>
                <p className="text-sm">
                  Employed on: {format(user.createdAt, 'dd/MM/yyyy')}
                </p>
              </div>
            </div>

            {/* Personal information */}
            <div className="w-full h-full flex flex-col justify-start items-start px-6 py-4 border-b bg-gray-50">
              <h4 className="text-lg font-semibold ">Personal information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-6 ">
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Username', value: '@' + user.username },
                  { label: 'Email', value: user.email },
                  { label: 'Role', value: user.role },
                  {
                    label: 'Employed on',
                    value: format(user.createdAt, 'dd/MM/yyyy'),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-start bg-gray-50 border rounded-lg p-4"
                  >
                    <h5 className="text-sm text-gray-500 font-medium">
                      {item.label}
                    </h5>
                    <span className="text-base font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons Section */}
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between gap-3 bg-white">
              <div>
                <EditUserDialog
                  user={user}
                  onUserUpdated={setUser}
                  className="bg-primary hover:bg-primary/70 text-white px-5 py-2 rounded-md w-full sm:w-auto"
                  text="Edit Profile"
                />
              </div>
              {role === 'ADMIN' ? (
                <ResetUserPassword
                  user={user}
                  className="border border-primary hover:bg-primary/90 hover:text-white text-primary px-5 py-2 rounded-md w-full sm:w-auto"
                />
              ) : (
                <ChangeUserPassword
                  user={user}
                  className="border border-primary hover:bg-primary/90 hover:text-white text-primary px-5 py-2 rounded-md w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
