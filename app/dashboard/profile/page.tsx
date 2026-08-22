'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

function ProfilePage() {
  return (
    <div className='p-10 flex flex-col items-center justify-center min-h-[85vh]'>
      <div className='w-full max-w-4xl'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold'>User Profile & Billing</h2>
          <p className='text-xs text-gray-500 mt-1'>
            Manage your personal account settings, authentication methods, and active subscriptions.
          </p>
        </div>

        {/* Clerk UserProfile Component */}
        <UserProfile routing='hash' />
      </div>
    </div>
  );
}

export default ProfilePage;