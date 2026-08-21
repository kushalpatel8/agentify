'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Props {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function WhileSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    whileCondition: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        whileCondition: '',
      });
    }
  }, [selectedNode]);

  const onSave = () => {
    updateFormData(formData);
    toast.success('While loop settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>While Loop</h2>
        <p className='text-xs text-gray-500'>Loop logic until a condition is satisfied</p>
      </div>

      {/* Loop Condition Input */}
      <div className='flex flex-col gap-1'>
        <Label>While Condition</Label>
        <Input
          placeholder='e.g., attempts < 3'
          value={formData?.whileCondition || ''}
          onChange={(e) => setFormData({ whileCondition: e.target.value })}
        />
        <p className='text-xs text-gray-400'>
          The agent will iterate through this branch as long as this expression evaluates to true.
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default WhileSettings;