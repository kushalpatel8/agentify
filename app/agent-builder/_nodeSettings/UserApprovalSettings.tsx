'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Props {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function UserApprovalSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        name: selectedNode?.data?.label || '',
        message: '',
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    updateFormData(formData);
    toast.success('User approval settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>User Approval</h2>
        <p className='text-xs text-gray-500'>Pause workflow for manual human review</p>
      </div>

      {/* Step / Action Name */}
      <div className='flex flex-col gap-1'>
        <Label>Action Name</Label>
        <Input
          placeholder='e.g., Approve Refund'
          value={formData?.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      {/* Confirmation Message */}
      <div className='flex flex-col gap-1'>
        <Label>Prompt Message</Label>
        <Textarea
          rows={4}
          placeholder='Do you approve executing this tool with the generated parameters?'
          value={formData?.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
        />
        <p className='text-xs text-gray-400'>
          This message is shown to the user when approval is required to proceed.
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default UserApprovalSettings;