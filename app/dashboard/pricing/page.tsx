'use client';

import React from 'react';
import { PricingTable } from '@clerk/nextjs';

function PricingPage() {
  return (
    <div className='p-10 flex flex-col items-center justify-center min-h-[85vh]'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl font-bold'>Pricing Plans</h2>
        <p className='text-sm text-gray-500 mt-2'>
          Choose a subscription plan to build and deploy unlimited AI agents.
        </p>
      </div>

      {/* Clerk Out-of-the-Box Subscription Billing Table */}
      <div className='w-full max-w-4xl'>
        <PricingTable />
      </div>
    </div>
  );
}

export default PricingPage;