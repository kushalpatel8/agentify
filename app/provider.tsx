"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react'

const Provider = ({ children }:Readonly<{children: React.ReactNode}>) => {

    const {user} = useUser();
    const CreateUser = useMutation(api.user.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>();

    useEffect(() => {
        user && CreateAndGetUser();
    },[user])

    const CreateAndGetUser = async () => {
        if(user) {
            const result = await CreateUser({
                name:user.fullName??'',
                email:user.primaryEmailAddress?.emailAddress??''
            });
            setUserDetail(result);
        }
    }

    return (
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>
    );
}

export default Provider;
