'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function ApiSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET',
    url: '',
    includeApiKey: false,
    apiKey: '',
    body: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        name: selectedNode?.data?.label || '',
        method: 'GET',
        url: '',
        includeApiKey: false,
        apiKey: '',
        body: '',
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    updateFormData(formData);
    toast.success('API settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>API Tool</h2>
        <p className='text-xs text-gray-500'>Call third-party APIs during agent execution</p>
      </div>

      {/* API Name */}
      <div className='flex flex-col gap-1'>
        <Label>Name</Label>
        <Input
          placeholder='e.g., Weather API'
          value={formData?.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      {/* HTTP Method Selection */}
      <div className='flex flex-col gap-1'>
        <Label>Request Method</Label>
        <Select
          value={formData?.method}
          onValueChange={(v) => handleChange('method', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Method' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='GET'>GET</SelectItem>
            <SelectItem value='POST'>POST</SelectItem>
            <SelectItem value='PUT'>PUT</SelectItem>
            <SelectItem value='DELETE'>DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* API Endpoint URL */}
      <div className='flex flex-col gap-1'>
        <Label>API URL</Label>
        <Input
          placeholder='https://api.example.com/data?query={cityName}'
          value={formData?.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      </div>

      {/* API Key Toggle & Input */}
      <div className='flex items-center justify-between'>
        <Label>Include API Key</Label>
        <Switch
          checked={formData?.includeApiKey}
          onCheckedChange={(v) => handleChange('includeApiKey', v)}
        />
      </div>

      {formData?.includeApiKey && (
        <div className='flex flex-col gap-1'>
          <Label className='text-xs'>API Key</Label>
          <Input
            type='password'
            placeholder='Bearer token or API key'
            value={formData?.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
          />
        </div>
      )}

      {/* Request Body (for POST/PUT) */}
      {formData?.method !== 'GET' && (
        <div className='flex flex-col gap-1'>
          <Label>Request Body (JSON)</Label>
          <Textarea
            rows={3}
            placeholder='{ "city": "{cityName}" }'
            value={formData?.body || ''}
            onChange={(e) => handleChange('body', e.target.value)}
          />
        </div>
      )}

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default ApiSettings;