'use client';

import React from 'react';
import MyAgents from '../_components/MyAgents';

function MyAgentsPage() {
  return (
    <div className='p-10 flex flex-col gap-5 min-h-[85vh]'>
      <div>
        <h2 className='text-2xl font-bold'>My AI Agents</h2>
        <p className='text-xs text-gray-500 mt-1'>
          Manage, edit, and inspect all the custom AI agents you have created.
        </p>
      </div>

      {/* Reused MyAgents Grid Component */}
      <MyAgents />
    </div>
  );
}

export default MyAgentsPage;