'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

interface ApiSettings {
  cal_api_key: string;
  cal_event_type_id: string;
  retell_api_key: string;
}

export default function ApiSettingsPage() {
  const [settings, setSettings] = useState<ApiSettings>({
    cal_api_key: '',
    cal_event_type_id: '',
    retell_api_key: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsFetching(true);
      console.log('[Settings Page] Fetching settings...');
      const response = await fetch('/api/settings');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch settings');
      }
      const data = await response.json();
      console.log('[Settings Page] Retrieved settings:', {
        hasCalApiKey: !!data.cal_api_key,
        hasRetellApiKey: !!data.retell_api_key
      });
      setSettings({
        cal_api_key: data.cal_api_key || '',
        cal_event_type_id: data.cal_event_type_id || '',
        retell_api_key: data.retell_api_key || '',
      });
    } catch (error) {
      console.error('[Settings Page] Error fetching settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('[Settings Page] Submitting settings update...');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }

      console.log('[Settings Page] Settings updated successfully');
      toast({
        title: "Settings updated",
        description: "Your API settings have been saved successfully.",
      });
    } catch (error) {
      console.error('[Settings Page] Error updating settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">API Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cal.com Settings</CardTitle>
            <CardDescription>Configure your Cal.com integration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cal_api_key">API Key</Label>
              <Input
                id="cal_api_key"
                type="password"
                value={settings.cal_api_key}
                onChange={(e) => setSettings({ ...settings, cal_api_key: e.target.value })}
                placeholder="Enter your Cal.com API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cal_event_type_id">Event Type ID</Label>
              <Input
                id="cal_event_type_id"
                value={settings.cal_event_type_id}
                onChange={(e) => setSettings({ ...settings, cal_event_type_id: e.target.value })}
                placeholder="Enter your Cal.com event type ID"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retell Settings</CardTitle>
            <CardDescription>Configure your Retell integration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retell_api_key">API Key</Label>
              <Input
                id="retell_api_key"
                type="password"
                value={settings.retell_api_key}
                onChange={(e) => setSettings({ ...settings, retell_api_key: e.target.value })}
                placeholder="Enter your Retell API key"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </form>
    </div>
  );
}
