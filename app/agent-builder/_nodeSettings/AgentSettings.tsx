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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Props {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function AgentSettings({ selectedNode, updateFormData }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    instruction: '',
    includeHistory: true,
    model: 'gpt-4o-mini',
    output: 'text',
    schema: '',
  });

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        name: selectedNode?.data?.label || '',
        instruction: '',
        includeHistory: true,
        model: 'gpt-4o-mini',
        output: 'text',
        schema: '',
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    updateFormData(formData);
    toast.success('Agent settings updated!');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='font-bold text-lg'>Agent</h2>
        <p className='text-xs text-gray-500'>Configure your AI agent behavior</p>
      </div>

      {/* Agent Name */}
      <div className='flex flex-col gap-1'>
        <Label>Name</Label>
        <Input
          placeholder='Agent name'
          value={formData?.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      {/* System Prompt / Instructions */}
      <div className='flex flex-col gap-1'>
        <Label>Instructions</Label>
        <Textarea
          rows={3}
          placeholder='Describe what this agent should do...'
          value={formData?.instruction || ''}
          onChange={(e) => handleChange('instruction', e.target.value)}
        />
      </div>

      {/* Include Chat History Switch */}
      <div className='flex items-center justify-between'>
        <Label>Include Chat History</Label>
        <Switch
          checked={formData?.includeHistory}
          onCheckedChange={(v) => handleChange('includeHistory', v)}
        />
      </div>

      {/* Model Selection */}
      <div className='flex flex-col gap-1'>
        <Label>AI Model</Label>
        <Select
          value={formData?.model}
          onValueChange={(v) => handleChange('model', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select model' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='gpt-4o-mini'>GPT-4o Mini</SelectItem>
            <SelectItem value='gpt-4o'>GPT-4o</SelectItem>
            <SelectItem value='gemini-1.5-flash'>Gemini 1.5 Flash</SelectItem>
            <SelectItem value='gemini-1.5-pro'>Gemini 1.5 Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Output Format Tabs */}
      <div className='flex flex-col gap-1'>
        <Label>Output Format</Label>
        <Tabs
          value={formData?.output}
          onValueChange={(v) => handleChange('output', v)}
          className='w-full'
        >
          <TabsList className='grid grid-cols-2 w-full'>
            <TabsTrigger value='text'>Text</TabsTrigger>
            <TabsTrigger value='json'>JSON</TabsTrigger>
          </TabsList>

          <TabsContent value='text'>
            <p className='text-xs text-gray-500 mt-1'>
              Output will return standard formatted text/markdown.
            </p>
          </TabsContent>

          <TabsContent value='json'>
            <div className='flex flex-col gap-1 mt-2'>
              <Label className='text-xs'>JSON Schema</Label>
              <Textarea
                rows={3}
                placeholder='{ "title": "string", "summary": "string" }'
                value={formData?.schema || ''}
                onChange={(e) => handleChange('schema', e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Button */}
      <Button onClick={onSave} className='w-full mt-2 cursor-pointer'>
        Save Settings
      </Button>
    </div>
  );
}

export default AgentSettings;