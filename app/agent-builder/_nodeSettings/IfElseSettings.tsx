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

function IfElseSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    ifCondition: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        ifCondition: '',
      });
    }
  }, [selectedNode]);

  const onSave = () => {
    updateFormData(formData);
    toast.success('If/Else settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>If / Else</h2>
        <p className='text-xs text-gray-500'>Create condition to branch your workflow</p>
      </div>

      {/* If Condition Input */}
      <div className='flex flex-col gap-1'>
        <Label>If Condition</Label>
        <Input
          placeholder='e.g., city != null'
          value={formData?.ifCondition || ''}
          onChange={(e) => setFormData({ ifCondition: e.target.value })}
        />
        <p className='text-xs text-gray-400'>
          If the condition matches, the execution routes via the 'If' handle; otherwise, it takes the 'Else' handle.
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default IfElseSettings;