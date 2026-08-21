'use client';

import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Props {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function EndSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    schema: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        schema: '',
      });
    }
  }, [selectedNode]);

  const onSave = () => {
    updateFormData(formData);
    toast.success('End node settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>End</h2>
        <p className='text-xs text-gray-500'>Choose the workflow output format</p>
      </div>

      {/* Output Schema */}
      <div className='flex flex-col gap-1'>
        <Label>Output Schema (Optional)</Label>
        <Textarea
          rows={5}
          placeholder='{ "response": "string", "status": "string" }'
          value={formData?.schema || ''}
          onChange={(e) => setFormData({ schema: e.target.value })}
        />
        <p className='text-xs text-gray-400'>
          Specify a JSON schema if you want the final response structured.
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default EndSettings;