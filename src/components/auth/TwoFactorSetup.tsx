'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { RootState } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/components/Card';
import Alert from '@/shared/components/Alert';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  QrcodeIcon,
  KeyIcon
} from '@heroicons/react/outline';

interface TwoFactorSetupProps {
  onComplete?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'start' | 'qr' | 'verify' | 'backup' | 'complete'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  const startSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setQrCode(data.qrCode);
      setStep('qr');
    } catch (error: any) {
      setError(error.message || 'Failed to start 2FA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          code: verificationCode.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setBackupCodes(data.backupCodes);
      setStep('backup');
    } catch (error: any) {
      setError(error.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
  };

  const finishSetup = () => {
    setStep('complete');
    onComplete?.();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Two-Factor Authentication Setup</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4">
            <ExclamationCircleIcon className="h-5 w-5" />
            <p>{error}</p>
          </Alert>
        )}

        {step === 'start' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enhance your account security by setting up two-factor authentication.
              You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            <div className="flex justify-end">
              <Button onClick={startSetup} loading={isLoading}>
                Start Setup
              </Button>
            </div>
          </div>
        )}

        {step === 'qr' && qrCode && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-64 h-64 relative mb-4">
                <Image
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                label="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
              />
              <div className="flex justify-end">
                <Button onClick={verifyCode} loading={isLoading}>
                  Verify Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'backup' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Backup Codes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save these backup codes in a secure place. You can use them to
                access your account if you lose your authenticator device.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-sm bg-white p-2 rounded border"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={copyBackupCodes}
                className="flex items-center"
              >
                <KeyIcon className="h-5 w-5 mr-2" />
                Copy Codes
              </Button>
              <Button onClick={finishSetup}>
                Complete Setup
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              2FA Setup Complete
            </h3>
            <p className="text-gray-600">
              Two-factor authentication has been successfully enabled for your account.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
