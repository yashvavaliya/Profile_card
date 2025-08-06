import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Download, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeCardProps {
  profileUrl: string;
  profileName: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ profileUrl, profileName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileName}'s Profile`,
          text: `Check out ${profileName}'s profile`,
          url: profileUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 256;
    canvas.height = 256;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${profileName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg justify-center xl:justify-start">
          <QrCode className="w-5 h-5" />
          Share Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center w-full">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <QRCode
              id="qr-code-svg"
              value={profileUrl}
              size={120}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="flex-1 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy URL
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Download QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <QRCode
                  value={profileUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                />
              </div>
              <Button onClick={downloadQRCode} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};